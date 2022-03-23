import express from 'express';
import animals from './app/animals.js';
import deeds from './app/deeds.js';
import oldBarn from './app/oldBarn.js';

const router = express.Router();

router.get('/animals/:id', (req, res, next) => animals.tokenURI(parseInt(req.params.id), req, res));
router.get('/animals', (req, res, next) => animals.tokenURIs(JSON.parse(decodeURIComponent(req.query.ids)), req, res));
router.get('/deeds/:id', (req, res, next) => deeds.deedURI(parseInt(req.params.id), req, res));
router.get('/deeds', (req, res, next) => deeds.deedURIs(JSON.parse(decodeURIComponent(req.query.ids)), req, res));
router.get('/building-game/participate', (req, res, next) => buildingGame.participateMany(req.query.game, req.query.uesr, JSON.parse(decodeURIComponent(req.query.participations)), res));
router.get('/barn/unstakeOrder1/:address', (req, res, next) => oldBarn.unstakeOrder(req.params.address, true, req, res));
router.get('/barn/unstakeOrder2/:address', (req, res, next) => oldBarn.unstakeOrder(req.params.address, false, req, res));
router.get('/barn/lostTokens/:address', (req, res, next) => oldBarn.lockedTokens(req.params.address, req, res));

export default router;
