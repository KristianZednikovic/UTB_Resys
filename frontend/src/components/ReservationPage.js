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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                UTB Strašidelná fakulta
              </h1>
            </Link>
            <div className="flex space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                Domů
              </Link>
              <Link
                to="/manage"
                className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                Spravovat
              </Link>
              <Link
                to="/reservations"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                Rezervovat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Rezervujte si místo na{" "}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Strašidelné fakultě UTB
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Připojte se k nám na strašidelnou fakultu! Vyplňte formulář níže a
            zarezervujte si místo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Reservation Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Detaily Rezervace
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Information */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Název týmu *
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.team_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Zadejte název vašeho týmu"
                />
                {errors.team_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.team_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Počet účastníků *
                </label>
                <select
                  name="team_number"
                  value={formData.team_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Účastník" : "Účastníků"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emailová adresa *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Zadejte váš email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Čas (10min intervaly) *
                </label>
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleInputChange}
                  onClick={fetchTimeAvailability}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.time_slot ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Vyberte čas</option>
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
                        {slot.label} {isTaken ? '(Obsazeno)' : isAvailable ? '(Dostupné)' : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.time_slot && (
                  <p className="text-red-500 text-sm mt-1">{errors.time_slot}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Potvrdit Rezervaci
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-600 mb-3">Už máte rezervaci?</p>
                <Link
                  to="/manage"
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Spravovat Existující Rezervace
                </Link>
              </div>
            </form>
          </div>

          {/* Information Panel */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Kontaktní informace
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Telefon</p>
                    <p className="text-gray-600">+420 739 271 855</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">propagace@fai.utb.cz</p>
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
