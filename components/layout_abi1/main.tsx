import Link from "next/link";

export default function LayoutABI({ children }) {
  return (
    <div className="flex items-stretch min-h-screen -my-4 -ml-4">
      {false && (
        <div className="flex-1 hidden bg-gray-200">
          <div className="flex flex-col gap-1 p-4">
            <p>View</p>
            <ul className="flex flex-col gap-1 ml-2">
              <Link href="/abi">
                <a className="text-sm text-gray-500">ABI</a>
              </Link>
              <Link href="/contract">
                <a className="text-sm text-gray-500">Contract</a>
              </Link>
              <Link href="/program">
                <a className="text-sm text-gray-500">Program</a>
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <p>Create</p>
            <ul className="flex flex-col gap-1 ml-2">
              <Link href="/create/abi">
                <a className="text-sm text-gray-500">ABI</a>
              </Link>
              <Link href="/create/contract">
                <a className="text-sm text-gray-500">Contract</a>
              </Link>
              <Link href="/create/program">
                <a className="text-sm text-gray-500">Program</a>
              </Link>
            </ul>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
