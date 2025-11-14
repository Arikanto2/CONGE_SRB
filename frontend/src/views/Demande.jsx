import { EyeIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Printer, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import PDF from "../Composants/ViewConge.jsx";
import { useAuth } from "../hooks/useAuth";
import "../Style/Demande.css";

import { PDFDocument } from "pdf-lib";
import DeuxiemePDF from "./PDF1.jsx";

import { pdf } from "@react-pdf/renderer";
import PDF1 from "./PDF.jsx";

export default function Demande() {
  const [selectedConge, setSelectedConge] = useState([]);
  const genererPDF = async (conge) => {
    try {
      if (!conge || !user) throw new Error("Données manquantes");

      const nombreJours = calculerNombreJours(conge.DATEDEBUT, conge.DATEFIN);
      const validation = iscongeValide(conge.VALIDCHEF, conge.VALIDDIV);

      const documentPDF1 = (
        <PDF1 conge={conge} nbrJR={nombreJours} validation={validation} user={user} />
      );

      const documentPDF2 = (
        <DeuxiemePDF
          user={user}
          nbJour={nombreJours}
          decision={decisionData}
          conge={selectedConge}
        />
      );

      // Générer les deux PDFs séparément
      const blob1 = await pdf(documentPDF1).toBlob();
      const blob2 = await pdf(documentPDF2).toBlob();

      // Charger les deux dans pdf-lib
      const pdfDoc1 = await PDFDocument.load(await blob1.arrayBuffer());
      const pdfDoc2 = await PDFDocument.load(await blob2.arrayBuffer());

      // Créer un nouveau PDF fusionné
      const mergedPdf = await PDFDocument.create();

      // Copier toutes les pages du premier PDF
      const pages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
      pages1.forEach((page) => mergedPdf.addPage(page));

      // Copier toutes les pages du deuxième PDF
      const pages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
      pages2.forEach((page) => mergedPdf.addPage(page));

      // Enregistrer le résultat final
      const mergedBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });
      const mergedUrl = URL.createObjectURL(mergedBlob);

      // Ouvrir le PDF final dans un nouvel onglet
      window.open(mergedUrl);

      // Nettoyer après 1 minute
      setTimeout(() => URL.revokeObjectURL(mergedUrl), 60000);
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur : " + error.message);
    }
  };

  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [donneeDemande, setDonneeDemande] = useState({
    IM: user?.IM || "",
    CATEGORIE: "",
    TYPE: "",
    MOTIF: "",
    DATEDEBUT: "",
    DATEFIN: "",
    LIEU: "",
    INTERIM: "",
    ABSENCE: "",
  });
  const [decisionData, setDecisionData] = useState([]);
  const iscongeValide = (validchef, validediv) => {
    if (validchef === "Validé") {
      return "Validé";
    } else if (validchef === "En attente" || validediv === "En attente") {
      return "En attente";
    } else if (validediv === "Refusé" || validchef === "Refusé") {
      return "Refusé";
    }
  };
  const getDecision = async (id) => {
    const reponse = await axios.get(`http://localhost:8000/api/decision/${id}`);
    setDecisionData(reponse.data);
  };
  const [getAlldemande, setGetAlldemande] = useState([]);
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
  const [soldeAuto, setSoldeAuto] = useState(0);
  const [alldemandeChange, setAlldemandeChange] = useState([]);
  const [filtreCategorie, setFiltreCategorie] = useState("");
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [isResetAnimating, setIsResetAnimating] = useState(false);

  const handleChange = (key, value) => {
    setDonneeDemande((prev) => {
      const newData = {
        ...prev,
        [key]: value,
      };
      return newData;
    });
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };
  const fetchDemande = useCallback(async () => {
    try {
      if (!token || !user?.IM) return;
      const response = await axios.get(`http://localhost:8000/api/all-demande/${user.IM}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setGetAlldemande(response.data || []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des demandes: " + error.message);
    }
  }, [token, user?.IM]);

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
    if (nbrJR <= 0) {
      newErrors.nbrJR = "Le nombre de jours doit être supérieur à zéro ";
    } else if (donneeDemande.CATEGORIE === "Congé" && nbrJR > 15) {
      newErrors.nbrJR = "Le nombre de jours ne peut pas dépasser 15 ";
    }else if (donneeDemande.CATEGORIE === "Autorisation d'absence" && nbrJR > 3) {
      newErrors.nbrJR = "Le nombre de jours ne peut pas dépasser 3 ";
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
      await axios.post("http://localhost:8000/api/faire-demande", donneeFinale);

      toast.success("Demande envoyée avec succès");

      recupererSolde();
      fetchDemande();
      document.getElementById("my_modal_3").close();
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
      document.getElementById("my_modal_3").close();

      console.error("Erreur complète:", err);
      console.error("Erreur response:", err.response);
      console.error("Erreur status:", err.response?.status);
      toast.error("Erreur data:", err.response?.data);

      // Gestion des erreurs de validation du serveur
      if (err.response?.status === 422 && err.response?.data?.errors) {
        console.log("Erreurs de validation:", err.response.data.errors);
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 400) {
        console.log(err.response.data.message);
      } else if (err.response?.status === 401) {
        console.log("Erreur d'authentification. Veuillez vous reconnecter.");
      } else {
        console.log(
          "Erreur lors de l'envoi de la demande: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const lieux = [
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
      const nouveauSoldeAuto = response.data.nbrAuto || 0;
      setSoldeConge(nouveauSolde);
      setSoldeAuto(nouveauSoldeAuto);
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
    }
  }, [token, user?.IM]);
  useEffect(() => {
    if (user?.IM) {
      setDonneeDemande((prev) => ({
        ...prev,
        IM: user.IM,
      }));
    }
  }, [user?.IM]);

  useEffect(() => {
    if (token && user) {
      recupererSolde();
      fetchDemande();
    }
  }, [token, user, recupererSolde, fetchDemande]);

  useEffect(() => {
    let demandesFiltrees = getAlldemande;

    // Filtrage par catégorie
    if (filtreCategorie !== "") {
      demandesFiltrees = demandesFiltrees.filter(
        (demande) => demande.CATEGORIE === filtreCategorie
      );
    }

    // Filtrage par texte de recherche (recherche dans toutes les colonnes du tableau)
    if (rechercheTexte !== "") {
      const texteRecherche = rechercheTexte.toLowerCase();
      demandesFiltrees = demandesFiltrees.filter((demande) => {
        // Date de demande
        const dateCreation = new Date(demande.created_at).toLocaleDateString().toLowerCase();

        // Type (catégorie ou type spécifique)
        const typeAffiche =
          (demande.TYPE == null ? demande.CATEGORIE : demande.TYPE)?.toLowerCase() || "";

        // Dates début et fin
        const dateDebut = new Date(demande.DATEDEBUT).toLocaleDateString().toLowerCase();
        const dateFin = new Date(demande.DATEFIN).toLocaleDateString().toLowerCase();

        // Nombre de jours (converti en string)
        const nombreJours = calculerNombreJours(demande.DATEDEBUT, demande.DATEFIN).toString();

        // Intérim
        const interim = (demande.INTERIM || "N/A").toLowerCase();

        // Validateur
        const validateur =
          demande.NOM_CHEF && demande.PRENOM_CHEF
            ? `${demande.NOM_CHEF} ${demande.PRENOM_CHEF}`.toLowerCase()
            : "non assigné";

        // Date de confirmation
        const dateConfirmation = new Date(demande.updated_at)
          .toLocaleDateString("fr-FR")
          .toLowerCase();

        // Status
        const status = iscongeValide(demande.VALIDCHEF, demande.VALIDDIV)?.toLowerCase() || "";

        // Recherche dans tous les champs
        return (
          dateCreation.includes(texteRecherche) ||
          typeAffiche.includes(texteRecherche) ||
          dateDebut.includes(texteRecherche) ||
          dateFin.includes(texteRecherche) ||
          nombreJours.includes(texteRecherche) ||
          interim.includes(texteRecherche) ||
          validateur.includes(texteRecherche) ||
          dateConfirmation.includes(texteRecherche) ||
          status.includes(texteRecherche) ||
          demande.CATEGORIE?.toLowerCase().includes(texteRecherche) ||
          demande.MOTIF?.toLowerCase().includes(texteRecherche) ||
          demande.LIEU?.toLowerCase().includes(texteRecherche)
        );
      });
    }

    setAlldemandeChange(demandesFiltrees);
  }, [getAlldemande, filtreCategorie, rechercheTexte]);

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

  // Fonction utilitaire pour ouvrir le modal de demande
  const ouvrirModalDemande = () => {
    document.getElementById("my_modal_3")?.showModal();
  };

  // UseEffect pour ouvrir le modal si le paramètre URL openModal=true est présent
  useEffect(() => {
    const openModal = searchParams.get("openModal");
    if (openModal === "true") {
      // Petit délai pour s'assurer que le DOM est prêt et que la page est chargée
      setTimeout(() => {
        ouvrirModalDemande();
      }, 300);

      // Nettoyer le paramètre URL après avoir ouvert le modal
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleDebutChange = (val) => {
    setDebutDate(val);
    handleChange("DATEDEBUT", val);

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

  const reinitialiserFiltres = () => {
    setIsResetAnimating(true);
    setFiltreCategorie("");
    setRechercheTexte("");

    // Arrêter l'animation après 1 seconde
    setTimeout(() => {
      setIsResetAnimating(false);
    }, 1000);
  };

  return (
    <div className="card ml-3 mr-3 mt-5 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <label className="input input-info left-0 h-10 w-80">
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
              <input
                type="search"
                placeholder="Rechercher..."
                value={rechercheTexte}
                onChange={(e) => setRechercheTexte(e.target.value)}
              />
            </label>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 transform text-center">
            <p className="labelTitre">Les congés demandés</p>
          </div>
          <div className="right-0 flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={reinitialiserFiltres}
              title="Réinitialiser les filtres"
              disabled={isResetAnimating}
            >
              <RefreshCcw
                size={16}
                className={`transition-transform duration-1000 ${isResetAnimating ? "animate-spin" : ""}`}
              />
              {isResetAnimating ? "Réinitialisation..." : "Réinitialiser"}
            </button>
            <select
              className="comboDemande select select-info"
              value={filtreCategorie}
              onChange={(e) => {
                const nouvelleCategorieFiltre = e.target.value;
                setFiltreCategorie(nouvelleCategorieFiltre);

                if (nouvelleCategorieFiltre === "") {
                  setAlldemandeChange(getAlldemande);
                } else {
                  setAlldemandeChange(
                    getAlldemande.filter((demande) => demande.CATEGORIE === nouvelleCategorieFiltre)
                  );
                }
              }}
            >
              <option value="">Toutes les catégories</option>
              <option value="Autorisation d'absence">Autorisation d'absence</option>
              <option value="Congé">Congé</option>
              <option value="Permission">Permission</option>
              <option value="Mission">Mission</option>
              <option value="Formation">Formation</option>
              <option value="Repos médical">Repos médical</option>
            </select>
            <button className="btnDemande btn btn-dash" onClick={ouvrirModalDemande}>
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
                        {donneeDemande["CATEGORIE"] == "Autorisation d'absence"? soldeAuto: soldeConge}
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
                        <p className="mt-1 text-[10px] text-red-600">{errors.CATEGORIE}</p>
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
                        {errors.TYPE && (
                          <p className="mt-1 text-[10px] text-red-600">{errors.TYPE}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex flex-1 items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox h-5 w-5 border-blue-400 bg-blue-100 checked:bg-blue-600 checked:text-white"
                          checked={checkbox}
                          onChange={(e) => {
                            setCheckbox(e.target.checked);
                            if (!e.target.checked) {
                              handleChange("ABSENCE", "");
                            }
                          }}
                        />
                      </label>
                      <select
                        className="comboDemande select select-info w-52 bg-gray-50"
                        value={donneeDemande.ABSENCE}
                        onChange={(e) => {
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
                      />
                      {errors.MOTIF && (
                        <p className="mt-1 text-[10px] text-red-600">{errors.MOTIF}</p>
                      )}
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
                      />
                      {errors.DATEDEBUT && (
                        <p className="mt-1 text-[10px] text-red-600">{errors.DATEDEBUT}</p>
                      )}
                    </div>
                    <div className="max-w-16 flex-1">
                      <label className="mb-1 block text-left font-serif text-sm">Jours:</label>
                      <input
                        type="number"
                        value={nbrJR}
                        onChange={(e) => handleNbrJRChange(e.target.value)}
                        className={`input ${errors.nbrJR ? "input-error border-red-500" : "input-info"} w-14 bg-gray-50 text-center`}
                      />
                      {errors.nbrJR && (
                        <p className="mt-1 text-[10px] text-red-600">{errors.nbrJR}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-left font-serif text-sm">Date fin*:</label>
                      <input
                        type="date"
                        value={finDate}
                        min={debutDate}
                        onChange={(e) => handleFinChange(e.target.value)}
                        className={`input input-info ${errors.DATEFIN ? "border-2 border-red-500" : ""}`}
                      />
                      {errors.DATEFIN && (
                        <p className="mt-1 text-[10px] text-red-600">{errors.DATEFIN}</p>
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
                        />
                        <details className="dropdown dropdown-top">
                          <summary className="btnChoixLieu btn h-8">choisir</summary>
                          <div className="max-h-64 overflow-y-auto">
                            <ul className="dropdown-content menu absolute left-0 top-full z-50 mt-2 max-h-64 w-52 space-y-1 overflow-y-auto rounded-box border border-blue-300 bg-base-100 p-2 shadow-sm">
                              {lieux.map((lieu) => (
                                <li
                                  key={lieu}
                                  onClick={() => ajouterLieu(lieu)}
                                  className={`cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${lieuSelectionne.includes(lieu) ? "bg-blue-500 text-white" : ""}`}
                                >
                                  {lieu}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </div>
                      {errors.LIEU && (
                        <p className="mt-1 text-[10px] text-red-600">{errors.LIEU}</p>
                      )}
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
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="bg-base-200 text-center">Date de demande</th>
                <th className="bg-base-200 text-center">Type</th>
                <th className="bg-base-200 text-center">Date début</th>
                <th className="bg-base-200 text-center">Date fin</th>
                <th className="bg-base-200 text-center">Nombre de jour</th>
                <th className="bg-base-200 text-center">Intérim</th>
                <th className="bg-base-200 text-center">Validateur et Date de confirmation</th>
                <th className="bg-base-200 text-center">Status</th>
                <th className="bg-base-200">Aperçu</th>
              </tr>
            </thead>
            <tbody>
              {alldemandeChange && alldemandeChange.length > 0 ? (
                alldemandeChange.map((conge) => (
                  <tr key={conge.id}>
                    <td className="text-center">
                      {new Date(conge.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      {conge.TYPE == null ? conge.CATEGORIE : conge.TYPE}
                    </td>
                    <td className="text-center">
                      {new Date(conge.DATEDEBUT).toLocaleDateString()}
                    </td>
                    <td className="text-center">{new Date(conge.DATEFIN).toLocaleDateString()}</td>
                    <td className="text-center">
                      {calculerNombreJours(conge.DATEDEBUT, conge.DATEFIN)}
                    </td>
                    <td className="text-center">{conge.INTERIM || "N/A"}</td>
                    <td className="text-center">
                      {conge.NOM_CHEF && conge.PRENOM_CHEF
                        ? `${conge.NOM_CHEF} ${conge.PRENOM_CHEF}`
                        : "Préfet"}
                      <br />
                      {new Date(conge.updated_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="text-center">
                      {iscongeValide(conge.VALIDCHEF, conge.VALIDDIV)}
                    </td>
                    <td className="">
                      <button
                        className="btnConnexion"
                        onClick={() => {
                          document.getElementById(`modal`).showModal();
                          getDecision(conge.id);
                          setSelectedConge(conge);
                        }}
                        title="Voir l'aperçu"
                      >
                        <EyeIcon className="h-4 w-4 text-white" />
                      </button>

                      <dialog id="modal" className="modal">
                        <div className="modal-box relative h-[85vh] max-w-full overflow-y-auto p-0">
                          <form method="dialog">
                            <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
                              ✕
                            </button>
                          </form>

                          <button
                            className="btn btn-primary btn-sm absolute left-14 top-3"
                            onClick={() => genererPDF(selectedConge)}
                          >
                            <Printer className="h-4 w-4 text-white" />
                          </button>

                          <div className="mx-auto my-auto">
                            <div className="mx-14 mb-5 mt-14">
                              <PDF
                                IM={selectedConge.IM}
                                NOM={selectedConge.NOM}
                                PRENOM={selectedConge.PRENOM}
                                DATEDEBUT={new Date(selectedConge.DATEDEBUT).toLocaleDateString()}
                                DATEFIN={new Date(selectedConge.DATEFIN).toLocaleDateString()}
                                motif={selectedConge.MOTIF}
                                Interim={selectedConge.INTERIM}
                                lieu={selectedConge.LIEU}
                                ref={selectedConge.Ref}
                                joursADebiter={[]}
                                decision={decisionData}
                                date={new Date(selectedConge.updated_at).toLocaleDateString(
                                  "fr-FR"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </dialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg
                        className="mb-4 h-16 w-16 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mb-2 text-lg font-medium text-gray-600">
                        Aucun résultat trouvé
                      </p>
                      <p className="text-sm text-gray-400">
                        {rechercheTexte || filtreCategorie
                          ? "Aucune demande ne correspond à vos critères de recherche."
                          : "Vous n'avez encore fait aucune demande de congé."}
                      </p>
                      {(rechercheTexte || filtreCategorie) && (
                        <button
                          className="btn btn-outline btn-sm mt-3"
                          onClick={reinitialiserFiltres}
                          disabled={isResetAnimating}
                        >
                          <RefreshCcw
                            size={14}
                            className={`mr-2 transition-transform duration-1000 ${isResetAnimating ? "animate-spin" : ""}`}
                          />
                          {isResetAnimating ? "Réinitialisation..." : "Effacer les filtres"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
