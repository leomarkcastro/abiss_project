import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { copyToClipboard, formatDate, shortenify } from "@/lib/utils";
import Link from "next/link";

const programExtended = Prisma.validator<Prisma.ProgramArgs>()({
  include: {
    contract: true,
    User: true,
  },
});
export type programType = Prisma.ProgramGetPayload<typeof programExtended>;

const columnHelper = createColumnHelper<programType>();

export const programColumns = [
  columnHelper.accessor("key", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Access Key</span>,
  }),
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => <p>{formatDate(info.getValue())}</p>,
    header: () => <span>Created At</span>,
  }),
  columnHelper.accessor("contract.name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Contract Linked</span>,
  }),
  columnHelper.accessor("User.name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Author</span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => (
      <div className="flex gap-4 text-sm">
        <Link href={`/program/${info.getValue()}`}>
          <a className="hover:text-blue-500">View</a>
        </Link>
        <button
          onClick={() => {
            copyToClipboard(
              `${
                window.location.origin
              }/api/data/program/bykey/${info.row.getValue("key")}`
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