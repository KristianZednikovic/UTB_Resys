import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

const HomePage = () => {
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
            <div className="flex justify-center space-x-6">
              <button className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer hover:animate-pulse">
                ⚰️ Ochrana duší
              </button>
              <button className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer hover:animate-pulse">
                💀 Podmínky přežití
              </button>
              <button className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer hover:animate-pulse">
                👻 Kontakt s duchy
              </button>
            </div>
            <div className="mt-6 text-gray-500 text-sm">
              🌙 "Věda a nadpřirozeno se setkávají v temnotě..." 🌙
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
