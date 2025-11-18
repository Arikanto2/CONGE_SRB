import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./Style/App.css";
import axios from "axios";
import { useEffect } from "react";
import Layout from "./Composants/Layout.jsx";
import ProtectedRoute from "./Composants/ProtectedRoute.jsx";
import ToastProvider from "./Composants/Toaster";
import Accueil from "./views/Accueil.jsx";
import Demande from "./views/Demande.jsx";
import Login from "./views/Login.jsx";
import PDF from "./views/PDF.jsx";
import PDF1 from "./views/PDF1.jsx";
import Profile from "./views/Profile.jsx";
import Stats from "./views/Stats.jsx";
import "@fontsource/viaoda-libre";

function App() {
  useEffect(() => {
    
    
    const creatConge = async () => {
      const date = new Date();
      const isPremierJanvier = date.getDate() === 1 && date.getMonth() === 0;

      if (!isPremierJanvier) {
        return;
      }
      try {
         await axios.post("http://localhost:8000/api/creat-conge-annuel");
      
      } catch (error) {
        console.error("Erreur lors de la création des congés annuels :", error);
      }
    };

    creatConge();
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/Accueil" element={<Accueil />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Demande" element={<Demande />} />
            <Route path="/Statistique" element={<Stats />} />
          </Route>

          {/* Routes PDF protégées */}
          <Route
            path="/PDF"
            element={
              <ProtectedRoute>
                <PDF />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PDF1"
            element={
              <ProtectedRoute>
                <PDF1 />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
