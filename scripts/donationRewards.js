import './../config.js';

import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import Web3 from 'web3';
import { ethers } from 'ethers';

import donationABI from './../abi/donation.abi.js';
import wtwoolABI from './../abi/wtwool.abi.js';
import wtmilkABI from './../abi/wtmilk.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);
const chain = Common.default.forCustomChain(process.env.CHAIN_NAME, {
    name: process.env.CHAIN_NAME,
    networkId: process.env.CHAIN_ID,
    chainId: process.env.CHAIN_ID
}, 'petersburg');

const account = process.env.WALLET_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex');

const donationAddress = process.env.DONATION_CONTRACT;
const donationContract = new web3.eth.Contract(donationABI, donationAddress);
const wtwoolAddress = process.env.WTWOOL_CONTRACT;
const wtwoolContract = new web3.eth.Contract(wtwoolABI, wtwoolAddress);
const wtmilkAddress = process.env.WTMILK_CONTRACT;
const wtmilkContract = new web3.eth.Contract(wtmilkABI, wtmilkAddress);

const WTWOOL_FOR_BNB = 500000;
const WTMILK_FOR_BNB = 10000;

donationContract.methods.funders(0).call((err, result) => {
    var funders = {};
    var wtwoolRewards = {};
    var wtmilkRewards = {};

    result[0].forEach((address, i) => {
        funders[address] = funders[address] ? funders[address] + parseInt(result[1][i]) : parseInt(result[1][i]);
    });

    console.log("Funders:", funders);

    Object.keys(funders).forEach((address, i) => {
        wtwoolRewards[address] = ethers.BigNumber.from(funders[address].toString()).mul(WTWOOL_FOR_BNB);
        wtmilkRewards[address] = ethers.BigNumber.from(funders[address].toString()).mul(WTMILK_FOR_BNB);
    });

    console.log("Rewards ($WTWool):", wtwoolRewards);

    web3.eth.getTransactionCount(account, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: wtwoolAddress,
            gasLimit: web3.utils.toHex(8000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: wtwoolContract.methods.transferToMany(Object.keys(wtwoolRewards), Object.values(wtwoolRewards)).encodeABI()
        };

        const tx = new Tx.Transaction(txObject, { common: chain });
        tx.sign(privateKey);

        web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`, (err, txHash) => {
            if(err) { console.log('Error:', err); }
            console.log('$WTWool txHash:', txHash);
        });
    });

    console.log("Rewards ($WTMilk):", wtmilkRewards);

    web3.eth.getTransactionCount(account, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: wtmilkAddress,
            gasLimit: web3.utils.toHex(8000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: wtmilkContract.methods.mintToMany(Object.keys(wtmilkRewards), Object.values(wtmilkRewards)).encodeABI()
        };

        const tx = new Tx.Transaction(txObject, { common: chain });
        tx.sign(privateKey);

        web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`, (err, txHash) => {
            if(err) { console.log('Error:', err); }
            console.log('$WTMilk txHash:', txHash);
        });
    });
});
