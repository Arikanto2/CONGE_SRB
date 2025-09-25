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
        <div className=" relative flex bg-white mx-auto loging overflow-hidden  ">
          <div className="absolute inset-y-0 left-0 sideGContener z-40 ">
            <SideLogin
              titre="SRBHM"
              bouton="S'inscrire"
              className="sideG "
            />
          </div>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 w-56 divDefilant z-30  rounded-tr-full rounded-br-full opacity-0 pointer-events-none"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10 ">
              <Inscription />
            </div>
            <div className="absolute inset-y-0 right-0  z-20 connexConteneur opacity-0 pointer-events-none">
              <Connexion />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
