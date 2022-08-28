import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

// export const getServerSideProps: GetServerSideProps = async () => {};

const Page = (props) => {
  const [abiList, setAbiList] = React.useState([]);
  const [conList, setConList] = React.useState([]);
  const [progList, setProgList] = React.useState([]);

  async function abiData() {
    const abi = await fetch("/api/db/abi");
    const abiList = await abi.json();
    setAbiList(abiList);
    const con = await fetch("/api/db/contract");
    const conList = await con.json();
    setConList(conList);
    const prog = await fetch("/api/db/program");
    const progList = await prog.json();
    setProgList(progList);
  }

  useEffect(() => {
    abiData();
  }, []);

  return (
    <main className="my-4 py-8">
      <div className="pb-4 border-b-2">
        <h1 className="text-6xl text-center">
          X<span className="animate-ping text-red-600">_</span>ABI
        </h1>
      </div>
      <div className="flex gap-2 items-start relative">
        <div className="flex-[2] flex flex-col gap-2 p-1">
          <div className="flex flex-col gap-2 p-1">
            <p className="text-3xl">Programs</p>
            {progList.map((prog) => {
              return (
                <div
                  key={prog.id}
                  className="border shadow-md rounded-md p-3 flex"
                >
                  <div className="flex-1">
                    <p className="text-xl ">{prog.name}</p>
                    <p>Uploaded on: {formatDate(prog.createdAt)}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-end">
                    <Link
                      href={`/program/${prog.id}`}
                      as={`/program/${prog.id}`}
                    >
                      <a className="text-blue-700">View</a>
                    </Link>
                    <button className="text-blue-700">Get ABI Link</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 p-1">
            <p className="text-3xl">Contracts</p>
            {conList.map((con) => {
              return (
                <div
                  key={con.id}
                  className="border shadow-md rounded-md p-3 flex"
                >
                  <div className="flex-1">
                    <p className="text-xl ">{con.name}</p>
                    <p>Uploaded on: {formatDate(con.createdAt)}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-end">
                    <Link
                      href={`/contract/${con.id}`}
                      as={`/contract/${con.id}`}
                    >
                      <a className="text-blue-700">View</a>
                    </Link>
                    <button className="text-blue-700">Get ABI Link</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 p-1">
            <p className="text-3xl">ABIs</p>
            {abiList.map((abi) => {
              return (
                <div
                  key={abi.id}
                  className="border shadow-md rounded-md p-3 flex"
                >
                  <div className="flex-1">
                    <p className="text-xl ">{abi.name}</p>
                    <p>Uploaded on: {formatDate(abi.createdAt)}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-end">
                    <Link href={`/abi/${abi.id}`} as={`/abi/${abi.id}`}>
                      <a className="text-blue-700">View</a>
                    </Link>
                    <button className="text-blue-700">Get ABI Link</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 p-3 text-right flex flex-col items-center m-1 sticky top-16">
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
