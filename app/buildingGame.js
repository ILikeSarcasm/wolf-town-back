import Web3 from 'web3';
import db from './database/database.js';

import buildingGameABI from './../abi/buildingGame.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const buildingGameAddress = process.env.BUILDING_GAME_CONTRACT;
const buildingGameContract = new web3.eth.Contract(buildingGameABI, buildingGameAddress);

const connection = mysql.createConnection(config);

const MIN_PARTICIPATION = 10;

export function participateMany(game, user, participations, res) {
    var sql = "SELECT MIN(`max`) AS `max_participations`" +
              "FROM (" +
		              "SELECT CASE WHEN " + MIN_PARTICIPATION + " - COUNT(*) <= " + MIN_PARTICIPATION / 2 + " THEN " + MIN_PARTICIPATION + " - COUNT(*) ELSE " + MIN_PARTICIPATION / 2 + " END AS `max` FROM buildingGame WHERE `game` = :? AND `state` = 'WAITING'" +
	              "UNION" +
		              "SELECT " + MIN_PARTICIPATION / 2 + " - COUNT(*) AS `max` FROM buildingGame WHERE `game` = :? AND `state` = 'WAITING' AND `user` = :?" +
              ") t;";
    var params = [ game, game, user ];

    db.query(sql, params).then(result => {
        var toWaiting = result.max_participations;
        var toStored = participations.length - toWaiting;

        if (toWaiting > 0) {
            var sql = "INSERT INTO buildingGame (`state`, `game`, `user`, `animalID`, `action`, `hash`, `nonce`) " +
                      "VALUES " + Array(toWaiting).fill(`('WAITING', :?, :?, :?, :?, :?, :?)`).join(', ') + ";";
        }

        if (toStored > 0) {
            var sql = "INSERT INTO buildingGame (`state`, `game`, `user`, `animalID`, `action`, `hash`, `nonce`) " +
                      "VALUES " + Array(toStored).fill(`('STORED', :?, :?, :?, :?, :?, :?)`).join(', ') + ";";
        }

        res.status(200).json({ result: true });

        checkMatches(game);
    }).catch(error => {
        console.err(`buildingGame.js:participateMany ${error}.`);
        res.status(200).json({ err: error });
    });
}

function checkMatches(game) {
    var sql = "SELECT COUNT(*) AS `waiting_participations`" +
              "FROM buildingGame" +
              "WHERE `game` = :? AND `state` = 'WAITING';";
    var params = [ game ];

    db.query(sql, params).then(result => {
        if (result.waiting_participations >= MIN_PARTICIPATION) {
            initiateMatchMaking(game);
        }
    }).catch(error => console.err(`buildingGame.js:checkMatches ${error}.`));
}

function initiateMatchMaking(game) {
    var sql = "UPDATE buildingGame" +
              "SET `state` = 'PROCESSING'" +
              "WHERE `game` = :? AND `state` = 'WAITING';";
    var params = [ game ];

    db.query(sql, params)
        .then(() => fetchParticipationData(game))
        .catch(error => console.err(`buildingGame.js:initiateMatchMaking ${error}.`));
}

function fetchParticipationData(game) {
    var sql = "SELECT `user`, `animalID`, `action`, `hash`" +
              "FROM buildingGame" +
              "WHERE `game` = :? AND `state` = 'WAITING'" +
              "LIMIT " + MIN_PARTICIPATION + ";";
    var params = [ game ];

    db.query(sql, params).then(result => {
        // var users = [];
        var animalIds = [];
        var actions = [];
        var hash = [];

        result.forEach(el => {
            // users.push(el.user);
            animalIds.push(el.animalID);
            actions.push(el.action);
            hash.push(el.hash);
        });

        checkData(game, /* users, */ animalIds, actions, hashes);
    }).catch(error => console.err(`buildingGame.js:initiateMatchMaking ${error}.`));
}

function checkData(game, /* users, */ animalIds, actions, hashes) {
    buildingGameContract.methods.participations(game, animalIds).call((error, result) => {
        if (error) {
            console.err(`buildingGame.js:checkData ${error}`);
            return;
        }

        var invalidData = 0;
        for (var i=0; i<animalIds.length; i++) {
            var hashedAction = web3.sha3(
                web3.utils.toHex(actions[i]) +
                web3.utils.toHex(hashes[i]) +
                web3.utils.toHex(result[i].nonce
            ), { encoding: 'hex' });

            if (hashedAction != result[i].hashedAction) {
                var sql = "DELETE FROM buildingGame" +
                          "WHERE `game` = :? AND `animalIds` = :?;";
                var params = [ game, animalIds[i] ];

                db.query(sql, params).catch(error => console.err(`buildingGame.js:checkData ${error}.`));
                invalidData++;
            }
        }

        if (!invalidData) {
            makeMatches(game, /* users, */ animalIds, actions, hashes);
        }
    });
}

function makeMatches(game, /* users, */ animalIds, actions, hashes) {
    buildingGameContract.methods.makeMatches(/* users, */ animalIds, actions, hashes).call((error, result) => {
        if (error) {
            console.log(`buildingGame.js:makeMatches ${error}`)
            return;
        }

        var sql = "DELETE FROM buildingGame" +
                  "WHERE `game` = :? AND `state` = 'PROCESSING' AND `animalIds` IN (" + animalIds.map(e => ':?').join(', ') + ");";
        var params = [ game, ...animalIds ];

        db.query(sql, params).catch(error => console.err(`buildingGame.js:makeMatches Tokens: ${animalIds} ${error}.`));
    });
}

const buildingGame = { participateMany };

export default buildingGame;
