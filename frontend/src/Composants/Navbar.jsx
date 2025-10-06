import { NavLink } from "react-router-dom";
import logo1 from "../assets/logo1.jpg";
import logo2 from "../assets/logo2.jpg";
import "../Style/App.css";
export default function Navbar() {
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
          <div tabIndex={0} role="button" className="avatar btn btn-ghost btn-circle">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu menu-sm z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <NavLink to="/profile" className="text-sm">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/login" className="text-sm">Déconnecter</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
