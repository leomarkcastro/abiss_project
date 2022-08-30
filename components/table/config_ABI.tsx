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
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => <p>{formatDate(info.getValue())}</p>,
    header: () => <span>Created At</span>,
  }),
  columnHelper.accessor("Contracts", {
    cell: (info) => <p>{info.getValue().length}</p>,
    header: () => <span>Contracts</span>,
  }),
  columnHelper.accessor("Owner.name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Author</span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => (
      <div className="flex gap-4 text-sm">
        <Link href={`/abi/${info.getValue()}`}>
          <a className="hover:text-blue-500">View</a>
        </Link>
        <button
          onClick={() => {
            copyToClipboard(
              `${window.location.origin}/api/data/abi/${info.getValue()}`
            );
            alert("Successfully copied to clipboard");
          }}
          className="hover:text-blue-500"
        >
          Copy Data Link
        </button>
      </div>
    ),
    header: () => <span className="text-center"></span>,
  }),
];
