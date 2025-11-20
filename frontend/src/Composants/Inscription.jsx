import axios from "axios";
import { CheckCircle, Eye, EyeOff, Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function InscriptionMultiStep({ activeDefil }) {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
  });

  const [password, setPassword] = useState("");
  const [confirmMDP, setConfirmMDP] = useState("");

  const API_URL = "http://localhost:8000/api/inscription";

  const handleChange = (field, value) => {
    setDonnees((prev) => ({ ...prev, [field]: value }));
  };

  // 5 étapes exactement comme tu veux
  const steps = [
    { id: 1, title: "Informations personnelles" },
    { id: 2, title: "Corps & Grade" },
    { id: 3, title: "Rôle & Division" },
    { id: 4, title: "Contact & Photo" },
    { id: 5, title: "Sécurité" },
  ];

  const nextStep = () => step < 5 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!donnees.NOM || !donnees.PRENOM || !donnees.IM)
          return toast.error("Nom, prénom et matricule sont obligatoires.");
        if (!/^\d{6}$/.test(donnees.IM)) return toast.error("Matricule : exactement 6 chiffres.");
        break;
      case 2:
        if (!donnees.CORPS || !donnees.GRADE)
          return toast.error("Corps et grade sont obligatoires.");
        break;
      case 3:
        if (!donnees.FONCTION || !donnees.DIVISION)
          return toast.error("Veuillez sélectionner fonction et division.");
        break;
      case 4:
        if (!donnees.EMAIL || !donnees.CONTACT)
          return toast.error("Email et contact obligatoires.");
        if (!/^\d{9}$/.test(donnees.CONTACT)) return toast.error("Contact : 9 chiffres requis.");
        if (!/^\S+@\S+\.\S+$/.test(donnees.EMAIL)) return toast.error("Email invalide.");
        break;
      case 5:
        if (password !== confirmMDP) return toast.error("Les mots de passe ne correspondent pas.");
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password))
          return toast.error("Mot de passe faible : 8+ caractères, majuscule, chiffre, spécial.");
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => validateStep() && nextStep();

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const formData = new FormData();
    Object.entries(donnees).forEach(([k, v]) => formData.append(k, v));
    if (selectedFile) formData.append("PHOTO_PROFIL", selectedFile);
    formData.append("MDP", password);

    try {
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Inscription ");
      activeDefil?.();

      setDonneepers({
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
      setPassword("");
      setConfirmMDP("");
      setSelectedFile(null);

    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-sm">
          {/* Header avec 5 étapes */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
            <h2 className="mb-6 text-center text-2xl font-bold">Inscription</h2>
            <div className="flex items-center justify-center gap-3">
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
          <div className="p-8 md:p-12">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {/* ÉTAPE 1 : Infos perso (sans Corps & Grade) */}
              {step === 1 && (
                <div>
                  <h3 className="mb-8 text-xl font-bold text-blue-700">
                    Informations personnelles
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <input
                      placeholder="Nom"
                      value={donnees.NOM}
                      onChange={(e) => handleChange("NOM", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                      placeholder="Prénom"
                      value={donnees.PRENOM}
                      onChange={(e) => handleChange("PRENOM", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                      placeholder="Matricule (6 chiffres)"
                      maxLength={6}
                      value={donnees.IM}
                      onChange={(e) => handleChange("IM", e.target.value.replace(/\D/g, ""))}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:col-span-2"
                    />
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : Corps & Grade (nouvelle étape dédiée) */}
              {step === 2 && (
                <div>
                  <h3 className="mb-8 text-xl font-bold text-blue-700">Corps & Grade</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <input
                      placeholder="Corps"
                      value={donnees.CORPS}
                      onChange={(e) => handleChange("CORPS", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                      placeholder="Grade"
                      value={donnees.GRADE}
                      onChange={(e) => handleChange("GRADE", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Rôle & Division */}
              {step === 3 && (
                <div>
                  <h3 className="mb-8 text-xl font-bold text-blue-700">Rôle & Division</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <select
                      value={donnees.FONCTION}
                      onChange={(e) => handleChange("FONCTION", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="" disabled>
                        Sélectionner fonction...
                      </option>
                      <option>Chef de service</option>
                      <option>Chef de division</option>
                      <option>Personnel</option>
                    </select>
                    <select
                      value={donnees.DIVISION}
                      onChange={(e) => handleChange("DIVISION", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="" disabled>
                        Sélectionner division...
                      </option>
                      <option>Bureau du Secrétariat</option>
                      <option>Cellule d'appui et coordination</option>
                      <option>Bureau des affaires administratifs et financières</option>
                      <option>Patrimoine de l'état</option>
                      <option>Chargée de finances locales et des EPN</option>
                      <option>Exécution budgetaire et remboursement des frais médicaux</option>
                      <option>Centre informatique régional</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : Contact & Photo */}
              {step === 4 && (
                <div>
                  <h3 className="mb-8 text-xl font-bold text-blue-700">Contact & Photo</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <input
                      type="email"
                      placeholder="Email"
                      value={donnees.EMAIL}
                      onChange={(e) => handleChange("EMAIL", e.target.value)}
                      className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 px-5 text-gray-600">
                        +261
                      </span>
                      <input
                        placeholder="34 123 45 67"
                        maxLength={9}
                        value={donnees.CONTACT}
                        onChange={(e) => handleChange("CONTACT", e.target.value.replace(/\D/g, ""))}
                        className="flex-1 rounded-r-xl border border-gray-200 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-white transition hover:shadow-lg">
                        <Upload size={20} />
                        Choisir une photo (optionnel)
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>

                      {/* Optionnel : afficher juste le nom du fichier sélectionné */}
                      {selectedFile && (
                        <p className="mt-3 text-center text-sm text-gray-600">
                          Fichier sélectionné :{" "}
                          <span className="font-medium">{selectedFile.name}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 5 : Sécurité (mot de passe) - CHECK VERT À DROITE DE L'ŒIL, EN DEHORS */}
              {step === 5 && (
                <div>
                  <h3 className="mb-8 text-center text-xl font-bold text-blue-700">Sécurité</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Champ Mot de passe */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-5 py-4 pr-12 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>

                    {/* Champ Confirmer + Check vert à droite de l'œil */}
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirmer"
                        value={confirmMDP}
                        onChange={(e) => setConfirmMDP(e.target.value)}
                        className={`w-full rounded-xl border px-5 py-4 pr-16 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          password && confirmMDP
                            ? password === confirmMDP
                              ? "border-green-500 ring-4 ring-green-100"
                              : "border-red-400 ring-4 ring-red-100"
                            : "border-gray-200"
                        }`}
                      />

                      {/* Bouton œil (à droite dans l'input) */}
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                      >
                        {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>

                      {/* Check vert À DROITE DE L'ŒIL, EN DEHORS de l'input */}
                      {password && confirmMDP && password === confirmMDP && (
                        <div className="pointer-events-none absolute right-[-3rem] top-1/2 -translate-y-1/2">
                          <CheckCircle className="text-green-500 drop-shadow-md" size={36} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex items-center justify-between pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="rounded-xl bg-gray-200 px-8 py-4 font-medium text-gray-600 disabled:opacity-50"
                >
                  Précédent
                </button>

                {step === 5 ? (
                  <button
                    onClick={handleSubmit}
                    className="transform rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-12 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                  >
                    Finaliser l'inscription
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="transform rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-12 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                  >
                    Suivant
                  </button>
                )}
              </div>
            </form>

            <p
              onClick={activeDefil}
              className="mt-8 cursor-pointer text-center font-medium text-blue-600 hover:underline"
            >
              J'ai déjà un compte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
