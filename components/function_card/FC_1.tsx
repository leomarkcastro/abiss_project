import { uuid } from "@/lib/utils";
import useWeb3 from "@/lib/web3/hooks/useWeb3";
import { useState } from "react";
import SimulateCard from "./SC_1";

export default function FunctionCard({
  commandList,
  web3,
  ABIData,
  connected,
  setConnected,
  contractAddress,
  setContractAddress,
  networkId = null,
}) {
  const [search, setSearch] = useState("");

  const [selectedCommandList, setSelectedCommandList] = useState([]);

  const web3User = useWeb3(true);

  return (
    <div className="flex-1 flex flex-col gap-2 my-2 border shadow-lg p-4 rounded-md">
      <p className="text-2xl font-bold">Functions</p>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex flex-col gap-1 max-h-[70vh] overflow-auto mt-9">
          <input
            className="border p-1"
            placeholder="Search A Function"
            onChange={(e) => setSearch(e.target.value)}
          />
          {commandList
            .filter((command) => command.type === "function")
            .filter((command) => command.name.indexOf(search) > -1)
            .map((command) => (
              <div
                key={`comm_${command.name}`}
                className="flex flex-col gap-1 p-2 bg-white hover:bg-gray-200 cursor-pointer border-b-2"
                onClick={() => {
                  connected &&
                    setSelectedCommandList([
                      ...selectedCommandList,
                      { ...command, nonce: uuid() },
                    ]);
                }}
              >
                <p className="text-xl flex">
                  {command.name}
                  <span className="text-sm ml-auto">
                    {command.stateMutability}
                  </span>
                </p>
              </div>
            ))}
        </div>
        <div className="flex-[2] flex flex-col gap-1 max-h-[70vh] overflow-auto bg-gray-100">
          {networkId !== null && web3User.currentNetwork !== networkId ? (
            <div className="flex flex-col w-full h-full items-center justify-center gap-1 p-2">
              <p className="text-lg flex">
                Please connect to the correct network (Chain ID: {networkId})
              </p>
            </div>
          ) : connected ? (
            <>
              <p className="p-1 pl-0">
                Connected to Contract:{" "}
                <span className="text-blue-500">{contractAddress}</span>
              </p>
              {selectedCommandList
                .filter((command) => command.type === "function")
                .map((command, ic) => (
                  <SimulateCard
                    key={`selcomm_${command.nonce}`}
                    web3={web3}
                    ABIData={ABIData}
                    address={contractAddress}
                    command={command}
                    deleteFx={() => {
                      selectedCommandList.splice(ic, 1);
                      setSelectedCommandList([...selectedCommandList]);
                    }}
                  />
                ))}
            </>
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center gap-2">
              <p className="text-center">
                <p className="mr-2">Connect to an Address: </p>
                <input
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="p-1 border"
                  placeholder="0x..."
                />
              </p>
              <button
                className="p-1 bg-blue-600 text-white"
                onClick={setConnected.bind(this, true)}
              >
                Connect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
