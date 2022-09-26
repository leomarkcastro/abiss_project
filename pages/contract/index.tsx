import LayoutABI from "@/components/layout_abi1/main";
import { Table } from "@/components/table/FilteredLayout";
import { contractColumns } from "@/components/table/config_Contracts";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { useState, useEffect } from "react";

const querySelectContract = (range = [0, 500]) => {
  const query: Prisma.ContractFindManyArgs = {
    include: {
      Abi: true,
      Network: true,
      Programs: true,
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
  const [conList, setConList] = useState([]);

  async function reloadContract(start, size = 500) {
    const con = await fetch(
      `/api/db/contract?q=${querySelectContract([start, start + size])}`
    );
    const conList = await con.json();
    setConList(conList);
  }

  async function abiData() {
    reloadContract(0);
  }

  useEffect(() => {
    abiData();
  }, []);

  return (
    <LayoutABI>
      <div className="flex-[6] p-4">
        <h2 className="text-3xl">Contracts</h2>
        <p className="text-xs">
          Referring to the smart contracts deployed in the Ethereum Blockchain
          (or any sidechain). After deploying your smart contract in the wild,
          you can immediately test their functionality by registering them here
          and communicating with them assuming that you know their address,
          their ABI and their network.
        </p>
        <hr className="my-2" />
        <h3 className="font-semibold">
          You are now viewing [Your] and [Public] Contracts
        </h3>
        <Table
          data={conList}
          columns={contractColumns}
          refetchData={reloadContract}
        />
      </div>
    </LayoutABI>
  );
}

export default Page;
