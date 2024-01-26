import Card from "components/card";
import { useLanguage } from "hooks/useLanguage";
import React, { useMemo } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { idioma } from "utils/constants";

function TopCreatorTable(props) {
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const { language } = useLanguage();
  const { cardsHome } = idioma[language];

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  return (
    <Card extra={"h-[390px] w-full"}>
      {/* Top Creator Header */}
      <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pt-4 pb-[20px] shadow-2xl shadow-gray-100 dark:!bg-navy-700 dark:shadow-none">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          {cardsHome?.text4}
        </h4>
      </div>

      {/* Top Creator Heading */}
      <div className="w-full overflow-x-scroll px-4 md:overflow-x-hidden">
        <table
          {...getTableProps()}
          className="w-full min-w-[500px] overflow-x-scroll"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                  >
                    <div className="flex items-center justify-between pt-4 pb-2 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="px-4">
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "Nombre") {
                      data = (
                        <div className="flex items-center gap-2">
                          <div className="h-[30px] w-[30px] rounded-full">
                            <img
                              src="https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                              className="h-full w-full rounded-full"
                              alt=""
                            />
                          </div>
                          <p className="text-sm font-medium text-navy-700 dark:text-white">
                            {cell.value}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Actividades") {
                      data = (
                        <p className="text-md font-medium text-gray-600 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "Detalle") {
                      data = (
                        <div class="mx-2 flex font-bold">
                          <Link
                            to={`/admin/profile/${cell.row.original.id_tutorado}`}
                            className="ml-[18px] flex w-auto  items-center justify-center"
                          >
                            <div className="rounded-full bg-lightPrimary p-2 dark:bg-navy-700">
                              <span className="flex items-center text-brand-500 dark:text-white">
                                <MdOutlineRemoveRedEye />
                              </span>
                            </div>
                          </Link>
                        </div>
                      );
                    }
                    return (
                      <td
                        className="py-3 text-sm"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TopCreatorTable;
