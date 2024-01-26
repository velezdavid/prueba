import InputField from "components/fields/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { alertBasic } from "utils/extends";
import { registrar } from "services/auth.service";
import { iniciarSesion } from "services/auth.service";
import { persitirUsario } from "services/auth.service";

export default function SignUp() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, correo, contrasena } = user;
    if (!nombre || !apellido || !correo || !contrasena) {
      const params = {
        title: "Validación",
        text: "Asegurese de llenar toda la información",
        icon: "info",
      };
      alertBasic(params);
      return;
    }
    const data = await registrar(user);

    if (data?.status === 201) {
      const access = await iniciarSesion(user);
      if (access?.status === 200) {
        await persitirUsario({
          user: access?.data?.user,
          jwt: access?.data?.token,
        });
        navigate("/");
      } else {
        const params = {
          title: "Info",
          text: access,
          icon: "info",
        };
        alertBasic(params);
      }
    } else {
      const params = {
        title: "Info",
        text: data,
        icon: "info",
      };
      alertBasic(params);
    }
  };
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Registrarte
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Ingresa tu información
        </p>
        <div className="flex gap-4 ">
          {/* nombre */}
          <InputField
            variant="auth"
            extra="mb-3 w-full "
            label="Nombre*"
            placeholder="Raul"
            id="nombre"
            type="text"
            name="nombre"
            onChange={handleInputChange}
            value={user?.nombre}
          />
          {/* Apellido */}
          <InputField
            variant="auth"
            extra="mb-3 w-full"
            label="Apellido*"
            placeholder="Gomez"
            id="apellido"
            type="text"
            name="apellido"
            onChange={handleInputChange}
            value={user?.apellido}
          />
        </div>

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Correo*"
          placeholder="usuario@gmail.com"
          id="email"
          type="email"
          name="correo"
          onChange={handleInputChange}
          value={user?.correo}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Contraseña*"
          placeholder="Min. 8 caracteres"
          id="password"
          type="password"
          name="contrasena"
          onChange={handleInputChange}
          value={user?.contrasena}
        />

        <button
          onClick={handleSubmit}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Registrarte
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            ¿Ya tienes cuenta?
          </span>
          <Link
            to="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
