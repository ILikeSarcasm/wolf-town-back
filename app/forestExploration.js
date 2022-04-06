import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { ethers } from 'ethers';

import wtAnimalABI from './../abi/wtanimal.abi.js';
import forestExplorationABI from './../abi/forestexploration.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const chain = Common.default.forCustomChain('mainnet', {
    name: process.env.CHAIN_NAME,
    networkId: parseInt(process.env.CHAIN_ID),
    chainId: parseInt(process.env.CHAIN_ID)
}, 'petersburg');

const publicKey = process.env.FOREST_EXPLORATION_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.FOREST_EXPLORATION_PRIVATE_KEY, 'hex');
const account = new ethers.Wallet(privateKey);

const forestExplorationAddress = process.env.FOREST_EXPLORATION_MANAGER_CONTRACT;

const REPLAY_TIME = 30000; // 30s
const DEFAULT_SEED = ethers.utils.solidityKeccak256([ 'string' ], ['DEFAULT_SEED' ]);

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

// 缓存最近一次检查的结果
let lastCheckResult = {};

export async function checkForSeedSpeedUp() {
    const forestExplorationContract = await getForestExplorationContract();
    // 1 Block every 3 seconds => 10 = 1min
    let fromBlock = (await web3.eth.getBlockNumber()) - 20;
    forestExplorationContract.getPastEvents('CreateRound', { fromBlock: fromBlock, toBlock: 'latest', filter: { wolfId: 0 } }).then(events => {
        const newCheckResult = {};
        events.forEach(event => {
            const roundId = event.returnValues.seed;
            if (lastCheckResult[roundId]) {
                console.log(`[LOG] ForestExploration Already checked ${roundId}`);
                return;
            }
            forestExplorationContract.methods.getRound(roundId).call((error, round) => {
                if (error) return console.error(`[ERROR] forestExploration.js:checkForSeedSpeedUp ${error}`);
                if (round.seed == DEFAULT_SEED) {
                    publishSeed(forestExplorationContract, roundId);
                } else {
                    newCheckResult[roundId] = true;
                }
            });
        });
        lastCheckResult = newCheckResult;
    })
    .catch(error => console.log(`[ERROR] forestExploration.js:checkForSeedSpeedUp ${error}`))
    .finally(() => {
        replayAfter(REPLAY_TIME, checkForSeedSpeedUp);
    });
}

function publishSeed(forestExplorationContract, roundId) {
    web3.eth.getTransactionCount(publicKey, async (err, txCount) => {
        if (err) return console.error(`[ERROR] forestExploration.js:publishSeed ${err}`);

        const signature = await account.signMessage(ethers.utils.arrayify(roundId));
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: forestExplorationAddress,
            gasLimit: web3.utils.toHex(Math.ceil((await forestExplorationContract.methods.PublishSeed(roundId, signature).estimateGas({ from: publicKey })) * 1.2)),
            gasPrice: web3.utils.toHex(web3.utils.toWei('5', 'gwei')),
            data: forestExplorationContract.methods.PublishSeed(roundId, signature).encodeABI()
        };

        console.log(`[LOG] ForestExploration Publishing seed for ${roundId}`);

        const tx = new Tx.Transaction(txObject, { common: chain });
        tx.sign(privateKey);

        var hash;
        web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
            .on('transactionHash', txHash => {
                console.log(`[LOG] ForestExploration Sending ${txHash}`);
                hash = txHash;
            })
            .on('receipt', txReceipt => console.log(`[LOG] ForestExploration Succeed ${hash}`))
            .on('error', error => console.error(`[ERROR] forestExploration.js:publishSeed Failed ${hash} ${error}`));

    }).catch(error => console.error(`[ERROR] forestExploration.js:publishSeed ${error}.`));
}

const forestExploration = { checkForSeedSpeedUp };

export default forestExploration;
