import React, { useState } from "react";
import { Link } from "react-router-dom";

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    team_name: "",
    team_number: 1,
    email: "",
    time_slot: "",
  });
  const [errors, setErrors] = useState({});
  const [timeAvailability, setTimeAvailability] = useState({});

  // Fetch time slot availability when dropdown is clicked
  const fetchTimeAvailability = async () => {
    try {
      const response = await fetch("./backend/get_time_availability.php");
      if (response.ok) {
        const data = await response.json();
        setTimeAvailability(data.availability);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await fetch("./backend/create_reservation.php", {
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
      alert(`Rezervace byla úspěšně vytvořena! ID: ${data.reservation.id}`);

      // Reset form
      setFormData({
        team_name: "",
        team_number: 1,
        email: "",
        time_slot: "",
      });
      setErrors({});
      
      // Refresh time availability
      const availabilityResponse = await fetch("./backend/get_time_availability.php");
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setTimeAvailability(availabilityData.availability);
      }
    } catch (err) {
      alert(`Chyba při vytváření rezervace: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 relative overflow-hidden">
      {/* Creepy Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-gray-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-red-600 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border border-gray-400 rounded-full animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-md shadow-2xl sticky top-0 z-50 border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-800 bg-clip-text text-transparent animate-pulse">
                🦇 UTB Strašidelná fakulta 🦇
              </h1>
            </Link>
            <div className="flex space-x-8">
              <Link
                to="/"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
              >
                🏠 Domů
              </Link>
              <Link
                to="/manage"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
              >
                ⚰️ Spravovat
              </Link>
              <Link
                to="/reservations"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
              >
                💀 Rezervovat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Reservation Form */}
          <div className="bg-gray-900/80 border-2 border-red-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-red-400 mb-8 text-center drop-shadow-lg">
              💀 Detaily Rezervace v Pekle 💀
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

          {/* Information Panel */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-gray-900/80 border-2 border-red-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-red-400 mb-6 drop-shadow-lg">
                👻 Kontaktní informace z říše mrtvých
              </h3>
              <div className="space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
