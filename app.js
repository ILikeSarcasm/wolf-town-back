import './config.js';
import express from 'express';
// import bodyParser from 'body-parser'; // Used for POST request
import router from './router.js';
import routerDebug from './router-debug.js';

const app = express();
app.use(express.static('public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);
if (process.env.ENVIRONMENT == 'dev') {
    app.use('/debug', routerDebug);
}

app.listen(process.env.PORT, function(err) {
    if(err) { console.log(err); }
    console.log(`Server listening on port ${process.env.PORT} in ${process.env.ENVIRONMENT} mode.`);
});

export default app;
