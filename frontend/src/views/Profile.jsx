import { useState, useEffect } from "react";
export default function Accueil() {
  const [password, setPassword] = useState("");
  const [confirmMDP, setConfirmMDP] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (confirmMDP.length > 0) {
      setIsValid(password === confirmMDP);
    }
  }, [password, confirmMDP]);
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
                <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2" onClick={() => document.getElementById("my_modal_3").close()}>
                  ✕
                </button>
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}

                  <div className="blocks-center">
                    <div className="ml-6 mr-6">
                      <p className="labeConnex1 text-center">Modification du profile</p>
                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Nom :</label>
                          <input
                            required
                            type="text"
                            placeholder=""
                            className="inputConnexion validator input input-info bg-gray-50"
                            pattern="^[A-Za-z\séùèà]+$"
                            minlength="6"
                            maxlength="30"
                            title="Seules les lettres sont autorisées (6-30 caractères)"
                          />
                          <p className="validator-hint">Seules les lettres sont autorisées</p>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Prénom :</label>
                          <input
                            required
                            type="text"
                            placeholder=""
                            className="inputConnexion validator input input-info bg-gray-50"
                            pattern="^[A-Za-z\séùèà]+$"
                            minlength="2"
                            maxlength="30"
                            title="Seules les lettres sont autorisées (2-30 caractères)"
                          />
                          <p className="validator-hint">Seules les lettres sont autorisées</p>
                        </div>
                      </div>

                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Grade :</label>
                          <select className="inputConnexion select select-info bg-gray-50" required>
                            <option value=""></option>
                            <option>L1</option>
                            <option>L2</option>
                            <option>L3</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Fonction :</label>
                          <select className="inputConnexion select select-info bg-gray-50" required>
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
                          <select className="inputConnexion select select-info bg-gray-50" required>
                            <option value=""></option>
                            <option>L1</option>
                            <option>L2</option>
                            <option>L3</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">E-mail :</label>
                          <input
                            required
                            type="email"
                            placeholder=""
                            className="inputConnexion validator input input-info bg-gray-50"
                          />
                          <div className="validator-hint">Adresse mail invalide</div>
                        </div>
                      </div>
                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Corps :</label>
                          <input
                            required
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
                <button
                  className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
                  onClick={() => document.getElementById("my_modal").close()}
                >
                  ✕
                </button>
                <form method="dialog" className="flex flex-col items-center justify-center">
                  <p className="labeConnex1 mb-6 text-center text-lg">Changement du mot de passe</p>

                  <div className="ml-36 mr-10 flex flex-col">
                    <div className="mb-5">
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
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        type="password"
                        placeholder=""
                        className="inputConnexion validator input input-info bg-gray-50"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#\s?&]{8,}$"
                        title="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                        minLength="8"
                        maxLength="20"
                      />
                      <p className="legendMDP validator-hint">
                        Doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                        chiffre et un caractère spécial
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-left font-serif text-sm">
                        Confirmer le nouveau mot de passe :
                      </label>
                      <input
                        value={confirmMDP}
                        onChange={(e) => setConfirmMDP(e.target.value)}
                        type="password"
                        className="inputConnexion input input-info w-full bg-gray-50"
                      />
                      <p className="legendMDP mt-2">
                        {isValid ? "" : "Les mots de passe ne correspondent pas"}
                      </p>
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
