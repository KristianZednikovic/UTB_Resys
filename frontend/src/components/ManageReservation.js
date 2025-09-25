import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Popup from "./Popup";
import LightRays from "./LightRays";
import QRCodePopup from "./QRCodePopup";

const ManageReservation = () => {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
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

  const showQRCode = (reservation) => {
    setQrReservationData({
      id: reservation.id,
      team_name: reservation.teamName,
      team_number: reservation.participantCount,
      email: reservation.email,
      time_slot: reservation.timeDisplay
    });
    setQrPopupOpen(true);
  };

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
      // Fetch from both tables
      const [response1, response2] = await Promise.all([
        fetch(`./backend/get_reservations.php?email=${encodeURIComponent(email)}`),
        fetch(`./backend/get_reservations_mira.php?email=${encodeURIComponent(email)}`)
      ]);

      let allReservations = [];
      let totalCount = 0;

      if (response1.ok) {
        const data1 = await response1.json();
        const reservations1 = data1.reservations.map(r => ({ ...r, table: 'reservations' }));
        allReservations = [...allReservations, ...reservations1];
        totalCount += data1.count;
      }

      if (response2.ok) {
        const data2 = await response2.json();
        const reservations2 = data2.reservations.map(r => ({ ...r, table: 'reservations_mira' }));
        allReservations = [...allReservations, ...reservations2];
        totalCount += data2.count;
      }

      setReservations(allReservations);
      setSuccess(`Našli jsme ${totalCount} rezervací pro email ${email} (${allReservations.filter(r => r.table === 'reservations').length} z první tabulky, ${allReservations.filter(r => r.table === 'reservations_mira').length} z druhé tabulky)`);
    } catch (err) {
      setError("Chyba při načítání rezervací. Zkuste to prosím znovu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId, table) => {
    if (!window.confirm("Opravdu chcete zrušit tuto rezervaci?")) {
      return;
    }

    try {
      const endpoint = table === 'reservations_mira' 
        ? './backend/cancel_reservation_mira.php'
        : './backend/cancel_reservation.php';
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          reservationId: reservationId,
          email: email 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel reservation");
      }

      const data = await response.json();

      setReservations((prev) =>
        prev.map((res) => (res.id === reservationId ? { ...data.reservation, table: table } : res))
      );
      setSuccess("Rezervace byla úspěšně zrušena");
    } catch (err) {
      setError(
        err.message || "Chyba při rušení rezervace. Zkuste to prosím znovu."
      );
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Light Rays Background */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, minHeight: '100vh' }}>
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
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-gray-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-red-600 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border border-gray-400 rounded-full animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <div className="flex items-end sm:items-end sm:justify-start justify-center">
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
                        <div className="flex gap-2">
                          {reservation.status === "cancelled" && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-900/50 text-red-300 border border-red-600">
                              ⚰️ Zrušeno
                            </span>
                          )}
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-600">
                            {reservation.table === 'reservations_mira' ? '🧪 Tabulka 2' : '💀 Tabulka 1'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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
                            👻 Email duchů:
                          </span>
                          <p className="text-gray-300">{reservation.email}</p>
                        </div>
                      </div>
                    </div>

                    {reservation.status === "active" && (
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <button
                          onClick={() => showQRCode(reservation)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 border border-blue-400 hover:border-blue-300 text-sm"
                        >
                          📱 QR Kód
                        </button>
                        <button
                          onClick={() =>
                            handleCancelReservation(reservation.id, reservation.table)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 border border-red-400 hover:border-red-300 text-sm"
                        >
                          ⚰️ Zrušit
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

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-2 border-red-800">
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
  );
};

export default ManageReservation;
