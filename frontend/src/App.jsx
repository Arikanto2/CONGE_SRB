import "./Style/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login.jsx";
import Accueil from "./views/Accueil.jsx";
import Profile from "./views/Profile.jsx";
import Demande from "./views/Demande.jsx";
import Stats from "./views/Stats.jsx";
import Layout from "./Composants/Layout.jsx";
import PDF from "./views/PDF.jsx";
import PDF1 from "./views/PDF1.jsx";
import ViewConge from "./Composants/ViewConge.jsx"; 


import "@fontsource/viaoda-libre";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login />
          }
        />
        <Route
          path="/login"
          element={
            <Login />
          }
        ></Route>

        <Route element={<Layout />}>
          <Route path="/Accueil" element={<Accueil />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Demande" element={<Demande />} />
          <Route path="/Statistique" element={<Stats />} />  
        </Route>
        <Route path="/PDF" element={<PDF/>} />
        <Route path="/PDF1" element={<PDF1/>} />
        <Route path="/ViewConge" element={<ViewConge/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
