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
    <div className="flex flex-col flex-1 gap-2 p-4 my-2 border rounded-md shadow-lg">
      <p className="text-2xl font-bold">Functions</p>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex-1 flex flex-col gap-1 max-h-[70vh] overflow-auto mt-9">
          <input
            className="sticky top-0 p-1 border"
            placeholder="Search A Function"
            onChange={(e) => setSearch(e.target.value)}
          />
          {commandList
            .filter((command) => command.type === "function")
            .filter((command) => command.name.indexOf(search) > -1)
            .map((command) => (
              <div
                key={`comm_${command.name}`}
                className="flex flex-col gap-1 p-2 bg-white border-b-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  connected &&
                    setSelectedCommandList([
                      ...selectedCommandList,
                      { ...command, nonce: uuid() },
                    ]);
                }}
              >
                <p className="flex text-xl">
                  {command.name}
                  <span className="ml-auto text-sm">
                    {command.stateMutability}
                  </span>
                </p>
              </div>
            ))}
        </div>
        <div className="flex-[2] flex flex-col gap-1 max-h-[70vh] overflow-auto bg-gray-100">
          {networkId !== null && web3User.currentNetwork !== networkId ? (
            <div className="flex flex-col items-center justify-center w-full h-full gap-1 p-2">
              <p className="flex text-lg">
                Please connect to the correct network (Chain ID: {networkId})
              </p>
            </div>
          ) : connected ? (
            <>
              <div className="sticky top-0 p-2 bg-gray-100">
                <p className="p-1 pl-0">
                  Connected to Contract:{" "}
                  <a
                    href={`https://blockscan.com/address/${contractAddress}`}
                    className="text-blue-500"
                  >
                    {contractAddress}
                  </a>
                </p>
                <p>
                  Your Wallet Address:
                  <a
                    href={`https://blockscan.com/address/${web3User.currentAccount}`}
                    className="text-blue-500"
                  >
                    {web3User.currentAccount}
                  </a>
                </p>
              </div>
              {selectedCommandList
                .filter((command) => command.type === "function")
                .map((command, ic) => (
                  <SimulateCard
                    key={`selcomm_${command.nonce}`}
                    id={ic}
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
            <div className="flex flex-col items-center justify-center w-full h-full gap-2">
              <p className="text-center">
                <p className="mr-2">Connect to an Address: </p>
                <input
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="p-1 border"
                  placeholder="0x..."
                />
              </p>
              <button
                className="p-1 text-white bg-blue-600"
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
