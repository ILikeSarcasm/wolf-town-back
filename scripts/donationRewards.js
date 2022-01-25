import './../config.js';

import Tx from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import Web3 from 'web3';
import { ethers } from 'ethers';

import donationABI from './../abi/donation.abi.js';
import wtwoolABI from './../abi/wtwool.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);
const chain = Common.default.forCustomChain('mainnet', { name: 'testnet', networkId: 97, chainId: 97 }, 'petersburg');

const account = process.env.WALLET_PUBLIC_KEY;
const privateKey = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex');

const donationAddress = process.env.DONATION_CONTRACT;
const donationContract = new web3.eth.Contract(donationABI, donationAddress);
const wtwoolAddress = process.env.WTWOOL_CONTRACT;
const wtwoolContract = new web3.eth.Contract(wtwoolABI, wtwoolAddress);

const WTWOOL_FOR_BNB = 500000;

donationContract.methods.funders(0).call((err, result) => {
    var funders = {};
    var rewards = {};

    result[0].forEach((address, i) => {
        funders[address] = funders[address] ? funders[address] + parseInt(result[1][i]) : parseInt(result[1][i]);
    });

    console.log("Funders:", funders);

    Object.keys(funders).forEach((address, i) => {
        rewards[address] = ethers.BigNumber.from(funders[address].toString()).mul(WTWOOL_FOR_BNB);
    });

    console.log("Rewards:", rewards);

    web3.eth.getTransactionCount(account, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: wtwoolAddress,
            gasLimit: web3.utils.toHex(8000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: wtwoolContract.methods.mintToMany(Object.keys(rewards), Object.values(rewards)).encodeABI()
        };

        const tx = new Tx.Transaction(txObject, { common: chain });
        tx.sign(privateKey);

        web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`, (err, txHash) => {
            if(err) { console.log('Error:', err); }
            console.log('txHash:', txHash);
        });
    });
});
