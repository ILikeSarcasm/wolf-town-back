import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { BigNumber, ethers } from 'ethers';

import wtAnimalABI from './../abi/wtanimal.abi.js';
import forestExplorationABI from './../abi/forestexploration.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);
const publicKey = process.env.FOREST_EXPLORATION_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.FOREST_EXPLORATION_PRIVATE_KEY, 'hex');
const account = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER));

const REPLAY_TIME = 30000; // 30s
const DEFAULT_SEED = '0x0000000000000000000000000000000000000000000000000000000000000000';

function replayAfter(t, f) {
    setTimeout(f, t);
}

async function getRandomAddressOfWTANIMAL() {
    const wtanAddress = process.env.WTANIMAL_CONTRACT;
    const wtanContract = new web3.eth.Contract(wtAnimalABI, wtanAddress);
    const wtanContractInstance = wtanContract.methods;

    const wtanContractInstanceRandomAddress = await wtanContractInstance.randomAddress().call();
    return wtanContractInstanceRandomAddress;
}

async function getForestExplorationContract() {
    return new web3.eth.Contract(forestExplorationABI, await getRandomAddressOfWTANIMAL());
}
function getForestExplorationEthersContract(address) {
    return new ethers.Contract(address, forestExplorationABI, account);
}

async function getSeedByIndex(forestExplorationContract, seedIndex) {
    return forestExplorationContract.methods.seedMap(seedIndex).call();
}

// 缓存最近一次检查的结果
let lastCheckResult = {};
export async function checkForSeedSpeedUp() {
    const forestExplorationContract = await getForestExplorationContract();
    // 1 Block every 3 seconds => 10 = 100min
    let fromBlock = (await web3.eth.getBlockNumber()) - 2000;
    forestExplorationContract.getPastEvents('SpeedUp', { fromBlock: fromBlock, toBlock: 'latest', filter: {} }).then(async events => {
        if (events.length === 0) return;
        const newCheckResult = {};
        const seedIndexs = events.map(event => event.returnValues.seedIdx).filter(seedIndex => !lastCheckResult[seedIndex]);
        const seeds = await Promise.all(seedIndexs.map(async seedIndex => getSeedByIndex(forestExplorationContract, seedIndex)));
        seeds.forEach(async (seed, index) => {
            const seedIndex = seedIndexs[index];
            if (seed == DEFAULT_SEED) {
                publishSeed(forestExplorationContract, seedIndex);
            } else {
                newCheckResult[seedIndex] = true;
            }
        });
        lastCheckResult = newCheckResult;
    })
    .catch(error => console.log(`[ERROR] forestExploration.js:checkForSeedSpeedUp ${error}`))
    .finally(() => {
        replayAfter(REPLAY_TIME, checkForSeedSpeedUp);
    });
}

const PUBLISH_SEED_MIN_TIME_DIFF = 60000; // 60s
const lastPublishTime = {};
const inLastPublishTime = (seedIndex) => lastPublishTime[seedIndex] && lastPublishTime[seedIndex] + PUBLISH_SEED_MIN_TIME_DIFF > Date.now();

// Empty invalid data and optimize memory.
setInterval(() => {
    for (const key in lastPublishTime) {
        if (!inLastPublishTime(key)) delete lastPublishTime[key];
    }
}, 60 * 60 * 1000);

async function publishSeed(forestExplorationContract, seedIndex) {
    const now = Date.now();
    if (inLastPublishTime(seedIndex)) {
        console.log(`[LOG] ForestExploration Publishing seed for ${seedIndex}, time diff: ${now - lastPublishTime[seedIndex]}`);
        return;
    }
    lastPublishTime[seedIndex] = now;
    const ethersContract = getForestExplorationEthersContract(forestExplorationContract._address);
    console.log(`[LOG] ForestExploration Publishing seed for ${seedIndex}`);
    const signSeed = ethers.utils.solidityKeccak256(['uint256', 'string', 'address'], [seedIndex, 'WolfTownForestExplorationSeed', forestExplorationContract._address]);
    const msg = await account.signMessage(ethers.utils.arrayify(signSeed));
    return submitTxByAccount(publicKey, async () => {
        const estimateGas = await ethersContract.estimateGas.PublishSeed(seedIndex, msg);
        const tx = await ethersContract.PublishSeed(seedIndex, msg, {
            gasLimit: estimateGas.mul(12).div(10),
            gasPrice: process.env.ENVIRONMENT === 'dev' ? ethers.utils.parseUnits('10', 'gwei') : ethers.utils.parseUnits('5', 'gwei'),
        });
        await tx.wait();
        console.log(`[LOG] ForestExploration Sending ${tx.hash}`);
    });
}

// Make an account always have only one transaction being submitted
const txQueue = {};
async function submitTxByAccount(address, callback) {
    const queue = txQueue[address] = txQueue[address] || [];
    const wait = Promise.all([...queue]);
    const next = new Promise(async resolve => {
        try {
            await wait;
        } finally {
            try {
                await callback();
            } finally {
                queue.splice(queue.indexOf(next), 1);
                resolve(null);
            }
        }
    });
    queue.push(next);
    return next;
}

const pausePubSeed = true;

// touchRound('1000000000000000000', '0x10febDB47De894026b91D639049E482f7E8C7e2e', '3', null)
async function touchRound(seedIndex, from, userNonce, res) {
    if (pausePubSeed) return res.status(200).json({ ok: 'pausePubSeed' });
    // must gt 1 ether and has user register
    if (BigNumber.from(seedIndex).lt(ethers.constants.WeiPerEther)) return res.status(200).json({});
    const forestExplorationContract = await getForestExplorationContract();
    const [userData] = await forestExplorationContract.methods.getUserNonceData(from, [userNonce]).call();
    const seed = await getSeedByIndex(forestExplorationContract, seedIndex);
    if (userData.seedIndex !== seedIndex) return res.status(200).json({ err: 'seedIndex error' });
    if (seed !== DEFAULT_SEED) return res.status(200).json({err: 'is opened'});
    if (userData.endTime === '0' || !userData.endTime) return res.status(200).json({ err: 'not end' });
    if (parseInt(userData.endTime) > (Math.ceil(Date.now() / 1000))) return res.status(200).json({ err: 'not end.' });
    publishSeed(forestExplorationContract, seedIndex);
    res.status(200).json({ ok: 'reg' });
}

async function publishSeedIndex(seedIndex, res) {
    if (pausePubSeed) return res.status(200).json({ ok: 'pausePubSeed' });
    seedIndex = BigNumber.from(seedIndex);
    const currentIndex = getCurrentIndex();
    const forestExplorationContract = await getForestExplorationContract();
    const contract = getForestExplorationEthersContract(forestExplorationContract._address);
    const currentJoinSeedIdx = await contract.currentJoinSeedIdx();
    if (seedIndex.gte(currentJoinSeedIdx)) return res.status(200).json({ err: 'lte' });
    if (seedIndex.gte(currentIndex)) return res.status(200).json({ err: 'lte' });
    const seed = await contract.seedMap(seedIndex);
    if (seed !== DEFAULT_SEED) return res.status(200).json({ err: 'pub-ed' });
    await publishSeed(forestExplorationContract, seedIndex);
    res.status(200).json({ ok: 'pub' });
}

const BeginTime = new Date('2022-04-09').getTime();
const getCurrentIndex = () => Math.floor((Date.now() - BeginTime) / 1000 / 60 / 60 / 23); // 23 hours per round
async function publishSeedEveryDay() {
    if (pausePubSeed) return;
    const doing = async () => {
        const forestExplorationContract = await getForestExplorationContract();
        const contract = getForestExplorationEthersContract(forestExplorationContract._address);
        const currentIndex = getCurrentIndex();
        const currentJoinSeedIdx = await contract.currentJoinSeedIdx();
        if (currentJoinSeedIdx.gte(currentIndex)) return;
        const tx = await contract.set_currentJoinSeedIdx(currentIndex);
        await tx.wait();
        const seed = await contract.seedMap(currentJoinSeedIdx);
        if (seed !== DEFAULT_SEED) return;
        await publishSeed(forestExplorationContract, currentJoinSeedIdx);
    }
    try {
        await doing();
    } catch(error) {
        console.error(`[ERROR] ForestExploration publishSeedEveryDay`, error);
    } finally {
        replayAfter(10 * 60 * 1000, publishSeedEveryDay)
    }
}
if (process.env.ENVIRONMENT == 'live') publishSeedEveryDay();
const forestExploration = { checkForSeedSpeedUp, touchRound, publishSeedIndex };

export default forestExploration;
