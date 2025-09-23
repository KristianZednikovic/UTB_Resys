import React, { useState } from "react";
import { Link } from "react-router-dom";

const ManageReservation = () => {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Prosím zadejte emailovou adresu");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setHasSearched(true);

    try {
      const response = await fetch(
        `./backend/get_reservations.php?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setReservations(data.reservations);
      setSuccess(`Našli jsme ${data.count} rezervaci pro email ${email}`);
    } catch (err) {
      setError("Chyba při načítání rezervace. Zkuste to prosím znovu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Opravdu chcete zrušit tuto rezervaci?")) {
      return;
    }

    try {
      const response = await fetch(
        `./backend/cancel_reservation.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            reservationId: reservationId,
            email: email 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel reservation");
      }

      const data = await response.json();

      setReservations((prev) =>
        prev.map((res) => (res.id === reservationId ? data.reservation : res))
      );
      setSuccess("Rezervace byla úspěšně zrušena");
    } catch (err) {
      setError(
        err.message || "Chyba při rušení rezervace. Zkuste to prosím znovu."
      );
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
                to="/reservations"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
              >
                💀 Rezervovat
              </Link>
              <Link
                to="/manage"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
              >
                ⚰️ Spravovat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-400 mb-4 drop-shadow-2xl">
            ⚰️ Spravovat{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-800 bg-clip-text text-transparent animate-pulse">
              Rezervaci v Pekle
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            👻 Zadejte svou emailovou adresu pro zobrazení a správu vaší
            <br />
            💀 rezervace v temných laboratořích hrůzy
          </p>
        </div>

        <div className="bg-gray-900/80 border-2 border-red-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Email Search Form */}
          <form onSubmit={handleEmailSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  👻 Emailová adresa z říše mrtvých *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-red-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                  placeholder="Zadejte email použitý při rezervaci v pekle"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
                >
                  {loading ? "🔍 Hledám v pekle..." : "💀 Najít Rezervaci"}
                </button>
              </div>
            </div>
          </form>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 font-medium">💀 {error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-600 rounded-xl backdrop-blur-sm">
              <p className="text-green-300 font-medium">👻 {success}</p>
            </div>
          )}

          {/* Reservations List */}
          {reservations.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-red-400 mb-6 drop-shadow-lg">
                💀 Vaše Rezervace v Pekle
              </h2>

              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                    reservation.status === "cancelled"
                      ? "bg-gray-800 border-gray-600 opacity-60"
                      : "bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-600 hover:shadow-2xl hover:shadow-red-500/20"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="text-xl font-bold text-red-300">
                          💀 {reservation.teamName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === "cancelled"
                              ? "bg-red-900/50 text-red-300 border border-red-600"
                              : "bg-green-900/50 text-green-300 border border-green-600"
                          }`}
                        >
                          {reservation.status === "cancelled"
                            ? "⚰️ Zrušeno"
                            : "👻 Aktivní"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-red-300">
                            ⏰ Čas hrůzy:
                          </span>
                          <p className="text-gray-300">
                            {reservation.timeDisplay}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-300">
                            💀 Počet obětí:
                          </span>
                          <p className="text-gray-300">
                            {reservation.participantCount}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-300">
                            📅 Datum experimentu:
                          </span>
                          <p className="text-gray-300">{reservation.date}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-300">
                            👻 Email duchů:
                          </span>
                          <p className="text-gray-300">{reservation.email}</p>
                        </div>
                      </div>
                    </div>

                    {reservation.status === "active" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() =>
                            handleCancelReservation(reservation.id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-2xl transform hover:scale-105 border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
                        >
                          ⚰️ Zrušit Rezervaci v Pekle
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Reservations Found */}
          {reservations.length === 0 && hasSearched && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💀</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2 drop-shadow-lg">
                ⚰️ Žádná rezervace v pekle nenalezena
              </h3>
              <p className="text-gray-300">
                Pro email <strong className="text-red-300">{email}</strong> nebyla nalezena žádná
                rezervace v temných laboratořích.
              </p>
            </div>
          )}
        </div>

        {/* Back to Reservation Button */}
        <div className="text-center mt-8">
          <Link
            to="/reservations"
            className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
          >
            💀 Vytvořit Novou Rezervaci v Pekle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageReservation;
