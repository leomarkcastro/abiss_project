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
    const abi = await fetch(`/api/db/program/${id}`);
    const abiData = await abi.json();
    setName(abiData.name);
  }

  const [name, setName] = React.useState("");

  async function deleteProgram(e) {
    e.preventDefault();
    try {
      const resp = await fetch(`/api/db/program/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      router.replace(`/program`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="">
      <p className="text-2xl">Delete Program?</p>
      <div className="">
        <p>Name: {name}</p>
      </div>
      <div className="mt-4">
        <button className="bg-red-500 text-white p-1" onClick={deleteProgram}>
          Delete
        </button>
      </div>
    </main>
  );
};

export default Page;
