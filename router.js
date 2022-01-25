import express from 'express';
import animals from './app/animals.js';

const router = express.Router();

router.get('/animals/:id', (req, res, next) => animals.tokenURI(parseInt(req.params.id), req, res));

export default router;
