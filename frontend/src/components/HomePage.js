import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Popup from "./Popup";
import LightRays from "./LightRays";

const HomePage = () => {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (popupType) => {
    console.log('Opening popup:', popupType);
    setActivePopup(popupType);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Light Rays Background */}
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-red-400 mb-6 animate-fade-in drop-shadow-2xl">
              🦇 Vítejte v
              <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-800 bg-clip-text text-transparent animate-pulse">
                Strašidelné fakultě UTB 🦇
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed">
              🌙 Vstupte do temného světa, kde se věda setkává s nadpřirozenem... 
              <br />
              💀 Univerzita Tomáše Bati ve Zlíně otevírá své nejstrašidelnější laboratoře 
              <br />
              🧪 kde se experimentuje s duchy, upíry a vědeckými monstry!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/reservations"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
              >
                💀 Rezervovat Místo v Pekle
              </Link>
            </div>
          </div>
        </div>

        {/* Creepy Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 border-2 border-gray-500 rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-red-600 rounded-full opacity-35 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 border border-red-400 rounded-full opacity-50 animate-ping"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-red-400 mb-4 drop-shadow-lg">
              🦇 Co vás čeká v temných laboratořích? 🦇
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              💀 Připravte se na nejstrašidelnější zážitky, jaké kdy věda nabídla...
              <br />
              🧪 Experimenty, které vás donutí křičet hrůzou!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-900/80 border-2 border-red-800 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:border-red-600">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-6 border border-red-400">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-4">
                🧬 Genetické Experimenty
              </h3>
              <p className="text-gray-300">
                💀 Vytvořte si vlastní monstrum v našich temných laboratořích! 
                🧪 Experimenty s DNA duchů a upírů, které vás donutí křičet hrůzou.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gray-900/80 border-2 border-red-800 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:border-red-600">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-6 border border-red-400">
                <span className="text-2xl">👻</span>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-4">
                👻 Duchové a Nadpřirozeno
              </h3>
              <p className="text-gray-300">
                🌙 Komunikujte s duchy pomocí nejmodernějších vědeckých metod! 
                🔬 Speciální senzory a detektory pro kontakt s říší mrtvých.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gray-900/80 border-2 border-red-800 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:border-red-600">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-6 border border-red-400">
                <span className="text-2xl">⚰️</span>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-4">
                ⚰️ Anatomie Monstrů
              </h3>
              <p className="text-gray-300">
                🦴 Pitve upírů, zombie a dalších strašidelných bytostí! 
                🔬 Detailní analýza anatomie nadpřirozených tvorů.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-black to-red-800 border-t-2 border-red-600 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2 text-red-400">666+</div>
              <div className="text-red-200">💀 Obětí</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl font-bold mb-2 text-red-400">13+</div>
              <div className="text-red-200">🧪 Temných Laboratoří</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-4xl font-bold mb-2 text-red-400">24h</div>
              <div className="text-red-200">🌙 Hrůzy</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="text-4xl font-bold mb-2 text-red-400">100%</div>
              <div className="text-red-200">💀 Strachu</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/80 backdrop-blur-sm border-t-2 border-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-red-400 mb-6 drop-shadow-lg">
            🦇 Připraveni na nejstrašidelnější zážitek svého života? 🦇
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            💀 Připojte se k stovkám odvážlivců, kteří přežili naši Strašidelnou fakultu UTB! 
            <br />
            🧪 Rezervujte si místo v pekle ještě dnes a nezmeškejte tuto 
            <br />
            🌙 jedinečnou příležitost setkat se s nadpřirozenem!
          </p>
          <Link
            to="/reservations"
            className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
          >
            💀 Rezervovat místo v Pekle
          </Link>
        </div>
      </section>

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
    </div>
  );
};

export default HomePage;
