import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { copyToClipboard, formatDate } from "@/lib/utils";
import Link from "next/link";

const abiExtended = Prisma.validator<Prisma.AbiArgs>()({
  include: { Contracts: true, Owner: true },
});
export type abiType = Prisma.AbiGetPayload<typeof abiExtended>;

const columnHelper = createColumnHelper<abiType>();

export const abiColumns = [
  columnHelper.accessor("id", {
    cell: (info) => <p className="hidden md:block">{info.getValue()}</p>,
    header: () => <span className="hidden md:block">ID</span>,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => (
      <p className="hidden md:block">{formatDate(info.getValue())}</p>
    ),
    header: () => <span className="hidden md:block">Created At</span>,
  }),
  columnHelper.accessor("Contracts", {
    cell: (info) => <p className="hidden md:block">{info.getValue().length}</p>,
    header: () => <span className="hidden md:block">Contracts</span>,
    enableColumnFilter: false,
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
    filterFn: (rows, id, filterValue) => {
      console.log(rows, id, filterValue);
      console.log(String(rows.original.public) == filterValue);
      return String(rows.original.public) == filterValue;
    },
  }),
  columnHelper.accessor("id", {
    cell: (info) => (
      <div className="flex gap-4 text-sm bg-gray-600 text-white justify-center">
        <Link href={`/abi/${info.getValue()}`}>
          <a className="hover:text-blue-100">View</a>
        </Link>
        <button
          onClick={() => {
            copyToClipboard(
              `${window.location.origin}/api/data/abi/${info.getValue()}`
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
    enableColumnFilter: false,
  }),
];
