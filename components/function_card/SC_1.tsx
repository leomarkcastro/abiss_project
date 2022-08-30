import useWeb3Action from "@/lib/web3/hooks/useWeb3Action";
import { useState, useEffect } from "react";

export default function SimulateCard({
  command,
  web3,
  ABIData,
  address,
  deleteFx,
}) {
  const contract = useWeb3Action(web3.web3, (_web3) => {
    if (ABIData)
      return new _web3.eth.Contract(JSON.parse(ABIData["abi"]), address);
    return false;
  });

  const [output, setOutput] = useState();

  async function onSubmitFx(e) {
    e.preventDefault();
    const inputList = command.inputs.map((_, i) => `inp_${command.name}_${i}`);
    const inputValues = inputList.map((iL) => e.target[iL].value);
    await contract.transact(web3.currentAccount, command, [...inputValues]);
  }

  useEffect(() => {
    if (contract.transactionDone) setOutput(contract.response);
  }, [contract.transactionDone, contract.response]);
  return (
    <div className="flex flex-col gap-1 p-3 border border-gray-500 shadow-md h-fit">
      <p className="text-xl flex">
        {command.name}
        <span className="text-sm ml-auto">{command.stateMutability}</span>
      </p>
      <form className="flex flex-col md:flex-row gap-1" onSubmit={onSubmitFx}>
        <div className="flex-[2]">
          {command.inputs.map((input_data, i) => {
            return (
              <div
                className="flex gap-2"
                key={`i_${command.nonce.substring(0, 10)}_${i}${i}`}
              >
                <p>
                  <span className="mr-1 text-gray-400">{input_data.type}</span>
                  {input_data.name}
                </p>
                <input
                  name={`inp_${command.name}_${i}`}
                  className="border flex-1"
                />
              </div>
            );
          })}
        </div>
        <div className="flex-1 flex flex-col">
          <button className="border bg-blue-600 text-white">Call</button>
          <button
            className="border bg-red-600 text-white"
            onClick={(e) => {
              e.preventDefault();
              deleteFx();
            }}
          >
            Delete
          </button>
        </div>
      </form>
      <div className="max-h-[15vh] overflow-auto">
        <p className="text-center break-all overflow-auto">
          {JSON.stringify(output)}
        </p>
      </div>
    </div>
  );
}
