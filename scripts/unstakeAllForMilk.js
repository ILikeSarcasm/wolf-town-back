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
var remainingTokensToProcess = 0;

barnContract.methods.totalStakes().call((error, totalTokens) => {
    if (error) return console.log(`unstakeAllForMilk.js Calling totalStakes ${error}`);
    remainingTokensToProcess = totalTokens;
    processNextBatch();
});

function processNextBatch() {
    var batchSize = remainingTokensToProcess - BATCH_SIZE >= 0 ? BATCH_SIZE : remainingTokensToProcess;
    remainingTokensToProcess -= batchSize;

    apiContract.methods.stakesAt(barnAddress, Array.from([...Array(batchSize).keys()].map(k => k + batch.length))).call((error, stakes) => {
        if (error) return console.log(`unstakeAllForMilk.js Calling stakesAt ${error}`);
        console.log(`${batchSize} stake fetched`);

        apiContract.methods.areSheepStakedForMilk(barnAddress, stakes.map(stake => stake.tokenId)).call((error, results) => {
            if (error) return console.log(`unstakeAllForMilk.js Calling areSheepStakedForMilk ${error}`);

            stakes.forEach((stake, i) => {
                if (results[i]) batch.push(stake.tokenId)
            });

            console.log(`${batch.length} animals are staked for milk`);
            if (batch.length < BATCH_SIZE * 0.75 && remainingTokensToProcess) processNextBatch();
            else unstakeBatch();
        });
    });
}

async function unstakeBatch() {
    var rawTx = {
        nonce: web3.utils.toHex(await web3.eth.getTransactionCount(publicKey)),
        to: barnAddress,
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: barnContract.methods.unstakeMany(batch).encodeABI()
    };

    var tx = new Tx.Transaction(rawTx, { common: chain });
    tx.sign(privateKey);

    web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
        .on('transactionHash', txHash => console.log(`Barn txHash: ${txHash}`))
        .on('receipt', txReceipt => {
            console.log(`Barn txReceipt: ${txReceipt}`);
            processNextBatch();
        });
}
