import axios from "axios";
import { BASE_API_URL } from "../utils/constants";

export const iniciarSesion = async (user) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/signin`, user);
    return response || {};
  } catch (error) {
    return error?.response?.data?.error;
  }
};

export const registrar = async (user) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/signup`, user);
    return response || {};
  } catch (error) {
    return error?.response?.data?.error;
  }
};

export const persitirUsario = ({ user, jwt = "jwt" }) => {
  user.jwt = jwt;
  localStorage.setItem("usuario", JSON.stringify(user));
};

export const obtenerUsuario = () => {
  return JSON.parse(localStorage.getItem("usuario"));
};
export const existAuth = () => {
  return JSON.parse(localStorage.getItem("usuario"));
};

export const cerrarSesion = () => {
  localStorage.removeItem("usuario");
};
