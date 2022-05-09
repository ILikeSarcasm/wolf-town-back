import dotenv from 'dotenv';
import SkillManagerABI from './abi/SkillManager.js';
import BuildingStakeManagerFixMint_abi from './abi/BuildingStakeManagerFixMint.js';

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

if (process.env.ENVIRONMENT == 'live') console.log('Running on mainnet');
else console.log('Running on testnet');

export const Constanst = {
  Contract: {
    BuildingStakeManagerFixMint: '',
    "SkillManager": "0xAef63919ac27d048d9e0c31da474AD0FEedB141a",
  },
  AbiConfig: {}
}

export const AbiConfig = {
  SkillManager: SkillManagerABI,
  BuildingStakeManagerFixMint: BuildingStakeManagerFixMint_abi
};
Constanst.AbiConfig = AbiConfig;

if (process.env.ENVIRONMENT !== 'live') {
  Object.assign(Constanst, {
    Contract: {
      BuildingStakeManagerFixMint: '0xb18a1a67e3a7EeAacc171A8983a2c0f39223a304',
      "SkillManager": "0x784Ffbb7E630F958Ca0586B0487Edb2cBfe249CD",
    }
  });
}