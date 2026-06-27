import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ListSpace from "./pages/ListSpace";
import Find from "./pages/Find";
import SpaceDetail from "./pages/SpaceDetail";
import HostDashboard from "./pages/HostDashboard";
import GuestDashboard from "./pages/GuestDashboard";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ListSpace />} />
          <Route path="/find" element={<Find />} />
          <Route path="/find/:id" element={<SpaceDetail />} />
          <Route path="/dashboard/host" element={<HostDashboard />} />
          <Route path="/dashboard/guest" element={<GuestDashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
