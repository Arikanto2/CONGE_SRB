import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import logo1 from "../assets/logo1.jpg";
import logo4 from "../assets/logo4.png";
import logo2 from "../assets/logo2.jpg";
import { useAuth } from "../hooks/useAuth";
import "../Style/App.css";

export default function Navbar() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir vous déconnecter ?",
      text: "Votre session sera fermée.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
      background: "#f9fafb",
      color: "#111827",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success("Déconnexion réussie 👋");
      }
    });
  };
  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 px-4 shadow-sm">
      <div className="flex flex-1 items-center gap-2">
        <img src={logo1} alt="Logo 1" className="h-10 w-10 rounded-full object-contain" />
        <img src={logo2} alt="Logo 2" className="w-15 h-12 rounded-full object-contain" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          <NavLink
            to="/accueil"
            className={({ isActive }) => `menuLink flex-1 ${isActive ? "activeLink" : ""}`}
          >
            Accueil
          </NavLink>
          <NavLink
            to="/demande"
            className={({ isActive }) => `menuLink flex-1 ${isActive ? "activeLink" : ""}`}
          >
            Congé
          </NavLink>
          <NavLink
            to="/statistique"
            className={({ isActive }) => `menuLink flex-1 ${isActive ? "activeLink" : ""}`}
          >
            Historique
          </NavLink>
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar">
            <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              <img
                src={
                  user?.PHOTO_PROFIL
                    ? `http://localhost:8000/storage/profile_photos/${user.PHOTO_PROFIL}`
                    : logo4
                }
                alt="Photo de profil"
                onError={(e) => (e.target.src = logo4)}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-base-100"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu menu-sm z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <NavLink to="/profile" className="text-sm">
                Profile
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-600 hover:bg-red-50"
              >
                Déconnecter
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
