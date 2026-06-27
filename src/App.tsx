import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ListSpace from "./pages/ListSpace";
import FindSpace from "./pages/FindSpace";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ListSpace />} />
          <Route path="/book" element={<FindSpace />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
