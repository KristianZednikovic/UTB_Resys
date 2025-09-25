import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Popup from "./Popup";
import LightRays from "./LightRays";
import QRCodePopup from "./QRCodePopup";

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    team_name: "",
    team_number: 1,
    email: "",
    time_slot: "",
  });
  const [formData2, setFormData2] = useState({
    team_name: "",
    team_number: 1,
    email: "",
    time_slot: "",
  });
  const [errors, setErrors] = useState({});
  const [errors2, setErrors2] = useState({});
  const [timeAvailability, setTimeAvailability] = useState({});
  const [timeAvailability2, setTimeAvailability2] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [qrPopupOpen, setQrPopupOpen] = useState(false);
  const [qrReservationData, setQrReservationData] = useState(null);

  const openPopup = (popupType) => {
    console.log('Opening popup:', popupType);
    setActivePopup(popupType);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  // Fetch time slot availability when dropdown is clicked
  const fetchTimeAvailability = async () => {
    try {
      const response = await fetch("/backend/get_time_availability.php");
      if (response.ok) {
        const data = await response.json();
        setTimeAvailability(data.availability);
      }
    } catch (error) {
      console.error("Failed to fetch time availability:", error);
    }
  };

  // Fetch time slot availability for second form
  const fetchTimeAvailability2 = async () => {
    try {
      const response = await fetch("/backend/get_time_availability_mira.php");
      if (response.ok) {
        const data = await response.json();
        setTimeAvailability2(data.availability);
      }
    } catch (error) {
      console.error("Failed to fetch time availability:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors2[name]) {
      setErrors2((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await fetch("/backend/create_reservation.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // If the error has a field property, show it next to that field
        if (errorData.field) {
          setErrors({
            [errorData.field]: errorData.error
          });
          return;
        }
        
        throw new Error(errorData.error || "Failed to create reservation");
      }

      const data = await response.json();
      
      // Set QR code data and show popup
      setQrReservationData({
        id: data.reservation.id,
        team_name: formData.team_name,
        team_number: formData.team_number,
        email: formData.email,
        time_slot: formData.time_slot,
        table: 'reservations' // First table
      });
      setQrPopupOpen(true);

      // Reset form
      setFormData({
        team_name: "",
        team_number: 1,
        email: "",
        time_slot: "",
      });
      setErrors({});
      
      // Refresh time availability
      const availabilityResponse = await fetch("/backend/get_time_availability.php");
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setTimeAvailability(availabilityData.availability);
      }
    } catch (err) {
      alert(`Chyba při vytváření rezervace: ${err.message}`);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setErrors2({}); // Clear previous errors

    try {
      const response = await fetch("/backend/create_reservation_mira.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData2),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // If the error has a field property, show it next to that field
        if (errorData.field) {
          setErrors2({
            [errorData.field]: errorData.error
          });
          return;
        }
        
        throw new Error(errorData.error || "Failed to create reservation");
      }

      const data = await response.json();
      
      // Set QR code data and show popup
      setQrReservationData({
        id: data.reservation.id,
        team_name: formData2.team_name,
        team_number: formData2.team_number,
        email: formData2.email,
        time_slot: formData2.time_slot,
        table: 'reservations_mira' // Second table
      });
      setQrPopupOpen(true);

      // Reset form
      setFormData2({
        team_name: "",
        team_number: 1,
        email: "",
        time_slot: "",
      });
      setErrors2({});
      
      // Refresh time availability
      const availabilityResponse = await fetch("/backend/get_time_availability_mira.php");
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setTimeAvailability2(availabilityData.availability);
      }
    } catch (err) {
      alert(`Chyba při vytváření rezervace 2: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Light Rays Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ff0000"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={2.5}
          fadeDistance={2.0}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      
      {/* Creepy Background Elements */}
      <div className="absolute inset-0 opacity-10" style={{ zIndex: 2 }}>
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-gray-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-red-600 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border border-gray-400 rounded-full animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Navigation */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ position: 'relative', zIndex: 10 }}>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-400 mb-4 drop-shadow-2xl">
            💀 Rezervujte si místo v{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-800 bg-clip-text text-transparent animate-pulse">
              Strašidelné fakultě UTB
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            🦇 Připojte se k nám v temných laboratořích hrůzy! 
            <br />
            🧪 Vyplňte formulář níže a zarezervujte si místo v pekle.
            <br />
            💀 Připravte se na nejstrašidelnější zážitek svého života!
          </p>
        </div>

        {/* Contact Info - Compact */}
        <div className="bg-gray-900/80 border-2 border-red-800 rounded-3xl shadow-2xl p-6 backdrop-blur-sm mb-8">
          <h3 className="text-2xl font-bold text-red-400 mb-4 text-center drop-shadow-lg">
            👻 Kontaktní informace z říše mrtvých
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center border border-red-400">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <p className="font-semibold text-red-300">Telefon do pekla</p>
                <p className="text-gray-300">+420 739 271 855</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center border border-red-400">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="font-semibold text-red-300">Email duchů</p>
                <p className="text-gray-300">propagace@fai.utb.cz</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* First Reservation Form */}
          <div className="bg-gray-900/80 border-2 border-red-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-red-400 mb-6 text-center drop-shadow-lg">
              💀 Rezervace 1 v Pekle 💀
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Information */}
              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  🦇 Název týmu obětí *
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                    errors.team_name ? 'border-red-500' : 'border-red-600'
                  }`}
                  placeholder="Zadejte název vašeho týmu obětí"
                />
                {errors.team_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.team_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  💀 Počet obětí *
                </label>
                <select
                  name="team_number"
                  value={formData.team_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-red-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Oběť" : "Obětí"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  👻 Emailová adresa *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-500' : 'border-red-600'
                  }`}
                  placeholder="Zadejte váš email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  ⏰ Čas experimentu (10min intervaly) *
                </label>
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleInputChange}
                  onClick={fetchTimeAvailability}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white ${
                    errors.time_slot ? 'border-red-500' : 'border-red-600'
                  }`}
                >
                  <option value="">Vyberte čas hrůzy</option>
                  {[
                    { value: "15:00", label: "15:00 - 15:10" },
                    { value: "15:10", label: "15:10 - 15:20" },
                    { value: "15:20", label: "15:20 - 15:30" },
                    { value: "15:30", label: "15:30 - 15:40" },
                    { value: "15:40", label: "15:40 - 15:50" },
                    { value: "16:00", label: "16:00 - 16:10" },
                    { value: "16:10", label: "16:10 - 16:20" },
                    { value: "16:20", label: "16:20 - 16:30" },
                    { value: "16:30", label: "16:30 - 16:40" },
                    { value: "16:40", label: "16:40 - 16:50" },
                    { value: "17:00", label: "17:00 - 17:10" },
                    { value: "17:10", label: "17:10 - 17:20" },
                    { value: "17:20", label: "17:20 - 17:30" },
                    { value: "17:30", label: "17:30 - 17:40" },
                    { value: "17:40", label: "17:40 - 17:50" },
                    { value: "18:00", label: "18:00 - 18:10" },
                    { value: "18:10", label: "18:10 - 18:20" },
                    { value: "18:20", label: "18:20 - 18:30" },
                    { value: "18:30", label: "18:30 - 18:40" },
                    { value: "18:40", label: "18:40 - 18:50" },
                    { value: "19:00", label: "19:00 - 19:10" },
                    { value: "19:10", label: "19:10 - 19:20" },
                    { value: "19:20", label: "19:20 - 19:30" },
                    { value: "19:30", label: "19:30 - 19:40" },
                    { value: "19:40", label: "19:40 - 19:50" }
                  ].map((slot) => {
                    const isAvailable = timeAvailability[slot.value] !== false;
                    const isTaken = timeAvailability[slot.value] === false;
                    
                    return (
                      <option 
                        key={slot.value} 
                        value={slot.value}
                        style={{
                          backgroundColor: isTaken ? '#fee2e2' : isAvailable ? '#dcfce7' : 'white',
                          color: isTaken ? '#dc2626' : isAvailable ? '#16a34a' : 'black'
                        }}
                        disabled={isTaken}
                      >
                        {slot.label} {isTaken ? '(Obsazeno peklem)' : isAvailable ? '(Dostupné pro hrůzu)' : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.time_slot && (
                  <p className="text-red-400 text-sm mt-1">{errors.time_slot}</p>
                )}
              </div>

              {/* GDPR Consent Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="gdpr-consent"
                  required
                  className="mt-1 w-5 h-5 text-red-600 bg-gray-800 border-red-600 rounded"
                />
                <label htmlFor="gdpr-consent" className="text-sm text-gray-300 leading-relaxed">
                  Souhlasím se zpracováním osobních údajů v souladu s GDPR pro účely této rezervace v temných laboratořích.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
              >
                💀 Potvrdit Rezervaci v Pekle
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-300 mb-3">Už máte rezervaci v pekle?</p>
                <Link
                  to="/manage"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 border border-red-600 hover:border-red-500"
                >
                  ⚰️ Spravovat Existující Rezervace
                </Link>
              </div>
            </form>
          </div>

          {/* Second Reservation Form */}
          <div className="bg-gray-900/80 border-2 border-red-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-red-400 mb-6 text-center drop-shadow-lg">
              💀 Rezervace 2 v Pekle 💀
            </h2>

            <form onSubmit={handleSubmit2} className="space-y-6">
              {/* Team Information */}
              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  🦇 Název týmu obětí *
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={formData2.team_name}
                  onChange={handleInputChange2}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                    errors2.team_name ? 'border-red-500' : 'border-red-600'
                  }`}
                  placeholder="Zadejte název vašeho týmu obětí"
                />
                {errors2.team_name && (
                  <p className="text-red-400 text-sm mt-1">{errors2.team_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  💀 Počet obětí *
                </label>
                <select
                  name="team_number"
                  value={formData2.team_number}
                  onChange={handleInputChange2}
                  required
                  className="w-full px-4 py-3 border border-red-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Oběť" : "Obětí"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  👻 Emailová adresa *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData2.email}
                  onChange={handleInputChange2}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                    errors2.email ? 'border-red-500' : 'border-red-600'
                  }`}
                  placeholder="Zadejte váš email"
                />
                {errors2.email && (
                  <p className="text-red-400 text-sm mt-1">{errors2.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  ⏰ Čas experimentu (10min intervaly) *
                </label>
                <select
                  name="time_slot"
                  value={formData2.time_slot}
                  onChange={handleInputChange2}
                  onClick={fetchTimeAvailability2}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white ${
                    errors2.time_slot ? 'border-red-500' : 'border-red-600'
                  }`}
                >
                  <option value="">Vyberte čas hrůzy</option>
                  {[
                    { value: "15:00", label: "15:00 - 15:10" },
                    { value: "15:10", label: "15:10 - 15:20" },
                    { value: "15:20", label: "15:20 - 15:30" },
                    { value: "15:30", label: "15:30 - 15:40" },
                    { value: "15:40", label: "15:40 - 15:50" },
                    { value: "16:00", label: "16:00 - 16:10" },
                    { value: "16:10", label: "16:10 - 16:20" },
                    { value: "16:20", label: "16:20 - 16:30" },
                    { value: "16:30", label: "16:30 - 16:40" },
                    { value: "16:40", label: "16:40 - 16:50" },
                    { value: "17:00", label: "17:00 - 17:10" },
                    { value: "17:10", label: "17:10 - 17:20" },
                    { value: "17:20", label: "17:20 - 17:30" },
                    { value: "17:30", label: "17:30 - 17:40" },
                    { value: "17:40", label: "17:40 - 17:50" },
                    { value: "18:00", label: "18:00 - 18:10" },
                    { value: "18:10", label: "18:10 - 18:20" },
                    { value: "18:20", label: "18:20 - 18:30" },
                    { value: "18:30", label: "18:30 - 18:40" },
                    { value: "18:40", label: "18:40 - 18:50" },
                    { value: "19:00", label: "19:00 - 19:10" },
                    { value: "19:10", label: "19:10 - 19:20" },
                    { value: "19:20", label: "19:20 - 19:30" },
                    { value: "19:30", label: "19:30 - 19:40" },
                    { value: "19:40", label: "19:40 - 19:50" }
                  ].map((slot) => {
                    const isAvailable = timeAvailability2[slot.value] !== false;
                    const isTaken = timeAvailability2[slot.value] === false;
                    
                    return (
                      <option 
                        key={slot.value} 
                        value={slot.value}
                        style={{
                          backgroundColor: isTaken ? '#fee2e2' : isAvailable ? '#dcfce7' : 'white',
                          color: isTaken ? '#dc2626' : isAvailable ? '#16a34a' : 'black'
                        }}
                        disabled={isTaken}
                      >
                        {slot.label} {isTaken ? '(Obsazeno peklem)' : isAvailable ? '(Dostupné pro hrůzu)' : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.time_slot && (
                  <p className="text-red-400 text-sm mt-1">{errors.time_slot}</p>
                )}
              </div>

              {/* GDPR Consent Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="gdpr-consent-2"
                  required
                  className="mt-1 w-5 h-5 text-red-600 bg-gray-800 border-red-600 rounded"
                />
                <label htmlFor="gdpr-consent-2" className="text-sm text-gray-300 leading-relaxed">
                  Souhlasím se zpracováním osobních údajů v souladu s GDPR pro účely této rezervace v temných laboratořích.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
              >
                💀 Potvrdit Rezervaci v Pekle
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-300 mb-3">Už máte rezervaci v pekle?</p>
                <Link
                  to="/manage"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 border border-red-600 hover:border-red-500"
                >
                  ⚰️ Spravovat Existující Rezervace
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-2 border-red-800" style={{ position: 'relative', zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent animate-pulse">
              🦇 UTB Strašidelná fakulta 🦇
            </h3>
            <p className="text-gray-400 mb-4">
              💀 Univerzita Tomáše Bati ve Zlíně - Temné laboratoře
            </p>
            <div className="flex justify-center space-x-6 relative z-10">
              <button 
                onClick={() => openPopup('ochrana')}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer hover:animate-pulse px-2 py-1 relative z-10"
                type="button"
              >
                ⚰️ Ochrana duší
              </button>
              <button 
                onClick={() => openPopup('podminky')}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer hover:animate-pulse px-2 py-1 relative z-10"
                type="button"
              >
                💀 Podmínky přežití
              </button>
              <button 
                onClick={() => openPopup('kontakt')}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer hover:animate-pulse px-2 py-1 relative z-10"
                type="button"
              >
                👻 Kontakt s duchy
              </button>
            </div>
            <div className="mt-6 text-gray-500 text-sm">
              🌙 "Věda a nadpřirozeno se setkávají v temnotě..." 🌙
            </div>
          </div>
        </div>
      </footer>

      {/* Popups */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <Popup 
        isOpen={activePopup === 'ochrana'} 
        onClose={closePopup} 
        title="⚰️ Ochrana duší"
      >
        <div className="space-y-6">
          <div className="bg-red-900/20 border border-red-600 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4">🛡️ Ochrana vaší duše</h3>
            <p className="text-gray-300 leading-relaxed">
              V našich temných laboratořích bereme ochranu duší velmi vážně. Každý návštěvník je pod 
              neustálým dohledem našich duchovních ochránců a je vybaven speciálními amulety proti 
              nadpřirozeným útokům.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">🔮 Duchovní ochrana</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Speciální amulety proti duchům</li>
                <li>• Ochranné kruhy kolem experimentů</li>
                <li>• Duchovní průvodci 24/7</li>
                <li>• Exorcistické rituály v případě potřeby</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">⚡ Bezpečnostní opatření</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Neustálý monitoring duší</li>
                <li>• Okamžitá evakuace při nebezpečí</li>
                <li>• Léčebné rituály po experimentech</li>
                <li>• Psychologická podpora duchů</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-red-300 mb-3">⚠️ Důležité upozornění</h4>
            <p className="text-gray-300">
              I přes všechna bezpečnostní opatření si uvědomte, že experimenty s nadpřirozenem 
              nesou určitá rizika. Naše laboratoře jsou vybaveny nejmodernějšími ochrannými systémy, 
              ale 100% bezpečnost nelze zaručit v říši duchů.
            </p>
          </div>
        </div>
      </Popup>

      <Popup 
        isOpen={activePopup === 'podminky'} 
        onClose={closePopup} 
        title="💀 Podmínky přežití"
      >
        <div className="space-y-6">
          <div className="bg-red-900/20 border border-red-600 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4">📋 Pravidla pro přežití</h3>
            <p className="text-gray-300 leading-relaxed">
              Aby jste přežili návštěvu našich temných laboratoří, musíte dodržovat následující 
              podmínky. Porušení těchto pravidel může vést k trvalému pobytu v říši mrtvých.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">✅ Povinnosti návštěvníka</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Dodržovat pokyny duchovních průvodců</li>
                <li>• Nenarušovat experimenty s duchy</li>
                <li>• Respektovat nadpřirozené bytosti</li>
                <li>• Nepoužívat mobilní telefony v laboratořích</li>
                <li>• Zachovat ticho během rituálů</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">❌ Zakázané činnosti</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Fotografování duchů bez povolení</li>
                <li>• Dotýkání se experimentálních vzorků</li>
                <li>• Křik nebo panika při setkání s duchy</li>
                <li>• Opouštění laboratoří bez doprovodu</li>
                <li>• Pokusy o komunikaci s duchy samostatně</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-red-300 mb-3">⚖️ Právní odpovědnost</h4>
            <p className="text-gray-300">
              Univerzita Tomáše Bati ve Zlíně neručí za případné duševní trauma, posedlost duchy 
              nebo trvalé změny v chování způsobené návštěvou temných laboratoří. Vstupem do 
              laboratoří souhlasíte s těmito podmínkami.
            </p>
          </div>
        </div>
      </Popup>

      <Popup 
        isOpen={activePopup === 'kontakt'} 
        onClose={closePopup} 
        title="👻 Kontakt s duchy"
      >
        <div className="space-y-6">
          <div className="bg-red-900/20 border border-red-600 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4">🔮 Komunikace s nadpřirozenem</h3>
            <p className="text-gray-300 leading-relaxed">
              Naše laboratoře jsou vybaveny nejmodernějšími technologiemi pro komunikaci s duchy. 
              Naučíte se používat různé metody kontaktu s říší mrtvých pod dohledem zkušených 
              duchovních průvodců.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">📡 Technologie komunikace</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• EVP (Electronic Voice Phenomena) rekordéry</li>
                <li>• EMF detektory pro detekci duchů</li>
                <li>• Teploměry pro měření duchovních teplot</li>
                <li>• Speciální kamery pro zachycení duchů</li>
                <li>• Ouija desky pro přímou komunikaci</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">🧙‍♀️ Tradiční metody</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Meditace pro otevření třetího oka</li>
                <li>• Rituály pro přivolání duchů</li>
                <li>• Použití křišťálových koulí</li>
                <li>• Tarot karty pro komunikaci</li>
                <li>• Svíčky a kadidlo pro ochranu</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-red-300 mb-3">📞 Kontaktní informace</h4>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="font-semibold text-red-300">📞 Telefon do pekla:</p>
                <p>+420 739 271 855</p>
              </div>
              <div>
                <p className="font-semibold text-red-300">📧 Email duchů:</p>
                <p>propagace@fai.utb.cz</p>
              </div>
            </div>
            <p className="mt-4 text-gray-300">
              Pro rezervaci místa v temných laboratořích nebo dotazy ohledně komunikace s duchy 
              nás neváhejte kontaktovat. Naši duchovní průvodci jsou k dispozici 24/7.
            </p>
          </div>
        </div>
      </Popup>

        {/* QR Code Popup */}
        <QRCodePopup 
          isOpen={qrPopupOpen}
          onClose={() => setQrPopupOpen(false)}
          reservationData={qrReservationData}
        />
      </div>
    </div>
  );
};

export default ReservationPage;
