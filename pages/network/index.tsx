import { Table } from "@/components/table/BasicLayout";
import { networkColumns } from "@/components/table/config_Network";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { useState, useEffect } from "react";

const querySelectNetwork = (range = [0, 500]) => {
  const query: Prisma.NetworkFindManyArgs = {
    skip: range[0],
    take: range[1] - range[0],
    orderBy: {
      createdAt: "asc",
    },
  };
  return encodeURI(JSON.stringify(query));
};

function Page() {
  const [netList, setNetList] = useState([]);

  async function reloadProgram(start, size = 500) {
    const prog = await fetch(
      `/api/db/network?q=${querySelectNetwork([start, start + size])}`
    );
    const progList = await prog.json();
    setNetList(progList);
  }

  async function abiData() {
    reloadProgram(0);
  }

  useEffect(() => {
    abiData();
  }, []);

  return (
    <div className="flex -ml-4 -my-4 items-stretch min-h-screen">
      <div className="flex-[6] p-4">
        <h2 className="text-3xl">Networks</h2>
        <p className="text-xs">
          Below are the list of ethereum network. These were added on demand by
          the website admin so if your network is not on the list, kindly
          contact us here.
        </p>
        <hr className="my-2" />
        <h3 className="font-semibold">You are now viewing [Public] Networks</h3>
        <Table
          data={netList}
          columns={networkColumns}
          refetchData={reloadProgram}
        />
      </div>
    </div>
  );
}

export default Page;
