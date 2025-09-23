import React, { useState } from "react";
import { Link } from "react-router-dom";

const ManageReservation = () => {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Prosím zadejte emailovou adresu");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

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
                className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                Rezervovat
              </Link>
              <Link
                to="/manage"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                Spravovat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Spravovat{" "}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Rezervaci
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zadejte svou emailovou adresu pro zobrazení a správu vaši
            Rezervace
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Email Search Form */}
          <form onSubmit={handleEmailSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emailová adresa *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Zadejte email použitý při rezervaci"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Hledám..." : "Najít Rezervaci"}
                </button>
              </div>
            </div>
          </form>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Reservations List */}
          {reservations.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Vaše Rezervace
              </h2>

              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                    reservation.status === "cancelled"
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {reservation.teamName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {reservation.status === "cancelled"
                            ? "Zrušeno"
                            : "Aktivní"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600">
                            Čas:
                          </span>
                          <p className="text-gray-900">
                            {reservation.timeDisplay}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            Počet účastníků:
                          </span>
                          <p className="text-gray-900">
                            {reservation.participantCount}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            Datum:
                          </span>
                          <p className="text-gray-900">{reservation.date}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            Email:
                          </span>
                          <p className="text-gray-900">{reservation.email}</p>
                        </div>
                      </div>
                    </div>

                    {reservation.status === "active" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() =>
                            handleCancelReservation(reservation.id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          Zrušit Rezervaci
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Reservations Found */}
          {reservations.length === 0 && email && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Žádná rezervace nenalezena
              </h3>
              <p className="text-gray-600">
                Pro email <strong>{email}</strong> nebyla nalezena žádná
                rezervace.
              </p>
            </div>
          )}
        </div>

        {/* Back to Reservation Button */}
        <div className="text-center mt-8">
          <Link
            to="/reservations"
            className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Vytvořit Novou Rezervaci
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageReservation;
