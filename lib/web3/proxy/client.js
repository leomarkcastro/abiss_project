import ABI from "./ABI.json";

export const CONTRACT_ADDRESS = "0x6E0F10309F7b6d19b44b715c92609dED5d7df3a1";

const client = (web3, _addr = CONTRACT_ADDRESS) => new web3.eth.Contract(
    ABI.abi,
    _addr
);

export default client;