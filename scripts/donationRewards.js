import './../config.js';

import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import Web3 from 'web3';
import { ethers } from 'ethers';
import fs from 'fs';

import donationABI from './../abi/donation.abi.js';
import wtwoolABI from './../abi/wtwool.abi.js';
import wtmilkABI from './../abi/wtmilk.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);
const chain = Common.default.forCustomChain('mainnet', {
    name: process.env.CHAIN_NAME,
    networkId: parseInt(process.env.CHAIN_ID),
    chainId: parseInt(process.env.CHAIN_ID)
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
const WTWOOL_FOR_WTMILK = 5000;
const WTMILK_FOR_WTWOOL = 1000;

const exclusionList = [
    '0x0000000000000000000000000000000000000000',
    '0x445479d811d37C04301C0c5D26Ea4f48970CCf2a',
    '0x8e7886303bC9652d726bd140518d9bAc8d05b9f8'
];

// donationContract.methods.funders(0).call((err, result) => {
donationContract.methods.getfunderMapData(0).call((err, result) => {
    var funders = {};
    var wtwoolRewards = {};
    var wtmilkRewards = {};

    result[0].forEach((address, i) => {
        if (exclusionList.indexOf(address) == -1) {
            funders[address] = funders[address] ? funders[address] + parseInt(result[1][i]) : parseInt(result[1][i]);
        }
    });

    // console.log("Funders:", funders);

    Object.keys(funders).forEach((address, i) => {
        wtwoolRewards[address] = ethers.BigNumber.from(funders[address].toString()).mul(WTWOOL_FOR_BNB).toString();
        var wtmilk = ethers.BigNumber.from("1000000000000000000").mul(Math.floor(ethers.BigNumber.from(wtwoolRewards[address]).div(ethers.BigNumber.from("1000000000000000000").mul(WTWOOL_FOR_WTMILK)).toNumber())).mul(WTMILK_FOR_WTWOOL);
        if (!wtmilk.isZero()) {
            wtmilkRewards[address] = wtmilk.toString();
        }
    });

    console.log(`Rewards ($WTWool): ${Object.entries(wtwoolRewards).length} entries`);
    // Object.entries(wtwoolRewards).forEach(([address, wtwoolReward]) => console.log(address, wtwoolReward.toString()));

    for (var i=0; Math.ceil(i<Object.entries(wtwoolRewards).length/50); i++) {
        fs.writeFile(`./scripts/woolAddresses${i}.txt`, JSON.stringify(Object.keys(wtwoolRewards).slice(i*50,(i+1)*50)), () => {});
        fs.writeFile(`./scripts/woolRewards${i}.txt`, JSON.stringify(Object.values(wtwoolRewards).slice(i*50,(i+1)*50)), () => {});
    }

    /* web3.eth.getTransactionCount(account, async (err, txCount) => {
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
    }); */

    console.log(`Rewards ($WTMilk): ${Object.entries(wtmilkRewards).length} entries`);
    // Object.entries(wtmilkRewards).forEach(([address, wtmilkReward]) => console.log(address, wtmilkReward.toString()));

    for (var i=0; i<Math.ceil(Object.entries(wtmilkRewards).length/50); i++) {
        fs.writeFile(`./scripts/milkAddresses${i}.txt`, JSON.stringify(Object.keys(wtmilkRewards).slice(i*50,(i+1)*50)), () => {});
        fs.writeFile(`./scripts/milkRewards${i}.txt`, JSON.stringify(Object.values(wtmilkRewards).slice(i*50,(i+1)*50)), () => {});
    }

    /* web3.eth.getTransactionCount(account, (err, txCount) => {
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
    }); */
});
