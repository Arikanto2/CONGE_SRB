import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "http://127.0.0.1:8000/api/Stats";

export async function getTasks() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    toast.error("Erreur lors de la récupération des tâches :", error);
    return [];
  }
}
