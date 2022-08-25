import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatDate, loadDetectedCommands, uuid } from "@/lib/utils";

import useWeb3 from "@/lib/web3/hooks/useWeb3";
import useWeb3Action from "@/lib/web3/hooks/useWeb3Action";
import { Prisma } from "@prisma/client";

// export const getServerSideProps: GetServerSideProps = async () => {};

const SimulateCard = ({ command, web3, ABIData, address, deleteFx }) => {
  const contract = useWeb3Action(web3.web3, (_web3) => {
    if (ABIData)
      return new _web3.eth.Contract(JSON.parse(ABIData["abi"]), address);
    return false;
  });

  const [output, setOutput] = useState();

  async function onSubmitFx(e) {
    e.preventDefault();
    const inputList = command.inputs.map((_, i) => `inp_${command.name}_${i}`);
    const inputValues = inputList.map((iL) => e.target[iL].value);
    await contract.transact(web3.currentAccount, command, [...inputValues]);
  }

  useEffect(() => {
    if (contract.transactionDone) setOutput(contract.response);
  }, [contract.transactionDone, contract.response]);
  return (
    <div className="flex flex-col gap-1 p-3 border border-gray-500 shadow-md h-fit">
      <p className="text-xl flex">
        {command.name}
        <span className="text-sm ml-auto">{command.stateMutability}</span>
      </p>
      <form className="flex gap-1" onSubmit={onSubmitFx}>
        <div className="flex-[2]">
          {command.inputs.map((input_data, i) => {
            return (
              <div
                className="flex gap-2"
                key={`i_${command.nonce.substring(0, 10)}_${i}${i}`}
              >
                <p>
                  <span className="mr-1 text-gray-400">{input_data.type}</span>
                  {input_data.name}
                </p>
                <input
                  name={`inp_${command.name}_${i}`}
                  className="border flex-1"
                />
              </div>
            );
          })}
        </div>
        <div className="flex-1 flex flex-col">
          <button className="border bg-blue-600 text-white">Call</button>
          <button
            className="border bg-red-600 text-white"
            onClick={(e) => {
              e.preventDefault();
              deleteFx();
            }}
          >
            Delete
          </button>
        </div>
      </form>
      <div className="max-h-[15vh] overflow-auto">
        <p className="text-center break-all overflow-auto">
          {JSON.stringify(output)}
        </p>
      </div>
    </div>
  );
};

const querySelectContract = (id: string) => {
  const query: Prisma.ContractFindFirstArgs = {
    where: {
      id: id,
    },
    include: {
      abi: true,
      network: true,
    },
  };
  return encodeURI(JSON.stringify(query));
};

const Page = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (!id && !commandList) return null;
      abiData(id);
    }
  }, [router.isReady]);

  const [contractData, setContractData] = React.useState(false);
  const [ABIData, setABIData] = React.useState(false);

  async function abiData(id) {
    const abi = await fetch(
      `/api/db/contract/${id}?q=${querySelectContract(id)}`
    );
    const abiData = await abi.json();
    setABIData(abiData.abi);
    loadDetectedCommands(abiData.abi.abi, setCommandList);
    setContractData(abiData);
    console.log(abiData);
    setContractAddress(abiData.id);
    setConnected(true);
  }

  const [commandList, setCommandList] = React.useState([]);

  const [selectedCommandList, setSelectedCommandList] = React.useState([]);

  const [contractAddress, setContractAddress] = React.useState<false | string>(
    false
  );
  const [connected, setConnected] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const web3 = useWeb3(true);

  return (
    <main className="my-4 py-8">
      <div className="flex flex-col items-stretch">
        <div className="flex-1 flex flex-col gap-1 my-2 border shadow-lg p-4 rounded-md relative">
          <div className="absolute right-6 top-6 text-right">
            <Link href={`/contract/edit/${contractData["id"]}`}>
              <a>
                <p className="text-blue-600">Edit</p>
              </a>
            </Link>
            <Link href={`/contract/delete/${contractData["id"]}`}>
              <a>
                <p className="text-red-600">Delete</p>
              </a>
            </Link>
          </div>
          <p className="text-2xl font-bold">Details</p>
          <p>
            <strong>Contract Address:</strong> {contractData["id"]}
          </p>
          <p>
            <strong>Name:</strong> {contractData["name"]}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(ABIData["createdAt"])}
          </p>
          <p>
            <strong>Network:</strong> {contractData["network"]?.name} (Chain ID
            -&gt;
            {" " + contractData["network"]?.id})
          </p>
          <p className="max-h-[20vh] overflow-auto bg-gray-100 p-3">
            {ABIData["abi"]}
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-2 my-2 border shadow-lg p-4 rounded-md">
          <p className="text-2xl font-bold">Functions</p>
          <div className="flex gap-2">
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
              {connected ? (
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
      </div>
    </main>
  );
};

export default Page;
