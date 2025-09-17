import React, { useState } from "react";
import { Link } from "react-router-dom";

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    participantCount: 1,
    participantNames: "",
    email: "",
    time: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Reservation data:", formData);
    alert("Rezervace byla úspěšně odeslána!");
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
            Připojte se k nám na strašidelnou fakultu! Vyplňte formulář níže a zarezervujte si místo.
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
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Zadejte název vašeho týmu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Počet účastníků *
                </label>
                <select
                  name="participantCount"
                  value={formData.participantCount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Účastník" : "Účastníků"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jména účastníků *
                </label>
                <textarea
                  name="participantNames"
                  value={formData.participantNames}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Zadejte jména všech účastníků (jedno jméno na řádek)"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Zadejte váš email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Čas (30min intervaly) *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Vyberte čas</option>
                  <option value="09:00">9:00 - 9:30</option>
                  <option value="09:30">9:30 - 10:00</option>
                  <option value="10:00">10:00 - 10:30</option>
                  <option value="10:30">10:30 - 11:00</option>
                  <option value="11:00">11:00 - 11:30</option>
                  <option value="11:30">11:30 - 12:00</option>
                  <option value="12:00">12:00 - 12:30</option>
                  <option value="12:30">12:30 - 13:00</option>
                  <option value="13:00">13:00 - 13:30</option>
                  <option value="13:30">13:30 - 14:00</option>
                  <option value="14:00">14:00 - 14:30</option>
                  <option value="14:30">14:30 - 15:00</option>
                  <option value="15:00">15:00 - 15:30</option>
                  <option value="15:30">15:30 - 16:00</option>
                  <option value="16:00">16:00 - 16:30</option>
                  <option value="16:30">16:30 - 17:00</option>
                  <option value="17:00">17:00 - 17:30</option>
                  <option value="17:30">17:30 - 18:00</option>
                  <option value="18:00">18:00 - 18:30</option>
                  <option value="18:30">18:30 - 19:00</option>
                  <option value="19:00">19:00 - 19:30</option>
                  <option value="19:30">19:30 - 20:00</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Potvrdit Rezervaci
              </button>
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
                    <p className="text-gray-600">+420 576 031 111</p>
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
                    <p className="text-gray-600">strasidelnafakulta@utb.cz</p>
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
