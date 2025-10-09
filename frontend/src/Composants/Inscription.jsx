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

            {/* Première ligne : Matricule + Nom */}
            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Matricule :</label>
                <input
                  type="text"
                  required
                  placeholder=""
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^[0-9]+$"
                  title="Seules les chiffres sont autorisés"
                />
                <p className="validator-hint">Seules les chiffres sont autorisés</p>
              </div>
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Nom :</label>
                <input
                  required
                  type="text"
                  placeholder=""
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^[A-Za-z\séùèà]+$"
                  minLength="6"
                  maxLength="30"
                  title="Seules les lettres sont autorisées (6-30 caractères)"
                />
                <p className="legendMDP validator-hint">
                  Seules les lettres sont autorisées et 6-30 caractères
                </p>
              </div>
            </div>

            {/* Deuxième ligne : Prénom + Corps */}
            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Prénom :</label>
                <input
                  required
                  type="text"
                  placeholder=""
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^[A-Za-z\séùèà]+$"
                  minLength="2"
                  maxLength="30"
                  title="Seules les lettres sont autorisées (2-30 caractères)"
                />
                <p className="legendMDP validator-hint">
                  Seules les lettres sont autorisées et 6-30 caractères{" "}
                </p>
              </div>
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

            {/* Troisième ligne : Grade + Fonction */}
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

            {/* Quatrième ligne : Division + Email */}
            <div className="flex gap-10">
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
                <div className="legendMDP validator-hint">Adresse mail invalide</div>
              </div>
            </div>

            {/* Cinquième ligne : Mot de passe + Confirmation */}
            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Mot de passe :</label>
                <input
                  required
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#\s*?&]{8,}$"
                  title="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                  minLength="8"
                  maxLength="20"
                />
                <p className="legendMDP validator-hint">
                  Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et
                  un caractère spécial
                </p>
              </div>
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">
                  Confirmer le mot de passe :
                </label>
                <input
                  type="password"
                  placeholder=""
                  value={confirmMDP}
                  onChange={(e) => setConfirmMDP(e.target.value)}
                  className="inputConnexion input input-info bg-gray-50"
                />
                <p className="legendMDP mt-2">
                  {isValid ? "" : "Les mots de passe ne correspondent pas"}
                </p>
              </div>
            </div>

            {/* Bouton et lien retour */}
            <button className="btnConnexion mx-auto block">s'inscrire</button>
            <p
              className="retourConnexion mx-auto mt-1 w-28 cursor-pointer text-center font-serif transition duration-1000 hover:underline"
              onClick={activeDefil}
            >
              j'ai déja un compte
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
