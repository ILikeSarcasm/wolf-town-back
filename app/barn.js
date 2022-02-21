import fs from 'fs';
import fetch from 'node-fetch';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';
import barnABI from './../abi/barn.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);
const barnAddress = process.env.BARN_CONTRACT;
const barnContract = new web3.eth.Contract(barnABI, barnAddress);

export function unstakeOrder(address, keepWolves, req, res) {
    var unstakeOrder = [];
    barnContract.methods.totalStakesOf(address).call(async (err, result) => {
        if (err) {
            console.log(`barn.js:unstakeOrder1 ${err}`);
            res.status(200).json({ error: err });
            return;
        }

        var totalStakes = parseInt(result);
        for (var i=totalStakes-1; i>=0; i--) {
            await (barnContract.methods.stakeOf(address, i).call(async (err, result) => {
                var length = unstakeOrder.length;
                if (address == result.owner && (!length || unstakeOrder[length-1].timestamp >= result.timestamp)) {
                    if (keepWolves) {
                        unstakeOrder.push(result);
                    } else {
                        var traits = JSON.parse(fs.readFileSync(`./public/metadata/${result.tokenId}.json`));
                        if (traits.isSheep) {
                            unstakeOrder.push(result);
                        }
                    }
                }
            }));
        }

        var json = unstakeOrder.map(obj => obj.tokenId);
        res.status(200).json(json);
    });
}
const barn = { unstakeOrder };

export default barn;
