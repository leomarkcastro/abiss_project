import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { isJsonString, loadDetectedCommands } from "@/lib/utils";
import { useRouter } from "next/router";
import ToggleSwitch from "@/components/components/ToggleSwitch";

// export const getServerSideProps: GetServerSideProps = async () => {};

const updateABIPrisma = (abi: string, name: string, isPublic: boolean) => {
  return Prisma.validator<Prisma.AbiUpdateInput>()({
    abi,
    name,
    public: isPublic,
    // User: { connect: { id: userId } },
  });
};

const Page = (props) => {
  const router = useRouter();

  const [id, setID] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (!id && !commandList) return null;
      setID(id);
      abiData(id);
    }
  }, [router.isReady]);

  async function abiData(id) {
    const abi = await fetch(`/api/db/abi/${id}`);
    const abiData = await abi.json();
    setName(abiData.name);
    setAbi(abiData.abi);
    setIsPublic(abiData.public);
  }

  const [name, setName] = React.useState("");
  const [abi, setAbi] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);
  const [commandList, setCommandList] = React.useState([]);

  async function updateABI(e) {
    e.preventDefault();
    if (isJsonString(abi)) {
      //createABI();
      const body = updateABIPrisma(abi, name, isPublic);
      try {
        const resp = await fetch(`/api/db/abi/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        router.replace(`/abi/${id}`);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <main className="">
      <p className="text-2xl">Create New ABI</p>
      <div className="flex gap-2">
        <div className="flex-[3] flex flex-col ">
          <form
            className="flex-[3] flex flex-col gap-2 my-2"
            onSubmit={updateABI}
          >
            <input
              className="border p-2"
              placeholder="ABI Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <code className="w-full">
              <textarea
                value={abi}
                onChange={(e) => {
                  setAbi(e.target.value);
                  if (isJsonString(e.target.value)) {
                    loadDetectedCommands(e.target.value, setCommandList);
                  }
                }}
                className="w-full border p-2"
                placeholder="ABI Content"
                name="abi"
                rows={10}
              />
            </code>
            <div className="w-full gap-2 flex">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isJsonString(abi)) {
                    abi && setAbi(JSON.stringify(JSON.parse(abi)));
                  }
                }}
                className="text-blue-700 p-2"
              >
                Minify JSON
              </button>

              <button className="bg-blue-500 text-white p-2 ml-auto">
                Update ABI
              </button>
            </div>
          </form>
          {commandList.length > 0 && (
            <div className="flex-1 flex flex-col gap-2 my-2">
              <p className="text-2xl">Functions</p>
              <div className="flex flex-col gap-1">
                {commandList
                  .filter((command) => command.type === "function")
                  .map((command) => (
                    <div
                      key={`${command.name}`}
                      className="border shadow-md flex-1 flex flex-col gap-1 p-1"
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-2xl">{command.name}</p>
                        <p>{command.stateMutability}</p>
                      </div>
                      {command.inputs.length > 0 && (
                        <>
                          <p className="text-sm">
                            {command.inputs.length} Inputs
                          </p>
                          <div>
                            {command.inputs.map((input) => (
                              <div
                                key={`${command.name}_${input.name}`}
                                className="flex items-center gap-3 ml-6 text-sm"
                              >
                                <p className="text-green-600">{input.type}</p>
                                <p>{input.name}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {command.outputs.length > 0 && (
                        <>
                          <p className="text-sm">
                            {command.outputs.length} Outputs
                          </p>
                          <div>
                            {command.outputs.map((output) => (
                              <div
                                key={`${command.name}_${output.name}`}
                                className="flex items-center gap-3 ml-6 text-sm"
                              >
                                <p className="text-green-600">{output.type}</p>
                                <p>{output.name}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
              <p className="text-2xl">Events</p>
              <div className="flex flex-col gap-1">
                {commandList
                  .filter((command) => command.type === "event")
                  .map((command) => (
                    <div
                      key={`${command.name}`}
                      className="border shadow-md flex-1 flex flex-col gap-1 p-1"
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-2xl">{command.name}</p>
                        <p>{command.stateMutability}</p>
                      </div>
                      {command.inputs.length > 0 && (
                        <>
                          <p className="text-sm">
                            {command.inputs.length} Parameters
                          </p>
                          <div>
                            {command.inputs.map((input) => (
                              <div
                                key={`${command.name}_${input.name}`}
                                className="flex items-center gap-3 ml-6 text-sm"
                              >
                                <p className="text-green-600">{input.type}</p>
                                <p>{input.name}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
