import { useMemo, useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

export function Table({
  columns: _columns,
  data,
  countPerPage = 3,
  refetchData = async (start: number, size?: number) => {},
}) {
  // const rerender = useReducer(() => ({}), {})[1];

  const [currentPage, setCurrentPage] = useState(0);
  const [counterPerPage, setCountPerPage] = useState(countPerPage);

  const table = useReactTable({
    data,
    columns: _columns,
    getCoreRowModel: getCoreRowModel(),
    // Pipeline
    // getPaginationRowModel: getPaginationRowModel(),
    //
    // initialState: {
    //   pagination: {
    //     pageSize: 10,
    //   },
    // },
  });

  return (
    <div className="p-2">
      <table className="table table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="bg-blue-500 text-white text-left"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              className=" border-b hover:bg-gray-200 cursor-pointer"
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className="p-2" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => {
            setCurrentPage(currentPage - 1);
            refetchData((currentPage - 1) * countPerPage);
          }}
          disabled={false}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => {
            setCurrentPage(currentPage + 1);
            refetchData((currentPage + 1) * countPerPage);
          }}
          disabled={false}
        >
          {">"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>{currentPage + 1}</strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={currentPage + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setCurrentPage(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={counterPerPage}
          onChange={(e) => {
            setCountPerPage(Number(e.target.value));
          }}
        >
          {[10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
