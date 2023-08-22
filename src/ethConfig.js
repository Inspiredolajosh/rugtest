import { ethers } from 'ethers';
import abi from "../rugtoken.json"

let provider = null;
let signer = null;
let contract = null;
let contractAddress = null; // Define the contractAddress variable here

if (typeof window !== 'undefined' && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contractAddress = '0xf57A045F01Fbbed8e2c9706cda10Bdf4E7e01851'; 
  contract = new ethers.Contract(contractAddress, abi, signer);
}

export { provider, contract, contractAddress };
