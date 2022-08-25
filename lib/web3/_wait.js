import web3 from "./web3";

export function waitTransactionToBeMined(hash, onFinish) {
  setTimeout(async () => {
    const result = await web3.eth.getTransactionReceipt(hash);
    if (result) {
      onFinish(result);
    } else if (result == null) {
      waitTransactionToBeMined(hash, onFinish);
    }
  }, 5000);
}