import React from "react";
import { Component } from "react";
import "../Style/Login.css";
import SideLogin from "./sideLogin.jsx";
import Inscription from "./Inscription.jsx";
import Connexion from "./connexion.jsx";
class Login extends Component {
  render() {
    return (
      <>
        <div className=" relative flex bg-gray-200 container mx-auto loging overflow-hidden  ">
          <div className="absolute inset-y-0 left-0 sideGContener ">
            <SideLogin
              titre="Créer un compte"
              bouton="S'inscrire"
              className="sideG "
            />
          </div>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-700  z-30  rounded-tr-full rounded-br-full"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0">
              <Inscription />
            </div>
            <div className="absolute inset-y-0 right-0  z-20 connexConteneur ">
              <Connexion />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
