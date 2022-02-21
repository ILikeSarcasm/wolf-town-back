import express from 'express';
import animals from './app/animals.js';
import barn from './app/barn.js';

const router = express.Router();

router.get('/animals/:id', (req, res, next) => animals.tokenURI(parseInt(req.params.id), req, res));
router.get('/barn/unstakeOrder1/:address', (req, res, next) => barn.unstakeOrder(req.params.address, true, req, res));
router.get('/barn/unstakeOrder2/:address', (req, res, next) => barn.unstakeOrder(req.params.address, false, req, res));

export default router;
