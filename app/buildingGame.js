import Web3 from 'web3';
import db from './database/database.js';

import buildingGameABI from './../abi/buildingGame.abi.js';

const web3 = new Web3(process.env.RPC_PROVIDER);

const buildingGameAddress = process.env.BUILDING_GAME_CONTRACT;
const buildingGameContract = new web3.eth.Contract(buildingGameABI, buildingGameAddress);

const connection = mysql.createConnection(config);

const MINIMUM_PARTICIPATION = 10;
const MINIMUM_PARTICIPANT = 2;

export function participateMany(game, participations, req, res) {
    var sql = "INESRT INTO buildingGame (`game`, `user`, `animalID`, `action`, `hash`, `nonce`) " +
              "VALUES " + participations.map(e => '(:?, :?, :?, :?, :?, :?)').join(', ') + ";";
    var params = participations.reduce((all, el) => all.concat(Object.values(el)), []);
    db.query(sql, params).then(() => {
        res.status(200).json({ result: true });
        checkMatches(game);
    }).catch(error => {
        console.err(`buildingGame.js:participateMany ${error}.`);
        res.status(200).json({ err: error });
    });
}

function checkMatches(game) {
    var sql = "SELECT SUM(`user_participations`) AS `participation_number`, " +
                      "COUNT(*) AS `user_number`, " +
                      "MAX(`user_participations`) AS `max_user_participation` " +
              "FROM (SELECT `user`, COUNT(*) AS `user_participations` FROM buildingGame WHERE game = :? GROUP BY `user`) t;";
    db.query(sql, [ game ]).then(result => {
        console.log(
            `${result.participation_number}/${MINIMUM_PARTICIPATION} participations  |  ` +
            `${result.user_number}/${MINIMUM_PARTICIPANT} participants   |   ` +
            `${result.max_user_participation}/${result.participation_number / 2} maximum user participation`
        );
        if (
            result.participation_number >= MINIMUM_PARTICIPATION &&
            result.user_number >= MINIMUM_PARTICIPANT &&
            result.max_user_participation <= result.participation_number / 2
        ) { initiateMatchMaking(game); }
    }).catch(error => console.err(`buildingGame.js:checkMatches ${error}.`));
}

function initiateMatchMaking(game) {
    var sql = "SELECT `animalID`, `action`, `hash` FROM buildingGame;";
    db.query(sql).then(result => {
        var animalIds = [];
        var actions = [];
        var hash = [];

        result.forEach(el => {
            animalIds.push(el.animalID);
            actions.push(el.action);
            hash.push(el.hash);
        });

        checkData(game, animalIds, actions, hashes);
    }).catch(error => console.err(`buildingGame.js:makeMatches ${error}.`));
}

function checkData(animalIds, actions, hashes) {
    buildingGameContract.methods.participations().call((error, result) => {
        if (error) {
            console.err(`buildingGame.js:checkData ${error}`);
            return;
        }

        var invalidData = 0;
        result[1].forEach(isValid => {
            if (!isValid) {
                var sql = "DELETE FROM buildingGame WHERE `animalIds` = :?;";
                db.query(sql, el).catch(error => console.err(`buildingGame.js:checkData ${error}.`));
                invalidData++;
            }
        });

        if (!invalidData) {
            makeMatches(game);
        }
    });
}

function makeMatches(game) {
    buildingGameContract.methods.makeMatches(animalIds, actions, hashes).call((error, result) => {
        if (error) {
            console.log(`buildingGame.js:makeMatches ${error}`)
            return;
        }

        var sql = "DELETE FROM buildingGame WHERE `animalIds` IN (" + animalIds.map(e => ':?').join(', ') + ");";
        db.query(sql, animalIds).catch(error => console.err(`buildingGame.js:makeMatches ${error}.`));
    });
}

const buildingGame = { participateMany };

export default buildingGame;
