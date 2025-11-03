// src/api/tasks.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/Stats";

export async function getTasks() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    return [];
  }
}
