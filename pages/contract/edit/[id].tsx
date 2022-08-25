import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { loadDetectedCommands } from "@/lib/utils";
import { useRouter } from "next/router";

// export const getServerSideProps: GetServerSideProps = async () => {};

const updateContract = (
  address: string,
  name: string,
  abi: number,
  network: number
) => {
  return Prisma.validator<Prisma.ContractUpdateInput>()({
    id: address,
    name,
    abi: { connect: { id: Number(abi) } },
    network: { connect: { id: Number(network) } },
    // User: { connect: { id: userId } },
  });
};

const querySelectContract = (id: string) => {
  const query: Prisma.ContractFindFirstArgs = {
    where: {
      id: id,
    },
    include: {
      abi: true,
      network: true,
    },
  };
  return encodeURI(JSON.stringify(query));
};

const Page = (props) => {
  const router = useRouter();

  const [id, setID] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setID(id);
      abiData(id);
    }
  }, [router.isReady]);

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [abi, setAbi] = useState("");
  const [network, setNetwork] = useState("");

  async function abiData(id) {
    const abi = await fetch(
      `/api/db/contract/${id}?q=${querySelectContract(id)}`
    );
    const abiData = await abi.json();
    setAddress(abiData["id"]);
    setName(abiData["name"]);
    setAbi(abiData["abi"]["id"]);
    setNetwork(abiData["network"]["id"]);
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
      <p className="text-2xl">Edit Contract</p>
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
              const contractData = updateContract(
                address,
                name,
                _abi,
                _network
              );
              try {
                const resp = await fetch(`/api/db/contract/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(contractData),
                });
                const data = await resp.json();
                console.log(data);
                router.replace(`/contract/${data.id}`);
              } catch (err) {
                console.log(err);
              }
            }}
          >
            <input
              className="border p-2"
              placeholder="Contract Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="border p-2"
              placeholder="Contract Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="border p-2"
              placeholder="ABI"
              name="abi"
              value={abi}
              onChange={(e) => setAbi(e.target.value)}
            >
              {abiList.map((al, ai) => {
                return <option value={al.id}>{al.name}</option>;
              })}
            </select>
            <select
              className="border p-2"
              placeholder="Network"
              name="network"
              value={network}
              onChange={(item) => {
                setNetwork(item.target.value);
              }}
            >
              {networkList.map((nl, ni) => {
                return (
                  <option key={`net_${nl.id}`} value={nl.id}>
                    {nl.name}
                  </option>
                );
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
