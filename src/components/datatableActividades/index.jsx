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
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";

const AdvancedDatatableActividades = ({ actividades, refresh, setRefresh }) => {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const refDT = useRef(null);
  const { language } = useLanguage();
  const { tableActivities, sinresultados, placeholder, buttons } =
    idioma[language];

  useEffect(() => {
    setLoading(false);
    initFilters();
    setTimeout(() => setClassDarkCustom(refDT), 700);
  }, []);

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
        value={actividades}
        paginator
        showGridlines
        rows={10}
        loading={loading}
        dataKey="_id"
        filters={filters}
        globalFilterFields={["nombre", "categoria", "fecha"]}
        header={header}
        emptyMessage={sinresultados}
        className="custom-class-dt"
        ref={refDT}
      >
        <Column
          field="nombre"
          header={tableActivities?.text1}
          filterPlaceholder="Buscar por nombre"
          style={{ minWidth: "12rem", textAlign: "center" }}
          className="capitalize "
        />
        <Column
          field="categoria"
          header={tableActivities?.text2}
          filterPlaceholder="Buscar por categoria"
          style={{ minWidth: "12rem", textAlign: "center" }}
          className="capitalize "
        />
        <Column
          header={tableActivities?.text3}
          field="fechaInicio"
          filterPlaceholder="Buscar por Fecha Inicio"
          style={{ minWidth: "12rem", textAlign: "center" }}
          className="text-center"
        />
        <Column
          header={tableActivities?.text4}
          field="fechaFin"
          filterPlaceholder="Buscar por Fecha Fin"
          style={{ minWidth: "12rem", textAlign: "center" }}
          className="text-center"
        />
      </DataTable>
    </div>
  );
};
export default AdvancedDatatableActividades;
