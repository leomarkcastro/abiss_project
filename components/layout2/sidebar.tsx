import Link from "next/link";

const links = [
  {
    group_name: "Viewer",
    links: [
      {
        name: "ABIs",
        url: "/abi",
      },
      {
        name: "Contracts",
        url: "/contract",
      },
      {
        name: "Programs",
        url: "/program",
      },
      // {
      //   name: "Public Envs",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
      // {
      //   name: "Hot Solidity Test",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
      // {
      //   name: "Host Files",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
    ],
  },
  {
    group_name: "Create",
    links: [
      {
        name: "ABIs",
        url: "/create/abi",
      },
      {
        name: "Contracts",
        url: "/create/contract",
      },
      {
        name: "Programs",
        url: "/create/program",
      },
      // {
      //   name: "Public Envs",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
      // {
      //   name: "Hot Solidity Test",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
      // {
      //   name: "Host Files",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
    ],
  },
  {
    group_name: "Utility",
    links: [
      {
        name: "Wallet Gen",
        url: "/util/wallet",
      },
      {
        name: "Keccak256",
        url: "/util/keccak",
      },
      {
        name: "Sign Msg",
        url: "/util/sign",
      },
      {
        name: "Merkle Tree",
        url: "/util/merkle",
      },
      {
        name: "Gas Estimator",
        url: "/util/gasestimator",
      },
      {
        name: "Pub Secrets",
        url: "/util/secrets",
      },
      // {
      //   name: "Public Envs",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
      // {
      //   name: "Hot Solidity Test",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
      // {
      //   name: "Host Files",
      //   url: "https://docs.soliditylang.org/en/v0.8.9/",
      // },
    ],
  },

  // {
  //   group_name: "External",
  //   links: [
  //     {
  //       name: "Pocketbase",
  //       url: "https://pb01.leocastro.com/_/",
  //     },
  //     {
  //       name: "Multiplayer Block",
  //       url: "https://colyseus01.leocastro.com/games/03",
  //     },
  //   ],
  // },
];

export default function Sidebar() {
  return (
    <aside className="h-full min-h-screen p-4 bg-gray-300">
      <h1 className="text-4xl">X_ABI</h1>
      <div className="my-4 border-b border-gray-300" />
      <ul>
        {links.map((group) => (
          <li key={group.group_name} className="mb-4">
            <h3 className="text-gray-500">{group.group_name}</h3>
            <ul className="pt-2 pl-2">
              {group.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.url}>
                    <a className="hover:text-blue-600">{link.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
}
