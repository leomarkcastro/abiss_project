import LayoutABI from "@/components/layout_abi1/main";
import { Table } from "@/components/table/BasicLayout";
import { abiColumns } from "@/components/table/config_ABI";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { useState, useEffect } from "react";

const querySelectABI = (range = [0, 3]) => {
  const query: Prisma.AbiFindManyArgs = {
    include: {
      Contracts: true,
      Owner: true,
    },
    skip: range[0],
    take: range[1] - range[0],
    orderBy: {
      createdAt: "desc",
    },
  };
  return encodeURI(JSON.stringify(query));
};

function Page() {
  const [abiList, setAbiList] = useState([]);

  async function reloadABI(start, size = 500) {
    const abi = await fetch(
      `/api/db/abi?q=${querySelectABI([start, start + size])}`
    );
    const abiList = await abi.json();
    console.log([start, start + size]);
    setAbiList(abiList);
  }

  async function abiData() {
    reloadABI(0);
  }

  useEffect(() => {
    abiData();
  }, []);

  return (
    <LayoutABI>
      <div className="flex-[6] p-4">
        <h2 className="text-3xl">ABIs</h2>
        <p className="text-xs">
          ABIs are used on Solidity mainly for interacting with the Smart
          Contract. It outlines the invocable functions and events that you can
          use both on websites, servers or other client-facing web3 applications
          to effectively interact with the smart contract.
        </p>
        <hr className="my-2" />
        <h3 className="font-semibold">
          You are now viewing [Your] and [Public] ABIs
        </h3>
        <Table data={abiList} columns={abiColumns} refetchData={reloadABI} />
      </div>
    </LayoutABI>
  );
}

export default Page;
