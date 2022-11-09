import { useState } from "react";
import useWeb3 from "@/lib/web3/hooks/useWeb3";

import keythereum from "keythereum";

function ToggleSecret({ message }) {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <div className="flex flex-col text-sm">
      {show ? (
        <p>{message}</p>
      ) : (
        <span>
          {Array.from({ length: message?.length || 0 }, () => ".").join("")}
        </span>
      )}
      <button className="cursor-pointer w-fit" onClick={toggle}>
        Show
      </button>
    </div>
  );
}

function Page() {
  const web3 = useWeb3(true);

  const [walletData, setWalletData] = useState<any>(false);
  const [password, setPassword] = useState<string>("");

  async function generateWallet() {
    const dk = keythereum.create();

    const keyObject = keythereum.dump(
      password || "pass123",
      dk.privateKey,
      dk.salt,
      dk.iv
    );

    Object.keys(dk).forEach(function (key, index) {
      dk[key] = dk[key].toString("hex");
    });

    const wallet = {
      raw: dk,
      keyObject,
    };

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
    let privateKey;

    try {
      privateKey = keythereum.recover(recoveryPass || "pass123", recoveryKey);
    } catch (err) {
      alert(err);
    }

    privateKey && setRecoveryData({ recoveredPK: privateKey.toString("hex") });
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
          Note: The whole wallet creation process happens on the browser side so
          nothing is sent to the server, nor nothing is saved on the session of
          the browser. However, feel free to speculate
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
          <p>Wallet Address:</p>
          <p>0x{walletData?.keyObject?.address}</p>
          <p className="break-all">Wallet Private Key: </p>
          <p>
            <ToggleSecret message={walletData?.raw?.privateKey} />
          </p>
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

            <p>Recovered PK:</p>
            <ToggleSecret message={recoveryData?.recoveredPK} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
