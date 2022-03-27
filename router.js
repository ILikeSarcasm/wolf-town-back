import express from 'express';

import animals from './app/animals.js';
import imageGenerator from './app/imageGenerator.js';
import buildingGame from './app/buildingGame.js';

const router = express.Router();

router.get('/animals/:id', (req, res, next) => animals.tokenURI(parseInt(req.params.id), req, res));
router.get('/animals', (req, res, next) => animals.tokenURIs(JSON.parse(decodeURIComponent(req.query.ids)), req, res));

router.get('/generate-image', (req, res, next) => imageGenerator.generateImage(req.query.type, parseInt(req.query.id), res));

router.post('/building-game/participate', (req, res, next) => buildingGame.participateMany(req.query.gameId, JSON.parse(decodeURIComponent(req.query.participations)), res));
router.post('/building-game/cancel', (req, res, next) => buildingGame.cancelMany(req.query.gameId, JSON.parse(decodeURIComponent(req.query.animalIds)), res));

export default router;
