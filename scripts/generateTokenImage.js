import './../config.js';

import fs from 'fs';
import images from 'images';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';
import bodyPartsData from './../public/images/bodyParts/bodyPartsData.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);

if (process.argv.length <= 2 && parseInt(process.argv[2]) <= 50000) {
    process.exit(1);
}

var tokenID = parseInt(process.argv[2]);
var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
var tokenImagePath = `${process.cwd()}/public/images/wtanimals/${tokenID}.png`;

if (!fs.existsSync(tokenImagePath)) {
    var result = {isSheep:false,fur:3,head:7,ears:0,eyes:13,nose:2,mouth:6,neck:0,feet:0,alpha:0};
    //wtanimalContract.methods.tokenTraits(tokenID).call((err, result) => {
        if (result.isSheep) {
            images(`${bodyPartsPath}0/${bodyPartsData[0][result.fur].name}.png`)
                .draw(images(`${bodyPartsPath}1/${bodyPartsData[1][result.head].name}.png`))
                .draw(images(`${bodyPartsPath}2/${bodyPartsData[2][result.ears].name}.png`))
                .draw(images(`${bodyPartsPath}3/${bodyPartsData[3][result.eyes].name}.png`))
                .draw(images(`${bodyPartsPath}4/${bodyPartsData[4][result.nose].name}.png`))
                .draw(images(`${bodyPartsPath}5/${bodyPartsData[5][result.mouth].name}.png`))
                .draw(images(`${bodyPartsPath}7/${bodyPartsData[7][result.feet].name}.png`))
                .save(tokenImagePath);
        } else {
            images(`${bodyPartsPath}9/${bodyPartsData[9][result.fur].name}.png`)
                .draw(images(`${bodyPartsPath}12/${bodyPartsData[12][result.eyes].name}.png`))
                .draw(images(`${bodyPartsPath}14/${bodyPartsData[14][result.nose].name}.png`))
                .draw(images(`${bodyPartsPath}15/${bodyPartsData[15][result.neck].name}.png`))
                .draw(images(`${bodyPartsPath}10/${bodyPartsData[10][result.alpha].name}.png`))
                .save(tokenImagePath);
        }
    //});

    console.log('Created.');
} else {
    console.log('Already exists.');
}
