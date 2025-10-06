import "../Style/Demande.css";
import { useState } from "react";
export default function Demande() {
  const lieux = ["Dakar", "Saint-Louis", "Ziguinchor", "Kaolack", "Tambacounda"];
  const [lieuSelectionne, setLieuSelectionne] = useState([]);

  const ajouterLieu = (lieu) => {
    if (lieuSelectionne.includes(lieu)) {
        setLieuSelectionne(lieuSelectionne.filter(l => l !== lieu));
    }else {
        setLieuSelectionne([...lieuSelectionne, lieu]);
    
    }}
    
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
                <input type="search" required placeholder="Recherche..." />
              </label>
              <p className="labelTitre absolute left-1/2 -translate-x-1/2 transform text-center">
                Les congés demandés
              </p>
              <div className="right-0 flex gap-2">
                <select className="comboDemande select select-info">
                  <option value="" disabled selected>
                    Catégorie d'absence
                  </option>
                  <option>L1</option>
                  <option>L2</option>
                  <option>L3</option>
                </select>
                <button
                  className="btnDemande btn btn-dash"
                  onClick={() => document.getElementById("my_modal_3").showModal()}
                >
                  Faire une demande
                </button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modalContent modal-box">
                    <form method="dialog">
                      <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
                        ✕
                      </button>
                      <div>
                        <p className="labeConnex1 text-center">Formulaire de demande d'absence</p>
                        <div className="mb-5 flex gap-20">
                          <div className="flex-1">
                            <label className="block text-left font-serif text-sm">
                              Catégorie d'absence*:
                            </label>
                            <select className="comboDemande select select-info w-full bg-gray-50">
                              <option value="" disabled selected></option>
                              <option>L1</option>
                              <option>L2</option>
                              <option>L3</option>
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
                        <div className="mb-5 flex gap-20">
                          <div className="flex-1">
                            <label className="block text-left font-serif text-sm">
                              Type d'autorisation d'absence*:
                            </label>
                            <select className="comboDemande select select-info w-full bg-gray-50">
                              <option value="" disabled selected></option>
                              <option>L1</option>
                              <option>L2</option>
                              <option>L3</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="block text-left font-serif text-sm">
                              Demi-Journée:
                            </label>
                            <select className="comboDemande select select-info w-full bg-gray-50">
                              <option value="" disabled selected></option>
                              <option>L1</option>
                              <option>L2</option>
                              <option>L3</option>
                            </select>
                          </div>
                        </div>
                        <div className="mb-5 flex">
                          <div className="flex-1">
                            <label className="block text-left font-serif text-sm">Motif :</label>
                            <textarea
                              placeholder="Saisissez votre motif d'absence ici."
                              className="textarea textarea-info w-full resize-none"
                            />
                          </div>
                        </div>
                        <div className="mb-5 flex gap-20">
                          <div className="flex-1">
                            <label className="block text-left font-serif text-sm">
                              Date début*:
                            </label>
                            <input type="date" className="input input-info" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-left font-serif text-sm">Date fin*:</label>
                            <input type="date" className="input input-info" />
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
                                placeholder=""
                                value={lieuSelectionne.join("-")}
                                className="inputDemande inputLieu input input-info w-full bg-gray-50"
                                readOnly
                              />
                              <details className="dropdown dropdown-top ">
                                <summary className="btnChoixLieu btn h-8">choisir</summary>

                                <ul className="border border-blue-300 rounded dropdown-content menu absolute left-0 top-full z-50 mt-2 max-h-40 w-52 overflow-y-auto overflow-x-hidden rounded-box bg-base-100 p-2 shadow-sm">
                                  {lieux.map((lieu) => (
                                    <li
                                      data-lieu={lieu}
                                      onClick={() => ajouterLieu(lieu)}
                                      className={`cursor-pointer hover:bg-blue-100 hover:text-blue-800 ${
                                  lieuSelectionne.includes(lieu) ? "bg-blue-500 text-white" : ""
                                }`}
                                    >
                                      {lieu}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            </div>
                          </div>
                        </div>

                        <button className="btnConnexion mx-auto block">Envoyer</button>
                      </div>
                    </form>
                  </div>
                </dialog>
              </div>
            </div>
            <div className="conteneurTab border-base-content/5 max-h-80 overflow-x-auto overflow-y-auto rounded-box border bg-base-100">
              <table className="table table-zebra">
                {/* head */}
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
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                    <th>1</th>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                    <th>1</th>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>Brice Swyre</td>
                    <td>Tax Accountant</td>
                    <td>Red</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td>Purple</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td>Purple</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

