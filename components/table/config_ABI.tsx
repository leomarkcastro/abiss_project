import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { formatDate } from "@/lib/utils";

const abiExtended = Prisma.validator<Prisma.AbiArgs>()({
  include: { contractUsers: true, User: true },
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
  columnHelper.accessor("contractUsers", {
    cell: (info) => <p>{info.getValue().length}</p>,
    header: () => <span>Created At</span>,
  }),
  columnHelper.accessor("User.name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Author</span>,
  }),
];
