import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-stone-950">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}