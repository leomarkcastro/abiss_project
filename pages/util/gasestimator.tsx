import { useState, useEffect } from "react";
import useWeb3 from "@/lib/web3/hooks/useWeb3";
import { roundTo } from "@/lib/utils";

type GasOracleResult = {
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  };
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  };
  slow: {
    maxPriorityFee: number;
    maxFee: number;
  };
  baseFee: number;
  // fiat: number;
};

const gweiToEth = Math.pow(10, -9);

function Page() {
  const sources = {
    mainnet: {
      name: "Ethereum Mainnet",
      sources: {
        etherchain: {
          url: "https://www.etherchain.org/api/gasPriceOracle",
          parse: (result) => {
            return {
              fast: {
                maxPriorityFee: result.fast,
                maxFee: result.currentBaseFee + result.fast,
              },
              standard: {
                maxPriorityFee: result.standard,
                maxFee: result.currentBaseFee + result.standard,
              },
              slow: {
                maxPriorityFee: result.safeLow,
                maxFee: result.currentBaseFee + result.safeLow,
              },
              baseFee: result.currentBaseFee,
            };
          },
        },
      },
    },
    polygon_mainnet: {
      name: "Polygon Mainnet",
      sources: {
        gasstation: {
          url: "https://gasstation-mainnet.matic.network/v2",
          parse: (result) => {
            return {
              fast: {
                maxPriorityFee: result.fast.maxPriorityFee,
                maxFee: result.fast.maxFee,
              },
              standard: {
                maxPriorityFee: result.standard.maxPriorityFee,
                maxFee: result.standard.maxFee,
              },
              slow: {
                maxPriorityFee: result.safeLow.maxPriorityFee,
                maxFee: result.safeLow.maxFee,
              },
              baseFee: result.estimatedBaseFee,
            };
          },
        },
        polygonscan: {
          url: "https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle",
          parse: (result) => {
            const _result = result.result;
            return {
              fast: {
                maxPriorityFee: 0,
                maxFee: _result.FastGasPrice,
              },
              standard: {
                maxPriorityFee: 0,
                maxFee: _result.ProposeGasPrice,
              },
              slow: {
                maxPriorityFee: 0,
                maxFee: _result.SafeGasPrice,
              },
              baseFee: _result.suggestBaseFee,
            };
          },
        },
      },
    },
    binance: {
      name: "Binance Mainnet",
      sources: {
        blockscan: {
          url: "https://gbsc.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle",
          parse: (result) => {
            const _result = result.result;
            return {
              fast: {
                maxPriorityFee: 0,
                maxFee: _result.FastGasPrice,
              },
              standard: {
                maxPriorityFee: 0,
                maxFee: _result.ProposeGasPrice,
              },
              slow: {
                maxPriorityFee: 0,
                maxFee: _result.SafeGasPrice,
              },
              baseFee: _result.ProposeGasPrice,
            };
          },
        },
      },
    },
  };

  const [network, setNetwork] = useState<string>("");
  const [gasSources, setGasSources] = useState<any>([]);

  const [currentSource, setCurrentSource] = useState<string>(null);

  const [gasOracleResult, setGasOracleResult] = useState(null);

  useEffect(() => {
    const target = Object.keys(sources)[0];
    setNetwork(target);
    setGasSources(sources[target].sources);
    setCurrentSource(Object.keys(sources[target].sources)[0]);
  }, []);

  useEffect(() => {
    if (!network) return;
    setCurrentSource(Object.keys(sources[network].sources)[0]);
  }, [network]);

  async function computeGasFee() {
    const gasFee = gasSources[currentSource];
    console.log(gasSources);
    console.log(currentSource);
    console.log(gasFee);

    //fetch data
    const response = await fetch(gasFee.url);
    const result = await response.json();

    //parse data
    const parsedResult = gasFee.parse(result);
    // console.log(parsedResult);

    setGasOracleResult(parsedResult);
  }

  const [gasCosumed, setGasCosumed] = useState<number>(0);

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Gas Estimator</p>
        <div className="flex flex-col gap-1">
          <label>Network</label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={network}
            onChange={(e) => {
              setNetwork(e.target.value);
              setGasSources(sources[e.target.value].sources);
            }}
          >
            {Object.keys(sources).map((key) => {
              return (
                <option key={key} value={key}>
                  {sources[key].name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label>Gas Price Source</label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={currentSource}
            onChange={(e) => {
              setCurrentSource(e.target.value);
            }}
          >
            {gasSources &&
              Object.keys(gasSources).map((gasSource: any) => {
                return (
                  <option key={gasSource} value={gasSource}>
                    {gasSource}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label>Gas Consumed</label>
          <input
            className="p-2 border border-gray-300 rounded-md"
            type="number"
            placeholder="Put Gas Value Here"
            value={gasCosumed}
            onChange={(e) => {
              setGasCosumed(Number(e.target.value));
            }}
          />
        </div>
        <button className="p-2 bg-gray-200" onClick={computeGasFee}>
          Compute Total Gas Fee
        </button>
        {gasOracleResult && (
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <div className="border shadow">
              <p className="text-center">Fast</p>
              <p className="text-center">
                {roundTo(gasOracleResult.fast.maxFee, 4)} gwei
              </p>
              <p className="text-center text-red-500">
                {roundTo(
                  gasOracleResult.fast.maxFee * gweiToEth * gasCosumed,
                  4
                )}{" "}
                burned
              </p>{" "}
            </div>
            <div className="border shadow">
              <p className="text-center">Standard</p>
              <p className="text-center">
                {roundTo(gasOracleResult.standard.maxFee, 4)} gwei
              </p>
              <p className="text-center text-red-500">
                {roundTo(
                  gasOracleResult.standard.maxFee * gweiToEth * gasCosumed,
                  4
                )}{" "}
                burned
              </p>
            </div>{" "}
            <div className="border shadow">
              <p className="text-center">Slow</p>
              <p className="text-center">
                {roundTo(gasOracleResult.slow.maxFee, 4)} gwei
              </p>
              <p className="text-center text-red-500">
                {roundTo(
                  gasOracleResult.slow.maxFee * gweiToEth * gasCosumed,
                  4
                )}{" "}
                burned
              </p>
            </div>
            <div className="border shadow">
              <p className="text-center">Base Fee</p>
              <p className="text-center">
                {roundTo(gasOracleResult.baseFee, 4)} gwei
              </p>
              <p className="text-center text-red-500">
                {roundTo(gasOracleResult.baseFee * gweiToEth * gasCosumed, 4)}{" "}
                burned
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
