import { useEffect, useState } from "react";

export function waitTransactionToBeMined(web3, hash, onFinish) {
  setTimeout(async () => {
    const result = await web3.eth.getTransactionReceipt(hash);
    if (result) {
      localStorage.removeItem("transactionHash");
      onFinish(result, !result.status);
    } else if (result == null) {
      web3 && waitTransactionToBeMined(web3, hash, onFinish);
    }
  }, 5000);
}

function useWeb3Action(web3, _contract) {
  const [isLoading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionDone, setTransactionDone] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(false);

  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!contract && web3 && _contract) {
      setContract(_contract(web3));
    }
  }, [web3, _contract]);

  useEffect(() => {
    loadStored();
  }, [web3]);

  function clear() {
    setLoading(false);
    setTransactionHash(null);
    setTransactionDone(false);
    setResponse(null);
    setError(null);
  }

  function loadStored() {
    if (!web3) return;
    const _tH = localStorage.getItem("transactionHash");
    if (_tH) {
      setLoading(true);
      setTransactionHash(_tH);
      waitTransactionToBeMined(web3, _tH, (result, error) => {
        setLoading(false);
        setTransactionDone(true);
        setResponse(result);
        if (error) {
          setError(error);
        }
      });
    }
  }

  async function transact(account, action, params, eth_value) {
    if (web3 && !isLoading) {
      setLoading(true);
      setTransactionHash(null);
      setTransactionDone(false);
      setResponse(null);
      setError(null);

      let retValue;
      let transaction = contract.methods[action.name](
        ...params.map((e) => {
          try {
            return JSON.parse(e);
          } catch {
            return e;
          }
        })
      );

      console.log(params);

      try {
        switch (action.stateMutability) {
          case "nonpayable":
            retValue = await transaction.send(
              {
                from: account,
              },
              function (error, transactionHash) {
                setTransactionHash(transactionHash);
                if (!error) {
                  localStorage.setItem("transactionHash", transactionHash);
                } else {
                  setError(error);
                  setLoading(false);
                }
                web3 &&
                  waitTransactionToBeMined(
                    web3,
                    transactionHash,
                    (result, error) => {
                      setTransactionDone(true);
                      setResponse(result);
                      if (error) {
                        setError(error);
                      }
                    }
                  );
              }
            );
            break;
          case "payable":
            console.log({
              from: account,
              value: web3.utils.toWei(eth_value, "ether"),
            });
            retValue = await transaction.send(
              {
                from: account,
                value: web3.utils.toWei(eth_value, "ether"),
              },
              function (error, transactionHash) {
                console.log(error, transactionHash);
                setTransactionHash(transactionHash);
                if (!error) {
                  localStorage.setItem("transactionHash", transactionHash);
                } else {
                  console.log(error);
                  setError(error);
                  setLoading(false);
                }
                console.log("ho");
                web3 &&
                  waitTransactionToBeMined(
                    web3,
                    transactionHash,
                    (result, error) => {
                      setTransactionDone(true);
                      setResponse(result);
                      if (error) {
                        setError(error);
                      }
                    }
                  );
              }
            );
            break;
          default:
            retValue = await transaction.call();
            setTransactionDone(true);
            setLoading(false);
            break;
        }
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
      setResponse(retValue);
      setLoading(false);
    }
  }

  async function call(account, action, params) {
    if (web3) {
      let retValue;
      let transaction = contract.methods[action.name](...params);

      try {
        switch (action.stateMutability) {
          default:
            retValue = await transaction.call({
              from: account,
            });
            break;
        }
      } catch (e) {
        console.log(e);
      }

      return retValue;
    }
  }

  return {
    isLoading,
    transactionHash,
    transactionDone,
    response,
    error,
    transact,
    call,
    clear,
  };
}

export default useWeb3Action;
