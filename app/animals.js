import fs from 'fs';
import { exec } from 'child_process';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);

export function tokenURI(tokenID, req, res) {
    if (tokenID <= 50000) {
        var endURI = `images/wtanimals/${tokenID}.png`;

        if (!fs.existsSync(`${process.cwd()}/public/${endURI}`)) {
            exec(`node ./scripts/generateTokenImage.js ${tokenID}`);
        }

        wtanimalContract.methods.tokenTraits(tokenID).call((err, result) => {
            var base64 = new Buffer(fs.readFileSync(`${process.cwd()}/public/${endURI}`)).toString('base64');

            res.status(200).json({
                name: `${result.isSheep ? 'Sheep': 'Wolf'} #${tokenID}`,
                description: 'Wolf Town NFT collection.',
                image: `<svg id="woolf" width="100%" height="100%" version="1.1" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image x="4" y="4" width="32" height="32" image-rendering="pixelated" preserveAspectRatio="xMidYMid" xlink:href="data:image/png;base64,${base64}"></image></svg>`,
                ...result
            });
        });
    } else {
        res.status(200).json({ error: 'Token does not exist.' });
    }
}

const animals = { tokenURI };

export default animals;
