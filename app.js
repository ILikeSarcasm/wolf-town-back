import './config.js';
import express from 'express';
// import bodyParser from 'body-parser'; // Used for POST request
import router from './router.js';

const app = express();
app.use(express.static('public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.listen(process.env.PORT || 3000, function(err) {
    if(err) { console.log(err); }
    console.log("Server listening on port", process.env.PORT || 3000);
});

export default app;
