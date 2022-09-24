import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { copyToClipboard, formatDate, shortenify } from "@/lib/utils";
import Link from "next/link";

const networkExtended = Prisma.validator<Prisma.NetworkArgs>()({});
export type networkType = Prisma.NetworkGetPayload<typeof networkExtended>;

const columnHelper = createColumnHelper<networkType>();

export const networkColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Network RPC ID</span>,
  }),
];
