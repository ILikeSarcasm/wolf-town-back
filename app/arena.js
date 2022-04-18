import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { ethers } from 'ethers';

import arenaABI from './../abi/arena.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const chain = Common.default.forCustomChain('mainnet', {
    name: process.env.CHAIN_NAME,
    networkId: parseInt(process.env.CHAIN_ID),
    chainId: parseInt(process.env.CHAIN_ID)
}, 'petersburg');

const publicKey = process.env.ARENA_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.ARENA_PRIVATE_KEY, 'hex');

const arenaAddress = process.env.ARENA_CONTRACT;
const arenaContract = new web3.eth.Contract(arenaABI, arenaAddress);

const keccak256 = ethers.utils.solidityKeccak256;
const arrayify = ethers.utils.arrayify;

const MAX_TRANSACTION_TIME = 300000;
const MINIMUM_PARTICIPANTS = 2;

var Transaction = { processing: false, txHash: '0', timestamp: 0 };

function random(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export async function checkMatches(level, res) {
    const totalUsers = await arenaContract.methods.getTotalUsersByLevel(level).call();

    if (totalUsers < MINIMUM_PARTICIPANTS) return res.status(200).json({ message: 'Not enough users.', succeed: false });

    let allUsers = await arenaContract.methods.getUsersByLevel(level, 0, 0).call();
    const users = animalIds.map(() => {
        let userIndex = random(allUsers.length);
        let user = allUsers[userIndex];
        allUsers.splice(userIndex, 1);
        return user;
    });
    const animalIds = await arenaContract.methods.getUsersWaitingListByLevel(level, users, Array(MINIMUM_PARTICIPANTS).fill(0)).call();

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
                console.error(`[ERROR] arena.js:makeMatches ${err}`);
                Transaction = { processing: false, txHash: '0', timestamp: 0 };
                reject(err);
                checkMatches(level);
                return;
            }

            var hash = keccak256([ 'uint256' ], [ Date.now() ]);
            var signature = await (new ethers.Wallet(privateKey)).signMessage(arrayify(hash));

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: arenaAddress,
                gasLimit: web3.utils.toHex(Math.ceil((await arenaContract.methods.makeMatches(animalIds, hash, signature).estimateGas({ from: publicKey })) * 1.2)),
                gasPrice: web3.utils.toHex(web3.utils.toWei('5', 'gwei')),
                data: arenaContract.methods.makeMatches(animalIds, hash, signature).encodeABI()
            };

            console.log(`[LOG] Arena Making match with animals ${animalIds}`);

            const tx = new Tx.Transaction(txObject, { common: chain });
            tx.sign(privateKey);

            web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
                .on('transactionHash', txHash => {
                    console.log(`[LOG] Arena Sending ${txHash}`);
                    Transaction.txHash = txHash;
                })
                .on('receipt', txReceipt => {
                    console.log(`[LOG] Arena Succeed ${Transaction.txHash}`);
                    Transaction = { processing: false, txHash: '0', timestamp: 0 };
                    checkMatches(level);
                })
                .on('error', error => {
                    console.error(`[ERROR] arena.js:makeMatches Failed ${Transaction.txHash} ${error}`);
                    Transaction = { processing: false, txHash: '0', timestamp: 0 };
                    checkMatches(level);
                });

            resolve(true);
        });
    });
}

const arena = { checkMatches };

export default arena;
