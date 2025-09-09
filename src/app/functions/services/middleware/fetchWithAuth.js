// functions/fetchWithAuth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRaiz } from "../api/source";

export const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    // Recupera token salvo na sessão
    const session = await AsyncStorage.getItem("currentSession");
    const parsed = session ? JSON.parse(session) : null;
    const token = parsed?.token;

    if (!token) {
      throw new Error("Token não encontrado");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    // Se tiver body e não tiver Content-Type, adiciona
    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.log("Erro fetchWithAuth:", error);
    throw error;
  }
};
