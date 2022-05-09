import { Contract, ethers } from 'ethers';
import { Constanst } from '../config.js';

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);

export const getContractHandler = (name = 'BuildingStakeManagerFixMint', privateKey = '', address = ethers.constants.AddressZero) => {
if (address === ethers.constants.AddressZero) address = Constanst.Contract[name];
  return new Contract(address, Constanst.AbiConfig[name], privateKey ? new ethers.Wallet(privateKey, provider): provider);
}

export const defaultSignData = {
  message: 'a demo sign message',
  signResult: '',
  signer: ethers.constants.AddressZero,
};
export const signCheck = (sign = defaultSignData) => {
  try {
    return ethers.utils.verifyMessage(sign.message, sign.signResult) === sign.signer;
  } catch(e) {
    return false;
  }
}