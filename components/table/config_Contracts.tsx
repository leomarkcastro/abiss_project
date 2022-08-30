import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { formatDate, shortenify } from "@/lib/utils";

const contractExtended = Prisma.validator<Prisma.ContractArgs>()({
  include: {
    abi: true,
    network: true,
    Program: true,
    User: true,
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
    cell: (info) => <p>{shortenify(info.getValue())}</p>,
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => <p>{formatDate(info.getValue())}</p>,
    header: () => <span>Created At</span>,
  }),
  columnHelper.accessor("abi.name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>ABI Source Name</span>,
  }),
  columnHelper.accessor("User.name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Author</span>,
  }),
];
