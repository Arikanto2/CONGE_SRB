import "../Style/Demande.css";
import { useState, useEffect } from "react";
//import axios from "axios";

export default function Demande() {
  // const [donneeDemande, setDonneeDemande] = useState({
  //   IM: "",
  //   CATEGORIE: "",
  //   TYPE: "",
  //   MOTIF: "",
  //   DATEDEBUT: "",
  //   DATEFIN: "",
  //   LIEU: "",
  //   INTERIM: "",
  //   ABSENCE: "",
  // });

  const [categorieAbsence, setCategorieAbsence] = useState("");
  const [titreTypeABS, setTitreTypeABS] = useState("");
  const [isAfficheTypeABS, setIsAfficheTypeABS] = useState(false);
  const [lieuSelectionne, setLieuSelectionne] = useState([]);
  const [debutDate, setDebutDate] = useState("");
  const [finDate, setFinDate] = useState("");
  const [nbrJR, setNbrJR] = useState(0);
  //const [soldeJours, setSoldeJours] = useState(25); // exemple de solde initial

  // const handleChange = (key, value) => {
  //   setDonneeDemande({
  //     ...donneeDemande,
  //     [key]: value,
  //   });
  // };

  /*const submitForm = async (e) => {
    e.preventDefault();
    const reponse = await axios.post("http://localhost:8000/api/faire-demande", donneeDemande);
    alert(reponse.data.message);
  };*/

  const lieux = [
    "Alaotra-Mangoro", "Amoron'i Mania", "Analamanga", "Analanjirofo", "Androy", "Anosy",
    "Atsimo-Andrefana", "Atsimo-Atsinanana", "Atsinanana", "Betsiboka", "Boeny", "Bongolava",
    "Diana", "Fitovinany", "Haute-Matsiatra", "Ihorombe", "Itasy", "Matsiatra-Ambony",
    "Melaky", "Menabe", "Sava", "Sofia", "Vakinankaratra", "Vatovavy", "A l'étranger",
  ];

  const autorisationAbsenceTypes = [
    "Autorisation d'absence ordinaire",
    "Autorisation d'absence spéciale",
    "Autorisation spéciale d'absence",
  ];

  const congeTypes = [
    "Congé annuel",
    "Congé de maternité",
    "Congé de paternité",
    "Congé annuel cumulé",
    "Congé pour éducation",
    "Congé maladie",
    "Congé de cure thermale",
    "Congé de longue durée",
    "Congé de fin de séjour à l'étranger",
  ];

  const calculerNombreJours = (date1, date2) => {
    if (!date1 || !date2) return 0;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = d2 - d1;
    return diff >= 0 ? Math.ceil(diff / (1000 * 3600 * 24)) + 1 : 0;
  };

  const calculerDateFin = (date1, jours) => {
    if (!date1 || jours <= 0) return "";
    const d1 = new Date(date1);
    d1.setDate(d1.getDate() + jours - 1);
    return d1.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (categorieAbsence === "Autorisation d'absence") {
      setIsAfficheTypeABS(true);
      setTitreTypeABS("Types d'autorisation d'absence");
    } else if (categorieAbsence === "Congé") {
      setIsAfficheTypeABS(true);
      setTitreTypeABS("Types de congé");
    } else {
      setIsAfficheTypeABS(false);
      setTitreTypeABS("");
    }
  }, [categorieAbsence]);

  const handleDebutChange = (val) => {
    setDebutDate(val);
    if (finDate && new Date(val) > new Date(finDate)) {
      setFinDate(val);
      setNbrJR(1);
    } else if (finDate) {
      setNbrJR(calculerNombreJours(val, finDate));
    }
  };

  const handleFinChange = (val) => {
    if (debutDate && new Date(val) < new Date(debutDate)) {
      setFinDate(debutDate);
      setNbrJR(1);
    } else {
      setFinDate(val);
      if (debutDate) setNbrJR(calculerNombreJours(debutDate, val));
    }
  };

  const handleNbrJRChange = (val) => {
    const jours = Number(val) || 0;
    setNbrJR(jours);
    if (debutDate && jours > 0) {
      setFinDate(calculerDateFin(debutDate, jours));
    }
  };

  const ajouterLieu = (lieu) => {
    setLieuSelectionne((prev) =>
      prev.includes(lieu) ? prev.filter((l) => l !== lieu) : [...prev, lieu]
    );
  };

  return (
    <>
      <div className="card ml-3 mr-3 mt-5 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <label className="input input-info left-0 h-10 w-60">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" placeholder="Recherche..." />
            </label>
            <p className="labelTitre absolute left-1/2 -translate-x-1/2 transform text-center">
              Les congés demandés
            </p>
            <div className="right-0 flex gap-2">
              <select className="comboDemande select select-info">
                <option value="" disabled selected>
                  Catégorie d'absence
                </option>
                <option value="Autorisation d'absence">Autorisation d'absence</option>
                <option value="Congé">Congé</option>
                <option value="Permission">Permission</option>
                <option value="Mission">Mission</option>
                <option value="Formation">Formation</option>
                <option value="Repos médical">Repos médical</option>
              </select>
              <button
                className="btnDemande btn btn-dash"
                onClick={() => document.getElementById("my_modal_3").showModal()}
              >
                Faire une demande
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modalContent modal-box">
                  <form method="dialog" >
                    <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
                      ✕
                    </button>
                    <p className="labeConnex1 text-center">Formulaire de demande d'absence</p>

                    <div className="flex items-center justify-center mb-3  gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2 text-lg font-semibold shadow-md">
                          {/* {soldeJours} */}
                        </div>
                        <span className="text-gray-600 text-sm">
                          Jours restants dans votre solde
                        </span>
                      </div>
                    </div>

                    <div className="mb-5 flex gap-20">
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">
                          Catégorie d'absence*:
                        </label>
                        <select
                          className="comboDemande select select-info w-full bg-gray-50"
                          onChange={(e) => setCategorieAbsence(e.target.value)}
                        >
                          <option value="" disabled selected>
                            Sélectionner
                          </option>
                          <option value="Autorisation d'absence">Autorisation d'absence</option>
                          <option value="Congé">Congé</option>
                          <option value="Permission">Permission</option>
                          <option value="Mission">Mission</option>
                          <option value="Formation">Formation</option>
                          <option value="Repos médical">Repos médical</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">Itérim :</label>
                        <input
                          type="text"
                          placeholder="Saisir l'itérim"
                          className="inputDemande input input-info w-full bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="mb-5 flex items-end gap-20">
                      {isAfficheTypeABS && (
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">
                            {titreTypeABS}*:
                          </label>
                          <select className="comboDemande select select-info w-full bg-gray-50">
                            <option value="" disabled selected>
                              Sélectionner le type
                            </option>
                            {(categorieAbsence === "Autorisation d'absence"
                              ? autorisationAbsenceTypes
                              : congeTypes
                            ).map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="mt-3 flex flex-1 items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox h-5 w-5 border-blue-400 bg-blue-100 checked:bg-blue-600 checked:text-white"
                        />
                        <select className="comboDemande select select-info w-52 bg-gray-50">
                          <option value="" disabled selected>
                            Demi-Journée
                          </option>
                          <option value="Matin">Matin</option>
                          <option value="Après-midi">Après-midi</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-5 flex">
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">Motif :</label>
                        <textarea
                          placeholder="Saisir le motif de l'absence"
                          className="textarea textarea-info w-full resize-none"
                        />
                      </div>
                    </div>

                    <div className="mb-5 flex gap-20">
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">Date début*:</label>
                        <input
                          type="date"
                          value={debutDate}
                          onChange={(e) => handleDebutChange(e.target.value)}
                          className="input input-info"
                        />
                      </div>
                      <div className="max-w-16 flex-1">
                        <label className="mb-1 block text-left font-serif text-sm">Jours:</label>
                        <input
                          type="number"
                          value={nbrJR}
                          onChange={(e) => handleNbrJRChange(e.target.value)}
                          className="input input-info w-14 bg-gray-50 text-center"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">Date fin*:</label>
                        <input
                          type="date"
                          value={finDate}
                          min={debutDate}
                          onChange={(e) => handleFinChange(e.target.value)}
                          className="input input-info"
                        />
                      </div>
                    </div>

                    <div className="mb-5 flex gap-20">
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">
                          Lieu de jouissance*:
                        </label>
                        <div className="flex w-96 gap-2">
                          <input
                            type="text"
                            value={lieuSelectionne.join(", ")}
                            className="inputDemande inputLieu input input-info w-full bg-gray-50"
                            readOnly
                          />
                          <details className="dropdown dropdown-top">
                            <summary className="btnChoixLieu btn h-8">choisir</summary>
                            <div className="max-h-64 overflow-y-auto">
                              <ul className="dropdown-content menu absolute left-0 top-full z-50 mt-2 max-h-64 w-52 space-y-1 overflow-y-auto rounded-box border border-blue-300 bg-base-100 p-2 shadow-sm">
                                {lieux.map((lieu) => (
                                  <li
                                    key={lieu}
                                    onClick={() => ajouterLieu(lieu)}
                                    className={`cursor-pointer hover:bg-blue-100 hover:text-blue-800 ${lieuSelectionne.includes(lieu) ? "bg-blue-500 text-white" : ""}`}
                                  >
                                    {lieu}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btnConnexion mx-auto block">
                      Envoyer
                    </button>
                  </form>
                </div>
              </dialog>
            </div>
          </div>

          <div className="conteneurTab border-base-content/5 max-h-80 overflow-x-auto overflow-y-auto rounded-box border bg-base-100">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date de demande</th>
                  <th>Type</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Nombre de jour</th>
                  <th>Intérim</th>
                  <th>Validateur et Date de confirmation</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12/10/2025</td>
                  <td>Congé annuel</td>
                  <td>15/10/2025</td>
                  <td>20/10/2025</td>
                  <td>5</td>
                  <td>Jean Dupont</td>
                  <td>Chef RH - 13/10/2025</td>
                  <td>Validé</td>
                  <td>---</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
