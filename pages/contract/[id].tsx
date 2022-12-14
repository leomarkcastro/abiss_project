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

const querySelectContract = (id: string) => {
  const query: Prisma.ContractFindFirstArgs = {
    where: {
      id: id,
    },
    include: {
      Abi: true,
      Network: true,
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
    setABIData(abiData.Abi);
    loadDetectedCommands(abiData.Abi.abi, setCommandList);
    setContractData(abiData);
    console.log(abiData);
    setContractAddress(abiData.id);
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
            <Link href={`/contract/edit/${contractData["id"]}`}>
              <a>
                <p className="text-blue-600">Edit</p>
              </a>
            </Link>
            <Link href={`/contract/publish/${contractData["id"]}`}>
              <a>
                <p className="text-green-600">Publish</p>
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
            <strong>Network:</strong> {contractData["Network"]?.name} (Chain ID
            -&gt;
            {" " + contractData["Network"]?.id})
          </p>
          <p>
            <strong>Published:</strong> {contractData["public"] ? "Yes" : "No"}
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
