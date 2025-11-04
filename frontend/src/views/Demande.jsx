import "../Style/Demande.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function Demande() {
  const { user, token } = useAuth();
  const [donneeDemande, setDonneeDemande] = useState({
    IM: user.IM,
    CATEGORIE: "",
    TYPE: "",
    MOTIF: "",
    DATEDEBUT: "",
    DATEFIN: "",
    LIEU: "",
    INTERIM: "",
    ABSENCE: "",
  });

  const [checkbox, setCheckbox] = useState(false);
  const [categorieAbsence, setCategorieAbsence] = useState("");
  const [titreTypeABS, setTitreTypeABS] = useState("");
  const [isAfficheTypeABS, setIsAfficheTypeABS] = useState(false);
  const [lieuSelectionne, setLieuSelectionne] = useState([]);
  const [debutDate, setDebutDate] = useState("");
  const [finDate, setFinDate] = useState("");
  const [nbrJR, setNbrJR] = useState(0);
  const [errors, setErrors] = useState({});
  const [soldeConge, setSoldeConge] = useState(0);

  const handleChange = (key, value) => {
    console.log(`handleChange appelé: ${key} = ${value}`);
    setDonneeDemande((prev) => {
      const newData = {
        ...prev,
        [key]: value,
      };
      console.log("Nouvelles données:", newData);
      return newData;
    });
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation de la catégorie
    if (!categorieAbsence || categorieAbsence.trim() === "") {
      newErrors.CATEGORIE = "La catégorie d'absence est obligatoire";
    }

    // Validation du type (seulement si le champ est affiché)
    if (isAfficheTypeABS && (!donneeDemande.TYPE || donneeDemande.TYPE.trim() === "")) {
      newErrors.TYPE = "Le type est obligatoire";
    }

    // Validation du motif
    if (!donneeDemande.MOTIF || donneeDemande.MOTIF.trim() === "") {
      newErrors.MOTIF = "Le motif est obligatoire";
    } else if (donneeDemande.MOTIF.length > 500) {
      newErrors.MOTIF = "Le motif ne peut pas dépasser 500 caractères";
    }

    // Validation des dates
    if (!debutDate) {
      newErrors.DATEDEBUT = "La date de début est obligatoire";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(debutDate);
      if (startDate <= today) {
        newErrors.DATEDEBUT = "La date de début doit être supérieure à aujourd'hui";
      }
    }

    if (!finDate) {
      newErrors.DATEFIN = "La date de fin est obligatoire";
    } else if (debutDate && new Date(finDate) < new Date(debutDate)) {
      newErrors.DATEFIN = "La date de fin doit être postérieure ou égale à la date de début";
    }

    // Validation du lieu
    if (lieuSelectionne.length === 0) {
      newErrors.LIEU = "Le lieu de jouissance est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!validateForm()) {
      return;
    }

    const donneeFinale = {
      ...donneeDemande,
      LIEU: lieuSelectionne.join(", "),
      DATEDEBUT: debutDate,
      DATEFIN: finDate,
    };

    try {
      console.log("Données envoyées:", donneeFinale);
      console.log("Token:", token);

      const reponse = await axios.post("http://localhost:8000/api/faire-demande", donneeFinale);

      console.log("Réponse reçue:", reponse.data);
      alert(reponse.data.message);

      // Recharger le solde après une demande réussie
      recupererSolde();

      document.getElementById("my_modal_3").close();
      // Réinitialiser le formulaire
      setDonneeDemande({
        IM: user.IM,
        CATEGORIE: "",
        TYPE: "",
        MOTIF: "",
        DATEDEBUT: "",
        DATEFIN: "",
        LIEU: "",
        INTERIM: "",
        ABSENCE: "",
      });
      setCategorieAbsence("");
      setDebutDate("");
      setFinDate("");
      setLieuSelectionne([]);
      setNbrJR(0);
      setErrors({});
    } catch (err) {
      console.error("Erreur complète:", err);
      console.error("Erreur response:", err.response);
      console.error("Erreur status:", err.response?.status);
      console.error("Erreur data:", err.response?.data);

      // Gestion des erreurs de validation du serveur
      if (err.response?.status === 422 && err.response?.data?.errors) {
        console.log("Erreurs de validation:", err.response.data.errors);
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 400) {
        // Erreur métier (demande en attente, solde insuffisant, etc.)
        alert(err.response.data.message);
      } else if (err.response?.status === 401) {
        // Erreur d'authentification
        alert("Erreur d'authentification. Veuillez vous reconnecter.");
      } else {
        alert(
          "Erreur lors de l'envoi de la demande: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const lieux = [
    "Alaotra-Mangoro",
    "Amoron'i Mania",
    "Analamanga",
    "Analanjirofo",
    "Androy",
    "Anosy",
    "Atsimo-Andrefana",
    "Atsimo-Atsinanana",
    "Atsinanana",
    "Betsiboka",
    "Boeny",
    "Bongolava",
    "Diana",
    "Fitovinany",
    "Haute-Matsiatra",
    "Ihorombe",
    "Itasy",
    "Matsiatra-Ambony",
    "Melaky",
    "Menabe",
    "Sava",
    "Sofia",
    "Vakinankaratra",
    "Vatovavy",
    "A l'étranger",
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

  const getDateDemain = () => {
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    return demain.toISOString().split("T")[0];
  };

  // Fonction pour récupérer le solde depuis l'API
  const recupererSolde = useCallback(async () => {
    try {
      if (!token || !user?.IM) return;

      const response = await axios.get(`http://localhost:8000/api/solde/${user.IM}`);

      const nouveauSolde = response.data.nbr_conge || 0;
      console.log("Solde récupéré:", nouveauSolde);
      setSoldeConge(nouveauSolde);
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
    }
  }, [token, user?.IM]);

  // UseEffect pour récupérer le solde au chargement du composant
  useEffect(() => {
    if (token && user) {
      recupererSolde();
    }
  }, [token, user, recupererSolde]); // Se déclenche quand token ou user change

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
    handleChange("DATEDEBUT", val);

    // Effacer l'erreur de date de début
    if (errors.DATEDEBUT) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.DATEDEBUT;
        return newErrors;
      });
    }

    if (finDate && new Date(val) > new Date(finDate)) {
      setFinDate(val);
      handleChange("DATEFIN", val);
      setNbrJR(1);
    } else if (finDate) {
      const nb = calculerNombreJours(val, finDate);
      setNbrJR(nb);
    }
  };

  const handleFinChange = (val) => {
    // Effacer l'erreur de date de fin
    if (errors.DATEFIN) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.DATEFIN;
        return newErrors;
      });
    }

    if (debutDate && new Date(val) < new Date(debutDate)) {
      setFinDate(debutDate);
      handleChange("DATEFIN", debutDate);
      setNbrJR(1);
    } else {
      setFinDate(val);
      handleChange("DATEFIN", val);
      if (debutDate) setNbrJR(calculerNombreJours(debutDate, val));
    }
  };

  const handleNbrJRChange = (val) => {
    const jours = Number(val) || 0;
    setNbrJR(jours);
    if (debutDate && jours > 0) {
      const dateFin = calculerDateFin(debutDate, jours);
      setFinDate(dateFin);
      handleChange("DATEFIN", dateFin);
    }
  };

  const ajouterLieu = (lieu) => {
    setLieuSelectionne((prev) => {
      const nouv = prev.includes(lieu) ? prev.filter((l) => l !== lieu) : [...prev, lieu];
      handleChange("LIEU", nouv.join(", "));

      // Effacer l'erreur de lieu si des lieux sont sélectionnés
      if (nouv.length > 0 && errors.LIEU) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.LIEU;
          return newErrors;
        });
      }

      return nouv;
    });
  };

  return (
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
              <option value="" disabled>
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
                <button
                  className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
                  onClick={() => document.getElementById("my_modal_3").close()}
                >
                  ✕
                </button>
                <form onSubmit={submitForm}>
                  <p className="labeConnex1 text-center">Formulaire de demande d'absence</p>

                  <div className="mb-3 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700 shadow-md ring-2 ring-blue-500 ring-offset-2">
                        {soldeConge}
                      </div>
                      <span className="text-sm text-gray-600">Jours restants dans votre solde</span>
                    </div>
                  </div>

                  <div className="mb-5 flex gap-20">
                    <div className="flex-1">
                      <label className="block text-left font-serif text-sm">
                        Catégorie d'absence*:
                      </label>
                      <select
                        className={`comboDemande select select-info w-full bg-gray-50 ${errors.CATEGORIE ? "border-2 border-red-500" : ""}`}
                        value={categorieAbsence}
                        onChange={(e) => {
                          setCategorieAbsence(e.target.value);
                          handleChange("CATEGORIE", e.target.value);
                        }}
                        required
                      >
                        <option value="" disabled>
                          Sélectionner
                        </option>
                        <option value="Autorisation d'absence">Autorisation d'absence</option>
                        <option value="Congé">Congé</option>
                        <option value="Permission">Permission</option>
                        <option value="Mission">Mission</option>
                        <option value="Formation">Formation</option>
                        <option value="Repos médical">Repos médical</option>
                      </select>
                      {errors.CATEGORIE && (
                        <p className="mt-1 text-sm text-red-500">{errors.CATEGORIE}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-serif text-sm">Itérim :</label>
                      <input
                        type="text"
                        placeholder="Saisir l'itérim"
                        className="inputDemande input input-info w-full bg-gray-50"
                        value={donneeDemande.INTERIM}
                        onChange={(e) => handleChange("INTERIM", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-5 flex items-end gap-20">
                    {isAfficheTypeABS && (
                      <div className="flex-1">
                        <label className="block text-left font-serif text-sm">
                          {titreTypeABS}*:
                        </label>
                        <select
                          className={`comboDemande select select-info w-full bg-gray-50 ${errors.TYPE ? "border-2 border-red-500" : ""}`}
                          value={donneeDemande.TYPE}
                          onChange={(e) => handleChange("TYPE", e.target.value)}
                          required
                        >
                          <option value="" disabled>
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
                        {errors.TYPE && <p className="mt-1 text-sm text-red-500">{errors.TYPE}</p>}
                      </div>
                    )}
                    <div className="mt-3 flex flex-1 items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox h-5 w-5 border-blue-400 bg-blue-100 checked:bg-blue-600 checked:text-white"
                          checked={checkbox}
                          onChange={(e) => {
                            console.log("Checkbox changé:", e.target.checked);
                            setCheckbox(e.target.checked);
                            if (!e.target.checked) {
                              handleChange("ABSENCE", "");
                              console.log("ABSENCE vidé");
                            }
                          }}
                        />
                      </label>
                      <select
                        className="comboDemande select select-info w-52 bg-gray-50"
                        value={donneeDemande.ABSENCE}
                        onChange={(e) => {
                          console.log("Demi-journée sélectionnée:", e.target.value);
                          handleChange("ABSENCE", e.target.value);
                        }}
                        disabled={!checkbox}
                      >
                        <option value="" disabled>
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
                        className={`textarea textarea-info w-full resize-none ${errors.MOTIF ? "border-2 border-red-500" : ""}`}
                        value={donneeDemande.MOTIF}
                        onChange={(e) => handleChange("MOTIF", e.target.value)}
                        maxLength={500}
                        required
                      />
                      {errors.MOTIF && <p className="mt-1 text-sm text-red-500">{errors.MOTIF}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        {donneeDemande.MOTIF.length}/500 caractères
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 flex gap-20">
                    <div className="flex-1">
                      <label className="block text-left font-serif text-sm">Date début*:</label>
                      <input
                        type="date"
                        value={debutDate}
                        min={getDateDemain()}
                        onChange={(e) => handleDebutChange(e.target.value)}
                        className={`input input-info ${errors.DATEDEBUT ? "border-2 border-red-500" : ""}`}
                        required
                      />
                      {errors.DATEDEBUT && (
                        <p className="mt-1 text-sm text-red-500">{errors.DATEDEBUT}</p>
                      )}
                    </div>
                    <div className="max-w-16 flex-1">
                      <label className="mb-1 block text-left font-serif text-sm">Jours:</label>
                      <input
                        type="number"
                        value={nbrJR}
                        max={15}
                        min={1}
                        onChange={(e) => handleNbrJRChange(e.target.value)}
                        className="input input-info w-14 bg-gray-50 text-center"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-serif text-sm">Date fin*:</label>
                      <input
                        type="date"
                        value={finDate}
                        min={debutDate}
                        onChange={(e) => handleFinChange(e.target.value)}
                        className={`input input-info ${errors.DATEFIN ? "border-2 border-red-500" : ""}`}
                        required
                      />
                      {errors.DATEFIN && (
                        <p className="mt-1 text-sm text-red-500">{errors.DATEFIN}</p>
                      )}
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
                          className={`inputDemande inputLieu input input-info w-full bg-gray-50 ${errors.LIEU ? "border-2 border-red-500" : ""}`}
                          placeholder="Sélectionner un lieu"
                          readOnly
                          required
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
                      {errors.LIEU && <p className="mt-1 text-sm text-red-500">{errors.LIEU}</p>}
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
  );
}
