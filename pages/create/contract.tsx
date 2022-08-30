import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { loadDetectedCommands } from "@/lib/utils";
import { useRouter } from "next/router";

// export const getServerSideProps: GetServerSideProps = async () => {};

const createContract = (
  address: string,
  name: string,
  abi: number,
  network: number
) => {
  return Prisma.validator<Prisma.ContractCreateInput>()({
    id: encodeURI(address.replace(" ", "_")),
    name,
    Abi: { connect: { id: Number(abi) } },
    Network: { connect: { id: Number(network) } },
    // User: { connect: { id: userId } },
  });
};

const Page = (props) => {
  const router = useRouter();
  async function uploadContract(e) {
    e.preventDefault();
  }

  const [networkList, setNetworkList] = useState([]);
  const [abiList, setABIList] = useState([]);

  async function loadData() {
    const _networkList = await fetch(`/api/db/network`);
    const networkList = await _networkList.json();
    const _abiList = await fetch(`/api/db/abi`);
    const abiList = await _abiList.json();
    setNetworkList(networkList);
    setABIList(abiList);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="my-4 py-8">
      <p className="text-2xl">Create New Contract</p>
      <div className="flex gap-2">
        <div className="flex-[3] flex flex-col ">
          <form
            className="flex-[3] flex flex-col gap-2 my-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const name = e.target["name"].value;
              const address = e.target["address"].value;
              const _abi = e.target["abi"].value;
              const _network = e.target["network"].value;
              const contractData = createContract(
                address,
                name,
                _abi,
                _network
              );
              try {
                const resp = await fetch("/api/db/contract", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(contractData),
                });
                const data = await resp.json();
                console.log(data);
                router.replace("/");
              } catch (err) {
                console.log(err);
              }
            }}
          >
            <input
              className="border p-2"
              placeholder="Contract Address"
              name="address"
            />
            <input
              className="border p-2"
              placeholder="Contract Name"
              name="name"
            />
            <select className="border p-2" placeholder="ABI" name="abi">
              {abiList.map((al, ai) => {
                return <option value={al.id}>{al.name}</option>;
              })}
            </select>
            <select className="border p-2" placeholder="Network" name="network">
              {networkList.map((nl, ni) => {
                return <option value={nl.id}>{nl.name}</option>;
              })}
            </select>
            <button>Save</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Page;
