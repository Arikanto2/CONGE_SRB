import "../Style/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Accueil from "../views/Accueil.jsx";
import Profile from "../views/Profile.jsx";
import Demande from "../views/Demande.jsx"
import Stats from "../views/Stats.jsx";
import Layout from "./Layout.jsx";
import "@fontsource/viaoda-libre";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="App h-screen flex items-center justify-center">
                            <Login />
                        </div>
                    }
                />
                <Route path="/login" element={<div className="App h-screen flex items-center justify-center">
                    <Login />
                </div>}>
                </Route>


                <Route element={<Layout />}>
                    <Route path="/Accueil" element={<Accueil />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/Demande" element={<Demande/>}/>
                    <Route path="/Statistique" element={<Stats/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
