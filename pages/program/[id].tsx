import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  copyToClipboard,
  formatDate,
  loadDetectedCommands,
  uuid,
} from "@/lib/utils";

import useWeb3 from "@/lib/web3/hooks/useWeb3";
import useWeb3Action from "@/lib/web3/hooks/useWeb3Action";
import { Prisma } from "@prisma/client";
import FunctionCard from "@/components/function_card/FC_1";

// export const getServerSideProps: GetServerSideProps = async () => {};

const querySelectProgram = (id: number) => {
  const query: Prisma.ProgramFindFirstArgs = {
    where: {
      id: Number(id),
    },
    include: {
      Contract: {
        include: {
          Abi: true,
          Network: true,
        },
      },
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

  const [programData, setProgramData] = React.useState(false);
  const [contractData, setContractData] = React.useState(false);
  const [ABIData, setABIData] = React.useState(false);

  async function abiData(id) {
    const program = await fetch(
      `/api/db/program/${id}?q=${querySelectProgram(id)}`
    );
    const abiData = await program.json();
    console.log(abiData);
    setABIData(abiData.Contract.Abi);
    loadDetectedCommands(abiData.Contract.Abi.abi, setCommandList);
    setProgramData(abiData);
    setContractData(abiData.Contract);
    console.log(abiData.Contract);
    setContractAddress(abiData.Contract.id);
    setConnected(true);
  }

  const [commandList, setCommandList] = React.useState([]);

  const [contractAddress, setContractAddress] = React.useState<false | string>(
    false
  );
  const [connected, setConnected] = React.useState(false);

  const web3 = useWeb3(true);

  return (
    <main className="">
      <div className="flex flex-col items-stretch">
        <div className="relative flex flex-col flex-1 gap-1 p-4 my-2 border rounded-md shadow-lg">
          <div className="absolute text-right right-6 top-6">
            <Link href={`/program/edit/${programData["id"]}`}>
              <a>
                <p className="text-blue-600">Edit</p>
              </a>
            </Link>
            <Link href={`/program/publish/${programData["id"]}`}>
              <a>
                <p className="text-green-600">Publish</p>
              </a>
            </Link>
            <Link href={`/program/delete/${programData["id"]}`}>
              <a>
                <p className="text-red-600">Delete</p>
              </a>
            </Link>
          </div>
          <p className="text-2xl font-bold">Program Details</p>
          <p>
            <strong>Access Key:</strong> {programData["key"]}
          </p>
          <p>
            <strong>Name:</strong> {programData["name"]}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(programData["createdAt"])}
          </p>
          <p>
            <strong>Published:</strong> {programData["public"] ? "Yes" : "No"}
          </p>
        </div>
        <div className="relative flex flex-col flex-1 gap-1 p-4 my-2 border rounded-md shadow-lg">
          <p className="text-2xl font-bold">Contract Details</p>
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
            <strong>Network:</strong> {contractData["Network"]?.name} (Chain ID
            :{" " + contractData["Network"]?.id})
          </p>
          <p className="max-h-[20vh] overflow-auto bg-gray-100 p-3">
            {ABIData["abi"]}
          </p>
          <button
            className="p-1 text-left bg-gray-300 w-fit"
            onClick={() => {
              copyToClipboard(ABIData["abi"]);
            }}
          >
            Copy ABI
          </button>
        </div>
        <FunctionCard
          ABIData={ABIData}
          commandList={commandList}
          web3={web3}
          connected={connected}
          setConnected={setConnected}
          contractAddress={contractAddress}
          setContractAddress={setContractAddress}
          networkId={contractData["networkID"]}
        />
      </div>
    </main>
  );
};

export default Page;
