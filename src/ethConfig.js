import { ethers } from 'ethers';
import abi from "../rugtoken.json"

let provider = null;
let signer = null;
let contract = null;
let contractAddress = null; // Define the contractAddress variable here

if (typeof window !== 'undefined' && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contractAddress = '0x9185263181bC7760170e00C043154Ae5069C4Ac5'; 
  contract = new ethers.Contract(contractAddress, abi, signer);
}

export { provider, contract, contractAddress };
