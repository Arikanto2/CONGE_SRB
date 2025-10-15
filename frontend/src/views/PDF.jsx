import React, { Component } from "react";
import logo from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";

export default class PDF extends Component {
  render() {
    return (
      <div className="px-24 py-8">
        <div id="pdfZone" className="bg-white p-8 font-serif text-[15px] leading-relaxed">
          <div className="mb-6 flex justify-center">
            <img src={logo3} alt="Logo" className="h-20 w-56" />
          </div>

          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-center">
                <img src={logo} alt="Logo" className="inline-block h-28 w-32" />
              </div>
              <div className="text-center">
                <p>MINISTÈRE DE L’ÉCONOMIE ET DES FINANCES</p>
                <p>SECRÉTARIAT GÉNÉRAL</p>
                <p>DIRECTION GÉNÉRALE DES FINANCES ET DES</p>
                <p>AFFAIRES GÉNÉRALES</p>
                <p>SERVICE RÉGIONAL DU BUDGET</p>
                <p>HAUTE MATSIATRA</p>
              </div>
            </div>

            <p className="pt-40 text-right">Fianarantsoa, le 20/08/2025</p>
          </div>

          <div className="mt-8">
            <p className="mb-10 text-center text-xl font-bold">DEMANDE D’AUTORISATION D’ABSENCE</p>

            <p>n° 218564-MEF/SG/DGBF/DB/SRB-HAUTE MATSIATRA</p>
            <p>Nom et prénoms : FAHAZAVANARIKANTO Andriantsoa</p>
            <p>Fonction :</p>
            <p>Matricule : 3175</p>
            <p>Corps : J08A</p>
            <p>Grade : ST0E</p>
            <p>Structure : MEF / SG / DGBF / DB / SRB – Haute Matsiatra</p>
            <p>Est autorisé(e) à s’absenter pour une durée de 3 jours.</p>
            <p>À compter du 20/08/2025 au 22/08/2025.</p>
            <p>Suppléant :</p>
            <p>Motif : Convenances personnelles.</p>
            <p>Lieu de jouissance : Haute Matsiatra.</p>
          </div>

          <div className="mt-24 flex justify-between">
            <p className="ml-12">L’intéressé(e)</p>
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
