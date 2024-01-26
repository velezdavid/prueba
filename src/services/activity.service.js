import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { obtenerUsuario } from "./auth.service";

export const getInfoDashboard = async () => {
  try {
    const tutor = obtenerUsuario();
    const response = await axios.get(
      `${BASE_API_URL}/activity/get-info-dashboard/${tutor?.id}`
    );
    return response?.data || [];
  } catch (error) {
    return error?.response?.data?.error;
  }
};
