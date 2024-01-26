import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiClock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { obtenerUsuario } from "services/auth.service";
import { cerrarSesion } from "services/auth.service";
import { io } from "socket.io-client";
import { BASE_URL } from "utils/constants";
import { getNotificationsByTutor } from "services/tutorado.service";
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";
import { getSendEmail } from "services/tutorado.service";
import { sendEmail } from "services/tutorado.service";
const Navbar = (props) => {
  const navigate = useNavigate();
  const socket = io(BASE_URL);

  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = useState(false);
  const [dataNotifications, setDataNotifications] = useState([]);
  const [point, setPoint] = useState(false);
  const { changeLanguage, language } = useLanguage();
  const { brandedText, userArea } = idioma[language];

  const fecha = new Date();
  const opciones = {
    month: "long",
    day: "numeric",
  };
  const dateLanguage = language === "es" ? "es-ES" : "en-EN";
  const date = fecha.toLocaleDateString(dateLanguage, opciones);
  const user = obtenerUsuario();
  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    socket.on("notificacion", async (data) => {
      console.log("notificacion", data);
      const resp = await getSendEmail(data?.tutorado);
      if (resp) {
        await sendEmail(data, resp);
      }
      getNotifications();
      setPoint(true);
    });
    return () => {
      socket.off("notificacion");
      socket.disconnect();
    };
  }, []);

  const getNotifications = async () => {
    const response = await getNotificationsByTutor(user?.id, 5);
    setDataNotifications(response);
  };
  const salir = () => {
    cerrarSesion();
    navigate("/auth/sign-in");
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            {brandedText}

            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <button
          className="flex items-center gap-2 px-2"
          onClick={() => {
            changeLanguage();
          }}
        >
          {language === "es" ? (
            <img
              className="w-6"
              src="https://images.vexels.com/media/users/3/164648/isolated/lists/3b68a533d5e7a8d5e42a8c85428148d6-icono-de-idioma-de-la-bandera-de-estados-unidos.png"
              alt="Bandera"
            />
          ) : (
            <img
              className="w-6"
              src="https://images.vexels.com/media/users/3/164598/isolated/preview/ae39cafd26e1b3739a0265ad7e65ebdc-icono-de-idioma-de-la-bandera-de-espana.png"
              alt="Bandera"
            />
          )}
          <span className="text-xs font-medium dark:text-white">
            {userArea?.idioma}
          </span>
        </button>

        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiClock className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            value={date}
            disabled
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-gray-400 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          {" "}
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* start Notification */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline
                className="h-4 w-4 text-gray-600 dark:text-white"
                onClick={() => setPoint(false)}
              />
            </p>
          }
          activeNotification={point}
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  {userArea?.textNotificacion}
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {userArea?.textHistorial}
                </p>
              </div>

              {dataNotifications.map((item) => (
                <Link
                  to={`/admin/profile/${item?.tutorado?.[0]?._id}`}
                  className="flex w-full cursor-pointer items-center"
                >
                  <div className="flex h-4 w-1 items-center justify-center  bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white"></div>
                  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                      {`${item?.mensaje} - ${item?.tutorado?.[0]?.nombre} ${item?.tutorado?.[0]?.apellido}`}
                    </p>
                    <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                      {item?.fecha}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="rounded-sm bg-gray-50 p-2">
                <Link
                  to={`/admin/alerts`}
                  className="float-right flex text-sm font-medium text-brand-500"
                >
                  {userArea?.textVermas}
                </Link>
              </div>
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-8 w-8 cursor-pointer rounded-full"
              src="https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
              alt="Avatar"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 {userArea?.saludo}, {user?.nombre}
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <button
                  onClick={salir}
                  className="text-sm font-medium text-red-500 hover:text-red-500"
                >
                  {userArea?.salir}
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
