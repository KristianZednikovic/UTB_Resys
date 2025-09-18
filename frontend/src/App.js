import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ReservationPage from "./components/ReservationPage";
import ManageReservation from "./components/ManageReservation";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/manage" element={<ManageReservation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
