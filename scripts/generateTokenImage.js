import './../config.js';

import fs from 'fs';
import images from 'images';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);

if (process.argv.length <= 2) {
    process.exit(1);
}

var tokenID = process.argv[2];
var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
var tokenImagePath = `${process.cwd()}/public/images/wtanimals/${tokenID}.png`;

if (!fs.existsSync(tokenImagePath)) {
    images(`${bodyPartsPath}0/Black.png`).draw(images(`${bodyPartsPath}1/Beanie.png`), 0, 0).save(tokenImagePath);
    console.log("Created.");
} else {
    console.log("Already exists.");
}
