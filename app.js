import './config.js';
import express from 'express';
// import bodyParser from 'body-parser'; // Used for POST request
import router from './router.js';
import forestExploration from './app/forestExploration.js';

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.static('public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.listen(process.env.PORT, function(err) {
    if(err) console.log(err);
    console.log(`Server listening on port ${process.env.PORT} in ${process.env.ENVIRONMENT} mode.`);
});

forestExploration.checkForSeedSpeedUp();

export default app;
