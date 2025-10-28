import { useState, useEffect } from "react";
import {useAuth} from "../hooks/useAuth";
export default function Profile() {
  const [password, setPassword] = useState("");
  const [confirmMDP, setConfirmMDP] = useState("");
  const [isValid, setIsValid] = useState(true);

  const {user} = useAuth();
  


  useEffect(() => {
    if (confirmMDP.length > 0) {
      setIsValid(password === confirmMDP);
    }
  }, [password, confirmMDP]);

  return (
    <div className="card card-xs mx-8 h-full bg-base-100 pb-3 shadow-sm">
      <div className="card-body ml-5 mr-5 h-full">
        <div className="divEntete flex items-center gap-5">
          <div className="avatar">
            <div className="w-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
            </div>
          </div>
          <p className="nomUtil">  {(user?.NOM?.toUpperCase() || "") + " " + (user?.PRENOM || "")} </p>
          <div className="flex gap-3">
            <button
              className="btnDemande btn btn-dash"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Modifier le profil
            </button>

            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <button
                  className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
                  onClick={() => document.getElementById("my_modal_3").close()}
                >
                  ✕
                </button>
                <form method="dialog">
                  <div className="blocks-center">
                    <div className="ml-6 mr-6">
                      <p className="labeConnex1 text-center">Modification du profil</p>

                      {/* Première ligne : Nom + Prénom */}
                      <div className="flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Nom :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre nom"
                            className="inputConnexion validator input input-info bg-gray-50"
                            pattern="^[A-Za-z\séùèà]+$"
                            minLength="6"
                            maxLength="30"
                            title="Seules les lettres sont autorisées (6-30 caractères)"
                          />
                          <p className="legendMDP validator-hint">
                            Seules les lettres sont autorisées (6 à 30 caractères)
                          </p>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Prénom :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre prénom"
                            className="inputConnexion validator input input-info bg-gray-50"
                            pattern="^[A-Za-z\séùèà]+$"
                            minLength="2"
                            maxLength="30"
                            title="Seules les lettres sont autorisées (2-30 caractères)"
                          />
                          <p className="legendMDP validator-hint">
                            Seules les lettres sont autorisées (2 à 30 caractères)
                          </p>
                        </div>
                      </div>

                      {/* Deuxième ligne : Matricule + Corps */}
                      <div className="flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Matricule :</label>
                          <input
                            type="text"
                            required
                            placeholder="Entrez votre matricule"
                            className="inputConnexion validator input input-info bg-gray-50"
                            pattern="^[0-9]{6}$"
                            title="6 chiffres requis"
                          />
                          <p className="validator-hint legendMDP">Seuls les chiffres sont autorisés (6 requis)</p>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Corps :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre corps"
                            className="inputConnexion input input-info bg-gray-50"
                          />
                        </div>
                      </div>

                      {/* Troisième ligne : Grade + Fonction */}
                      <div className="mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Grade :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre grade"
                            className="inputConnexion input input-info bg-gray-50"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Fonction :</label>
                          <select className="inputConnexion select select-info bg-gray-50" required>
                            <option value="">Sélectionnez une fonction</option>
                            <option>Chef de service</option>
                            <option>Chef de division</option>
                            <option>Personnel</option>
                          </select>
                        </div>
                      </div>

                      {/* Quatrième ligne : Division + E-mail */}
                      <div className="flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Division :</label>
                          <select className="inputConnexion select select-info bg-gray-50" required>
                            <option value="">Sélectionnez une division</option>
                            <option>L1</option>
                            <option>L2</option>
                            <option>Centre Informatique</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">E-mail :</label>
                          <input
                            required
                            type="email"
                            placeholder="Entrez votre adresse e-mail"
                            className="inputConnexion validator input input-info bg-gray-50"
                          />
                          <div className="legendMDP validator-hint">Adresse e-mail invalide</div>
                        </div>
                      </div>

                      {/* Cinquième ligne : Contact + Photo */}
                      <div className="relative mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Contact :</label>
                          <div className="relative w-full">
                            <span className="pointer-events-none absolute left-0 top-4 z-20 h-8 -translate-y-1/2 rounded-md border border-solid border-gray-400 bg-gray-100 pl-1 pt-1 text-sm">
                              +261
                            </span>
                            <input
                              required
                              type="text"
                              pattern="^[0-9]{9}$"
                              minLength={9}
                              maxLength={9}
                              title="Seuls les chiffres sont autorisés (9 chiffres après +261)"
                              className="inputConnexion1 validator input input-info z-10 w-full bg-gray-50 px-10 py-2"
                              placeholder="Numéro sans indicatif"
                            />
                            <p className="legendMDP validator-hint">
                              Seuls les chiffres sont autorisés (9 chiffres requis)
                            </p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Photo de profil :</label>
                          <input
                            type="file"
                            className="input-info file-input h-8 w-48"
                            accept=".jpg,.jpeg,.png,.gif"
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
                        placeholder="Entrez votre ancien mot de passe"
                        className="inputConnexion input input-info w-full bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-left font-serif text-sm">
                        Nouveau mot de passe :
                      </label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Entrez un nouveau mot de passe"
                        className="inputConnexion validator input input-info bg-gray-50"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#\s?&]{8,}$"
                        title="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                        minLength="8"
                        maxLength="20"
                      />
                      <p className="legendMDP validator-hint">
                        Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
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
                        placeholder="Confirmez le nouveau mot de passe"
                        className="inputConnexion input input-info w-full bg-gray-50"
                      />
                      <p className="legendMDP mt-2">
                        {isValid ? "" : "Les mots de passe ne correspondent pas."}
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
              <span className="labelProfil">Matricule :</span>&emsp;
              <span className="text-black">{user?.IM}</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Fonction :</span>&emsp;
              <span className="text-black">{user?.FONCTION}</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Division :</span>&emsp;
              <span className="text-black">{user?.DIVISION}</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Corps :</span>&emsp;
              <span className="text-black">{user?.CORPS}</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Grade :</span>&emsp;
              <span className="text-black">{user?.GRADE}</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">E-mail :</span>&emsp;
              <span className="text-black">{user?.EMAIL}</span>
            </label>
            <label className="mb-2 block text-left font-serif text-sm">
              <span className="labelProfil">Contact :</span>&emsp;
              <span className="text-black">{user?.CONTACT}</span>
            </label>
          </div>

          <div className="divPorfil mt-4 rounded-lg">
            <div className="mb-4 flex items-center">
              <label className="labelProfil">Congé :</label>
              <select className="select select-info ml-4 w-32">
                <option selected>2025</option>
                <option>2024</option>
                <option>2023</option>
                <option>Cumul</option>
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
