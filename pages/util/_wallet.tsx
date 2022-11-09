import { useState } from "react";
import useWeb3 from "@/lib/web3/hooks/useWeb3";

function Page() {
  const web3 = useWeb3(true);

  const [walletData, setWalletData] = useState<any>(false);
  const [password, setPassword] = useState<string>("");

  async function generateWallet() {
    const data = await fetch("/api/tools/wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });
    const wallet = await data.json();

    console.log(wallet);
    setWalletData(wallet);
  }

  async function saveToFile() {
    const element = document.createElement("a");
    const textFile = new Blob(
      [JSON.stringify(walletData?.keyObject || {}, null, 2)],
      {
        type: "text/plain",
      }
    ); //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile);
    element.download = "keyFile.json";
    // document.body.appendChild(element);
    element.click();
  }

  const [recoveryKey, setRecoveryKey] = useState<string>("");
  const [recoveryPass, setRecoveryPass] = useState<string>("");
  const [recoveryData, setRecoveryData] = useState<any>(false);
  const [recoveryAdd, setRecoveryAdd] = useState<string>("");

  async function recoverWallet() {
    const data = await fetch("/api/tools/wallet/recover", {
      method: "POST",
      body: JSON.stringify({
        keyObject: recoveryKey,
        password: recoveryPass,
      }),
    });
    const wallet = await data.json();

    if (wallet.error) {
      alert(wallet.error);
    }
    setRecoveryData(wallet);
  }

  async function handleFileChose(file) {
    const reader = new FileReader();
    reader.onloadend = async (e) => {
      // console.log("yow");
      // console.log(e.target.result);
      setRecoveryKey(JSON.parse(e.target.result as string));
      setRecoveryAdd(JSON.parse(e.target.result as string)["address"]);
    };
    file && reader.readAsText(file);
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Random Wallet Generator</p>
        <p>
          Note: We dont save anything on our database. Like, really. Promise
        </p>
        <div className="flex flex-col gap-2 py-4">
          <button className="p-1 bg-gray-300 w-fit" onClick={generateWallet}>
            Generate Wallet
          </button>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-1/2 p-1 border"
            placeholder="Wallet JSON File Password. Only input if you're planning to save wallet as JSON file"
          />
          <p className="text-xs">Default password is pass123</p>
        </div>
        <div className="p-2">
          <p>Wallet Address: 0x{walletData?.keyObject?.address}</p>
          <p>Wallet Private Key: {walletData?.raw?.privateKey}</p>
          <div className="flex flex-col p-2 text-left w-fit">
            <a
              className="text-sm text-blue-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                saveToFile();
              }}
            >
              Save Wallet as JSON
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Recover Wallet from KeyFile</p>
        <div className="p-2">
          <div className="flex flex-col w-full gap-2">
            <input
              className="w-1/2 p-1 border"
              type="password"
              placeholder="Password of Recovery File"
              onChange={(e) => setRecoveryPass(e.target.value)}
              value={recoveryPass}
            ></input>
            <input
              type="file"
              className="w-fit"
              onChange={(e) => handleFileChose(e.target.files[0])}
            />
          </div>
          <div className="flex flex-col gap-2 py-4 w-fit">
            <button className="p-1 bg-gray-300" onClick={recoverWallet}>
              Recover Wallet
            </button>
          </div>
          <div>
            <p>Recovered Address: 0x{recoveryAdd}</p>
            <p>Recovered PK: {recoveryData["recoveredPK"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
