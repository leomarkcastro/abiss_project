import { useState } from "react";
import useWeb3 from "@/lib/web3/hooks/useWeb3";

function Page() {
  const web3 = useWeb3(true);
  const [data, setData] = useState<any>(null);

  const [signature, setSignature] = useState<any>(null);

  async function signMessagePersonal() {
    const accounts = await web3.web3.eth.getAccounts();

    const hostAddress = accounts[0];

    // let nonce = "\x19Ethereum Signed Message:\n" + message.length + message;
    // nonce = web3.utils.keccak256(nonce);
    // const signature = await web3.eth.sign(nonce, hostAddress);

    const procMesasge = web3.web3.utils.utf8ToHex(data || "");

    const hashMessage = web3.web3.utils.soliditySha3(
      { t: "string", v: "\x19Ethereum Signed Message:\n" },
      { t: "uint8", v: procMesasge.length },
      { t: "string", v: procMesasge }
    );

    const signature = await web3.web3.eth.personal.sign(
      procMesasge,
      hostAddress
    );
    // console.log(signature);
    setSignature({
      message: procMesasge,
      messageHash: hashMessage,
      signature,
    });
  }

  const [privateKey, setPrivateKey] = useState<any>(null);

  async function signMessagePrivate() {
    const procMesasge = web3.web3.utils.utf8ToHex(data || "");

    const signature = await web3.web3.eth.accounts.sign(
      procMesasge,
      privateKey
    );
    setSignature(signature);
  }

  const [recData, setRecData] = useState<any>(null);
  const [recSignature, setRecSignature] = useState<any>(null);

  const [recAddress, setRecAddress] = useState<any>(null);

  async function verifyMessage() {
    const recovered = web3.web3.eth.accounts.recover(recData, recSignature);

    setRecAddress(recovered);
  }

  return (
    <div className="">
      <div className="flex flex-row gap-2">
        <div className="flex flex-col flex-1 gap-2">
          <p className="text-2xl">Sign Message</p>
          <div>
            <label>Data</label>
            <br></br>
            <textarea
              className="w-full p-2 border"
              placeholder="Input data Here"
              rows={3}
              value={data}
              onChange={(e) => setData(e.target.value)}
            ></textarea>
          </div>
          <p>Sign using Your Wallet</p>
          <div className="flex gap-2">
            <button
              className="p-1 bg-gray-200 shadow-md"
              onClick={signMessagePersonal}
            >
              Sign Message (EIP 117)
            </button>
          </div>
          <hr className="my-2" />
          <p>Sign Using Private Key</p>
          <div>
            <input
              className="w-full p-1 border"
              type="password"
              placeholder="Sign Using Private Key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="p-1 bg-gray-200 shadow-md"
              onClick={signMessagePrivate}
            >
              Sign Message (EIP 117)
            </button>
          </div>
          <div>
            <p className="break-all">
              <strong>Message Hex:</strong> {signature && signature["message"]}
            </p>

            <p className="break-all">
              <strong>Signature:</strong> {signature && signature["signature"]}
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <p className="text-2xl">Recover Address from Message and Signature</p>
          <div>
            <label>Data</label>
            <br></br>
            <textarea
              className="w-full p-2 border"
              placeholder="Input data Here"
              rows={3}
              value={recData}
              onChange={(e) => setRecData(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label>Signature</label>
            <br></br>
            <textarea
              className="w-full p-2 border"
              placeholder="Input data Here"
              rows={2}
              value={recSignature}
              onChange={(e) => setRecSignature(e.target.value)}
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button
              className="p-1 bg-gray-200 shadow-md"
              onClick={verifyMessage}
            >
              Verify Message (EIP 117)
            </button>
          </div>
          <div>
            <p className="break-all">
              <strong>Recovered Address:</strong> {recAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
