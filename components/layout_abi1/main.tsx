import Link from "next/link";

export default function LayoutABI({ children }) {
  return (
    <div className="flex -ml-4 -my-4 items-stretch min-h-screen">
      <div className="flex-1 bg-gray-200">
        <div className="p-4 flex flex-col gap-1">
          <p>View</p>
          <ul className="ml-2 flex flex-col gap-1">
            <Link href="/abi">
              <a className="text-gray-500 text-sm">ABI</a>
            </Link>
            <Link href="/contract">
              <a className="text-gray-500 text-sm">Contract</a>
            </Link>
            <Link href="/program">
              <a className="text-gray-500 text-sm">Program</a>
            </Link>
          </ul>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <p>Create</p>
          <ul className="ml-2 flex flex-col gap-1">
            <Link href="/create/abi">
              <a className="text-gray-500 text-sm">ABI</a>
            </Link>
            <Link href="/create/contract">
              <a className="text-gray-500 text-sm">Contract</a>
            </Link>
            <Link href="/create/program">
              <a className="text-gray-500 text-sm">Program</a>
            </Link>
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}
