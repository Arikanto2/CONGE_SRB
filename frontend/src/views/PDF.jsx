import React, { Component } from "react";
import logo from "../assets/logo2.jpg";

export default class PDF extends Component {
  render() {
    return (
      <div className="pl-28 pr-28">
        <div id="pdfZone" className="bg-white p-6 font-serif">
          <h1 className="mb-4 text-center text-2xl font-bold">PDF</h1>
          <div className="flex justify-between">
            <img src={logo} alt="Logo" className="h-28 w-32" />
            <p className="pt-11">Fianarantsoa, le 20/08/2025</p>
          </div>
          <div className="mt-6">
            <p className="mb-11 text-center text-xl font-bold">DEMANDE D'AUTORISATION D'ABSENCE</p>
            <p>n°218564-MEF/SG/DGBF/DB/SRB-HAUTE MATSIATRA</p>
            <p>Nom et prénoms: FAHAZAVANARIKANTO Andriantsoa</p>
            <p>Fonction:</p>
            <p>Matricule: 3175</p>
            <p>Corps: J08A</p>
            <p>Grade: ST0E</p>
            <p>Structure: MEF/SG/DGBF/DB/SRB-HAUTE MATSIATRA </p>
            <p>Est autorisée à s'absenter pour une durée de 3 jours</p>
            <p>A compter du 20/08/2025 au 22/08/2025</p>
            <p>Suppléant:</p>
            <p>Motif: Convenances personnelles</p>
            <p>Lieu de jouissance: Haute Matsiatra</p>
          </div>
          <div className="flex justify-between mt-24">
            <p className="ml-12">L'interessé</p>
            <div className="text-center">
              <p>Le chef hiérarchique</p>
              <p>Validé</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
