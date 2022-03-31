import fs from 'fs';
import sharp from 'sharp';
import Web3 from 'web3';

import wtAPIABI from './../abi/wtAPI.abi.js';

import bodyPartsData from './../public/images/bodyParts/bodyPartsData.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtAPIAddress = process.env.WTAPI_CONTRACT;
const wtAPIContract = new web3.eth.Contract(wtAPIABI, wtAPIAddress);

const BUILDING_NAMES = [ "", "ARENA" ];

export function tokenURI(tokenID, res) {
    getURIs([ tokenID ])
        .then(metadatas => res.status(200).json(metadatas[tokenID]))
        .catch(error => res.status(200).json({ err: `${error}` }));
}

export function tokenURIs(tokenIDs, res) {
    getURIs(tokenIDs)
        .then(metadatas => res.status(200).json(metadatas))
        .catch(error => res.status(200).json({ err: `${error}` }));
}

function getURIs(tokenIDs) {
    return new Promise((resolve, reject) => {
        var metadatas = {};

        wtAPIContract.methods.WTAnimalData(tokenIDs, process.env.WTANIMAL_CONTRACT, process.env.SKILL_MANAGER_CONTRACT, process.env.BUILDING_GAME_MANAGER_CONTRACT).call(async (error, animals) => {
            if (error) {
                reject(error);
                return console.error(`animals.js:getURIs ${error}`);
            }

            var promises = [];
            tokenIDs.forEach((tokenID, i) => promises.push(generateTokenMetadata(tokenID, {
                traits: animals.traits[i],
                skills: animals.skills[i],
                ownership: animals.ownership[i]
            })));

            Promise.allSettled(promises).then(results => {
                results.forEach(result => result.value ? metadatas[result.value.id] = result.value : null);
                resolve(metadatas);
            });
        });
    });
}

function generateTokenMetadata(tokenID, data) {
    return new Promise((resolve, reject) => {
        generateTokenImage(tokenID, data.traits).then(base64SmallImage => {
            var ownerships = [];
            data.ownership.forEach((ownership, i) => {
                if (ownership.points != '0') {
                    ownerships.push({
                        trait_type: BUILDING_NAMES[i],
                        value: ownership.points
                    });
                }
            });
            
            var metadata = {
                id: tokenID,
                name: `${data.traits.isSheep ? 'Sheep': 'Wolf'} #${tokenID}`,
                description: 'Wolf Town NFT collection.',
                image: `${process.env.URL}images/animals/${tokenID}.png`,
                imageSmall: `data:image/svg;base64,${base64SmallImage}`,
                attributes: [
                    { trait_type: 'type', value: data.traits.isSheep ? 'Sheep' : 'Wolf' },
                    { trait_type: 'fur', value: bodyPartsData[data.traits.isSheep ? 0 : 9][parseInt(data.traits['fur'])].name },
                    { trait_type: 'head', value: bodyPartsData[1][parseInt(data.traits['head'])].name },
                    { trait_type: 'ears', value: bodyPartsData[2][parseInt(data.traits['ears'])].name },
                    { trait_type: 'eyes', value: bodyPartsData[data.traits.isSheep ? 3 : 12][parseInt(data.traits['eyes'])].name },
                    { trait_type: 'nose', value: bodyPartsData[data.traits.isSheep ? 4 : 14][parseInt(data.traits['nose'])].name },
                    { trait_type: 'mouth', value: bodyPartsData[5][parseInt(data.traits['mouth'])].name },
                    { trait_type: 'neck', value: data.traits.isSheep ? "None" : bodyPartsData[15][parseInt(data.traits['neck'])].name },
                    { trait_type: 'feet', value: bodyPartsData[7][parseInt(data.traits['feet'])].name },
                    { trait_type: 'alpha', value: data.traits.isSheep ? "None" : bodyPartsData[10][parseInt(data.traits['alpha'])].name },

                    { trait_type: 'building skill level', value: data.skills[1].level },
                    { trait_type: 'stealing skill level', value: data.skills[2].level },

                    ...ownerships
                ]
            };

            resolve(metadata);
        }).catch(error => reject(error));
    });
}

function generateTokenImage(tokenID, traits) {
    return new Promise(async (resolve, reject) => {
        var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
        var smallImagePath = `${process.cwd()}/public/images/wtanimalsSmall/${tokenID}.png`;
        var base64SmallImage;

        if (!fs.existsSync(smallImagePath)) {
            if (traits.isSheep) {
                await sharp(`${bodyPartsPath}0/${bodyPartsData[0][parseInt(traits.fur)].name}.png`)
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
                    .catch(error => reject(`animals.js:generateTokenImage Animal ${tokenID} ${error}`));
            } else {
                await sharp(`${bodyPartsPath}9/${bodyPartsData[9][parseInt(traits.fur)].name}.png`)
                    .composite([
                        { input: `${bodyPartsPath}12/${bodyPartsData[12][parseInt(traits.eyes)].name}.png` },
                        { input: `${bodyPartsPath}14/${bodyPartsData[14][parseInt(traits.nose)].name}.png` },
                        { input: `${bodyPartsPath}15/${bodyPartsData[15][parseInt(traits.neck)].name}.png` },
                        { input: `${bodyPartsPath}10/${bodyPartsData[10][parseInt(traits.alpha)].name}.png` }
                    ])
                    .toFile(smallImagePath)
                    .catch(error => reject(`animals.js:generateTokenImage Animal ${tokenID} ${error}`));
            }
        }

        try {
            base64SmallImage = new Buffer.from(fs.readFileSync(smallImagePath)).toString('base64');
            resolve(base64SmallImage);
        } catch (error) {
            reject(`animals.js:generateTokenImage Animal ${tokenID} ${error}`);
        }
    });
}

const animals = { tokenURI, tokenURIs };

export default animals;
