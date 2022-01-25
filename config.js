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

dotenv.config({ path });
