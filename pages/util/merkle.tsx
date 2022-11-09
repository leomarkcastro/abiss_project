import { useState } from "react";
import useWeb3 from "@/lib/web3/hooks/useWeb3";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";

function Page() {
  const [tree, setTree] = useState<any>(null);

  const [leafsInput, setLeafsInput] = useState<any>(null);
  const [root, setRoot] = useState<any>(null);

  async function generateMerkleTree() {
    const leafs = leafsInput.split("\n").map((v) => keccak256(v));
    const tree = new MerkleTree(leafs, keccak256, { sort: true });
    setTree(tree);
    setRoot(tree.getHexRoot());
  }

  const [genProofInput, setGenProofInput] = useState<any>(null);
  const [genProofs, setGenProofs] = useState<any>(null);
  async function generateProof() {
    const proof = tree.getHexProof(keccak256(genProofInput));
    console.log(proof);
    setGenProofs(proof);
  }

  const [verLeaf, setVerLeaf] = useState<any>(null);
  const [verProofs, setVerProofs] = useState<any>(null);
  const [verVerified, setVerVerified] = useState<any>(null);
  async function verifyProof() {
    // verproofs to array
    const proof = verProofs.split("\n");
    // console.log(proof, verLeaf, root);
    const verified = tree.verify(proof, keccak256(verLeaf), root);
    // console.log(verified);
    setVerVerified(verified);
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 gap-2">
        <p className="text-2xl">Merkle Tree</p>
        <div className="flex-1 p-2">
          <label>Leaves</label>
          <textarea
            className="w-full p-2 border"
            placeholder="Input data Here"
            rows={5}
            value={leafsInput}
            onChange={(e) => setLeafsInput(e.target.value)}
          ></textarea>
        </div>
        <button className="p-1 bg-gray-200" onClick={generateMerkleTree}>
          Generate Merkle Tree
        </button>
        <p className="text-2xl">Generate Proof</p>
        <p>Root:</p>
        <p className="text-xs">{root}</p>
        <div className="flex-1 p-2">
          <label>Generate Proof</label>
          <input
            className="w-full p-1 border"
            placeholder="Leaf"
            value={genProofInput}
            onChange={(e) => setGenProofInput(e.target.value)}
          ></input>
        </div>
        <button className="p-1 bg-gray-200" onClick={generateProof}>
          Generate Proof
        </button>
        <div>
          <p>Proofs:</p>
          <div>
            {genProofs &&
              genProofs.map((x: any) => {
                return (
                  <li key={x} className="text-xs list-disc">
                    {x}
                  </li>
                );
              })}
          </div>
        </div>
      </div>
      <div className="flex-1 p-2">
        <p className="text-2xl">Merkle Tree Verify</p>

        <div className="flex-1 p-2">
          <label>Leaf</label>
          <input
            className="w-full p-1 border"
            placeholder="Leaf"
            value={verLeaf}
            onChange={(e) => setVerLeaf(e.target.value)}
          ></input>
        </div>
        <div className="flex-1 p-2">
          <label>Proofs</label>
          <textarea
            className="w-full p-2 border"
            placeholder="Input data Here"
            rows={5}
            value={verProofs}
            onChange={(e) => setVerProofs(e.target.value)}
          ></textarea>
        </div>
        <button className="w-full p-1 bg-gray-200" onClick={verifyProof}>
          Verify Proof
        </button>
        <p>Is Verified: {JSON.stringify(verVerified)}</p>
      </div>
    </div>
  );
}

export default Page;
