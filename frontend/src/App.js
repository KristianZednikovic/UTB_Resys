import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ReservationPage from "./components/ReservationPage";
import ManageReservation from "./components/ManageReservation";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import QRScanner from "./components/QRScanner";
import InfoPage from "./components/InfoPage";
import "./App.css";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/manage" element={<ManageReservation />} />
          <Route path="/scanqr" element={<QRScanner />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
