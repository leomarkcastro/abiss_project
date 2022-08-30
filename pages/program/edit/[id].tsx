import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { loadDetectedCommands, uuid } from "@/lib/utils";
import { useRouter } from "next/router";

// export const getServerSideProps: GetServerSideProps = async () => {};

const updateContract = (name: string, key: string, contract: string) => {
  return Prisma.validator<Prisma.ProgramUpdateInput>()({
    name,
    key,
    Contract: { connect: { id: contract } },
    // User: { connect: { id: userId } },
  });
};

const querySelectProgram = (id: any) => {
  const query: Prisma.ProgramFindFirstArgs = {
    where: {
      id: Number(id),
    },
    include: {
      Contract: true,
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

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [contract, setContract] = useState("");

  async function abiData(id) {
    const abi = await fetch(
      `/api/db/program/${id}?q=${querySelectProgram(id)}`
    );
    const abiData = await abi.json();
    setName(abiData["name"]);
    setKey(abiData["key"]);
    setContract(abiData["Contract"]["id"]);
  }

  const [contractList, setContractList] = useState([]);

  async function loadData() {
    const _contractList = await fetch(`/api/db/contract`);
    const contractList = await _contractList.json();
    setContractList(contractList);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="my-4 py-8">
      <p className="text-2xl">Edit Program</p>
      <div className="flex gap-2">
        ot
        <div className="flex-[3] flex flex-col ">
          <form
            className="flex-[3] flex flex-col gap-2 my-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const name = e.target["name"].value;
              const key = e.target["key"].value;
              const contract = e.target["Contract"].value;
              const contractData = updateContract(name, key, contract);
              try {
                const resp = await fetch(`/api/db/program/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(contractData),
                });
                const data = await resp.json();
                console.log(data);
                router.replace(`/program/${data.id}`);
              } catch (err) {
                console.log(err);
              }
            }}
          >
            <input
              className="border p-2"
              placeholder="Contract Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-3">
              <input
                className="border p-2 flex-1"
                placeholder="Access Key"
                name="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <button
                className="p-2 pr-4"
                onClick={(e) => {
                  e.preventDefault();
                  setKey(`${uuid().split("-")[0]}_${uuid().split("-")[0]}`);
                }}
              >
                Generate
              </button>
            </div>
            <select
              className="border p-2"
              placeholder="Contract"
              name="contract"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
            >
              {contractList.map((cl, ci) => {
                return <option value={cl.id}>{cl.name}</option>;
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
