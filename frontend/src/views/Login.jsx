import { Component } from "react";
import "../Style/Login.css";
import Inscription from "../Composants/Inscription.jsx";
import Connexion from "../Composants/connexion.jsx";
import Logo2 from "../assets/Logo2.jpg";
class Login extends Component {
  render() {
    return (
      <>
        
        <div className="loging relative mx-auto flex overflow-hidden bg-white">
          
          <div className="relative w-full">
            <div className="divDefilant absolute inset-y-0 left-0 z-30 w-56 rounded-br-full rounded-tr-full"></div>
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0">
              <Inscription />
            </div>
            <div className="connexConteneur absolute inset-y-0 right-0 z-20">
              <Connexion />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
