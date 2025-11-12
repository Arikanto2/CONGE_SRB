import React from "react";

export default function ViewConge({
  IM,
  NOM,
  PRENOM,
  DATEDEBUT,
  DATEFIN,
  motif,
  lieu,
  ref,
  joursADebiter,
  Interim,
  decision,
}) {
  return (
    <div id="pdfZone" className="rounded-xl border bg-white p-10 font-serif shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold underline">DÉCISION DE CONGÉ ANNUEL</h1>

      <div className="mb-6 flex justify-between text-sm">
        <div>
          <p className="font-semibold">
            {NOM} {PRENOM}
          </p>
          <p>Matricule : {IM} </p>
          <p>MEF/SG/DGBF/DB/SRB-HAUTE MATSIATRA</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">Demande n°{ref}</p>
          <p>En date du </p>
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
              <p className="font-medium"> {DATEDEBUT} </p>
            </div>
            <div className="flex justify-between">
              <p>Date du retour :</p>
              <p className="font-medium"> {DATEFIN} </p>
            </div>
            <div className="flex justify-between">
              <p>Lieu de jouissance :</p>
              <p className="font-medium"> {lieu} </p>
            </div>
            <div className="flex justify-between">
              <p>Intérim : </p>
              <p className="font-medium">{Interim}</p>
            </div>
            <div className="flex justify-between">
              <p>Motif :</p>
              <p className="font-medium"> {motif} </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="mb-2 text-center text-base font-semibold text-gray-700 underline">
            Décision administrative
          </h2>
          <div className="space-y-1">
            {joursADebiter && joursADebiter.length > 0 ? (
              joursADebiter.map((ligne, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <p>Nombre de jours à débiter:</p>
                    <p className="font-medium">{ligne.jours}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Decision :</p>
                    <p className="font-medium">
                      {ligne.id}/{ligne.annee}-MEF/SG/DGFAG/DB/SRB/HM.F
                    </p>
                  </div>
                </div>
              ))
            ) : (
              decision.map((dec) => (
                <div key={dec.id} className="space-y-1">
                  <div className="flex justify-between">
                    <p>Nombre de jours à débiter:</p>
                    <p className="font-medium">{dec.congeDebite}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Decision :</p>
                    <p className="font-medium">
                      {dec.id}/{dec.an}-MEF/SG/DGFAG/DB/SRB/HM.F
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
