import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { ethers } from 'ethers';
import db from './database/database.js';

import tournamentABI from './../abi/tournament.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const chain = Common.default.forCustomChain('mainnet', {
    name: process.env.CHAIN_NAME,
    networkId: parseInt(process.env.CHAIN_ID),
    chainId: parseInt(process.env.CHAIN_ID)
}, 'petersburg');

const publicKey = process.env.TOURNAMENT_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.TOURNAMENT_PRIVATE_KEY, 'hex');

const tournamentAddress = process.env.TOURNAMENT_CONTRACT;
const tournamentContract = new web3.eth.Contract(tournamentABI, tournamentAddress);

const keccak256 = ethers.utils.solidityKeccak256;
const arrayify = ethers.utils.arrayify;

const MAX_TRANSACTION_TIME = 300000;

var Transaction = { processing: false, txHash: '0', timestamp: 0 };

function random(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setNewTournamentSize() {
    new Promise((resolve, reject) => {
        let participantNumber = random(6, 3);
        var sql = "UPDATE `tournament` " +
                  "SET `participants` = " + participantNumber ";";

        db.query(sql).then(() => resolve(participantNumber)).catch(error => {
            console.error(`[ERROR] tournament.js:setNewTournamentSize ${error}.`);
            reject(error);
        });
    });
}

function getNextTournamentSize() {
    new Promise((resolve, reject) => {
        var sql = "SELECT `participants` FROM `tournament`;";

        db.query(sql).then(rows => resolve(rows[0].participants)).catch(error => {
            console.error(`[ERROR] tournament.js:getNextTournamentSize ${error}.`);
            reject(error);
        });
    });
}

export async function checkMatches(level, res) {
    const minimumUsers = await getNextTournamentSize();
    const totalUsers = await tournamentContract.methods.getTotalUsersByLevel(level).call();

    if (totalUsers < minimumUsers) return res.status(200).json({ message: 'Not enough users.', succeed: false });

    const animalIds = Array(minimumUsers).fill(0);
    let allUsers = await tournamentContract.methods.getUsersByLevel(level, 0, 0).call();
    const users = animalIds.map(() => {
        let userIndex = random(allUsers.length);
        let user = allUsers[userIndex];
        allUsers.splice(userIndex, 1);
        return user;
    });
    const animalIds = await tournamentContract.methods.getUsersWaitingListByLevel(level, users, Array(MINIMUM_PARTICIPANTS).fill(0)).call();

    checkTransactionTime();
    if (!Transaction.processing) {
        makeMatches(level, animalIds, res)
            .then(() => res.status(200).json({ succeed: true }))
            .catch(error => res.status(200).json({ message: `${error}`, succeed: false }));
    } else res.status.json({ message: 'Transaction already pending.', succeed: false });
}

function checkTransactionTime() {
    if (Transaction.timestamp && Date.now() - Transaction.timestamp >= MAX_TRANSACTION_TIME) {
        console.log('[LOG] BuildingGameManager Transaction reset because maximum time exceeded.')
        Transaction = { processing: false, txHash: '0', timestamp: 0 };
    }
}

function makeMatches(level, animalIds) {
    return new Promise((resolve, reject) => {
        Transaction = { processing: true, txHash: '0', timestamp: Date.now() };

        web3.eth.getTransactionCount(publicKey, async (err, txCount) => {
            if (err) {
                console.error(`[ERROR] tournament.js:makeMatches ${err}`);
                Transaction = { processing: false, txHash: '0', timestamp: 0 };
                reject(err);
                checkMatches(level);
                return;
            }

            var hash = keccak256([ 'uint256' ], [ Date.now() ]);
            var signature = await (new ethers.Wallet(privateKey)).signMessage(arrayify(hash));

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: tournamentAddress,
                gasLimit: web3.utils.toHex(Math.ceil((await tournamentContract.methods.makeMatches(animalIds, hash, signature).estimateGas({ from: publicKey })) * 1.2)),
                gasPrice: web3.utils.toHex(web3.utils.toWei('5', 'gwei')),
                data: tournamentContract.methods.makeMatches(animalIds, hash, signature).encodeABI()
            };

            console.log(`[LOG] Tournament Making match with animals ${animalIds}`);

            const tx = new Tx.Transaction(txObject, { common: chain });
            tx.sign(privateKey);

            web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
                .on('transactionHash', txHash => {
                    console.log(`[LOG] Tournament Sending ${txHash}`);
                    Transaction.txHash = txHash;
                })
                .on('receipt', async txReceipt => {
                    console.log(`[LOG] Tournament Succeed ${Transaction.txHash}`);
                    Transaction = { processing: false, txHash: '0', timestamp: 0 };
                    await setNewTournamentSize();
                    checkMatches(level);
                })
                .on('error', error => {
                    console.error(`[ERROR] tournament.js:makeMatches Failed ${Transaction.txHash} ${error}`);
                    Transaction = { processing: false, txHash: '0', timestamp: 0 };
                    checkMatches(level);
                });

            resolve(true);
        });
    });
}

const tournament = { checkMatches };

export default tournament;
