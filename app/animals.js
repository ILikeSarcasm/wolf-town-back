import fs from 'fs';
import sharp from 'sharp';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';
import wtAPIABI from './../abi/wtAPI.abi.js';
import bodyPartsData from './../public/images/bodyParts/bodyPartsData.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);
const wtAPIAddress = process.env.WTAPI_CONTRACT;
const wtAPIContract = new web3.eth.Contract(wtAPIABI, wtAPIAddress);

export function tokenURI(tokenID, req, res) {
    var metadataPath = `${process.cwd()}/public/metadata/${tokenID}.json`;
    if (!fs.existsSync(metadataPath)) {
        wtanimalContract.methods.totalSupply().call((error, totalSupply) => {
            if (error) {
                console.log(`animals.js:tokenURI ${error}`);
                res.status(200).json({ err: `${error.data}` });
                return;
            }

            if (parseInt(totalSupply) < parseInt(tokenID)) {
                console.log(`animals.js:tokenURI Token ${tokenID} does not exist.`);
                res.status(200).json({ err: `Token ${tokenID} does not exist.` });
                return;
            }

            wtanimalContract.methods.tokenTraits(tokenID).call(async (error, traits) => {
                if (error) {
                    console.log(`animals.js:tokenURI ${error}`);
                    res.status(200).json({ err: `${error.data}` });
                    return;
                }

                res.status(200).json(await generateTokenMetadata(tokenID, traits));
            });
        });
    } else {
        fs.readFile(metadataPath, (error, json) => {
            if (error) {
                console.log(`animals.js:tokenURI ${error}`);
                res.status(200).json({ err: `${error}` });
            } else {
                res.status(200).json(JSON.parse(json));
            }
        });
    }
}

export function tokenURIs(tokenIDs, req, res) {
    wtanimalContract.methods.totalSupply().call((error, totalSupply) => {
        wtAPIContract.methods.WTAnimalURIs(tokenIDs, wtanimalAddress).call(async (error, traitsArray) => {
            if (error) {
                console.log(`animals.js:tokenURIs ${error}`);
                res.status(200).json({ err: `${error}` });
                return;
            }

            var metadatas = {};

            for (var i=0; i<traitsArray.length; i++) {
                var metadata;
                var metadataPath = `${process.cwd()}/public/metadata/${tokenIDs[i]}.json`;

                if (parseInt(totalSupply) >= parseInt(tokenIDs[i])) {
                    if (!fs.existsSync(metadataPath)) {
                        metadata = await generateTokenMetadata(tokenIDs[i], traitsArray[i]);
                    } else {
                        try {
                            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                        } catch (error) {
                            console.erroror(`animals.js:tokenURIs ${error}`);
                            metadata = { data: error };
                        }
                    }
                } else {
                    console.erroror(`animals.js:tokenURIs Token ${tokenIDs[i]} does not exist.`);
                    metadata = { data: `Token ${tokenIDs[i]} does not exist.` }
                }

                metadatas[tokenIDs[i]] = metadata;
            }

            res.status(200).json(metadatas);
        });
    });
}

async function generateTokenMetadata(tokenID, traits) {
    await generateTokenImage(tokenID, traits);

    var base64SmallImage = new Buffer(fs.readFileSync(`${process.cwd()}/public/images/wtanimalsSmall/${tokenID}.png`)).toString('base64');
    var metadata = {
        id: tokenID,
        name: `${traits.isSheep ? 'Sheep': 'Wolf'} #${tokenID}`,
        description: 'Wolf Town NFT collection.',
        image: `${process.env.URL}images/animals/${tokenID}.png`,
        imageSmall: `data:image/svg;base64,${base64SmallImage}`,
        attributes: [
            { trait_type: 'type', value: traits.isSheep ? 'Sheep' : 'Wolf' },
            { trait_type: 'fur', value: bodyPartsData[traits.isSheep ? 0 : 9][parseInt(traits['fur'])].name },
            { trait_type: 'head', value: bodyPartsData[1][parseInt(traits['head'])].name },
            { trait_type: 'ears', value: bodyPartsData[2][parseInt(traits['ears'])].name },
            { trait_type: 'eyes', value: bodyPartsData[traits.isSheep ? 3 : 12][parseInt(traits['eyes'])].name },
            { trait_type: 'nose', value: bodyPartsData[traits.isSheep ? 4 : 14][parseInt(traits['nose'])].name },
            { trait_type: 'mouth', value: bodyPartsData[5][parseInt(traits['mouth'])].name },
            { trait_type: 'neck', value: traits.isSheep ? "None" : bodyPartsData[15][parseInt(traits['neck'])].name },
            { trait_type: 'feet', value: bodyPartsData[7][parseInt(traits['feet'])].name },
            { trait_type: 'alpha', value: traits.isSheep ? "None" : bodyPartsData[10][parseInt(traits['alpha'])].name }
        ]
    };

    fs.writeFile(`${process.cwd()}/public/metadata/${tokenID}.json`, JSON.stringify(metadata), (error) => {
        if (error) {
            console.log(`animals.js:generateTokenMetadata ${error}`);
        }
    });

    return metadata;
}

function generateTokenImage(tokenID, traits) {
    return new Promise((resolve, reject) => {
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
                        { input: `${bodyPartsPath}10/${bodyPartsData[10][parseInt(traits.alpha)].name}.png` }
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
        } else {
            resolve(tokenImagePath);
        }
    });
}

const animals = { tokenURI, tokenURIs };

export default animals;
