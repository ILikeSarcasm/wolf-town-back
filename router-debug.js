import express from 'express';
import animals from './app/animals.js';

const router = express.Router();

router.get('/animals/generateTokenImage/:id/:isSheep/:fur/:head/:ears/:eyes/:nose/:mouth/:neck/:feet/:alpha', (req, res, next) => animals.generateTokenImage(parseInt(req.params.id), {
    isSheep: req.params.isSheep == 'true',
    fur: parseInt(req.params.fur),
    head: parseInt(req.params.head),
    ears: parseInt(req.params.ears),
    eyes: parseInt(req.params.eyes),
    nose: parseInt(req.params.nose),
    mouth: parseInt(req.params.mouth),
    neck: parseInt(req.params.neck),
    feet: parseInt(req.params.feet),
    alpha: parseInt(req.params.alpha),
}));

export default router;
