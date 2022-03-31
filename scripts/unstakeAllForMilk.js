import './../config.js';

import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import Web3 from 'web3';
import { ethers } from 'ethers';

import barnABI from './../abi/barn.abi.js';
import apiABI from './../abi/wtAPI.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);
const chain = Common.default.forCustomChain('mainnet', {
    name: process.env.CHAIN_NAME,
    networkId: parseInt(process.env.CHAIN_ID),
    chainId: parseInt(process.env.CHAIN_ID)
}, 'petersburg');

const publicKey = process.env.WALLET_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex');

const barnAddress = process.env.BARN_CONTRACT;
const barnContract = new web3.eth.Contract(barnABI, barnAddress);
const apiAddress = process.env.WTAPI_CONTRACT;
const apiContract = new web3.eth.Contract(apiABI, apiAddress);

const BATCH_SIZE = 50;

var batch = [];
var totalTokenToProcess = 0;
var processedTokens = 0;

var nonce = await web3.eth.getTransactionCount(publicKey);

barnContract.methods.totalStakes().call((error, totalTokens) => {
    if (error) return console.log(`unstakeAllForMilk.js Calling totalStakes ${error}`);
    totalTokenToProcess = totalTokens;
    processNextBatch();
});

function processNextBatch() {
    var batchSize = processedTokens + BATCH_SIZE <= totalTokenToProcess ? BATCH_SIZE : totalTokenToProcess - processedTokens;
    var indexes = Array.from([...Array(batchSize).keys()].map(k => k + processedTokens));
    processedTokens += batchSize;

    apiContract.methods.stakesAt(barnAddress, indexes).call((error, stakes) => {
        if (error) return console.log(`unstakeAllForMilk.js Calling stakesAt ${error}`);
        console.log(`${processedTokens} / ${totalTokenToProcess} stake fetched`);

        apiContract.methods.areSheepStakedForMilk(barnAddress, stakes.map(stake => stake.tokenId)).call((error, results) => {
            if (error) return console.log(`unstakeAllForMilk.js Calling areSheepStakedForMilk ${error}`);

            stakes.forEach((stake, i) => {
                if (results[i]) batch.push(indexes[i])
            });

            console.log(`${batch.length} animals are staked for milk`);
            if (batch.length < BATCH_SIZE * 0.75 && processedTokens < totalTokenToProcess) processNextBatch();
            else unstakeBatch();
        });
    });
}

async function unstakeBatch() {
    console.log(`Unstaking ${batch}`);

    var rawTx = {
        nonce: web3.utils.toHex(nonce),
        to: barnAddress,
        gasLimit: web3.utils.toHex(Math.ceil((await barnContract.methods.unstakeByStakeIndexes(batch).estimateGas({ from: publicKey })) * 1.2)),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: barnContract.methods.unstakeByStakeIndexes(batch).encodeABI()
    };

    var tx = new Tx.Transaction(rawTx, { common: chain });
    tx.sign(privateKey);

    web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
        .on('transactionHash', txHash => console.log(`Barn txHash: ${txHash}`))
        .on('receipt', txReceipt => {
            totalTokens -= batch.length;
            processedTokens -= batch.length;
            if (processedTokens < totalTokenToProcess) {
                batch = [];
                nonce++;
                processNextBatch();
            }
        })
        .on('error', error => console.log(`unstakeAllForMilk.js ${error}`));
}
