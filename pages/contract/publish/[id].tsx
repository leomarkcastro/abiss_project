import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { isJsonString, loadDetectedCommands } from "@/lib/utils";
import { useRouter } from "next/router";

// export const getServerSideProps: GetServerSideProps = async () => {};

const Page = (props) => {
  const router = useRouter();

  const [id, setID] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (!id) return null;
      setID(id);
      abiData(id);
    }
  }, [router.isReady]);

  async function abiData(id) {
    const abi = await fetch(`/api/db/contract/${id}`);
    const abiData = await abi.json();
    setName(abiData.name);
    setAbi(abiData.abi);
  }

  const [name, setName] = React.useState("");
  const [abi, setAbi] = React.useState("");

  async function publishABI(e, isPublish) {
    e.preventDefault();
    try {
      const body = Prisma.validator<Prisma.ContractUpdateInput>()({
        public: isPublish,
      });
      const resp = await fetch(`/api/db/contract/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.replace(`/contract/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="">
      <p className="text-2xl">Publish Contract?</p>
      <div className="">
        <p>Name: {name}</p>
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white p-1 mr-4"
          onClick={(e) => publishABI(e, true)}
        >
          Publish
        </button>
        <button
          className="bg-emerald-400 text-white p-1"
          onClick={(e) => publishABI(e, false)}
        >
          Hide as Draft
        </button>
      </div>
    </main>
  );
};

export default Page;
