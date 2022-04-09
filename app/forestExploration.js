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
    (new Promise(resolve => setTimeout(resolve, t))).then(f);
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

async function getNonce() {
    return web3.eth.getTransactionCount(publicKey);
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
        let nonce = await getNonce();
        const newCheckResult = {};
        const seedIndexs = events.map(event => event.returnValues.seedIdx).filter(seedIndex => !lastCheckResult[seedIndex]);
        const seeds = await Promise.all(seedIndexs.map(async seedIndex => getSeedByIndex(forestExplorationContract, seedIndex)));
        seeds.forEach(async (seed, index) => {
            const seedIndex = seedIndexs[index];
            if (seed == DEFAULT_SEED) {
                publishSeed(forestExplorationContract, seedIndex, nonce++);
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

async function publishSeed(forestExplorationContract, seedIndex, nonce) {
    const now = Date.now();
    if (inLastPublishTime(seedIndex)) {
        console.log(`[LOG] ForestExploration Publishing seed for ${seedIndex}, time diff: ${now - lastPublishTime[seedIndex]}`);
        return;
    }
    lastPublishTime[seedIndex] = now;
    const ethersContract = getForestExplorationEthersContract(forestExplorationContract._address);
    console.log(`[LOG] ForestExploration Publishing seed for ${seedIndex}`);
    const signSeed = ethers.utils.solidityKeccak256(['uint256', 'string', 'address'], [seedIndex, 'WolfTownForestExplorationSeed', account.address]);
    const msg = await account.signMessage(ethers.utils.arrayify(signSeed));
    const estimateGas = await ethersContract.estimateGas.PublishSeed(seedIndex, msg);
    const tx = await ethersContract.PublishSeed(seedIndex, msg, {
        gasLimit: estimateGas.mul(12).div(10),
        gasPrice: process.env.ENVIRONMENT === 'dev' ? ethers.utils.parseUnits('10', 'gwei') : ethers.utils.parseUnits('5', 'gwei'),
        nonce
    });
    console.log(`[LOG] ForestExploration Sending ${tx.hash}`);
}
// touchRound('1000000000000000000', '0x10febDB47De894026b91D639049E482f7E8C7e2e', '3', null)
async function touchRound(seedIndex, from, userNonce, res) {
    // must gt 1 ether and has user register
    if (BigNumber.from(seedIndex).lt(ethers.constants.WeiPerEther)) return res.status(200).json({});
    const forestExplorationContract = await getForestExplorationContract();
    const userData = await forestExplorationContract.methods.getUserNonceData(from, [userNonce]).call();
    const seed = await getSeedByIndex(forestExplorationContract, seedIndex);
    if (userData.seedIndex !== seedIndex) return res.status(200).json({});
    if (seed !== DEFAULT_SEED) return res.status(200).json({});
    if (userData.endTime === '0' || !userData.endTime) return res.status(200).json({});
    if (parseInt(userData.endTime) > (Math.ceil(Date.now() / 1000))) return res.status(200).json({});
    const nonce = await getNonce();
    publishSeed(forestExplorationContract, seedIndex, nonce);
    res.status(200).json({});
}

const BeginTime = new Date('2022-04-09').getTime();
async function publishSeedEveryDay() {
    const forestExplorationContract = await getForestExplorationContract();
    const contract = getForestExplorationEthersContract(forestExplorationContract._address);
    const now = Date.now();
    const currentIndex = Math.floor((now - BeginTime) / 1000 / 60 / 60 / 23); // 23 hours per round
    const currentJoinSeedIdx = await contract.currentJoinSeedIdx();
    if (currentJoinSeedIdx.gte(currentIndex)) return replayAfter(10*60*1000, publishSeedEveryDay);
    await contract.set_currentJoinSeedIdx(currentIndex);
    // must success
    while(true) {
        try {
            const nonce = await getNonce();
            try {
                await publishSeed(forestExplorationContract, currentJoinSeedIdx, nonce);
            } finally {
                const seed = await contract.seedMap(currentJoinSeedIdx);
                if (seed !== DEFAULT_SEED) return replayAfter(10 * 60 * 1000, publishSeedEveryDay);
            }
        } catch(error) {
            console.log(`[ERROR] ForestExploration publishSeedEveryDay ${currentJoinSeedIdx}`);
        }
    }
}
publishSeedEveryDay();
const forestExploration = { checkForSeedSpeedUp, touchRound };

export default forestExploration;
