import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { formatDate, shortenify } from "@/lib/utils";

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
];
