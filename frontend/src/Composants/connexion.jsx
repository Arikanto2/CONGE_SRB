import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Connexion({ activeDefil }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [IM, setIM] = useState("");
  const [MDP, setMDP] = useState("");
  const [loading, setLoading] = useState(false);
  
  

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
     // Clear error when user types
    if (name === "IM") setIM(value);
    else if (name === "MDP") setMDP(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!IM || !MDP) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    

    try {
      const result = await login({ IM, MDP });

      if (result.success) {
        navigate("/Accueil");
        toast.success("Connexion réussie !");
      } else {
        
        toast.error(result.error || "Erreur de connexion");
      }
    } catch (err) {
      
      toast.error("Erreur de connexion au serveur.");
      console.error("Erreur de connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-center">
      <form onSubmit={handleSubmit}>
        <div>
          <p className="labeConnex mb-7 text-center">Connexion</p>

          <div className="mb-4">
            <label className="text-m block text-left font-serif">Identifiant:</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400">
                <UserIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                name="IM"
                value={IM}
                onChange={handleChange}
                placeholder=""
                className="inputConnexion1 w-full bg-gray-50 pl-8"
              />
            </div>
          </div>

          <div className="mb-4 mt-4">
            <label className="text-m block text-left font-serif">Mot de passe:</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="MDP"
                value={MDP}
                onChange={handleChange}
                placeholder=""
                className="inputConnexion1 w-full bg-gray-50 pl-8 pr-10"
              />
              <label className="swap swap-rotate absolute right-2 top-1/2 -translate-y-1/2 transform">
                <input type="checkbox" checked={showPassword} onChange={togglePassword} />
                <EyeIcon className="swap-on h-4 w-4 text-blue-400" />
                <EyeSlashIcon className="swap-off h-4 w-4 text-blue-400" />
              </label>
            </div>
          </div>

          <button type="submit" className="btnConnexion mx-auto mt-10 block" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p
            className="inscriptionLink mx-auto mt-2 block w-fit transition-all duration-1000 hover:underline"
            onClick={activeDefil}
          >
            Créer un compte
          </p>
        </div>
      </form>
    </div>
  );
}
