import express from 'express';
import animals from './app/animals.js';

const router = express.Router();

router.get('/fetchOldTraits', (req, res, next) => animals.fetchOldTraits(req, res));

export default router;
