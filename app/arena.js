import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { BigNumber, ethers } from 'ethers';
import confData from './database/BuildingStakeManagerFixMint-deploy.js';
import arenaABI from './../abi/arena.abi.js';
import { defaultSignData, getContractHandler, signCheck } from '../lib/ethers.js';
import { Constanst } from '../config.js';

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

export async function initCheckMatches(level, res) {
    res.status(200).json(await checkMatches(level));
}

function checkMatches(level) {
    return new Promise(async (resolve, reject) => {
        const totalUsers = await arenaContract.methods.getTotalUsersByLevel(level).call();

        if (totalUsers < MINIMUM_PARTICIPANTS) return resolve({ message: 'Not enough users.', succeed: false });

        let allUsers = Object.values(await arenaContract.methods.getUsersByLevel(level, 0, 0).call());
        const users = Array(MINIMUM_PARTICIPANTS).fill(0).map(() => {
            let userIndex = random(allUsers.length);
            return allUsers.splice(userIndex, 1)[0];
        });
        const animalIds = await arenaContract.methods.getUsersWaitingListByLevel(level, users, Array(MINIMUM_PARTICIPANTS).fill(0)).call();

        checkTransactionTime();
        if (!Transaction.processing) {
            makeMatches(level, animalIds)
                .then(() => resolve({ succeed: true }))
                .catch(error => resolve({ message: `${error}`, succeed: false }));
        } else resolve({ message: 'Transaction already pending.', succeed: false });
    });
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
                gasPrice: web3.utils.toHex(web3.utils.toWei(process.env.ENVIRONMENT == 'dev' ? '10' : '5', 'gwei')),
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

/**
 * 重新获取动物技能点
 */
export async function fixStakeSkill(skillId, index, sign = defaultSignData, res = null) {
    try {
        sign = JSON.parse(sign);
    } catch (e) {
        return res.status(500).json({ message: 'Invalid signature.' });
    }
    if (!signCheck(sign)) return res.status(500).json({ message: 'Signature check failed.' });
    if (sign.message !== `${Constanst.Contract.BuildingStakeManagerFixMint}:${skillId}:${index}`) return res.status(500).json({ message: 'Invalid signature.' });
    index = parseInt(index);
    if (isNaN(index)) return res.status(500).json({ message: 'Invalid index.' });
    // const BuildingStakeManagerFixMint = getContractHandler('BuildingStakeManagerFixMint', process.env.BuildingStakeManagerFixMint_Admin);
    const datas = [];
    const fullDatas = [];
    for (const id in confData) {
        const td = confData[id];
        fullDatas.push(td);
        if (sign.signer !== td.user) continue;
        if (td[skillId] === '0') continue;
        datas.push(td);
    }
    const data = datas.splice(index * 100, 100);
    const pointTotal = data.reduce((total, td) => total.add(td[skillId]), BigNumber.from(0));
    const nonce = fullDatas.indexOf(data[0]);
    if (pointTotal.isZero()) return res.status(500).json({ message: 'No data.' });

    try {
        const signSeed = ethers.utils.solidityKeccak256(['uint256', 'string', 'uint256', 'address', 'address'], [pointTotal, 'skillUpToken', nonce, Constanst.Contract.SkillManager, Constanst.Contract.BuildingStakeManagerFixMint]);
        const account = new ethers.Wallet(process.env.BuildingStakeManagerFixMint_Admin || process.env.FOREST_EXPLORATION_PRIVATE_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER));
        const msg = await account.signMessage(ethers.utils.arrayify(signSeed));
        res.status(200).json({ ok: 'ok', msg, nonce, data });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Failed.' });
    }
}

const skillCache = {};
let awaitHandler = null;
export async function getUserSkillUnSave(userAddress, res) {
    // const BuildingStakeManagerFixMint = getContractHandler('BuildingStakeManagerFixMint', process.env.BuildingStakeManagerFixMint_Admin || process.env.FOREST_EXPLORATION_PRIVATE_KEY);

    if (!skillCache.BUILD && !awaitHandler) {
        awaitHandler = new Promise(async resolve => {
            const SkillManager = getContractHandler('SkillManager');
            skillCache.STEAL = await SkillManager.skillNameToId('STEAL');
            skillCache.FIGHT = await SkillManager.skillNameToId('FIGHT');
            skillCache.BUILD = await SkillManager.skillNameToId('BUILD');
            resolve(null);
        });
    }
    if (awaitHandler) await awaitHandler;

    const skills = [String(skillCache.BUILD), String(skillCache.STEAL), String(skillCache.FIGHT)];
    const skillsBegin = [0, 10000, 100000];
    const SkillMap = {
        [String(skillCache.BUILD)]: 'building',
        [String(skillCache.STEAL)]: 'stealing',
        [String(skillCache.FIGHT)]: 'fighting',
    };
    const data = skills.map((skillId, idxx) => {
        const fullDatas = [];
        const datas = [];
        for (const id in confData) {
            const td = confData[id];
            fullDatas.push(td);
            if (userAddress !== td.user) continue;
            if (td[SkillMap[skillId]] === '0') continue;
            datas.push(td);
        }
        const nonces = [];
        while (datas.length > 0) {
            const data = datas.splice(0, 100);
            nonces.push(skillsBegin[idxx] + fullDatas.indexOf(data[0]));
        }
        return nonces; // BuildingStakeManagerFixMint.getNonces(nonces);
    });
    // for (const skillId in SkillMap) {
    //     data[SkillMap[skillId]] = data[skillId];
    //     delete data[skillId];
    // }
    res.status(200).json({ ok: 'ok', data });
}

const arena = { initCheckMatches, fixStakeSkill, getUserSkillUnSave };

export default arena;
