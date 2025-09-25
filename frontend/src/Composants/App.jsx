import "../Style/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Accueil from "../views/Accueil.jsx";
import "@fontsource/viaoda-libre";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="App h-screen flex items-center justify-center skeleton">
            <Login />       
          </div>} />
          <Route path="/about" element={<Accueil/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
