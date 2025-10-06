export default function Accueil() {
  return (
    <div className="card card-xs mx-8 h-full bg-base-100 pb-3 shadow-sm">
      <div className="card-body ml-5 mr-5 h-full">
        <div className="divEntete flex items-center gap-5">
          <div className="cadreprmierL flex items-center justify-items-center">
            <p className="premierL text-center">F</p>
          </div>
          <p className="nomUtil">FAHAZAVANARIKANTO Andriantsoa</p>
          <div className="flex gap-3">
            <button
              className="btnDemande btn btn-dash"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Modifier le profile
            </button>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
                    ✕
                  </button>
                  <div className="blocks-center">
                    <div className="ml-6 mr-6">
                      <p className="labeConnex1 text-center">Modification du profile</p>
                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Prénom :</label>
                          <input
                            type="text"
                            placeholder=""
                            className="inputConnexion input input-info bg-gray-50"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Nom :</label>
                          <input
                            type="text"
                            placeholder=""
                            className="inputConnexion input input-info bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Grade :</label>
                          <select className="inputConnexion select select-info bg-gray-50">
                            <option value=""></option>
                            <option>L1</option>
                            <option>L2</option>
                            <option>L3</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Fonction :</label>
                          <select className="inputConnexion select select-info bg-gray-50">
                            <option value=""></option>
                            <option>L1</option>
                            <option>L2</option>
                            <option>L3</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-3 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Division :</label>
                          <select className="inputConnexion select select-info bg-gray-50">
                            <option value=""></option>
                            <option>L1</option>
                            <option>L2</option>
                            <option>L3</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">E-mail :</label>
                          <input
                            type="email"
                            placeholder=""
                            className="inputConnexion input input-info bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Corps :</label>
                          <input
                            type="text"
                            placeholder=""
                            className="inputConnexion input input-info bg-gray-50"
                          />
                        </div>
                      </div>

                      <button className="btnConnexion mx-auto block">Enregistrer</button>
                    </div>
                  </div>
                </form>
              </div>
            </dialog>
            <button
              className="btnDemande btn btn-dash"
              onClick={() => document.getElementById("my_modal").showModal()}
            >
              Changer le mot de passe
            </button>
            <dialog id="my_modal" className="modal">
              <div className="modal-box flex items-center justify-center p-8">
                <form method="dialog" className="flex flex-col items-center justify-center">
                  <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
                    ✕
                  </button>

                  <p className="labeConnex1 mb-6 text-center text-lg">Changement du mot de passe</p>

                  <div className="flex  flex-col ml-24 mr-10 gap-6">
                    <div>
                      <label className="mb-1 block text-left font-serif text-sm">
                        Ancien mot de passe :
                      </label>
                      <input
                        type="password"
                        className="inputConnexion input input-info w-full bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-left font-serif text-sm">
                        Nouveau mot de passe :
                      </label>
                      <input
                        type="password"
                        className="inputConnexion input input-info w-full bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-left font-serif text-sm">
                        Confirmer le nouveau mot de passe :
                      </label>
                      <input
                        type="password"
                        className="inputConnexion input input-info w-full bg-gray-50"
                      />
                    </div>
                  </div>

                  <button className="btnConnexion mt-6">Valider</button>
                </form>
              </div>
            </dialog>
          </div>
        </div>

        <div className="mt-3">
          <div className="divPorfil rounded-lg">
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Matricule:</span>&emsp;
              <span className="text-black">48798</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Fonction:</span>&emsp;
              <span className="text-black">Chef</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Division:</span>&emsp;
              <span className="text-black">CIR</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Corps:</span>&emsp;
              <span className="text-black">J08A</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Grade:</span>&emsp;
              <span className="text-black">ST0E</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">E-mail:</span>&emsp;
              <span className="text-black">fahazavanaandriantsoa@gmail.com</span>
            </label>
          </div>

          <div className="divPorfil mt-4 rounded-lg">
            <div className="mb-4 flex items-center">
              <label className="labelProfil">Congé:</label>
              <select className="select select-info ml-4 w-32">
                <option selected>2025</option>
                <option>2024</option>
                <option>2023</option>
                <option>cumul</option>
              </select>
            </div>

            <div className="flex w-full text-center">
              <div className="flex-1">
                <p className="labelProfil">Solde acquis</p>
                <p className="valueConge">30 jours</p>
              </div>
              <div className="flex-1">
                <p className="labelProfil">Jours utilisés</p>
                <p className="valueConge">12 jours</p>
              </div>
              <div className="flex-1">
                <p className="labelProfil">Solde restant</p>
                <p className="valueConge">18 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
