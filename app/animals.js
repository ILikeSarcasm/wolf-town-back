import fs from 'fs';
import { exec } from 'child_process';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);

export function tokenURI(tokenID, req, res) {
    if (tokenID <= 50000) {
        if (!fs.existsSync(`./../public/images/wtanimals/${tokenID}.png`)) {
            exec(`node ./scripts/generateTokenImage.js ${tokenID}`);
        }

        wtanimalContract.methods.tokenTraits(tokenID).call((err, result) => {
            res.status(200).json({
                name: `${result.isSheep ? 'Sheep': 'Wolf'} #${tokenID}`,
                description: 'Wolf Town NFT collection.',
                image: `${process.env.URL}images/wtanimals/${tokenID}.png`,
                ...result
            });
        });
    } else {
        res.status(200).json({ error: 'Token does not exist.' });
    }
}

const animals = { tokenURI };

export default animals;
