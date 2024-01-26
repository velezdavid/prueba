import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.css"; // core css
import "./custom.css";
import { setClassDarkCustom } from "./utils/extends";
import { getTutorados } from "services/tutorado.service";
import { getNotificationsByIdTutorado } from "services/tutorado.service";
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";

const AdvancedDatatableNotifications = ({}) => {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [tutorados, setTutorados] = useState([]);
  const [dataTutorado, setDataTutorado] = useState([]);

  const refDT = useRef(null);
  const { language } = useLanguage();
  const { tableAlert, sinresultados, placeholder, buttons } = idioma[language];
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false);
    initFilters();
    setTimeout(() => setClassDarkCustom(refDT), 700);
    getData();
  }, []);

  const getData = async () => {
    const tutorados = await getTutorados();
    setTutorados(tutorados);
    if (tutorados.length > 0) {
      const tutorado = await getNotificationsByIdTutorado(tutorados?.[0]?._id);
      setDataTutorado(tutorado);
    }
  };

  const getAlertsByUser = async (e) => {
    const idTutorado = e.target.value;
    const tutorado = await getNotificationsByIdTutorado(idTutorado);
    setDataTutorado(tutorado);
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nombre: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      categoria: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      fechaInicio: { value: null, matchMode: FilterMatchMode.CONTAINS },
      fechaFin: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <>
        <select
          onChange={getAlertsByUser}
          className=" float-right flex items-center justify-center rounded-md border px-8 py-4 text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white"
        >
          {tutorados?.map((tutorado) => (
            <option
              key={tutorado._id}
              value={tutorado?._id}
            >{`${tutorado?.nombre} ${tutorado?.apellido}`}</option>
          ))}
        </select>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label={buttons?.limpiar}
            outlined
            onClick={clearFilter}
          />
          <span className="p-input-icon-left ">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={placeholder?.buscar}
              className="dark:!bg-navy-800 dark:!text-white "
            />
          </span>
        </div>
      </>
    );
  };

  const header = renderHeader();

  return (
    <div className="card dark:!bg-navy-900">
      <DataTable
        value={dataTutorado}
        paginator
        showGridlines
        rows={10}
        loading={loading}
        dataKey="_id"
        filters={filters}
        globalFilterFields={["mensaje", "fecha"]}
        header={header}
        emptyMessage={sinresultados}
        className="custom-class-dt"
        ref={refDT}
      >
        <Column
          field="mensaje"
          header={tableAlert?.text1}
          filterPlaceholder="Buscar por nombre"
          style={{ minWidth: "12rem", textAlign: "center" }}
          className="capitalize "
        />
        <Column
          field="fecha"
          header={tableAlert?.text2}
          filterPlaceholder="Buscar por categoria"
          style={{ minWidth: "12rem", textAlign: "center" }}
          className="capitalize "
        />
      </DataTable>
    </div>
  );
};
export default AdvancedDatatableNotifications;
