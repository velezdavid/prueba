import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  MdOutlineRemoveRedEye,
  MdModeEditOutline,
  MdDelete,
} from "react-icons/md";
import { Link } from "react-router-dom";

import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.css"; // core css
import "./custom.css";
import { setClassDarkCustom } from "./utils/extends";
import Swal from "sweetalert2";
import { obtenerUsuario } from "services/auth.service";
import { registrarTutorado } from "services/tutorado.service";
import { alertBasic } from "utils/extends";
import { actualizarTutorado } from "services/tutorado.service";
import { desactiveTutorado } from "services/tutorado.service";
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";

const AdvancedDatatable = ({ tutorados, refresh, setRefresh }) => {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const classField =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

  const refDT = useRef(null);
  const { language } = useLanguage();

  const {
    tableUser,
    buttons,
    placeholder,
    modals,
    message: mesageModal,
  } = idioma[language];

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
      ciudad: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      actividades: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      estado: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue("");
  };

  const registerOrUpdate = async (action = "register", user = {}) => {
    const {
      apellido = "",
      cedula = "",
      codigoTutorado = "",
      direccion = "",
      nombre = "",
      telefono = "",
    } = user;
    const message =
      action === "register" ? mesageModal?.success3 : mesageModal?.success4;

    const { value: formValues } = await Swal.fire({
      title: modals?.labelNuevoRegistro,
      html: `
      <input id="cedula" type="number" class="${classField}" placeholder=${modals?.text1} value="${cedula}" pattern="[0-9]{10}" required >
        <div class="flex gap-4 mt-4">
          <input id="nombre" class="${classField}" placeholder="${modals?.text2}" value="${nombre}">
          <input id="apellido" class="${classField}" placeholder="${modals?.text3}" value="${apellido}">
        </div>
        <div class="flex gap-4 mt-4">
          <input id="telefono"  type="number" class="${classField}" placeholder="${modals?.text4}" value="${telefono}">
          <input id="codigo" class="${classField}" placeholder="${modals?.text5}" value="${codigoTutorado}">
        </div>
      <textarea id="direccion" class="mt-4 ${classField}" placeholder="${modals?.text6}">${direccion}</textarea>`,
      confirmButtonText: action === "register" ? modals?.text7 : modals?.text8,
      focusConfirm: false,
      preConfirm: async () => {
        const tutor = await obtenerUsuario();

        return {
          cedula: document.getElementById("cedula").value,
          nombre: document.getElementById("nombre").value,
          apellido: document.getElementById("apellido").value,
          telefono: document.getElementById("telefono").value,
          codigoTutorado: document.getElementById("codigo").value,
          direccion: document.getElementById("direccion").value,
          tutor: tutor?.id,
        };
      },
    });

    if (formValues) {
      const request =
        action === "register"
          ? registrarTutorado(formValues)
          : actualizarTutorado(user?._id, formValues);
      const resp = await request;
      if (resp?.status === 201) {
        const params = {
          title: mesageModal?.title1,
          text: message,
        };
        alertBasic(params);
        setRefresh(!refresh);
        return;
      }
      const params = {
        title: mesageModal?.title2,
        text: resp,
        icon: "info",
      };
      alertBasic(params);
    }
  };

  const deleteTutorado = async (id) => {
    const resp = await desactiveTutorado(id);
    if (resp?.status === 201) {
      const params = {
        title: mesageModal?.title1,
        text: mesageModal?.success1,
        icon: "success",
      };
      alertBasic(params);
      setRefresh(!refresh);
    } else {
      const params = {
        title: mesageModal?.title2,
        text: mesageModal?.error1,
        icon: "info",
      };
      alertBasic(params);
    }
  };

  const renderHeader = () => {
    return (
      <>
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label={buttons?.nuevoRegistro}
          outlined
          onClick={() => registerOrUpdate("register")}
          className=" float-right"
          id="b-add"
        />
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

  const actionsBodyTemplate = (data) => {
    return (
      <div className="flex items-center justify-center gap-2">
        <Link to={`/admin/profile/${data._id}`} className="ml-[18px] ">
          <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
            <span className="flex items-center text-brand-500 dark:text-white">
              <MdOutlineRemoveRedEye />
            </span>
          </div>
        </Link>
        <button onClick={() => registerOrUpdate("update", data)}>
          <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
            <span className="flex items-center text-brand-500 dark:text-white">
              <MdModeEditOutline />
            </span>
          </div>
        </button>
        <button onClick={() => deleteTutorado(data?._id)}>
          <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
            <span className="flex items-center text-brand-500 dark:text-white">
              <MdDelete />
            </span>
          </div>
        </button>
      </div>
    );
  };

  const statusBodyTemplate = ({ estado }) => {
    return (
      <span
        className={`rounded-lg py-1 px-2 text-white
          ${estado === "Activo" ? "bg-green-500" : "bg-red-600"}
            `}
      >
        {estado}
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div className="card dark:!bg-navy-900">
      <DataTable
        value={tutorados}
        paginator
        showGridlines
        rows={10}
        loading={loading}
        dataKey="id"
        filters={filters}
        globalFilterFields={[
          "cedula",
          "nombre",
          "ciudad",
          "estado",
          "actividades",
        ]}
        header={header}
        emptyMessage="Sin resultados"
        className="custom-class-dt"
        ref={refDT}
      >
        <Column
          field="cedula"
          header={tableUser?.text1}
          filterPlaceholder="Buscar por cedula"
          style={{ minWidth: "10rem", textAlign: "center" }}
        />
        <Column
          field="nombre"
          header={tableUser?.text2}
          filterPlaceholder="Buscar por nombre"
          style={{ minWidth: "10rem", textAlign: "center" }}
        />
        <Column
          field="apellido"
          header={tableUser?.text3}
          filterPlaceholder="Buscar por apellido"
          style={{ minWidth: "10rem", textAlign: "center" }}
        />
        <Column
          header={tableUser?.text4}
          field="telefono"
          filterPlaceholder="Buscar por telefono"
          style={{ minWidth: "10rem", textAlign: "center" }}
          className="text-center"
        />
        <Column
          field="estado"
          header={tableUser?.text5}
          filterPlaceholder="Buscar por estado"
          body={statusBodyTemplate}
          style={{ minWidth: "10rem", textAlign: "center" }}
        />
        <Column
          field="direccion"
          header={tableUser?.text6}
          filterPlaceholder="Buscar por direccion"
          style={{ minWidth: "10rem", textAlign: "center" }}
        />

        <Column
          header={tableUser?.text7}
          style={{ minWidth: "10rem" }}
          body={actionsBodyTemplate}
        />
      </DataTable>
    </div>
  );
};
export default AdvancedDatatable;
