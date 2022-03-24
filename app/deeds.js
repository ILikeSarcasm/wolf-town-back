import Web3 from 'web3';
import db from './database/database.js';

import wtdeedABI from './../abi/wtownershipdeed.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const wtdeedAddress = process.env.BUILDING_GAME_MANAGER_CONTRACT;
const wtdeedContract = new web3.eth.Contract(wtdeedABI, wtdeedAddress);

export function deedURI(deedID, req, res) {
    var sql = "SELECT d.`id`, b.`name`, d.`points` " +
              "FROM deed d " +
              "LEFT JOIN building b ON d.`buildingId` = b.`id` " +
              "WHERE d.`id` = ?;";
    var params = [ deedID ];

    db.query(sql, params).then(result => {
        if (!result.length) {
            wtanimalContract.methods.getDeeds([ deedID ]).call((error, deeds) => {
                if (error) {
                    console.log(`deeds.js:deedURI ${error}`);
                    res.status(200).json({ err: `${error.data}` });
                    return;
                }

                var data = { id: deedID, ...deeds[0] };
                toDB(data).catch(error => console.error(`deeds.js:deedURI ${error}.`));
                res.status(200).json(getMetadata(data));
            });
        } else {
            res.status(200).json(getMetadata(result));
        }
    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`deeds.js:deedURI ${error}.`);
    });
}

export function deedURIs(deedIDs, req, res) {
    var sql = "SELECT t.`id` " +
              "FROM (VALUES " + deedIDs.map(deedID => 'ROW(?)').join(', ') + ") t(`id`) " +
              "LEFT JOIN deed d ON t.`id` = d.`id` " +
              "WHERE d.`id` IS NULL;";
    var params = [ deedIDs ];

    db.query(sql, params).then(results => {

        var metadatas = {};

        var promises = [];
        if (results.length) {
            wtdeedContract.methods.getDeeds(results.map(result => result.id)).call(async (error, deeds) => {
                if (error) {
                    console.log(`animals.js:deedURIs ${error}`);
                    res.status(200).json({ err: `${error}` });
                    return;
                }

                deeds.forEach((deed, i) => {
                    var data = { id: results[i], ...deed };
                    promises.push(toDB(data).catch(error => console.error(`deeds.js:deedURIs ${error}.`)));
                });
            });
        }

        Promise.allSettled(promises).then(() => {
            var sql = "SELECT d.`id`, b.`name`, d.`points` " +
                      "FROM deed " +
                      "LEFT JOIN building b ON d.`buildingId` = b.`id` " +
                      "WHERE d.`id` IN (" + deedIDs.map(deedID => '?').join(', ') + ");";
            var params = [ deedIDs ];

            db.query(sql, params).then(deeds => {
                deeds.forEach(deed => metadatas[deed.id] = getMetadata(deed));
                res.status(200).json(metadatas);
            }).catch(error => {
                res.status(200).json({ err: `${error}` });
                console.error(`deeds.js:deedURIs ${error}.`);
            });
        });

    }).catch(error => {
        res.status(200).json({ err: `${error}` });
        console.error(`deeds.js:deedURIs ${error}.`);
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

async function toDB(deed) {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO deeds (`id`, `buildingID`, `points`) " +
                  "VALUES (?, '" + deed.buildingId + "', " + deed.points + ");";
        var params = [ deed.id ];

        db.query(sql, params).then(result => {
            resolve(deed);
        }).catch(error => {
            reject(error);
            console.error(`deeds.js:toDB ${error}.`);
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
