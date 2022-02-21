import fs from 'fs';
import fetch from 'node-fetch';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';
import oldBarnABI from './../abi/oldBarn.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);
const oldBarnAddress = process.env.OLD_BARN_CONTRACT;
const oldBarnContract = new web3.eth.Contract(oldBarnABI, oldBarnAddress);

export function unstakeOrder(address, keepWolves, req, res) {
    var unstakeOrder = [];
    oldBarnContract.methods.totalStakesOf(address).call(async (err, result) => {
        if (err) {
            console.log(`oldBarn.js:unstakeOrder ${err}`);
            res.status(200).json({ error: err });
            return;
        }

        var totalStakesOf = parseInt(result);
        for (var i=totalStakesOf-1; i>=0; i--) {
            await (oldBarnContract.methods.stakeOf(address, i).call(async (err, result) => {
                if (err) {
                    console.log(`oldBarn.js:unstakeOrder ${err}`);
                    res.status(200).json({ error: err });
                    return;
                }

                var length = unstakeOrder.length;
                if (address == result.owner && (!length || unstakeOrder[length-1].timestamp >= result.timestamp)) {
                    if (keepWolves) {
                        unstakeOrder.push(result);
                    } else {
                        await (wtanimalContract.methods.tokenTraits(result.tokenId).call((err, traits) => {
                            if (traits.isSheep) {
                                unstakeOrder.push(result);
                            }
                        }));
                    }
                }
            }));
        }

        var json = unstakeOrder.map(obj => obj.tokenId);
        res.status(200).json(json);
    });
}

export function lockedTokens(address, req, res) {
    var lockedTokens = [];
    oldBarnContract.methods.totalStakesOf(address).call((err, result) => {
        if (err) {
            console.log(`oldBarn.js:lockedTokens ${err}`);
            res.status(200).json({ error: err });
            return;
        }

        var totalStakesOf = parseInt(result);
        if (totalStakesOf != 0) {
            oldBarnContract.methods.totalStakes().call((err, result) => {
                if (err) {
                    console.log(`oldBarn.js:lockedTokens ${err}`);
                    res.status(200).json({ error: err });
                    return;
                }

                var totalStakes = parseInt(result);
                for (var i=0; i<totalStakes; i++) {
                    oldBarnContract.methods.stakeAt(i).call((err, result) => {
                        if (err) {
                            console.log(`oldBarn.js:lockedTokens ${err}`);
                            res.status(200).json({ error: err });
                            return;
                        }

                        if (result.owner == address) {
                            lockedTokens.push(parseInt(result.tokenId));

                            if (lockedTokens.length == totalStakesOf) {
                                res.status(200).json(JSON.stringify(lockedTokens));
                            }
                        }
                    });
                }
            });
        } else {
            res.status(200).json(JSON.stringify(lockedTokens));
        }
    });
}

const oldBarn = { unstakeOrder, lockedTokens };

export default oldBarn;
