import React, { Component } from "react";
import logo from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";


export default class PDF extends Component {
  render() {
    return (
      <div className="px-20 py-10">
        <div id="pdfZone" className="bg-white p-10 font-serif">
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

          <div className="mt-24 leading-relaxed">
            <p className="mb-8 text-center text-xl font-bold">
              DEMANDE DE JOUISSANCE DE CONGE
            </p>
            <p>Je soussigné FAHAZAVANARIKANTO Andriantsoa IM 3175</p>
            <p>En service au Centre informatique</p>
            <p>
              Budget: GENERAL/Fonctionnemant Imputation budgétaire:
              00.210.114/3.00.23.2.260.30101.6012
            </p>
            <p>
              Sollicite de jouissance d'une fraction de congé annuel de Cinq{" "}
              (05) Jours, au titre
            </p>
            <p>de l'année 2025 suivant décision n°...... du .....</p>
            <p>Et pour compter du 01/09/25 au 05/09/25</p>
            <p>Pour motif congé annuel</p>
            <p>Pour en jouir à Antananarivo</p>
          </div>

          <div className="mt-8 flex justify-end">
            <p>L'intéressé(e)</p>
          </div>

          <div className="mt-8">
            <p className="font-bold underline">DECOMPTE</p>
            <ul className="ml-10 list-disc leading-relaxed">
              <li>Reliquat: cinq (05) Jours</li>
              <li>Nombre de jours demandés: cinq (05) Jours</li>
              <li>Droit de congé restant: cinq (05) Jours</li>
            </ul>
          </div>

          <div className="mt-10 flex justify-between">
            <div className="text-center">
              <p className="mb-5">AVIS FAVORABLE</p>
              <p>Le Chef hiérarchique</p>
            </div>
            <div className="text-center">
              <p className="mb-5">AVIS FAVORABLE</p>
              <p>Le Chef de Service Régional du Budget</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
