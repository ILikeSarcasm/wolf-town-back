import '../config.js';

import { ethers } from 'ethers';

const keccak256 = ethers.utils.solidityKeccak256;

if (process.argv.length <= 4) {
    console.log('Args are <private_key> <action> <none>');
    process.exit(1);
}

const account = new ethers.Wallet(process.argv[2]);

const password = await account.signMessage(JSON.stringify({ user: account.getAddress(), play: 'WolfTown Building' }));
const hash1 = keccak256([ 'uint256', 'string', 'uint256' ], [ parseInt(process.argv[3]), password, parseInt(process.argv[4]) ]);
const hash2 = keccak256([ 'uint256', 'bytes32', 'uint256' ], [ parseInt(process.argv[3]), hash1, parseInt(process.argv[4]) ]);

console.log(`Action: ${process.argv[3]}`);
console.log(`Password: ${password}`);
console.log(`Nonce: ${process.argv[4]}`);
console.log(`Hash1: ${hash1}`);
console.log(`Hash2: ${hash2}`);
