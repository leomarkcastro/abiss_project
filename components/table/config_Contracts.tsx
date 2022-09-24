import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { copyToClipboard, formatDate, shortenify } from "@/lib/utils";
import Link from "next/link";

const contractExtended = Prisma.validator<Prisma.ContractArgs>()({
  include: {
    Abi: true,
    Network: true,
    Owner: true,
    Programs: true,
  },
});
export type contractType = Prisma.ContractGetPayload<typeof contractExtended>;

const columnHelper = createColumnHelper<contractType>();

export const contractColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => (
      <p className="hidden md:block">{shortenify(info.getValue())}</p>
    ),
    header: () => <span className="hidden md:block">Address</span>,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => (
      <p className="hidden md:block">{formatDate(info.getValue())}</p>
    ),
    header: () => <span className="hidden md:block">Created At</span>,
  }),
  columnHelper.accessor("Abi.name", {
    cell: (info) => (
      <p className="hidden md:block">{shortenify(info.getValue())}</p>
    ),
    header: () => <span className="hidden md:block">ABI Source</span>,
  }),
  columnHelper.accessor("Owner.name", {
    cell: (info) => <p className="hidden md:block">{info.getValue()}</p>,
    header: () => <span className="hidden md:block">Author</span>,
  }),
  columnHelper.accessor("public", {
    cell: (info) => (
      <p className="hidden md:block">{info.getValue() ? "Yes" : "No"}</p>
    ),
    header: () => <span className="hidden md:block">Public</span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => (
      <div className="flex gap-4 text-sm bg-gray-600 text-white justify-center">
        <Link href={`/contract/${info.getValue()}`}>
          <a className="hover:text-blue-100">View</a>
        </Link>
        <button
          onClick={() => {
            copyToClipboard(
              `${window.location.origin}/api/data/contract/${info.getValue()}`
            );
            // alert("Successfully copied to clipboard");
          }}
          className="hover:text-blue-100"
        >
          Link
        </button>
      </div>
    ),
    header: () => <span className="text-center"></span>,
  }),
];
