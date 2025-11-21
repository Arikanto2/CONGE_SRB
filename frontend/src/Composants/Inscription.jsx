import axios from "axios";
import { Eye, EyeOff, Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function InscriptionMultiStep({ activeDefil }) {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isChefSelected, setIsChefSelected] = useState(false);

  const [donnees, setDonnees] = useState({
    IM: "",
    NOM: "",
    PRENOM: "",
    CORPS: "",
    GRADE: "",
    FONCTION: "",
    DIVISION: "",
    EMAIL: "",
    CONTACT: "",
    MDP: "",
  });

  const [confirmMDP, setConfirmMDP] = useState("");
  const isMPDMatch = () => {
    return donnees.MDP === confirmMDP;
  };

  const API_URL = "http://localhost:8000/api/inscription";

  const handleChange = (field, value) => {
    setDonnees((prev) => ({ ...prev, [field]: value }));
    if (field === "FONCTION" && value === "Chef de service") {
      setIsChefSelected(true);
    } else if (field === "FONCTION") {
      setIsChefSelected(false);
    }
  };

  // 5 étapes exactement comme tu veux
  const steps = [
    { id: 1, title: "Informations personnelles" },
    { id: 2, title: "Corps & Grade" },
    { id: 3, title: "Rôle & Division" },
    { id: 4, title: "Contact & Photo" },
    { id: 5, title: "Mot de passe" },
  ];

  const nextStep = () => step < 5 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!donnees.NOM || !donnees.PRENOM || !donnees.IM) {
          toast.error("Nom, prénom et matricule sont obligatoires.");
          return false;
        }
        if (!/^[A-Za-zéèàêëùï\s-]{2,30}$/.test(donnees.NOM)) {
          toast.error("Nom : uniquement lettres, 2 à 30 caractères.");
          return false;
        }
        if (!/^[A-Za-zéèàêëùï\s-]{2,30}$/.test(donnees.PRENOM)) {
          toast.error("Prénom : uniquement lettres, 2 à 30 caractères.");
          return false;
        }
        if (!/^\d{6}$/.test(donnees.IM)) {
          toast.error("Matricule : exactement 6 chiffres.");
          return false;
        }
        break;

      case 2:
        if (!donnees.CORPS || !donnees.GRADE) {
          toast.error("Corps et grade sont obligatoires.");
          return false;
        }
        /*if (!/^[A-Za-zéèàêëùï\s-]{2,50}$/.test(donnees.CORPS)) {
          toast.error("Corps : uniquement lettres, 2 à 50 caractères.");
          return false;
        }
        if (!/^[A-Za-z0-9\s-]{2,30}$/.test(donnees.GRADE)) {
          toast.error("Grade : lettres et chiffres, 2 à 30 caractères.");
          return false;
        }*/
        break;

      case 3:
        if (!donnees.FONCTION || (!donnees.DIVISION && !isChefSelected)) {
          toast.error("Veuillez sélectionner fonction et division.");
          return false;
        }
        break;

      case 4:
        if (!donnees.EMAIL || !donnees.CONTACT) {
          toast.error("Email et contact obligatoires.");
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(donnees.EMAIL)) {
          toast.error("Email invalide.");
          return false;
        }
        if (!/^\d{10}$/.test(donnees.CONTACT)) {
          toast.error("Contact : 9 chiffres requis.");
          return false;
        }
        break;

      case 5:
        if (!donnees.MDP || !confirmMDP) {
          toast.error("Veuillez remplir le mot de passe et la confirmation.");
          return false;
        }
        if (donnees.MDP !== confirmMDP) {
          toast.error("Les mots de passe ne correspondent pas.");
          return false;
        }
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?& ]{8,}$/.test(
            donnees.MDP
          )
        ) {
          toast.error(
            "Mot de passe faible : au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
          );
          return false;
        }

        break;

      default:
        return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!isMPDMatch()) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (donnees.FONCTION === "Chef de service") {
      try {
        const response = await axios.post("http://localhost:8000/api/verify-chef-service");
        if (response.data.exists) {
          toast.error("Un chef de service existe déjà. Vous ne pouvez pas en créer un autre.");
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du chef de service:", error);
        toast.error("Une erreur est survenue lors de la vérification du chef de service.");
        return;
      }
    }

    if (donnees.FONCTION === "Chef de division") {
      try {
        const response = await axios.post("http://localhost:8000/api/verify-chef-division", {
          DIVISION: donnees.DIVISION,
        });
        if (response.data.exists) {
          const chef = response.data.chef;
          toast.error(
            `Un chef de division existe déjà pour la division "${donnees.DIVISION}".\n\nChef actuel: ${chef.prenom} ${chef.nom} (IM: ${chef.im})\n\nVous ne pouvez pas créer un autre chef pour cette division.`
          );
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du chef de division:", error);
        toast.error("Une erreur est survenue lors de la vérification du chef de division.");
        return;
      }
    }

    const formData = new FormData();
    Object.entries(donnees).forEach(([k, v]) => formData.append(k, v));
    if (selectedFile) formData.append("PHOTO_PROFIL", selectedFile);
    formData.append("MDP", donnees.MDP);

    try {
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Inscription réussie !");
      activeDefil?.();

      setDonnees({
        IM: "",
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

      setConfirmMDP("");
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="flex min-h-screen px-4 py-8 bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="w-full max-w-2xl">
        <div className="bg-white/90">
          {/* Header avec 5 étapes */}
          <div className="px-6 py-5 text-white bg-gradient-to-r from-blue-500 to-cyan-500">
            <div className="py-5">
              <h2 className="font-bold text-center labeSRB5">Inscription</h2>
            </div>
            <div className="flex items-center justify-between gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold transition-all ${
                        step >= s.id ? "bg-white text-blue-600" : "bg-white/40 text-white/80"
                      }`}
                    >
                      {step > s.id ? "✓" : s.id}
                    </div>
                    <p className="mt-2 max-w-28 text-center text-[11px] leading-tight">{s.title}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-1 w-12 ${step > s.id + 1 ? "bg-white" : "bg-white/40"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="px-12 py-6 h-96 max-h-96">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* ÉTAPE 1 : Infos perso (sans Corps & Grade) */}
              {step === 1 && (
                <div className="h-48">
                  <h3 className="mb-8 font-serif text-xl font-bold text-blue-700">
                    Informations personnelles
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Nom"
                        value={donnees.NOM}
                        className="validator input input-info bg-gray-50"
                        pattern="^[A-Za-z\séùèà]+$"
                        minLength="2"
                        maxLength="30"
                        title="Seules les lettres sont autorisées (2-30 caractères)"
                        onChange={(e) => handleChange("NOM", e.target.value)}
                      />
                      <p className="legendMDP validator-hint">
                        Seules les lettres sont autorisées (2 à 30 caractères)
                      </p>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Prénom"
                        value={donnees.PRENOM}
                        className="validator input input-info bg-gray-50"
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
                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="Matricule (6 chiffres)"
                        value={donnees.IM}
                        className="validator input input-info bg-gray-50"
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          handleChange("IM", onlyNums);
                        }}
                      />

                      <p className="legendMDP validator-hint">6 chiffres requis.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : Corps & Grade (nouvelle étape dédiée) */}
              {step === 2 && (
                <div className="h-48">
                  <h3 className="mb-8 font-serif text-xl font-bold text-blue-700">Corps & Grade</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Corps"
                        value={donnees.CORPS}
                        className="input input-info bg-gray-50"
                        onChange={(e) => handleChange("CORPS", e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Grade"
                        value={donnees.GRADE}
                        className="input input-info bg-gray-50"
                        onChange={(e) => handleChange("GRADE", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Rôle & Division */}
              {step === 3 && (
                <div className="h-48">
                  <h3 className="mb-8 font-serif text-xl font-bold text-blue-700">
                    Rôle & Division
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <select
                        className="select select-info bg-gray-50"
                        value={donnees.FONCTION}
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
                    <div>
                      <select
                        className="select select-info bg-gray-50"
                        value={donnees.DIVISION}
                        onChange={(e) => handleChange("DIVISION", e.target.value)}
                        disabled={isChefSelected}
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
                </div>
              )}

              {/* ÉTAPE 4 : Contact & Photo */}
              {step === 4 && (
                <div className="h-48">
                  <h3 className="mb-8 font-serif text-xl font-bold text-blue-700">
                    Contact & Photo
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <input
                        type="email"
                        placeholder="exemple@domaine.com"
                        value={donnees.EMAIL}
                        className="validator input input-info bg-gray-50"
                        onChange={(e) => handleChange("EMAIL", e.target.value)}
                      />
                      <div className="legendMDP validator-hint">Adresse e-mail invalide</div>
                    </div>
                    <div>
                      <div className="validator input input-info">
                        <svg
                          className="h-[1em] opacity-50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                        >
                          <g fill="none">
                            <path
                              d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                              fill="currentColor"
                            ></path>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                              fill="currentColor"
                            ></path>
                          </g>
                        </svg>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          value={donnees.CONTACT}
                          className="z-10 w-full validator bg-gray-50"
                          placeholder="Numéro sans indicatif"
                          title="Seuls les chiffres sont autorisés (9 chiffres requis)"
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/\D/g, "");
                            handleChange("CONTACT", onlyNums);
                          }}
                        />
                      </div>
                      <p className="legendMDP validator-hint"> Doit contenir que des chiffres</p>
                    </div>
                    <div className="flex justify-center w-full md:col-span-2">
                      <label className="inline-flex items-center gap-3 px-5 py-2 text-white transition rounded-sm cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg">
                        <Upload size={20} />
                        Choisir une photo (optionnel)
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 5 : Sécurité (mot de passe) - CHECK VERT À DROITE DE L'ŒIL, EN DEHORS */}
              {step === 5 && (
                <div className="h-48">
                  <h3 className="mb-8 text-xl font-bold text-blue-700">Sécurité</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Champ Mot de passe */}
                    <div className="relative">
                      <div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Entrez votre mot de passe"
                          value={donnees.MDP}
                          onChange={(e) => {
                            handleChange("MDP", e.target.value);
                          }}
                          className="validator input input-info bg-gray-50"
                          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?& ]{8,}$"
                          title="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                          minLength="8"
                          maxLength="20"
                        />
                        <p className="legendMDP validator-hint">
                          Doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                          chiffre et un caractère spécial
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-10 text-gray-500 transition -translate-y-1/2 right-2 top-5 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>

                    {/* Champ Confirmer + Check vert à droite de l'œil */}

                    <div className="relative">
                      <div>
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirmez votre mot de passe"
                          value={confirmMDP}
                          onChange={(e) => {
                            setConfirmMDP(e.target.value);
                            setIsValid(isMPDMatch());
                          }}
                          className="input input-info bg-gray-50"
                        />
                        <p className="mt-1 text-red-600 legendMDP">
                          {isValid && confirmMDP ? "Les mots de passe ne correspondent pas." : ""}
                        </p>
                      </div>

                      {/* Bouton œil (à droite dans l'input) */}
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute z-10 text-gray-500 transition -translate-y-1/2 right-2 top-5 hover:text-gray-700"
                      >
                        {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>

                      {/* Check vert À DROITE DE L'ŒIL, EN DEHORS de l'input */}
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex items-center justify-around pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="w-24 btn btn-outline"
                >
                  Précédent
                </button>

                {step === 5 ? (
                  <button
                    onClick={handleSubmit}
                    className="font-bold text-white transition duration-300 ease-in-out transform btn btn-soft bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg"
                  >
                    Finaliser l'inscription
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-24 font-bold text-white transition duration-300 ease-in-out transform btn btn-soft bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg"
                  >
                    Suivant
                  </button>
                )}
              </div>
            </form>

            <p
              className="w-32 mx-auto font-serif text-center cursor-pointer retourConnexion mt-7 hover:underline"
              onClick={activeDefil}
            >
              J'ai déjà un compte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
