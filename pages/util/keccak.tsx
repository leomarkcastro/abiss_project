import { useState } from "react";
import useWeb3 from "@/lib/web3/hooks/useWeb3";

function Page() {
  const web3 = useWeb3(true);

  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<string>("");

  const [result, setResult] = useState<any>({
    sha3: "",
    soliditySha3: "",
  });

  function hash() {
    let inp = data || "";

    if (type === "json") {
      try {
        inp = JSON.parse(inp);
      } catch (e) {
        console.log(e);
        alert("Invalid JSON");
      }
    }

    try {
      setResult({
        sha3: web3.web3.utils.sha3(inp),
        soliditySha3: web3.web3.utils.soliditySha3(inp),
      });
    } catch (err) {
      try {
        // check if inp is array
        if (inp.length) {
          setResult({
            soliditySha3: web3.web3.utils.soliditySha3(...inp),
          });
        } else {
          setResult({
            soliditySha3: web3.web3.utils.soliditySha3(inp),
          });
        }
      } catch (errr) {
        console.log(errr);
        alert("Invalid input");
      }
    }
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Keccak256/SHA3</p>
        <div className="flex flex-col gap-2 my-4">
          <div>
            <label>Input Type</label>
            <br></br>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              defaultValue="string"
            >
              <option value="string">String</option>
              <option value="json">Parse as JSON</option>
            </select>
          </div>
          <div>
            <label>Data</label>
            <br></br>
            <textarea
              className="w-full p-2 border"
              placeholder="Input data Here"
              rows={5}
              value={data}
              onChange={(e) => setData(e.target.value)}
            ></textarea>
            {type == "json" && (
              <>
                <p className="text-xs">
                  Or input anything that can be parsed as JSON
                </p>
                <p className="text-xs">
                  You can input specific types like{" "}
                  {`{"type": "uint256", "value": "234"}`}
                </p>
              </>
            )}
          </div>
        </div>
        <button className="p-2 bg-gray-200 border shadow" onClick={hash}>
          Process Data
        </button>
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Result</p>
        {result.sha3 ? (
          <>
            <p>String Sha3</p>
            <p>{result.sha3}</p>
          </>
        ) : (
          <>
            <p>Solidity Sha3</p>
            <p>{result.soliditySha3}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
