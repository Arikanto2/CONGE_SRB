import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // ton Navbar actuel

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 p-4 bg-base-200">
                <Outlet />
            </main>
        </div>
    );
}
