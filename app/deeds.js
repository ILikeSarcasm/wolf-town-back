import Web3 from 'web3';
import db from './database/database.js';

import wtdeedABI from './../abi/wtownershipdeed.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtdeedAddress = process.env.WTOWNERSHIP_DEED_CONTRACT;
const wtdeedContract = new web3.eth.Contract(wtdeedABI, wtdeedAddress);

export function deedURI(deedID, res) {
    getURIs([ deedID ])
        .then(metadatas => res.status(200).json(metadatas[deedID]))
        .catch(error => res.status(200).json({ err: `${error}` }));
}

export function deedURIs(deedURIs, res) {
    getURIs(deedURIs)
        .then(metadatas => res.status(200).json(metadatas))
        .catch(error => res.status(200).json({ err: `${error}` }));
}

function getURIs(deedIDs) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT `id` FROM deed WHERE `id` IN (" + deedIDs.map(() => '?').join(', ') + ");";
        var params = deedIDs;

        db.query(sql, params).then(async rows => {

            var existingIds = rows.map(row => row.id);
            var missingIds = deedIDs.filter(deedId => !existingIds.includes(deedId));

            var metadatas = {};

            var promises = [];
            if (missingIds.length) {
                await wtdeedContract.methods.getDeeds(missingIds).call(async (error, deeds) => {
                    if (error) {
                        console.log(`deeds.js:getURIs ${error}`);
                        reject(error);
                        return;
                    }

                    deeds.forEach((deed, i) => {
                        deed = { id: missingIds[i], ...deed };
                        if (parseInt(deed.buildingId)) {
                            promises.push(toDB(deed));
                        } else {
                            metadatas[deed.id] = `Deed ${deed.id} does not exist.`;
                        }
                    });
                });
            }

            Promise.allSettled(promises).then(() => {
                var sql = "SELECT d.`id`, b.`name`, d.`points` " +
                          "FROM deed d " +
                          "LEFT JOIN building b ON d.`buildingId` = b.`id` " +
                          "WHERE d.`id` IN (" + deedIDs.map(() => '?').join(', ') + ");";
                var params = deedIDs;

                db.query(sql, params).then(rows => {
                    rows.forEach(row => metadatas[row.id] = getMetadata(row));
                    resolve(metadatas);
                }).catch(error => {
                    console.error(`deeds.js:getURIs ${sql} ${params} ${error}.`);
                    reject(error);
                });
            });

        }).catch(error => {
            console.error(`deeds.js:getURIs ${sql} ${params} ${error}.`);
            reject(error);
        });
    });
}

function getMetadata(deed) {
    var metadata = {
        id: deed.id,
        name: `Ownership deed #${deed.id}`,
        description: 'Wolf Town NFT Ownership Deed collection.',
        image: `${process.env.URL}images/deeds/${deed.id}.png`,
        // imageSmall: `data:image/svg;base64,${base64SmallImage}`,
        attributes: [
            { trait_type: 'building', value: deed.buildingName },
            { trait_type: 'points', value: deed.points }
        ]
    };

    return metadata;
}

function toDB(deed) {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO deed (`id`, `buildingID`, `points`) " +
                  "VALUES (?, '" + deed.buildingId + "', " + deed.points + ");";
        var params = [ deed.id ];

        db.query(sql, params).then(result => resolve(deed)).catch(error => {
            console.error(`deeds.js:toDB ${sql} ${params} ${error}.`);
            reject(error);
        });
    });
}

// function generateTokenImage(deedID, traits) {
//     return new Promise((resolve, reject) => {
//         var wtanimalsLogo = `${process.cwd()}/public/images/wtanimalsLogo.png`;
//         var bodyPartsPath = `${process.cwd()}/public/images/bodyParts/`;
//         var tokenImagePath = `${process.cwd()}/public/images/animals/${deedID}.png`;
//         var tokenSmallImagePath = `${process.cwd()}/public/images/wtanimalsSmall/${deedID}.png`;
//
//         if (!fs.existsSync(tokenImagePath)) {
//             if (traits.isSheep) {
//                 sharp(`${bodyPartsPath}0/${bodyPartsData[0][parseInt(traits.fur)].name}.png`)
//                     .composite([
//                         { input: `${bodyPartsPath}1/${bodyPartsData[1][parseInt(traits.head)].name}.png` },
//                         // GOLD EARS ARE BUGGED (3, 4, 5)
//                         { input: `${bodyPartsPath}2/${bodyPartsData[2][[3, 4, 5].indexOf(parseInt(traits.ears)) == -1 ? parseInt(traits.ears) : 0].name}.png` },
//                         { input: `${bodyPartsPath}3/${bodyPartsData[3][parseInt(traits.eyes)].name}.png` },
//                         { input: `${bodyPartsPath}4/${bodyPartsData[4][parseInt(traits.nose)].name}.png` },
//                         { input: `${bodyPartsPath}5/${bodyPartsData[5][parseInt(traits.mouth)].name}.png` },
//                         { input: `${bodyPartsPath}7/${bodyPartsData[7][parseInt(traits.feet)].name}.png` }
//                     ])
//                     .toFile(tokenSmallImagePath)
//                     .then(() => {
//                         sharp(tokenSmallImagePath)
//                             .resize({ width: 320, height: 320, kernel: 'nearest' })
//                             .composite([ { input: wtanimalsLogo } ])
//                             .toFile(tokenImagePath)
//                             .then(() => resolve(tokenImagePath));
//                     });
//             } else {
//                 sharp(`${bodyPartsPath}9/${bodyPartsData[9][parseInt(traits.fur)].name}.png`)
//                     .composite([
//                         { input: `${bodyPartsPath}12/${bodyPartsData[12][parseInt(traits.eyes)].name}.png` },
//                         { input: `${bodyPartsPath}14/${bodyPartsData[14][parseInt(traits.nose)].name}.png` },
//                         { input: `${bodyPartsPath}15/${bodyPartsData[15][parseInt(traits.neck)].name}.png` },
//                         { input: `${bodyPartsPath}10/${bodyPartsData[10][parseInt(traits.alpha)].name}.png` }
//                     ])
//                     .toFile(tokenSmallImagePath)
//                     .then(() => {
//                         sharp(tokenSmallImagePath)
//                             .resize({ width: 320, height: 320, kernel: 'nearest' })
//                             .composite([ { input: wtanimalsLogo } ])
//                             .toFile(tokenImagePath)
//                             .then(() => resolve(tokenImagePath));
//                     });
//             }
//         } else {
//             resolve(tokenImagePath);
//         }
//     });
// }

const deeds = { deedURI, deedURIs };

export default deeds;
