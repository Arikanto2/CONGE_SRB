import "../Style/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login.jsx";
import "@fontsource/viaoda-libre";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="App h-screen flex items-center justify-center">
            <Login />
          
          </div>} />
          <Route path="/about" element={<h1 className="bg-">jj</h1>} />
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
