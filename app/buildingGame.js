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

const account = process.env.WALLET_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex');

const buildingGameAddress = process.env.BUILDING_GAME_MANAGER_CONTRACT;
const buildingGameContract = new web3.eth.Contract(buildingGameABI, buildingGameAddress);

const keccak256 = ethers.utils.solidityKeccak256;

const MIN_PARTICIPATION = 10;

// Participations => Participation[]
// Participation => { animalId: ..., action: ..., hashedAction: ... }
// Needs user to sign
export async function participateMany(gameId, user, participations, res) {
    const [ validParticipations, invalidParticipations ] = await checkData(gameId, participations);

    if (validParticipations.length == 0) {
        console.log(`buildingGame.js:participateMany Invalid data`);
        res.status(200).json({ err: 'Invalid data' });
        return;
    }

    var sql = "INSERT INTO buildingGame (`state`, `buildingId`, `user`, `animalId`, `action`, `hashedAction`) " +
              "VALUES " + Array(validParticipations.length).fill(`('WAITING', ?, ?, ?, ?, ?)`).join(', ') + ";";
    var params = validParticipations.reduce((all, p) => all.concat([ gameId, user, p.animalId, p.action, p.hashedAction ]), []);

    db.query(sql, params).then(() => {
        res.status(200).json({ succeed: validParticipations, failed: invalidParticipations });
        checkMatches(gameId);
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`buildingGame.js:participateMany ${error}.`);
    });
}

// Needs user to sign
export function cancelMany(gameId, animalIds, res) {
    deleteParticipations(gameId, animalIds)
        .then(() => res.status(200).json({ success: true }))
        .catch(error => res.status(200).json({ err: `${error}` }));
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
    var sql = "SELECT bg.`user`, bg.`animalId`, bg.`action`, bg.`hashedAction` " +
              "FROM buildingGame bg " +
                	"JOIN (" +
                		"SELECT `user`, GROUP_CONCAT(`animalId`) AS `animalIds` " +
                		"FROM buildingGame " +
                		"WHERE `buildingId` = ? AND `state` = 'WAITING' " +
                		"GROUP BY `user` " +
                	") t ON bg.`user` = t.`user` AND FIND_IN_SET(bg.`animalId`, t.`animalIds`) BETWEEN 1 AND " + MIN_PARTICIPATION / 2 + " " +
              "ORDER BY bg.`timestamp` " +
              "LIMIT " + MIN_PARTICIPATION + ";";
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
    var sql = "UPDATE buildingGame " +
          "SET `state` = '" + state + "' " +
          "WHERE `buildingId` = ? AND `animalID` IN (" + animalIds.map(() => '?').join(', ') + ")";
    var params = [ gameId, ...animalIds ];

    db.query(sql, params).catch(error => console.error(`buildingGame.js:switchState ${state} for animals ${animalIds} ${error}`));
}

function deleteParticipations(gameId, animalIds) {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM buildingGame " +
                  "WHERE `buildingId` = ? AND `animalId` IN (" + animalIds.map(() => '?').join(', ') + ");";
        var params = [ gameId, ...animalIds ];

        db.query(sql, params).then(() => resolve(true)).catch(error => {
            console.error(`buildingGame.js:deleteParticipations With animals ${animalIds} ${error}.`)
            reject(error);
        });
    });
}

function makeMatches(gameId, participations) {
    web3.eth.getTransactionCount(account, async (err, txCount) => {
        var sql = "SELECT `name` FROM building WHERE `id` = ?;";
        var params = [ gameId ];

        db.query(sql, params).then(async result => {

            const signature = await web3.eth.sign(keccak256([ 'string' ], [ result[0].name ]), account);

            var animalIds = [];
            var actions = [];
            var passwords = [];

            participations.forEach(p => {
                animalIds.push(p.animalId);
                animalIds.push(p.action);
                animalIds.push(p.hashedAction);
            });

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: buildingGameAddress,
                gasLimit: web3.utils.toHex(8000000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data: buildingGameContract.methods.makeMatches(signature, gameId, animalIds, actions, passwords).encodeABI()
            };

            const tx = new Tx.Transaction(txObject, { common: chain });
            tx.sign(privateKey);

            web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`, (err, txHash) => {
                if (err) {
                    console.log(`buildingGame.js:makeMatches With animals ${animalIds} ${err}`);
                    return;
                }

                console.log(`$WTWool txHash: ${txHash}`);
                deleteParticipations(animalIds);
            });

        }).catch(error => {
            console.error(`buildingGame.js:makeMatches ${error}.`)
            reject(error);
        });
    });
}

const buildingGame = { participateMany, cancelMany };

export default buildingGame;
