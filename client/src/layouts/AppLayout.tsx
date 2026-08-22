import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-16">
        <Outlet />
      </main>
    </div>
  );
}
