import dotenv from 'dotenv';

var path;

if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case 'live': path = './.env'; break;
        default: path = './.env.dev'; break;
    }
} else {
    path = './.env.dev';
}

if (process.env.ENVIRONMENT == 'live') console.log('Running on mainnet');
else console.log('Running on testnet');

dotenv.config({ path });
