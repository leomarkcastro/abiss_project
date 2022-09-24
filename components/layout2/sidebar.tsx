import Link from "next/link";

const links = [
  {
    group_name: "Tools",
    links: [
      {
        name: "ABI Management",
        url: "/abi",
      },
      {
        name: "Public Envs",
        url: "https://docs.soliditylang.org/en/v0.8.9/",
      },
      {
        name: "Hot Solidity Test",
        url: "https://docs.soliditylang.org/en/v0.8.9/",
      },
      {
        name: "Host Files",
        url: "https://docs.soliditylang.org/en/v0.8.9/",
      },
    ],
  },
  {
    group_name: "External",
    links: [
      {
        name: "Pocketbase",
        url: "https://pb01.leocastro.com/_/",
      },
      {
        name: "Multiplayer Block",
        url: "https://colyseus01.leocastro.com/games/03",
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="bg-gray-300 min-h-screen h-full p-4">
      <h1 className="text-4xl">X_ABI</h1>
      <div className="border-b border-gray-300 my-4" />
      <ul>
        {links.map((group) => (
          <li key={group.group_name} className="mb-4">
            <h3 className="text-gray-500">{group.group_name}</h3>
            <ul className="pl-2 pt-2">
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
