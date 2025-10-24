import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Inscription({ activeDefil }) {
  const [password, setPassword] = useState("");
  const [confirmMDP, setConfirmMDP] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null); // État pour le fichier
  const API_URL = "http://localhost:8000/api/inscription";
  const [donneepers, setDonneepers] = useState({
    IM: "",
    IM_CHEF: "",
    NOM: "",
    PRENOM: "",
    CORPS: "",
    GRADE: "",
    FONCTION: "",
    DIVISION: "",
    EMAIL: "",
    CONTACT: "",
    PHOTO_PROFIL: "",
    MDP: "",
  });

  const submitInscription = async () => {
    if (!isValid) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    // Debug: afficher les données exactes envoyées
    console.log("=== DONNÉES ENVOYÉES ===");
    console.log("donneepers:", donneepers);
    console.log(
      "Champs vides:",
      Object.keys(donneepers).filter((key) => !donneepers[key])
    );
    console.log("========================");

    try {
      const response = await axios.post(API_URL, donneepers);
      alert("Inscription réussie !");
      console.log("Réponse:", response.data);

      // Reset du formulaire en cas de succès
      setDonneepers({
        IM: "",
        IM_CHEF: "",
        NOM: "",
        PRENOM: "",
        CORPS: "",
        GRADE: "",
        FONCTION: "",
        DIVISION: "",
        EMAIL: "",
        CONTACT: "",
        PHOTO_PROFIL: "",
        MDP: "",
      });
      setPassword("");
      setConfirmMDP("");
      setSelectedFile(null); // Reset du fichier sélectionné
    } catch (err) {
      console.error("=== ERREUR COMPLÈTE ===");
      console.error("Erreur:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        console.error("Data:", err.response.data);

        if (err.response.status === 422 && err.response.data.errors) {
          const errors = err.response.data.errors;
          console.error("Erreurs de validation:", errors);

          let errorMessage = "Erreurs de validation trouvées:\n\n";
          Object.keys(errors).forEach((field) => {
            errorMessage += `• ${field}: ${errors[field].join(", ")}\n`;
          });

          alert(errorMessage);
        } else {
          alert(`Erreur ${err.response.status}: ${err.response.data.message || "Erreur inconnue"}`);
        }
      } else if (err.request) {
        console.error("Pas de réponse reçue:", err.request);
        alert("Erreur de connexion: Aucune réponse du serveur");
      } else {
        console.error("Erreur de configuration:", err.message);
        alert(`Erreur: ${err.message}`);
      }
      console.error("=======================");
    }
  };

  function handleChange(key, value) {
    setDonneepers({ ...donneepers, [key]: value });
  }

  useEffect(() => {
    if (confirmMDP.length > 0) {
      setIsValid(password === confirmMDP);
    } else {
      setIsValid(true);
    }
  }, [password, confirmMDP]);

  // useEffect pour convertir automatiquement le fichier en nom de fichier (string)
  useEffect(() => {
    if (selectedFile) {
      console.log("Fichier sélectionné:", selectedFile.name);
      setDonneepers((prev) => ({
        ...prev,
        PHOTO_PROFIL: selectedFile.name,
      }));
    } else {
      setDonneepers((prev) => ({
        ...prev,
        PHOTO_PROFIL: "",
      }));
    }
  }, [selectedFile]);

  return (
    <>
      <div className="blocks-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitInscription();
          }}
        >
          <div className="ml-14 mr-14">
            <p className="labeConnex1 text-center">Inscription</p>

            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Nom :</label>
                <input
                  required
                  type="text"
                  placeholder="Entrez votre nom"
                  value={donneepers.NOM}
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^[A-Za-z\séùèà]+$"
                  minLength="6"
                  maxLength="30"
                  title="Seules les lettres sont autorisées (6-30 caractères)"
                  onChange={(e) => handleChange("NOM", e.target.value)}
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
                  value={donneepers.PRENOM}
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^[A-Za-z\séùèà]+$"
                  minLength="2"
                  maxLength="30"
                  title="Seules les lettres sont autorisées (2-30 caractères)"
                  onChange={(e) => handleChange("PRENOM", e.target.value)}
                />
                <p className="legendMDP validator-hint">
                  Seules les lettres sont autorisées (2 à 30 caractères)
                </p>
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Matricule :</label>
                <input
                  type="text"
                  required
                  placeholder="Entrez votre matricule"
                  value={donneepers.IM}
                  className="inputConnexion validator input input-info bg-gray-50"
                  pattern="^[0-9]{6}$"
                  minLength="6"
                  maxLength="6"
                  title="Seuls les chiffres sont autorisés"
                  onChange={(e) => handleChange("IM", e.target.value)}
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
                  value={donneepers.CORPS}
                  className="inputConnexion input input-info bg-gray-50"
                  onChange={(e) => handleChange("CORPS", e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2 flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Grade :</label>
                <input
                  required
                  type="text"
                  placeholder="Entrez votre grade"
                  value={donneepers.GRADE}
                  className="inputConnexion input input-info bg-gray-50"
                  onChange={(e) => handleChange("GRADE", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Fonction :</label>
                <select
                  className="inputConnexion select select-info bg-gray-50"
                  required
                  value={donneepers.FONCTION}
                  onChange={(e) => handleChange("FONCTION", e.target.value)}
                >
                  <option value="" disabled>
                    Sélectionnez votre fonction
                  </option>
                  <option value="Chef de service">Chef de service</option>
                  <option value="Chef de division">Chef de division</option>
                  <option value="Personnel">Personnel</option>
                </select>
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Division :</label>
                <select
                  className="inputConnexion select select-info bg-gray-50"
                  required
                  value={donneepers.DIVISION}
                  onChange={(e) => handleChange("DIVISION", e.target.value)}
                >
                  <option value="" disabled>
                    Sélectionnez une division
                  </option>
                  <option value="Bureau du Secrétariat">Bureau du Secrétariat</option>
                  <option value="Cellule d'appui et coordination">
                    Cellule d'appui et coordination
                  </option>
                  <option value="Bureau des affaires administratifs et financières">
                    Bureau des affaires administratifs et financières
                  </option>
                  <option value="Patrimoine de l'état">Patrimoine de l'état</option>
                  <option value="Chargée de finances locales et des EPN">
                    Chargée de finances locales et des EPN
                  </option>
                  <option value="Exécution budgetaire et remboursement des frais médicaux">
                    Exécution budgetaire et remboursement des frais médicaux
                  </option>
                  <option value="Centre informatique régional">Centre informatique régional</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">E-mail :</label>
                <input
                  required
                  type="email"
                  placeholder="exemple@domaine.com"
                  value={donneepers.EMAIL}
                  className="inputConnexion validator input input-info bg-gray-50"
                  onChange={(e) => handleChange("EMAIL", e.target.value)}
                />
                <div className="legendMDP validator-hint">Adresse e-mail invalide</div>
              </div>
            </div>

            <div className="relative flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Contact :</label>
                <div className="relative w-full">
                  <span className="pointer-events-none absolute left-0 top-4 z-20 h-8 -translate-y-1/2 rounded-md border border-solid border-gray-400 bg-gray-100 pl-1 pt-1 text-sm">
                    +261
                  </span>
                  <input
                    required
                    pattern="^[0-9]{9}$"
                    type="text"
                    value={donneepers.CONTACT}
                    minLength={9}
                    maxLength={9}
                    title="Seuls les chiffres sont autorisés (9 chiffres requis)"
                    className="inputConnexion1 validator input input-info z-10 w-full bg-gray-50"
                    placeholder="Numéro sans indicatif"
                    onChange={(e) => handleChange("CONTACT", e.target.value)}
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file); // Le useEffect s'occupera de convertir en string
                  }}
                />
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex-1">
                <label className="block text-left font-serif text-sm">Mot de passe :</label>
                <input
                  required
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleChange("MDP", e.target.value);
                  }}
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

            <button className="btnConnexion mx-auto block" type="submit">
              S'inscrire
            </button>
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
