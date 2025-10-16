import React, { useState, useEffect } from "react";

export default function Inscription({ activeDefil }) {
  const [password, setPassword] = useState("");
  const [confirmMDP, setConfirmMDP] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (confirmMDP.length > 0) {
      setIsValid(password === confirmMDP);
    } else {
      setIsValid(true);
    }
  }, [password, confirmMDP]);

  return (
    <>
      <div className="blocks-center">
        <form
          onSubmit={(e) => {
            if (!e.target.checkValidity()) {
              e.preventDefault();
              alert("Veuillez remplir correctement tous les champs !");
            }
          }}
        >
          <div className="ml-14 mr-14">
            <p className="labeConnex1 text-center">Inscription</p>

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
                  pattern="^[0-9]+$"
                  minLength="6"
                  maxLength="6"
                  title="Seuls les chiffres sont autorisés"
                />
                <p className="legendMDP validator-hint">
                  Seuls les chiffres sont autorisés (6 chiffres requis)
                </p>
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
                  <option value="" disabled>Sélectionnez votre fonction</option>
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
                  <option value="" disabled>Sélectionnez une division</option>
                  <option>Bureau du Secrétariat</option>
                  <option>Cellule d'appui et coordination</option>
                  <option>Bureau des affaires administratifs et financières</option>
                  <option>Patrimoine de l'état</option>
                  <option>Chargée de finances locales et des EPN</option>
                  <option>Exécution budgetaire et remboursement des frais médicaux</option>
                  <option>Centre informatique régional</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">E-mail :</label>
                <input
                  required
                  type="email"
                  placeholder="exemple@domaine.com"
                  className="inputConnexion validator input input-info bg-gray-50"
                />
                <div className="legendMDP validator-hint">Adresse e-mail invalide</div>
              </div>
            </div>

            {/* Cinquième ligne : Contact + Photo */}
            <div className="relative flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Contact :</label>
                <div className="relative w-full">
                  <span className="pointer-events-none absolute left-0 top-4 z-20 h-8 -translate-y-1/2 rounded-md border border-solid border-gray-400 bg-gray-100 pl-1 pt-1 text-sm">
                    +261
                  </span>
                  <input
                    required
                    pattern="^[0-9]+$"
                    type="text"
                    minLength={9}
                    maxLength={9}
                    title="Seuls les chiffres sont autorisés (9 chiffres requis)"
                    className="inputConnexion1 validator input input-info z-10 w-full bg-gray-50"
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

            {/* Sixième ligne : Mot de passe + Confirmation */}
            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Mot de passe :</label>
                <input
                  required
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#\s*?&]{8,}$"
                  title="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                  minLength="8"
                  maxLength="20"
                />
                <p className="legendMDP validator-hint">
                  Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
                </p>
              </div>
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">
                  Confirmer le mot de passe :
                </label>
                <input
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmMDP}
                  onChange={(e) => setConfirmMDP(e.target.value)}
                  className="inputConnexion input input-info bg-gray-50"
                />
                <p className="legendMDP mt-1">
                  {isValid ? "" : "Les mots de passe ne correspondent pas."}
                </p>
              </div>
            </div>

            {/* Bouton et lien retour */}
            <button className="btnConnexion mx-auto block">S'inscrire</button>
            <p
              className="retourConnexion mx-auto w-28 cursor-pointer text-center font-serif transition duration-1000 hover:underline"
              onClick={activeDefil}
            >
              J'ai déjà un compte
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
