import { Component } from "react";
import "../Style/Login.css";
import Inscription from "../Composants/Inscription.jsx";
import Connexion from "../Composants/connexion.jsx";
import Logo2 from "../assets/Logo2.jpg";

class Login extends Component {
  toggleClasses = (element, classesToRemove = [], classesToAdd = []) => {
    if (element) {
      classesToRemove.forEach((cls) => element.classList.remove(cls));
      classesToAdd.forEach((cls) => element.classList.add(cls));
    }
  };

  deffilant = () => {
    const divDefilant = document.querySelector(".divDefilant");
    const connexConteneur = document.querySelector(".connexConteneur");
    const inscriptionConteneur = document.querySelector(".InscriptionConteneur");

    if (divDefilant) {
      this.toggleClasses(divDefilant, ["animate-slideOut"], ["animate-defilement"]);

      setTimeout(() => {
        this.toggleClasses(connexConteneur, [], ["pointer-events-none", "opacity-0"]);
        this.toggleClasses(inscriptionConteneur, ["pointer-events-none"], ["opacity-100"]);

        this.toggleClasses(divDefilant, ["animate-defilement", "rounded-br-full", "rounded-tr-full"], ["animate-defilement1"]);
      }, 2000);
    }
  };

  deffilantrevrse = () => {
    const divDefilant = document.querySelector(".divDefilant");
    const connexConteneur = document.querySelector(".connexConteneur");
    const inscriptionConteneur = document.querySelector(".InscriptionConteneur");

    if (divDefilant) {
      this.toggleClasses(divDefilant, ["animate-defilement1"], ["animate-slideIn"]);

      setTimeout(() => {
        this.toggleClasses(connexConteneur, ["pointer-events-none", "opacity-0"]);
        this.toggleClasses(inscriptionConteneur, ["opacity-100"], ["pointer-events-none", "opacity-0"]);

        this.toggleClasses(divDefilant, ["animate-slideIn"], ["rounded-br-full", "rounded-tr-full", "animate-slideOut"]);
      }, 2000);
    }
  };

  render() {
    return (
      <>
        <div className="App skeleton relative flex h-screen">
          <div className="absolute left-0 top-0 flex items-center gap-2 p-2">
            <img src={Logo2} alt="Logo SRB" className="logo2" />
            <p className="labeSRB">SERVICE RÉGIONAL DU BUDGET HAUTE MATSIATRA</p>
          </div>
          <div className="loging relative mx-auto my-auto flex overflow-hidden bg-white">
            <div className="relative w-full">
              <div className="divDefilant absolute inset-y-0 left-0 z-30 w-56 rounded-br-full rounded-tr-full"></div>
              <div className="InscriptionConteneur pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0">
                <Inscription activeDefil={this.deffilantrevrse} />
              </div>
              <div className="connexConteneur absolute inset-y-0 right-0 z-20">
                <Connexion activeDefil={this.deffilant} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
