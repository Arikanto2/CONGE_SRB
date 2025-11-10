import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "../Style/Login.css";

export default function Profile() {
  const [password, setPassword] = useState("");
  const [confirmMDP, setConfirmMDP] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTous, setIsTous] = useState(false);
  const [_congeAnnuel, setCongeAnnuel] = useState([]);
  const [Annee, setAnnee] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [congeSelectionne, setCongeSelectionne] = useState(null);

  const { user, token, updateUser } = useAuth();
  useEffect(() => {
    if (_congeAnnuel && _congeAnnuel.length > 0 && selectedAnnee) {
      const conge = _congeAnnuel.find((c) => c.ANNEE === selectedAnnee);
      setCongeSelectionne(conge || null);
    }
  }, [selectedAnnee, _congeAnnuel]);

  useEffect(() => {
    const fetchCongeAnnuel = async () => {
      try {
        if (token) {
          console.log("Token disponible, récupération des congés annuels...");
          const response = await axios.get("http://localhost:8000/api/conge-annuel");

          setCongeAnnuel(response.data);
          console.log("Données congés annuels récupérées:", response.data);

          // Extraire les années et les mettre dans Annee
          const annees = response.data.map((element) => element.ANNEE);
          // Supprimer les doublons si nécessaire et trier par ordre décroissant
          const anneesUniques = [...new Set(annees)].sort((a, b) => b - a);
          setAnnee(anneesUniques);
          console.log("Années extraites:", anneesUniques);

          // Sélectionner la première année par défaut
          if (anneesUniques.length > 0) {
            setSelectedAnnee(anneesUniques[0]);
          }
        } else {
          console.log("Aucun token disponible");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des congés annuels:", error);
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
        }
      }
    };

    fetchCongeAnnuel();
  }, [token]);

  const toggleTous = (value) => {
    if (value === "Cumul") {
      setIsTous(true);
      setSelectedAnnee("Cumul");
    } else {
      setIsTous(false);
      setSelectedAnnee(value);
    }
  };
  const API_URL = "http://localhost:8000/api/modification";

  const [donneepers, setDonneepers] = useState({
    IM_ANC: user?.IM || "",
    NOM: user?.NOM || "",
    PRENOM: user?.PRENOM || "",
    CORPS: user?.CORPS || "",
    GRADE: user?.GRADE || "",
    FONCTION: user?.FONCTION || "",
    DIVISION: user?.DIVISION || "",
    EMAIL: user?.EMAIL || "",
    CONTACT: user?.CONTACT || "",
    PHOTO_PROFIL: user?.PHOTO_PROFIL || "",
  });
  const [donneeMDP, setDonneeMDP] = useState({
    ANCIEN_MDP: "",
    new_MDP: "",
    confirm_MDP: "",
  });
  // Fonction de validation du mot de passe
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#\s?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlechangeMPD = (key, value) => {
    setDonneeMDP({ ...donneeMDP, [key]: value });
  };

  const submitFormMDP = async () => {
    // Validation du mot de passe
    if (!validatePassword(password)) {
      alert(
        "Le nouveau mot de passe ne respecte pas les critères requis.\n\nIl doit contenir au moins :\n- 8 caractères\n- Une lettre majuscule\n- Une lettre minuscule\n- Un chiffre\n- Un caractère spécial (@$!%*#?&)"
      );
      return;
    }

    if (!isValid) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    console.log("submitFormMDP called with data:", donneeMDP);
    console.log("Token:", token);
    setIsSubmitting(true);

    if (!token) {
      alert("Vous devez être connecté pour modifier votre mot de passe");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/verify-password", {
        ANCIEN_MDP: donneeMDP.ANCIEN_MDP,
      });
      if (!response.data.valid) {
        alert(`L'ancien mot de passe est incorrect.`);
        setIsSubmitting(false);
        return;
      }
      const response1 = await axios.post("http://localhost:8000/api/change-password", donneeMDP);
      console.log("Response from server:", response1.data);

      alert("Mot de passe modifié avec succès");
      document.getElementById("my_modal").close();
      setIsSubmitting(false);
    } catch (error) {
      console.error("Erreur lors de la modification du mot de passe :", error);
      setIsSubmitting(false);

      if (error.response?.status === 401) {
        alert("Erreur d'authentification. Veuillez vous reconnecter.");
      } else if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join("\n");
        alert(`${messages}`);
      } else {
        alert(error.response?.data?.message || "Erreur lors de la modification du mot de passe.");
      }
    }
  };

  // Mettre à jour les données quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setDonneepers({
        IM_ANC: user?.IM || "",
        NOM: user?.NOM || "",
        PRENOM: user?.PRENOM || "",
        CORPS: user?.CORPS || "",
        GRADE: user?.GRADE || "",
        FONCTION: user?.FONCTION || "",
        DIVISION: user?.DIVISION || "",
        EMAIL: user?.EMAIL || "",
        CONTACT: user?.CONTACT || "",
        PHOTO_PROFIL: user?.PHOTO_PROFIL || "",
      });
    }
  }, [user]);

  // Fonction de validation
  const handleChange = (key, value) => {
    setDonneepers({ ...donneepers, [key]: value });
  };

  const submitForm = async () => {
    console.log("submitForm called with data:", donneepers);
    console.log("Token:", token);
    setIsSubmitting(true);

    if (!token) {
      alert("Vous devez être connecté pour modifier votre profil");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in donneepers) {
        formData.append(key, donneepers[key]);
      }

      const response = await axios.post(API_URL, formData);
      console.log("Response from server:", response.data);

      // Mettre à jour le contexte d'authentification avec les nouvelles données
      updateUser(response.data.token, response.data.personnel);

      alert("Profil modifié avec succès");
      document.getElementById("my_modal_3").close();
      setIsSubmitting(false);

      // Optionnel : rafraîchir la page pour refléter les changements
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la modification du profil :", error);
      setIsSubmitting(false);

      if (error.response?.status === 401) {
        alert("Erreur d'authentification. Veuillez vous reconnecter.");
      } else if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join("\n");
        alert(`${messages}`);
      } else {
        alert(error.response?.data?.message || "Erreur lors de la modification du profil.");
      }
    }
  };

  useEffect(() => {
    // Validation de la correspondance des mots de passe
    if (confirmMDP.length > 0) {
      setIsValid(password === confirmMDP);
    }

    // Validation du format du mot de passe
    if (password.length > 0) {
      setIsPasswordValid(validatePassword(password));
    } else {
      setIsPasswordValid(false);
    }
  }, [password, confirmMDP]);

  return (
    <div className="card card-xs mx-8 h-full bg-base-100 pb-3 shadow-sm">
      <div className="card-body ml-5 mr-5 h-full">
        <div className="divEntete flex items-center gap-5">
          <div className="avatar">
            <div className="w-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              <img src={`http://localhost:8000/storage/profile_photos/${donneepers.PHOTO_PROFIL}`} />
              

            </div>
          </div>
          <p className="nomUtil">
            {" "}
            {(user?.NOM?.toUpperCase() || "") + " " + (user?.PRENOM || "")}{" "}
          </p>
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
                  }}
                >
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
                            value={donneepers.NOM}
                            onChange={(e) => handleChange("NOM", e.target.value)}
                            title="Seules les lettres sont autorisées (2-30 caractères)"
                          />
                          <p className="legendMDP validator-hint">
                            Seules les lettres sont autorisées (2 à 30 caractères)
                          </p>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Prénom :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre prénom"
                            className="inputConnexion validator input input-info bg-gray-50"
                            value={donneepers.PRENOM}
                            onChange={(e) => handleChange("PRENOM", e.target.value)}
                            title="Seules les lettres sont autorisées (2-30 caractères)"
                          />

                          <p className="legendMDP validator-hint">
                            Seules les lettres sont autorisées (2 à 30 caractères)
                          </p>
                        </div>
                      </div>

                      <div className="mb-5 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Corps :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre corps"
                            className="inputConnexion input input-info bg-gray-50"
                            value={donneepers.CORPS}
                            onChange={(e) => handleChange("CORPS", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Grade :</label>
                          <input
                            required
                            type="text"
                            placeholder="Entrez votre grade"
                            className="inputConnexion input input-info bg-gray-50"
                            value={donneepers.GRADE}
                            onChange={(e) => handleChange("GRADE", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Troisième ligne : Grade + Fonction */}
                      <div className="mb-5 flex gap-10">
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
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Division :</label>
                          <select
                            className="inputConnexion select select-info bg-gray-50"
                            value={donneepers.DIVISION}
                            onChange={(e) => handleChange("DIVISION", e.target.value)}
                            required
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
                            <option value="Centre informatique régional">
                              Centre informatique régional
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Quatrième ligne : Division + E-mail */}
                      <div className="flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">E-mail :</label>
                          <input
                            required
                            type="email"
                            placeholder="Entrez votre adresse e-mail"
                            className="inputConnexion validator input input-info bg-gray-50"
                            value={donneepers.EMAIL}
                            onChange={(e) => handleChange("EMAIL", e.target.value)}
                          />

                          <div className="legendMDP validator-hint">
                            Format: exemple@domaine.com
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">Contact :</label>
                          <div className="relative w-full">
                            <span className="pointer-events-none absolute left-0 top-4 z-20 h-8 -translate-y-1/2 rounded-md border border-solid border-gray-400 bg-gray-100 pl-1 pt-1 text-sm">
                              +261
                            </span>
                            <input
                              required
                              type="number"
                              minLength="9"
                              maxLength="9"
                              value={donneepers.CONTACT}
                              onChange={(e) => handleChange("CONTACT", e.target.value)}
                              title="Seuls les chiffres sont autorisés (9 chiffres après +261)"
                              className="inputConnexion1 validator input input-info z-10 w-full bg-gray-50 px-10 py-2"
                              placeholder="Numéro sans indicatif"
                            />

                            <p className="legendMDP validator-hint">9 chiffres requis.</p>
                          </div>
                        </div>
                      </div>

                      {/* Cinquième ligne : Contact + Photo */}
                      <div className="relative mb-2 flex gap-10">
                        <div className="flex-1">
                          <label className="block text-left font-serif text-sm">
                            Photo de profil :
                          </label>
                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleChange("PHOTO_PROFIL", e.target.files[0]);
                              }
                              else {
                                handleChange("PHOTO_PROFIL", null);
                              }
                            }}
                            className="input-info file-input h-8 w-48"
                            accept=".jpg,.jpeg,.png,.gif"
                          />
                        </div>
                        <div className="flex-1">
                          {/* Espace vide pour maintenir l'alignement */}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btnConnexion mx-auto block"
                        disabled={isSubmitting}
                        onClick={submitForm}
                      >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                      </button>
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
                <form
                  method="dialog"
                  className="flex flex-col items-center justify-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitFormMDP();
                  }}
                >
                  <p className="labeConnex1 mb-6 text-center text-lg">Changement du mot de passe</p>

                  <div className="ml-36 mr-10 flex flex-col">
                    <div className="mb-5">
                      <label className="mb-1 block text-left font-serif text-sm">
                        Ancien mot de passe :
                      </label>
                      <input
                        required
                        type="password"
                        placeholder="Entrez votre ancien mot de passe"
                        className="inputConnexion input input-info w-full bg-gray-50"
                        onChange={(e) => handlechangeMPD("ANCIEN_MDP", e.target.value)}
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
                          handlechangeMPD("new_MDP", e.target.value);
                        }}
                        type="password"
                        placeholder="Entrez un nouveau mot de passe"
                        className={`inputConnexion validator input bg-gray-50 ${
                          password.length > 0
                            ? isPasswordValid
                              ? "input-success"
                              : "input-error"
                            : "input-info"
                        }`}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#\s?&]{8,}$"
                        title="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                        minLength="8"
                        maxLength="20"
                        required
                      />
                      <p
                        className={`legendMDP validator-hint ${
                          password.length > 0 && !isPasswordValid ? "text-error" : ""
                        }`}
                      >
                        Doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                        chiffre et un caractère spécial
                        {password.length > 0 && isPasswordValid && (
                          <span className="ml-2 text-success">✓ Valide</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-left font-serif text-sm">
                        Confirmer le nouveau mot de passe :
                      </label>
                      <input
                        value={confirmMDP}
                        onChange={(e) => {
                          setConfirmMDP(e.target.value);
                          handlechangeMPD("confirm_MDP", e.target.value);
                        }}
                        required
                        type="password"
                        placeholder="Confirmez le nouveau mot de passe"
                        className={`inputConnexion input w-full bg-gray-50 ${
                          confirmMDP.length > 0
                            ? isValid
                              ? "input-success"
                              : "input-error"
                            : "input-info"
                        }`}
                      />
                      <p
                        className={`legendMDP mt-2 ${
                          confirmMDP.length > 0 && !isValid ? "text-error" : ""
                        }`}
                      >
                        {confirmMDP.length > 0 && isValid && (
                          <span className="text-success">✓ Les mots de passe correspondent</span>
                        )}
                        {confirmMDP.length > 0 && !isValid && (
                          <span className="text-error">
                            ✗ Les mots de passe ne correspondent pas
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btnConnexion mx-auto block"
                    disabled={isSubmitting || !isPasswordValid || !isValid || password.length === 0}
                    onClick={submitFormMDP}
                  >
                    {isSubmitting ? "Validation..." : "Valider"}
                  </button>
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
              <select
                className="select select-info ml-4 w-32"
                value={selectedAnnee}
                onChange={(e) => {
                  toggleTous(e.target.value);
                  setSelectedAnnee(e.target.value);
                }}
              >
                {Annee.length === 0 && (
                  <option value="" disabled>
                    Chargement...
                  </option>
                )}
                {Annee.map((annee, index) => (
                  <option key={index} value={annee}>
                    {annee}
                  </option>
                ))}
                <option value="Cumul">Cumul</option>
              </select>
            </div>

            <div className="flex w-full text-center">
              <div className="flex-1">
                <p className="labelProfil">Solde acquis</p>
                <p className="valueConge">{isTous ? Annee.length * 30 + " Jours" : "30 jours"}</p>
              </div>
              <div className="flex-1">
                <p className="labelProfil">Jours utilisés</p>
                <p className="valueConge">
                  <p className="valueConge">
                    {congeSelectionne?.NBR_CONGE
                      ? 30 - congeSelectionne.NBR_CONGE
                      : _congeAnnuel.reduce(
                          (somme, element) =>
                            somme + (element.NBR_CONGE ? 30 - element.NBR_CONGE : 0),
                          0
                        )}
                  </p>
                </p>
              </div>
              <div className="flex-1">
                <p className="labelProfil">Solde restant</p>
                <p className="valueConge">
                  {congeSelectionne?.NBR_CONGE
                    ? congeSelectionne.NBR_CONGE
                    : _congeAnnuel.reduce((somme, element) => somme + (element.NBR_CONGE || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
