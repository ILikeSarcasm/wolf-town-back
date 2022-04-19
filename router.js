import express from 'express';

import animals from './app/animals.js';
import imageGenerator from './app/imageGenerator.js';
import buildingGame from './app/buildingGame.js';
import forestExploration from './app/forestExploration.js';
import arena from './app/arena.js';
import tournament from './app/tournament.js';

const router = express.Router();

router.get('/animals/:id', (req, res, next) => animals.tokenURI(parseInt(req.params.id), res));
router.get('/animals', (req, res, next) => animals.tokenURIs(JSON.parse(decodeURIComponent(req.query.ids)), res));

router.get('/generate-image', (req, res, next) => imageGenerator.generateImage(req.query.type, parseInt(req.query.id), res));

router.get('/building-game/participations', (req, res, next) => buildingGame.getParticipationRouter(req.query.gameId, req, res));
router.post('/building-game/participate', (req, res, next) => buildingGame.participateMany(req.query.gameId, JSON.parse(decodeURIComponent(req.query.participations)), res));
router.post('/building-game/cancel', (req, res, next) => buildingGame.cancelMany(req.query.gameId, JSON.parse(decodeURIComponent(req.query.animalIds)), res));
router.post('/building-game/check-matches/:gameId', (req, res, next) => buildingGame.runCheckMatches(req.params.gameId, res));
router.post('/building-game/delete-pending/:gameId', (req, res, next) => buildingGame.deleteProcessing(req.params.gameId, res));

router.get('/forest-exploration/touchIndex/:seed/:from/:nonce', (req, res, next) => forestExploration.touchRound(req.params.seed, req.params.from, req.params.nonce, res));

router.post('/arena/check-matches/:level', (req, res, next) => arena.initCheckMatches(req.params.level, res));

router.post('/tournament/check-matches/:level', (req, res, next) => tournament.initCheckMatches(req.params.level, res));

export default router;
