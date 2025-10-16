import React, { Component } from "react";

export default class ViewConge extends Component {
  render() {
    return (
      <div
        id="pdfZone"
        className="rounded-xl bg-white p-10 shadow-lg font-serif border "
      >
        <h1 className="mb-6 text-center text-2xl font-bold underline">
          DÉCISION DE CONGÉ ANNUEL
        </h1>

        <div className="mb-6 flex justify-between text-sm">
          <div>
            <p className="font-semibold">FAHAZAVANARIKANTO Andriantsoa</p>
            <p>Matricule : 3175</p>
            <p>MEF/SG/DGBF/DB/SRB-HAUTE MATSIATRA</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Demande n°218564</p>
            <p>En date du 29/08/2025</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
            <h2 className="mb-2 text-center text-base font-semibold text-gray-700 underline">
              Information sur la demande
            </h2>
            <div className="space-y-1">
              <div className="flex justify-between">
                <p>Date du départ :</p>
                <p className="font-medium">20/08/2025</p>
              </div>
              <div className="flex justify-between">
                <p>Date du retour :</p>
                <p className="font-medium">22/08/2025</p>
              </div>
              <div className="flex justify-between">
                <p>Lieu de jouissance :</p>
                <p className="font-medium">Analamanga</p>
              </div>
              <div className="flex justify-between">
                <p>Intérim :</p>
                <p className="font-medium">RABEMANANJARA Harilanto</p>
              </div>
              <div className="flex justify-between">
                <p>Motif :</p>
                <p className="font-medium">Convenances personnelles</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
            <h2 className="mb-2 text-center text-base font-semibold text-gray-700 underline">
              Décision administrative
            </h2>
            <div className="space-y-1">
              <div className="flex justify-between">
                <p>Nombre de jours à débiter :</p>
                <p className="font-medium">4</p>
              </div>
              <div className="flex justify-between">
                <p>Décision:</p>
                <p className="font-medium ">018-MEF/SG/DGFAG/DB/SRB/HM.F</p>
              </div> 
              <div className="flex justify-between">
                <p>Nombre de jours à débiter :</p>
                <p className="font-medium">4</p>
              </div>
              <div className="flex justify-between">
                <p>Décision:</p>
                <p className="font-medium ">N57/2022-MEF/SG/DGFAG/DB/SRB/HM.F</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
