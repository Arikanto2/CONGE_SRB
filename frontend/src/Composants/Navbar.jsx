import { Link } from "react-router-dom";
import logo1 from "../assets/logo1.jpg";
import logo2 from "../assets/logo2.jpg";
export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">

            <div className="flex-1 items-center flex gap-2">
                <img src={logo1} alt="Logo 1" className="h-10 w-10 rounded-full object-contain" />
                <img src={logo2} alt="Logo 2" className="h-15 w-10 rounded-full object-contain" />
            </div>

            <div className="flex items-center gap-4">

                <Link to="/accueil" className="btn btn-ghost hover:bg-gray-100">Accueil</Link>
                <Link to="/demande" className="btn btn-ghost hover:bg-gray-100">Congé</Link>
                <Link to="/statistique" className="btn btn-ghost hover:bg-gray-100">Historique</Link>

                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-24 md:w-48"
                />

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                    >
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/login">Logout</Link></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}
