import { useEffect, useState } from "react";
import Link from "next/link";

import { Prisma } from "@prisma/client";
import { Table } from "@/components/table/BasicLayout";
import { abiColumns } from "@/components/table/config_ABI";
import { contractColumns } from "@/components/table/config_Contracts";
import { programColumns } from "@/components/table/config_Program";

const querySelectABI = (range = [0, 3]) => {
  const query: Prisma.AbiFindManyArgs = {
    include: {
      contractUsers: true,
      User: true,
    },
    skip: range[0],
    take: range[1] - range[0],
  };
  return encodeURI(JSON.stringify(query));
};

const querySelectContract = (range = [0, 3]) => {
  const query: Prisma.ContractFindManyArgs = {
    include: {
      abi: true,
      network: true,
      Program: true,
      User: true,
    },
    skip: range[0],
    take: range[1] - range[0],
  };
  return encodeURI(JSON.stringify(query));
};

const querySelectProgram = (range = [0, 3]) => {
  const query: Prisma.ProgramFindManyArgs = {
    include: {
      contract: true,
      User: true,
    },
    skip: range[0],
    take: range[1] - range[0],
  };
  return encodeURI(JSON.stringify(query));
};

const Page = (props) => {
  const [abiList, setAbiList] = useState([]);
  const [conList, setConList] = useState([]);
  const [progList, setProgList] = useState([]);

  async function reloadABI(start, size = 3) {
    const abi = await fetch(
      `/api/db/abi?q=${querySelectABI([start, start + size])}`
    );
    const abiList = await abi.json();
    console.log([start, start + size]);
    setAbiList(abiList);
  }
  async function reloadContract(start, size = 3) {
    const con = await fetch(
      `/api/db/contract?q=${querySelectContract([start, start + size])}`
    );
    const conList = await con.json();
    setConList(conList);
  }
  async function reloadProgram(start, size = 3) {
    const prog = await fetch(
      `/api/db/program?q=${querySelectProgram([start, start + size])}`
    );
    const progList = await prog.json();
    setProgList(progList);
  }

  async function abiData() {
    reloadABI(0);
    reloadContract(0);
    reloadProgram(0);
  }

  useEffect(() => {
    abiData();
  }, []);

  return (
    <main className="my-4 py-8">
      <div className="pb-4 border-b-2">
        <h1 className="text-4xl text-center">Welcome to</h1>
        <h1 className="text-6xl text-center">
          X<span className="animate-ping text-red-600">_</span>ABI
        </h1>
      </div>
      <div className="flex gap-2 items-start relative">
        <div className="flex-[4] flex flex-col gap-2 p-1">
          <Table data={abiList} columns={abiColumns} refetchData={reloadABI} />
          <Table
            data={conList}
            columns={contractColumns}
            refetchData={reloadContract}
          />
          <Table
            data={progList}
            columns={programColumns}
            refetchData={reloadProgram}
          />
        </div>
        <div className="flex-1 p-3 text-right flex flex-col items-center m-1 sticky top-16 border shadow-md bg-gray-200">
          <Link href="/create/abi">
            <a>
              <button className="text-blue-700 p-1">Create A New ABI</button>
            </a>
          </Link>
          <Link href="/create/contract">
            <a>
              <button className="text-blue-700 p-1">
                Create A New Contract
              </button>
            </a>
          </Link>
          <Link href="/create/program">
            <a>
              <button className="text-blue-700 p-1">
                Create A New Program
              </button>
            </a>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
