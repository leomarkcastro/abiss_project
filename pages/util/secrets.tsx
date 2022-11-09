import { useState, useEffect } from "react";
import { roundTo } from "@/lib/utils";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

import CryptoJS from "crypto-js";

function Page() {
  const [code, setCode] = useState(
    `You can save anything. It's just a string.\n\nTry it out!`
  );
  const [pass, setPass] = useState("");

  const [accessCode, setAccessCode] = useState("");

  function accessTemplate(id = "<id>") {
    return `https://solidity.xurpasportal.com/api/secrets/view/${id}`;
  }

  function saveData() {
    const signature = hashData();
    const value = encryptData();
    uploadData(value, signature);
  }

  function hashData() {
    const hash = CryptoJS.SHA256(code).toString();
    return hash;
  }

  function encryptData() {
    const encrypted = CryptoJS.AES.encrypt(code, pass).toString();
    return encrypted;
    // localStorage.setItem("code", encrypted);
  }

  function decryptData() {
    const decrypted = CryptoJS.AES.decrypt(code, pass).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
    // localStorage.setItem("code", decrypted);
  }

  function verifyData() {
    const hash = hashData();
    const decrypted = decryptData();
    const newHash = CryptoJS.SHA256(decrypted).toString();
    return hash === newHash;
  }

  async function uploadData(value, signature) {
    const response = await fetch("/api/secrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        signature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Something went wrong!");
    }
    console.log(data);
    setAccessCode(data.id);
    return data;
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Public Secrets</p>
        <p className="text-sm">
          Public Secrets in the sense that everyone can access your data as long
          as they know the id of your data. Secret in the sense that values are
          encrypted and only those who knows the password can read the data.
          Only strings are supported.
        </p>
        <p className="text-sm">
          You can access the values you saved by doing {accessTemplate()}
        </p>
        <hr />
        <p className="text-xl">Create a new secret</p>
        <div className="flex flex-col gap-2">
          <label>Data</label>
          <div className="h-[30vh] overflow-y-auto  border border-gray-300 rounded-lg">
            <Editor
              value={code}
              className="p-2 rounded-lg min-h-[30vh] focus:outline-none focus:border-none active:outline-none"
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.text)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <input
            className="p-2 border border-gray-300 rounded-md"
            type="password"
            placeholder="Put Password Here"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
        </div>
        <button className="p-2 bg-gray-400 rounded-md" onClick={saveData}>
          Save
        </button>
        <hr />
        {accessCode && (
          <div className="flex flex-col gap-2">
            <p className="text-xl">Access your secret</p>
            <p className="text-sm">
              You can access your secret by doing{" "}
              <a href={accessTemplate(accessCode)}>
                {accessTemplate(accessCode)}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
