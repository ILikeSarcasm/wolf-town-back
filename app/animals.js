import fs from 'fs';
import images from 'images';
import Web3 from 'web3';

import wtanimalABI from './../abi/wtanimal.abi.js';
import bodyPartsData from './../public/images/bodyParts/bodyPartsData.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtanimalAddress = process.env.WTANIMAL_CONTRACT;
const wtanimalContract = new web3.eth.Contract(wtanimalABI, wtanimalAddress);

export async function tokenURI(tokenID, req, res) {
    var metadataPath = `./public/metadata/${tokenID}.json`;
    if (tokenID <= 50000) {
        if (!fs.existsSync(metadataPath)) {
            wtanimalContract.methods.tokenTraits(tokenID).call((err, result) => {
                if (err) {
                    console.log(`animals.js:tokenURI ${err}`);
                    res.status(200).json({ error: err });
                    return;
                }

                var tokenImagePath = generateTokenImage(tokenID, result);
                if (!tokenImagePath) {
                    res.status(200).json({ error: 'An error occured ...' });
                    return;
                }

                var base64 = new Buffer(fs.readFileSync(tokenImagePath)).toString('base64');
                var json = {
                    name: `${result.isSheep ? 'Sheep': 'Wolf'} #${tokenID}`,
                    description: 'Wolf Town NFT collection.',
                    image: `<svg id="woolf" width="100%" height="100%" version="1.1" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image x="4" y="4" width="32" height="32" image-rendering="pixelated" preserveAspectRatio="xMidYMid" xlink:href="data:image/png;base64,${base64}"></image></svg>`,
                    attributes: [
                        { trait_type: 'fur', value: result['fur'] },
                        { trait_type: 'head', value: result['head'] },
                        { trait_type: 'ears', value: result['ears'] },
                        { trait_type: 'eyes', value: result['eyes'] },
                        { trait_type: 'nose', value: result['nose'] },
                        { trait_type: 'mouth', value: result['mouth'] },
                        { trait_type: 'neck', value: result['neck'] },
                        { trait_type: 'feet', value: result['feet'] },
                        { trait_type: 'alpha', value: result['alpha'] }
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
    var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
    var tokenImagePath = `${process.cwd()}/public/images/wtanimals/${tokenID}.png`;

    if (!fs.existsSync(tokenImagePath)) {
        try {
            if (traits.isSheep) {
                images(`${bodyPartsPath}0/${bodyPartsData[0][parseInt(traits.fur)].name}.png`)
                    // WHITE CAP IS BUGGED (19)
                    .draw(images(`${bodyPartsPath}1/${bodyPartsData[1][parseInt(traits.head) != 19 ? parseInt(traits.head) : 0].name}.png`), 0, 0)
                    // GOLD EARS ARE BUGGED (3, 4, 5)
                    .draw(images(`${bodyPartsPath}2/${bodyPartsData[2][[3, 4, 5].indexOf(parseInt(traits.ears)) == -1 ? parseInt(traits.ears) : 0].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}3/${bodyPartsData[3][parseInt(traits.eyes)].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}4/${bodyPartsData[4][parseInt(traits.nose)].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}5/${bodyPartsData[5][parseInt(traits.mouth)].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}7/${bodyPartsData[7][parseInt(traits.feet)].name}.png`), 0, 0)
                    .save(tokenImagePath);
            } else {
                images(`${bodyPartsPath}9/${bodyPartsData[9][parseInt(traits.fur)].name}.png`)
                    .draw(images(`${bodyPartsPath}12/${bodyPartsData[12][parseInt(traits.eyes)].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}14/${bodyPartsData[14][parseInt(traits.nose)].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}15/${bodyPartsData[15][parseInt(traits.neck)].name}.png`), 0, 0)
                    .draw(images(`${bodyPartsPath}10/${bodyPartsData[10][parseInt(traits.alpha)].name}.png`), 0, 0)
                    .save(tokenImagePath);
            }
        } catch (err) {
            console.log(`animals.js:generateTokenImage ${err}`);
            console.log(`traits: ${traits}`);
            tokenImagePath = null;
        }
    }

    return tokenImagePath;
}

const animals = { tokenURI, generateTokenImage };

export default animals;
