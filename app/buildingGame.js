import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { ethers } from 'ethers';
import db from './database/database.js';

import buildingGameABI from './../abi/buildinggamemanager.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const chain = Common.default.forCustomChain('mainnet', {
    name: process.env.CHAIN_NAME,
    networkId: parseInt(process.env.CHAIN_ID),
    chainId: parseInt(process.env.CHAIN_ID)
}, 'petersburg');

const publicKey = process.env.WALLET_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex');
const account = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);

const buildingGameAddress = process.env.BUILDING_GAME_MANAGER_CONTRACT;
const buildingGameContract = new web3.eth.Contract(buildingGameABI, buildingGameAddress);

const keccak256 = ethers.utils.solidityKeccak256;

const MIN_PARTICIPATION = 10;

export function getParticipations(gameId, animalIds, res) {
    var sql = "SELECT `animalId` " +
              "FROM building-game " +
              "WHERE `buildingId` = ? AND `animalId` IN (" + animalIds.map(() => '?').join(', ') + ");";
    var params = [ gameId, ...animalIds ];

    db.query(sql, params).then(rows => {
        var validAnimalIds = rows.map(row => parseInt(row.animalId));
        var invalidAnimalIds = animalIds.filter(animalId => !validAnimalIds.includes(animalId));
        res.status(200).json({ succeed: validAnimalIds, failed: invalidAnimalIds });
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`buildingGame.js:getParticipations ${error}.`);
    });
}

// Participations => Participation[]
// Participation => { animalId: ..., action: ..., hashedAction: ... }
export async function participateMany(gameId, participations, res) {
    const [ validParticipations, invalidParticipations ] = await checkData(gameId, participations);

    if (validParticipations.length == 0) {
        res.status(200).json({ succeed: validParticipations, failed: invalidParticipations });
        return;
    }

    var sql = "REPLACE INTO building-game (`state`, `buildingId`, `user`, `animalId`, `action`, `hashedAction`) " +
              "VALUES " + Array(validParticipations.length).fill(`('WAITING', ?, ?, ?, ?, ?)`).join(', ') + ";";
    var params = validParticipations.reduce((all, p) => all.concat([ gameId, p.participant, p.animalId, p.action, p.hashedAction ]), []);

    console.log(`Participating with animals ${participations.map(p => p.animalId)}`);

    db.query(sql, params).then(() => {
        res.status(200).json({ succeed: validParticipations, failed: invalidParticipations });
        checkMatches(gameId);
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`buildingGame.js:participateMany ${error}.`);
    });
}

export function cancelMany(gameId, animalIds, res) {
    buildingGameContract.methods.getGameParticipationByAnimalIds(gameId, animalIds).call((error, participations) => {
        if (error) {
            console.log(`buildingGame.js:cancelMany ${error}`);
            reject(error);
            return;
        }

        var invalidAnimalIds = participations.filter(p => p.animalId != '0').map(p => parseInt(p.animalId));
        var validAnimalIds = animalIds.filter(animalId => !invalidAnimalIds.includes(animalId));

        if (!validAnimalIds.length) {
            res.status(200).json({ succeed: validAnimalIds, failed: invalidAnimalIds });
            return;
        }

        console.log(`Canceling animals ${validAnimalIds}`);

        deleteParticipations(gameId, validAnimalIds)
            .then(() => res.status(200).json({ succeed: validAnimalIds, failed: invalidAnimalIds }))
            .catch(error => res.status(200).json({ err: `${error}` }));
    });
}

export function submitAgain(gameId, animalIds, password, res) {
    buildingGameContract.methods.getGameParticipationByAnimalIds(gameId, animalIds).call((error, realParticipations) => {
        if (error) {
            console.log(`buildingGame.js:submitAgain ${error}`);
            reject(error);
            return;
        }

        var participations = [];
        var validAnimalIds = [];
        var invalidAnimalIds = [];
        animalIds.forEach((animalId, i) => {
            var action = 0;
            var hash1 = keccak256([ 'uint256', 'string', 'uint256' ], [ action, password, parseInt(realParticipations[i].nonce) ]);
            var hash2 = keccak256([ 'uint256', 'bytes32', 'uint256' ], [ action, hash1, parseInt(realParticipations[i].nonce) ]);

            if (hash2 != realParticipations[i].hashedAction) {
                action = 1;
                hash1 = keccak256([ 'uint256', 'string', 'uint256' ], [ action, password, parseInt(realParticipations[i].nonce) ]);
            }

            participations.push({
                animalId: animalId,
                action: action,
                hashedAction: hash1
            });
        });

        participateMany(gameId, participations, res);
    });
}

function checkData(gameId, participations) {
    return new Promise((resolve, reject) => {
        buildingGameContract.methods.getGameParticipationByAnimalIds(gameId, participations.map(p => p.animalId)).call((error, realParticipations) => {
            if (error) {
                console.log(`buildingGame.js:checkData ${error}`);
                reject(error);
                return;
            }

            var validParticipations = [];
            var invalidParticipations = [];
            participations.forEach((participation, i) => {
                participation.participant = realParticipations[i].participant;
                if (realParticipations[i].animalId != 0) {
                    var hashedAction = keccak256([ 'uint256', 'bytes32', 'uint256' ], [ parseInt(participation.action), participation.hashedAction, parseInt(realParticipations[i].nonce) ]);

                    if (hashedAction == realParticipations[i].hashedAction) {
                        validParticipations.push(participation);
                    } else {
                        console.log(`buildingGame.js:checkData Invalid participation for animal ${participation.animalId}`);
                        invalidParticipations.push(participation);
                    }
                } else {
                    console.log(`buildingGame.js:checkData Invalid participation for animal ${participation.animalId}`);
                    invalidParticipations.push(participation);
                }
            });

            resolve([ validParticipations, invalidParticipations ]);
        });
    });
}

function checkMatches(gameId) {
    var sql = "SELECT `user`, `animalId`, `action`, `hashedAction` " +
              "FROM ( " +
                  "SELECT bg.`user`, bg.`animalId`, bg.`action`, bg.`hashedAction` " +
                  "FROM building-game bg " +
                    	"JOIN (" +
                    		"SELECT `user`, GROUP_CONCAT(`animalId`) AS `animalIds` " +
                    		"FROM building-game " +
                    		"WHERE `buildingId` = ? AND `state` = 'WAITING' " +
                    		"GROUP BY `user` " +
                    	") t ON bg.`user` = t.`user` AND FIND_IN_SET(bg.`animalId`, t.`animalIds`) BETWEEN 1 AND " + MIN_PARTICIPATION / 2 + " " +
                  "ORDER BY bg.`timestamp` " +
                  "LIMIT " + MIN_PARTICIPATION +
                ") t " +
                "ORDER BY RAND();";
    var params = [ gameId ];

    db.query(sql, params).then(participations => {
        if (participations.length == MIN_PARTICIPATION) {
            initiateMatchMaking(gameId, participations);
        }
    }).catch(error => console.error(`buildingGame.js:checkMatches ${error}.`));
}

async function initiateMatchMaking(gameId, participations) {
    var animalIds = participations.map(p => p.animalId);

    switchState(gameId, animalIds, 'PROCESSING');

    const [ validParticipations, invalidParticipations ] = await checkData(gameId, participations);
    if (invalidParticipations.length == 0) {
        makeMatches(gameId, validParticipations);
    } else {
        console.error(`buildingGame.js:initiateMatchMaking Canceled match making.`);

        var validAnimalIds = validParticipations.map(p => p.animalId);
        var invalidAnimalIds = invalidParticipations.map(p => p.animalId);

        switchState(gameId, validAnimalIds, 'WAITING');
        deleteParticipations(gameId, invalidAnimalIds);
        checkMatches(gameId);
    }
}

function switchState(gameId, animalIds, state) {
    var sql = "UPDATE building-game " +
          "SET `state` = '" + state + "' " +
          "WHERE `buildingId` = ? AND `animalID` IN (" + animalIds.map(() => '?').join(', ') + ")";
    var params = [ gameId, ...animalIds ];

    db.query(sql, params).catch(error => console.error(`buildingGame.js:switchState ${state} for animals ${animalIds} ${error}`));
}

function deleteParticipations(gameId, animalIds) {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM building-game " +
                  "WHERE `buildingId` = ? AND `animalId` IN (" + animalIds.map(() => '?').join(', ') + ");";
        var params = [ gameId, ...animalIds ];

        db.query(sql, params).then(() => resolve(true)).catch(error => {
            console.error(`buildingGame.js:deleteParticipations With animals ${animalIds} ${error}.`)
            reject(error);
        });
    });
}

function makeMatches(gameId, participations) {
    web3.eth.getTransactionCount(publicKey, async (err, txCount) => {
        if (err) {
            switchState(gameId, participations.map(p => p.animalId), 'WAITING');
            console.log(`buildingGame.js:makeMatches With animals ${animalIds} ${err}`);
            return;
        }

        var sql = "SELECT `name` FROM building WHERE `id` = ?;";
        var params = [ gameId ];

        db.query(sql, params).then(async result => {
            var animalIds = [];
            var actions = [];
            var passwords = [];

            participations.forEach(p => {
                animalIds.push(p.animalId);
                actions.push(p.action);
                passwords.push(p.hashedAction);
            });

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: buildingGameAddress,
                gasLimit: web3.utils.toHex(8000000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data: buildingGameContract.methods.makeMatches(gameId, animalIds, actions, passwords).encodeABI()
            };

            console.log(`Making match with animals ${animalIds}`);

            const tx = new Tx.Transaction(txObject, { common: chain });
            tx.sign(privateKey);

            web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`, (err, txHash) => {
                if (err) {
                    switchState(gameId, animalIds, 'WAITING');
                    console.log(`buildingGame.js:makeMatches With animals ${animalIds} ${err}`);
                    return;
                }

                console.log(`BuildingGameManager txHash: ${txHash}`);
                deleteParticipations(gameId, animalIds);
            });

        }).catch(error => {
            switchState(gameId, participations.map(p => p.animalId), 'WAITING');
            console.error(`buildingGame.js:makeMatches ${error}.`);
            return;
        });
    });
}

const buildingGame = { getParticipations, participateMany, cancelMany, submitAgain };

export default buildingGame;
