import "../Style/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Accueil from "../views/Accueil.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>}/>
          <Route path="/about" element={<Accueil/>} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
