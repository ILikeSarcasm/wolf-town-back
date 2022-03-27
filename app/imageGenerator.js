import fs from 'fs';
import sharp from 'sharp';
import Web3 from 'web3';

import animalABI from './../abi/wtanimal.abi.js';
import deedABI from './../abi/wtownershipdeed.abi.js';
import bodyPartsData from './../public/images/bodyParts/bodyPartsData.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const animalContract = new web3.eth.Contract(animalABI, process.env.WTANIMAL_CONTRACT);
const deedContract = new web3.eth.Contract(deedABI, process.env.WTOWNERSHIP_DEED_CONTRACT);

export function generateImage(tokenType, tokenId, res) {
    var promise;

    switch (tokenType) {
        case 'animal': promise = generateAnimalImage(tokenId); break;
        case 'deed': promise = generateDeedImage(tokenId); break;
        default: res.status(200).json({ err: 'Invalid parameters' }); return;
    }

    promise.then(imagePath => res.sendFile(imagePath)).catch(error => res.status(200).json({ err: error }));
}

function generateAnimalImage(animalId) {
    return new Promise((resolve, reject) => {
        var wtanimalsLogo = `${process.cwd()}/public/images/wtanimalsLogo.png`;
        var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
        var imagePath = `${process.cwd()}/public/images/animals/${animalId}.png`;
        var smallImagePath = `${process.cwd()}/public/images/wtanimalsSmall/${animalId}.png`;

        if (!fs.existsSync(imagePath)) {
            animalContract.methods.tokenTraits(animalId).call(async (error, traits) => {
                if (error) {
                    console.log(`imageGenerator.js:generateAnimalImage Animal ${animalId} ${error}`);
                    res.status(200).json({ err: `${error.data}` });
                    return;
                }

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
                        .toFile(smallImagePath)
                        .then(() => {
                            sharp(smallImagePath)
                                .resize({ width: 320, height: 320, kernel: 'nearest' })
                                .composite([ { input: wtanimalsLogo } ])
                                .toFile(imagePath)
                                .then(() => resolve(imagePath));
                        });
                } else {
                    sharp(`${bodyPartsPath}9/${bodyPartsData[9][parseInt(traits.fur)].name}.png`)
                        .composite([
                            { input: `${bodyPartsPath}12/${bodyPartsData[12][parseInt(traits.eyes)].name}.png` },
                            { input: `${bodyPartsPath}14/${bodyPartsData[14][parseInt(traits.nose)].name}.png` },
                            { input: `${bodyPartsPath}15/${bodyPartsData[15][parseInt(traits.neck)].name}.png` },
                            { input: `${bodyPartsPath}10/${bodyPartsData[10][parseInt(traits.alpha)].name}.png` }
                        ])
                        .toFile(smallImagePath)
                        .then(() => {
                            sharp(smallImagePath)
                                .resize({ width: 320, height: 320, kernel: 'nearest' })
                                .composite([ { input: wtanimalsLogo } ])
                                .toFile(imagePath)
                                .then(() => resolve(imagePath));
                        });
                }
            });
        } else {
            resolve(imagePath);
        }
    });
}

function generateDeedImage(deedId) {
    return new Promise((resolve, reject) => {
        var imagePath = `${process.cwd()}/public/images/deeds/${deedId}.png`;

        if (!fs.existsSync(imagePath)) {
            deedContract.methods.getDeed(deedId).call(async (error, traits) => {
                // Generate Deed image
            });
        } else {
            resolve(imagePath);
        }
    });
}

const imageGenerator = { generateImage };

export default imageGenerator;
