import LayoutABI from "@/components/layout_abi1/main";
import { Table } from "@/components/table/BasicLayout";
import { contractColumns } from "@/components/table/config_Contracts";
import { programColumns } from "@/components/table/config_Program";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { useState, useEffect } from "react";

const querySelectProgram = (range = [0, 500]) => {
  const query: Prisma.ProgramFindManyArgs = {
    include: {
      Contract: true,
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
  const [progList, setProgList] = useState([]);

  async function reloadProgram(start, size = 500) {
    const prog = await fetch(
      `/api/db/program?q=${querySelectProgram([start, start + size])}`
    );
    const progList = await prog.json();
    setProgList(progList);
  }

  async function abiData() {
    reloadProgram(0);
  }

  useEffect(() => {
    abiData();
  }, []);

  return (
    <LayoutABI>
      <div className="flex-[6] p-4">
        <h2 className="text-3xl">Programs</h2>
        <p className="text-xs">
          On your application, especially if you&APOS;re using web3.js,
          ethers.js or any other web3 integration module, you&APOS;ll have to
          supply information about your smart contract such as it&APOS;s
          address, it&APOS;s network and it&APOS;s ABI. And often, you&APOS;ll
          have to supply the same information to different application/servers
          in order for them to be in sync at all times without the hassle of
          redeploying every of your application when a new smart contract is
          deployed. Through this page, you can create an API route where it
          points you to a smart contract and all of your services will point to
          this one API so you are now sure that all of them uses the same data
          at all times.
        </p>
        <hr className="my-2" />
        <h3 className="font-semibold">
          You are now viewing [Your] and [Public] Programs
        </h3>
        <Table
          data={progList}
          columns={programColumns}
          refetchData={reloadProgram}
        />
      </div>
    </LayoutABI>
  );
}

export default Page;
