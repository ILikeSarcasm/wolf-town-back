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
const MAX_TRANSACTION_TIME = 300000;

var Transaction = { processing: false, txHash: '0', timestamp: 0 };

export function getParticipationRouter(gameId, req, res) {
    var animalIds = JSON.parse(decodeURIComponent(req.query.animalIds ? req.query.animalIds : '[]'));
    var from = parseInt(req.query.from) || 0;
    var to = parseInt(req.query.to) || 10000;

    if (req.query.user) getParticipationsByUser(gameId, req.query.user, res);
    else if (animalIds.length) getParticipationsByAnimals(gameId, animalIds, res);
    else getParticipations(gameId, from, to, res);
}

export function getParticipations(gameId, from, to, res) {
    var sql = "SELECT `user`, `animalId`, `timestamp` " +
              "FROM `building-game` " +
              "WHERE `buildingId` = ? " +
              "ORDER BY `timestamp`" +
              (to ? " LIMIT " + from + ", " + to + ";" : ";");
    var params = [ gameId ];

    db.query(sql, params).then(rows1 => {

        var sql = "SELECT `user`, COUNT(*) AS `total` " +
                  "FROM (" +
                      "SELECT `user`, `animalId`, `timestamp` " +
                      "FROM `building-game` " +
                      "WHERE `buildingId` = ? " +
                      "ORDER BY `timestamp`" +
                      (to ? " LIMIT " + from + ", " + to : "") +
                  ") t " +
                  "GROUP BY `user`;";
        var params = [ gameId ];

        db.query(sql, params).then(rows2 => {
            res.status(200).json({ participations: rows1, total: rows1.length, totalByUser: rows2 });
        }).catch(error => {
            res.status(200).json({ err: `${error}` });
            console.error(`[ERROR] buildingGame.js:getParticipations ${error}.`);
        });

    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`[ERROR] buildingGame.js:getParticipations ${error}.`);
    });
}

export function getParticipationsByUser(gameId, user, res) {
    var sql = "SELECT `animalId`, `hashedAction`, `nonce` " +
              "FROM `building-game` " +
              "WHERE `buildingId` = ? AND `user` = ?;";
    var params = [ gameId, user ];

    db.query(sql, params).then(rows => {
        res.status(200).json({ participations: rows.map(row => ({ animalId: row.animalId, hashedHash1: ethers.utils.hashMessage(row.hashedAction), nonce: row.nonce })), total: rows.length });
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`[ERROR] buildingGame.js:getParticipationsByUser ${error}.`);
    });
}

export function getParticipationsByAnimals(gameId, animalIds, res) {
    var sql = "SELECT `animalId`, `hashedAction`, `nonce` " +
              "FROM `building-game` " +
              "WHERE `buildingId` = ? AND `animalId` IN (" + animalIds.map(() => '?').join(', ') + ");";
    var params = [ gameId, ...animalIds ];

    db.query(sql, params).then(rows => {
        var validAnimalIds = rows.map(row => parseInt(row.animalId));
        var invalidAnimalIds = animalIds.filter(animalId => !validAnimalIds.includes(parseInt(animalId)));
        res.status(200).json({ participations: rows.map(row => ({ animalId: row.animalId, hashedHash1: ethers.utils.hashMessage(row.hashedAction), nonce: row.nonce })), total: rows.length, failed: invalidAnimalIds });
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`[ERROR] buildingGame.js:getParticipationsByAnimals ${error}.`);
    });
}

// Participations => Participation[]
// Participation => { animalId: ..., action: ..., hashedAction: ..., nonce: ... }
export async function participateMany(gameId, participations, res) {
    const [ validParticipations, invalidParticipations ] = await checkData(gameId, participations);

    if (validParticipations.length == 0) {
        res.status(200).json({ succeed: validParticipations, failed: invalidParticipations });
        return;
    }

    var sql = "REPLACE INTO `building-game` (`state`, `buildingId`, `user`, `animalId`, `action`, `hashedAction`, `nonce`) " +
              "VALUES " + Array(validParticipations.length).fill(`('WAITING', ?, ?, ?, ?, ?, ?)`).join(', ') + ";";
    var params = validParticipations.reduce((all, p) => all.concat([ gameId, p.participant, p.animalId, p.action, p.hashedAction, p.nonce ]), []);

    console.log(`[LOG] BuildingGameManager Participating with animals ${validParticipations.map(p => p.animalId)}`);

    db.query(sql, params).then(() => {
        res.status(200).json({ succeed: validParticipations, failed: invalidParticipations });
        checkMatches(gameId);
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`[ERROR] buildingGame.js:participateMany ${error}.`);
    });
}

export function cancelMany(gameId, animalIds, res) {
    buildingGameContract.methods.getGameParticipationByAnimalIds(gameId, animalIds).call((error, participations) => {
        if (error) {
            console.log(`[ERROR] buildingGame.js:cancelMany ${error}`);
            reject(error);
            return;
        }

        var invalidAnimalIds = participations.filter(p => p.animalId != '0').map(p => parseInt(p.animalId));
        var validAnimalIds = animalIds.filter(animalId => !invalidAnimalIds.includes(parseInt(animalId)));

        if (!validAnimalIds.length) {
            res.status(200).json({ succeed: validAnimalIds, failed: invalidAnimalIds });
            return;
        }

        console.log(`[LOG] BuildingGameManager Canceling animals ${validAnimalIds}`);

        deleteParticipations(gameId, validAnimalIds)
            .then(() => res.status(200).json({ succeed: validAnimalIds, failed: invalidAnimalIds }))
            .catch(error => res.status(200).json({ err: `${error}` }));
    });
}

export function runCheckMatches(gameId, res) {
    checkMatches(gameId)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(200).json({ err: `${error}` }));
}

export function deleteProcessing(gameId, res) {
    var sql = "DELETE FROM `building-game` " +
              "WHERE `buildingId` = ? AND `state` = 'PROCESSING';";
    var params = [ gameId ];

    db.query(sql, params).then(() => {
        res.status(200).json({ succeed: true });
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`[ERROR] buildingGame.js:deleteProcessing ${error}.`);
    });
}

function checkData(gameId, participations) {
    return new Promise((resolve, reject) => {
        buildingGameContract.methods.getGameParticipationByAnimalIds(gameId, participations.map(p => p.animalId)).call((error, realParticipations) => {
            if (error) {
                console.error(`[ERROR] buildingGame.js:checkData ${error}`);
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
                        console.log(`[LOG] BuildingGameManager Invalid participation for animal ${participation.animalId}`);
                        invalidParticipations.push(participation);
                    }
                } else {
                    console.log(`[LOG] BuildingGameManager Invalid participation for animal ${participation.animalId}`);
                    invalidParticipations.push(participation);
                }
            });

            resolve([ validParticipations, invalidParticipations ]);
        });
    });
}

export function checkMatches(gameId) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT `user`, `animalId`, `action`, `hashedAction` " +
                  "FROM ( " +
                      "SELECT bg.`user`, bg.`animalId`, bg.`action`, bg.`hashedAction` " +
                      "FROM `building-game` bg " +
                        	"JOIN (" +
                        		"SELECT `user`, GROUP_CONCAT(`animalId`) AS `animalIds` " +
                        		"FROM `building-game` " +
                        		"WHERE `buildingId` = ? AND `state` = 'WAITING' " +
                        		"GROUP BY `user` " +
                        	") t ON bg.`user` = t.`user` AND FIND_IN_SET(bg.`animalId`, t.`animalIds`) BETWEEN 1 AND " + MIN_PARTICIPATION / 2 + " " +
                      "ORDER BY bg.`timestamp` " +
                      "LIMIT " + MIN_PARTICIPATION +
                    ") t " +
                    "ORDER BY RAND();";
        var params = [ gameId ];

        db.query(sql, params).then(participations => {
            checkTransactionTime();

            if (Transaction.processing) return resolve({ succeed: false, message: 'Participation already being processed.' });
            if (participations.length != MIN_PARTICIPATION) return resolve({ succeed: false, message: 'Not enough participations.' });

            resolve({ succeed: true });
            initiateMatchMaking(gameId, participations);
        }).catch(error => {
            console.error(`[ERROR] buildingGame.js:checkMatches ${error}.`);
            reject(`buildingGame.js:checkMatches ${error}.`);
        });
    });
}

function checkTransactionTime() {
    if (Transaction.timestamp && Date.now() - Transaction.timestamp >= MAX_TRANSACTION_TIME) {
        console.log('[LOG] BuildingGameManager Transaction reset because maximum time exceeded.')
        Transaction = { processing: false, txHash: '0', timestamp: 0 };
    }
}

async function initiateMatchMaking(gameId, participations) {
    var animalIds = participations.map(p => p.animalId);

    const [ validParticipations, invalidParticipations ] = await checkData(gameId, participations);
    if (invalidParticipations.length == 0) {
        Transaction = { processing: true, txHash: '0', timestamp: Date.now() };
        switchState(gameId, animalIds, 'PROCESSING');
        makeMatches(gameId, validParticipations);
    } else {
        console.log(`[LOG] BuildingGameManager Canceled match making.`);
        switchState(gameId, validParticipations.map(p => p.animalId), 'WAITING');
        deleteParticipations(gameId, invalidParticipations.map(p => p.animalId));
        checkMatches(gameId);
    }
}

function switchState(gameId, animalIds, state) {
    var sql = "UPDATE `building-game` " +
          "SET `state` = '" + state + "' " +
          "WHERE `buildingId` = ? AND `animalID` IN (" + animalIds.map(() => '?').join(', ') + ")";
    var params = [ gameId, ...animalIds ];

    db.query(sql, params).catch(error => console.error(`[ERROR] buildingGame.js:switchState ${error}`));
}

function deleteParticipations(gameId, animalIds) {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM `building-game` " +
                  "WHERE `buildingId` = ? AND `animalId` IN (" + animalIds.map(() => '?').join(', ') + ");";
        var params = [ gameId, ...animalIds ];

        db.query(sql, params).then(() => resolve(true)).catch(error => {
            console.error(`[ERROR] buildingGame.js:deleteParticipations ${error}.`)
            reject(error);
        });
    });
}

function makeMatches(gameId, participations) {
    web3.eth.getTransactionCount(publicKey, async (err, txCount) => {
        if (err) {
            console.error(`[ERROR] buildingGame.js:makeMatches ${err}`);
            Transaction = { processing: false, txHash: '0', timestamp: 0 };
            switchState(gameId, participations.map(p => p.animalId), 'WAITING');
            checkMatches(gameId);
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
                gasLimit: web3.utils.toHex(Math.ceil((await buildingGameContract.methods.makeMatches(gameId, animalIds, actions, passwords).estimateGas({ from: publicKey })) * 1.2)),
                gasPrice: web3.utils.toHex(web3.utils.toWei('5', 'gwei')),
                data: buildingGameContract.methods.makeMatches(gameId, animalIds, actions, passwords).encodeABI()
            };

            console.log(`[LOG] BuildingGameManager Making match with animals ${animalIds}`);

            const tx = new Tx.Transaction(txObject, { common: chain });
            tx.sign(privateKey);

            web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
                .on('transactionHash', txHash => {
                    console.log(`[LOG] BuildingGameManager Sending ${txHash}`);
                    Transaction.hash = txHash;
                })
                .on('receipt', txReceipt => {
                    console.log(`[LOG] BuildingGameManager Succeed ${Transaction.txHash}`);
                    Transaction = { processing: false, txHash: '0', timestamp: 0 };
                    deleteParticipations(gameId, animalIds);
                    checkMatches(gameId);
                })
                .on('error', error => {
                    console.error(`[ERROR] buildingGame.js:makeMatches Failed ${Transaction.txHash} ${error}`);
                    Transaction = { processing: false, txHash: '0', timestamp: 0 };
                    switchState(gameId, animalIds, 'WAITING');
                    checkMatches(gameId);
                });

        }).catch(error => {
            console.error(`[ERROR] buildingGame.js:makeMatches ${error}.`);
            Transaction = { processing: false, txHash: '0', timestamp: 0 };
            switchState(gameId, participations.map(p => p.animalId), 'WAITING');
            checkMatches(gameId);
        });
    });
}

const buildingGame = { getParticipationRouter, participateMany, cancelMany, runCheckMatches, deleteProcessing };

export default buildingGame;
