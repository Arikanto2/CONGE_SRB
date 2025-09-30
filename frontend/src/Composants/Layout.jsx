import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 p-4 bg-base-200">
                <Outlet />
            </main>
            
            {/* <Footer/> */}
        </div>
    );
}
