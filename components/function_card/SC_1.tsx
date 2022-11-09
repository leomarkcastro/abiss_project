import useWeb3Action from "@/lib/web3/hooks/useWeb3Action";
import { useState, useEffect } from "react";

function InputWrapper({ type, name }) {
  if (["bool"].includes(type)) {
    return (
      <select name={name}>
        <option value={1}>true</option>
        <option value={0}>false</option>
      </select>
    );
  }
  return <input name={name} className="flex-1 border" />;
}

export default function SimulateCard({
  command,
  web3,
  ABIData,
  address,
  deleteFx,
  id,
}) {
  const contract = useWeb3Action(web3.web3, (_web3) => {
    if (ABIData)
      return new _web3.eth.Contract(
        JSON.parse(ABIData["abi"]),
        String(address).toLowerCase().trim()
      );
    return false;
  });

  const [output, setOutput] = useState<string | undefined>();

  async function onSubmitFx(e) {
    e.preventDefault();
    setOutput("Loading...");
    const inputList = command.inputs.map(
      (_, i) => `inp_${id}_${command.name}_${i}`
    );
    const inputValues = inputList.map((iL) => {
      const inpValue = e.target[iL].value;

      if (/^\[.*\]$/.test(inpValue)) {
        return JSON.parse(inpValue);
      }
      return e.target[iL].value;
    });

    console.log(inputValues);

    if (command.stateMutability === "payable") {
      const amountToSend = e.target["amountToSend"].value;
      await contract.transact(
        web3.currentAccount,
        command,
        [...inputValues],
        amountToSend
      );
    } else {
      await contract.transact(web3.currentAccount, command, [...inputValues]);
    }
  }

  useEffect(() => {
    if (contract.transactionDone) setOutput(contract.response);
  }, [contract.transactionDone, contract.response]);
  return (
    <div className="flex flex-col gap-1 p-3 border border-gray-500 shadow-md h-fit">
      <p className="flex text-xl">
        {command.name}
        <span className="ml-auto text-sm">{command.stateMutability}</span>
      </p>
      <form className="flex flex-col gap-1 md:flex-row" onSubmit={onSubmitFx}>
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
                <InputWrapper
                  name={`inp_${id}_${command.name}_${i}`}
                  type={input_data.type}
                />
              </div>
            );
          })}
          {command.stateMutability === "payable" && (
            <div className="flex gap-2">
              <p>
                <span className="mr-1 text-gray-400">Ether</span>
                Ether To Send
              </p>
              <input name={`amountToSend`} className="flex-1 border" />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <button className="text-white bg-blue-600 border">Call</button>
          <button
            className="text-white bg-red-600 border"
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
        <p className="overflow-auto text-center break-all">
          {JSON.stringify(output)}
        </p>
      </div>
    </div>
  );
}
