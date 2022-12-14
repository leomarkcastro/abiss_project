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

const querySelectABI = (id: string) => {
  const query: Prisma.AbiFindUniqueArgs = {
    where: {
      id: Number(id),
    },
    include: {
      Contracts: true,
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

  const [ABIData, setABIData] = React.useState(false);

  async function abiData(id) {
    const abi = await fetch(`/api/db/abi/${id}?q=${querySelectABI(id)}`);
    const abiData = await abi.json();
    setABIData(abiData);
    loadDetectedCommands(abiData.abi, setCommandList);
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
            <Link href={`/abi/edit/${ABIData["id"]}`}>
              <a>
                <p className="text-blue-600">Edit</p>
              </a>
            </Link>
            <Link href={`/abi/publish/${ABIData["id"]}`}>
              <a>
                <p className="text-green-600">Publish</p>
              </a>
            </Link>
            <Link href={`/abi/delete/${ABIData["id"]}`}>
              <a>
                <p className="text-red-600">Delete</p>
              </a>
            </Link>
          </div>
          <p className="text-2xl font-bold">Details</p>
          <p>
            <strong>Name:</strong> {ABIData["name"]}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(ABIData["createdAt"])}
          </p>
          <p>
            <strong>Contracts using this:</strong>{" "}
            {ABIData["Contracts"]?.length}
          </p>
          <p>
            <strong>Published:</strong> {ABIData["public"] ? "Yes" : "No"}
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
        <div className="flex flex-col flex-1 gap-1 p-4 my-2 border rounded-md shadow-lg">
          <p className="text-2xl font-bold">Contract Users</p>
          <div className="p-4">
            {ABIData["Contracts"]?.map((con, ci) => {
              return (
                <Link key={`contract-${ci}`} href={`/contract/${con.id}`}>
                  <a>
                    <div className={`con_${con.id}`}>
                      <p className="text-blue-600">
                        {con.name} ({formatDate(con.createdAt)})
                      </p>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        <FunctionCard
          ABIData={ABIData}
          commandList={commandList}
          web3={web3}
          connected={connected}
          setConnected={setConnected}
          contractAddress={contractAddress}
          setContractAddress={setContractAddress}
        />
      </div>
    </main>
  );
};

export default Page;
