import Web3 from 'web3';
import db from './database/database.js';

import buildingGameABI from './../abi/buildingGame.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const buildingGameAddress = process.env.BUILDING_GAME_CONTRACT;
const buildingGameContract = new web3.eth.Contract(buildingGameABI, buildingGameAddress);

const connection = mysql.createConnection(config);

const MIN_PARTICIPATION = 10;

export function participateMany(game, user, participations, res) {
    var sql = "INSERT INTO buildingGame (`state`, `game`, `user`, `animalID`, `action`, `hash`) " +
              "VALUES " + Array(participations.length).fill(`('WAITING', :?, :?, :?, :?, :?)`).join(', ') + ";";
    var params = participations.reduce((all, el) => all.concat([ game, el.user, el.animalID, el.action, el.hash ]), []);

    db.query(sql, params).then(() => {
        res.status(200).json({ result: true });
        checkMatches(game);
    }).catch(error => {
        res.status(200).json({ err: error });
        console.err(`buildingGame.js:participateMany ${error}.`);
    });
}

function checkMatches(game) {
    var sql = "SELECT bg.`user`, bg.`animalID`, bg.`action`, bg.`hash` " +
              "FROM buildingGame bg " +
                	"JOIN (" +
                		"SELECT `user`, GROUP_CONCAT(`animalID`) AS `animalIDs` " +
                		"FROM buildingGame " +
                		"WHERE `game` = :? AND `state` = 'WAITING' " +
                		"GROUP BY `user` " +
                	") t ON bg.`user` = t.`user` AND FIND_IN_SET(bg.`animalID`, t.`animalIDs`) BETWEEN 1 AND " + MIN_PARTICIPATION / 2 + " " +
              "ORDER BY bg.`timestamp` " +
              "LIMIT " + MIN_PARTICIPATION + ";";
    var params = [ game ];

    db.query(sql, params).then(result => {
        if (result.length == MIN_PARTICIPATION) {
            initiateMatchMaking(game, result);
        }
    }).catch(error => console.err(`buildingGame.js:checkMatches ${error}.`));
}

function initiateMatchMaking(game, data) {
    // var users = [];
    var animalIDs = [];
    var actions = [];
    var hashes = [];

    data.forEach(row => {
        // users.push(el.user);
        animalIDs.push(row.animalID);
        actions.push(row.action);
        hashes.push(row.hash);
    });

    switchState(game, animalIDs, 'PROCESSING');
    checkData(game, /* users, */ animalIDs, actions, hashes);
}

function switchState(game, animalIDs, state) {
    var sql = "UPDATE buildingGame " +
          "SET `state` = '" + state + "' " +
          "WHERE `game` = :? AND `animalID` IN (" + data.map(row => row.animalID).join(', ') + ")";
    var params = [ game ];

    db.query(sql, params).catch(error => console.err(`buildingGame.js:switchState ${error}.`));
}

function checkData(game, /* users, */ animalIDs, actions, hashes) {
    buildingGameContract.methods.participations(game, animalIDs).call((error, result) => {
        if (error) {
            console.err(`buildingGame.js:checkData ${error}`);
            return;
        }

        var validAnimalIDs = [];
        for (var i=0; i<animalIDs.length; i++) {
            var hashedAction = web3.sha3(
                web3.utils.toHex(actions[i]) +
                web3.utils.toHex(hashes[i]) +
                web3.utils.toHex(result[i].nonce
            ), { encoding: 'hex' });

            if (hashedAction != result[i].hashedAction) {
                var sql = "DELETE FROM buildingGame " +
                          "WHERE `game` = :? AND `animalID` = :?;";
                var params = [ game, animalIDs[i] ];

                db.query(sql, params).catch(error => console.err(`buildingGame.js:checkData ${error}.`));
            } else {
                validAnimalIDs.push(animalIDs[i]);
            }
        }

        if (validAnimalIDs.length == animalIDs.length) {
            makeMatches(game, /* users, */ animalIDs, actions, hashes);
        } else {
            switchState(game, validAnimalIDs, 'WAITING');
            checkMatches(game);
        }
    });
}

function makeMatches(game, /* users, */ animalIDs, actions, hashes) {
    buildingGameContract.methods.makeMatches(/* users, */ animalIDs, actions, hashes).call((error, result) => {
        if (error) {
            console.log(`buildingGame.js:makeMatches ${error}`)
            return;
        }

        var sql = "DELETE FROM buildingGame " +
                  "WHERE `game` = :? AND `animalID` IN (" + animalIDs.map(animalID => ':?').join(', ') + ");";
        var params = [ game, ...animalIDs ];

        db.query(sql, params).catch(error => console.err(`buildingGame.js:makeMatches Tokens: ${animalIDs} ${error}.`));
    });
}

const buildingGame = { participateMany };

export default buildingGame;
