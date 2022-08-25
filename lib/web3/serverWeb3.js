import Web3 from "web3";
 
let web3;
 
const provider = new Web3.providers.HttpProvider(
  `https://eth-rinkeby.alchemyapi.io/v2/iV2OlIWb2skpdpY039yL8SuyTpjf1Ub6`
);
web3 = new Web3(provider);

 
export default web3;