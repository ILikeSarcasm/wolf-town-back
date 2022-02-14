import fs from 'fs';
import sharp from 'sharp';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';
import bodyPartsData from './../public/images/bodyParts/bodyPartsData.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);

export function tokenURI(tokenID, req, res) {
    var metadataPath = `./public/metadata/${tokenID}.json`;
    if (tokenID <= 50000) {
        if (!fs.existsSync(metadataPath)) {
            wtanimalContract.methods.tokenTraits(tokenID).call(async (err, result) => {
                if (err) {
                    console.log(`animals.js:tokenURI ${err}`);
                    res.status(200).json({ error: err });
                    return;
                }

                var tokenImagePath = await generateTokenImage(tokenID, result);
                var base64 = new Buffer(fs.readFileSync(`${process.cwd()}/public/images/wtanimalsSmall/${tokenID}.png`)).toString('base64');

                var json = {
                    name: `${result.isSheep ? 'Sheep': 'Wolf'} #${tokenID}`,
                    description: 'Wolf Town NFT collection.',
                    image: `${process.env.URL}images/animals/${tokenID}.png`,
                    imageSmall: `data:image/svg+xml;base64,${base64}`,
                    attributes: [
                        { trait_type: 'fur', value: bodyPartsData[1][parseInt(result['fur'])].name },
                        { trait_type: 'head', value: bodyPartsData[1][parseInt(result['head'])].name },
                        { trait_type: 'ears', value: bodyPartsData[1][parseInt(result['ears'])].name },
                        { trait_type: 'eyes', value: bodyPartsData[1][parseInt(result['eyes'])].name },
                        { trait_type: 'nose', value: bodyPartsData[1][parseInt(result['nose'])].name },
                        { trait_type: 'mouth', value: bodyPartsData[1][parseInt(result['mouth'])].name },
                        { trait_type: 'neck', value: bodyPartsData[1][parseInt(result['neck'])].name },
                        { trait_type: 'feet', value: bodyPartsData[1][parseInt(result['feet'])].name },
                        { trait_type: 'alpha', value: bodyPartsData[1][parseInt(result['alpha'])].name }
                    ]
                };

                fs.writeFile(metadataPath, JSON.stringify(json), (err) => {
                    if (err) {
                        console.log(`animals.js:tokenURI ${err}`);
                    }
                });

                res.status(200).json(json);
            });
        } else {
            fs.readFile(metadataPath, (err, json) => {
                if (err) {
                    console.log(`animals.js:tokenURI ${err}`);
                    res.status(200).json({ error: err });
                } else {
                    res.status(200).json(JSON.parse(json));
                }
            });
        }
    } else {
        res.status(200).json({ error: 'Token does not exist.' });
    }
}

export function generateTokenImage(tokenID, traits) {
    return new Promise( (resolve, reject) => {
        var wtanimalsLogo = `${process.cwd()}/public/images/wtanimalsLogo.png`;
        var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
        var tokenImagePath = `${process.cwd()}/public/images/animals/${tokenID}.png`;
        var tokenSmallImagePath = `${process.cwd()}/public/images/wtanimalsSmall/${tokenID}.png`;

        if (!fs.existsSync(tokenImagePath)) {
            if (traits.isSheep) {
                sharp(`${bodyPartsPath}0/${bodyPartsData[0][parseInt(traits.fur)].name}.png`)
                    .composite([
                        { input: `${bodyPartsPath}1/${bodyPartsData[1][parseInt(traits.head)].name}.png` },
                        // GOLD EARS ARE BUGGED (3, 4, 5)
                        { input: `${bodyPartsPath}2/${bodyPartsData[2][[3, 4, 5].indexOf(parseInt(traits.ears)) == -1 ? parseInt(traits.ears) : 0].name}.png` },
                        { input: `${bodyPartsPath}3/${bodyPartsData[3][parseInt(traits.eyes)].name}.png` },
                        { input: `${bodyPartsPath}4/${bodyPartsData[4][parseInt(traits.nose)].name}.png` },
                        { input: `${bodyPartsPath}5/${bodyPartsData[5][parseInt(traits.mouth)].name}.png` },
                        { input: `${bodyPartsPath}7/${bodyPartsData[7][parseInt(traits.feet)].name}.png` }
                    ])
                    .toFile(tokenSmallImagePath)
                    .then(() => {
                        sharp(tokenSmallImagePath)
                            .resize({ width: 320, height: 320, kernel: 'nearest' })
                            .composite([ { input: wtanimalsLogo } ])
                            .toFile(tokenImagePath)
                            .then(() => resolve(tokenImagePath));
                    });
            } else {
                sharp(`${bodyPartsPath}9/${bodyPartsData[9][parseInt(traits.fur)].name}.png`)
                    .composite([
                        { input: `${bodyPartsPath}12/${bodyPartsData[12][parseInt(traits.eyes)].name}.png` },
                        { input: `${bodyPartsPath}14/${bodyPartsData[14][parseInt(traits.nose)].name}.png` },
                        { input: `${bodyPartsPath}15/${bodyPartsData[15][parseInt(traits.neck)].name}.png` },
                        { input: `${bodyPartsPath}10/${bodyPartsData[10][parseInt(traits.alpha)].name}.png` },
                        { input: `${bodyPartsPath}7/${bodyPartsData[7][parseInt(traits.feet)].name}.png` }
                    ])
                    .toFile(tokenSmallImagePath)
                    .then(() => {
                        sharp(tokenSmallImagePath)
                            .resize({ width: 320, height: 320, kernel: 'nearest' })
                            .composite([ { input: wtanimalsLogo } ])
                            .toFile(tokenImagePath)
                            .then(() => resolve(tokenImagePath));
                    });
            }
        }
    });
}

const animals = { tokenURI, generateTokenImage };

export default animals;
