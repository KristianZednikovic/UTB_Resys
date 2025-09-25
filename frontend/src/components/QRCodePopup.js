import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

const QRCodePopup = ({ isOpen, onClose, reservationData }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  const generateQRCode = useCallback(async () => {
    try {
      // Create QR code data with reservation information
      const qrData = {
        reservationId: reservationData.id,
        teamName: reservationData.team_name,
        email: reservationData.email,
        timeSlot: reservationData.time_slot,
        participantCount: reservationData.team_number,
        table: reservationData.table || 'table1', // Include table information
        date: new Date().toLocaleDateString('cs-CZ'),
        timestamp: new Date().toISOString()
      };

      // Convert to JSON string for QR code
      const qrString = JSON.stringify(qrData);
      
      // Generate QR code as data URL
      const dataURL = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000', // Black QR code
          light: '#ffffff' // White background
        }
      });
      
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [reservationData]);

  useEffect(() => {
    if (isOpen && reservationData) {
      generateQRCode();
    }
  }, [isOpen, reservationData, generateQRCode]);

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `reservation-${reservationData?.id || 'qr'}.png`;
      link.href = qrCodeDataURL;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200 text-2xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-400 mb-2 drop-shadow-lg">
            💀 QR Kód Rezervace v Pekle 💀
          </h2>
          <p className="text-gray-300">
            Naskenujte tento QR kód pro rychlý přístup k informacím o vaší rezervaci
          </p>
        </div>

        {/* QR Code Display */}
        <div className="text-center mb-6">
          {qrCodeDataURL ? (
            <div className="bg-white p-4 rounded-2xl border-2 border-red-400 inline-block">
              <img 
                src={qrCodeDataURL} 
                alt="QR Code" 
                className="w-64 h-64 mx-auto"
              />
            </div>
          ) : (
            <div className="w-64 h-64 bg-gray-800 border-2 border-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-300">Generuji QR kód...</p>
              </div>
            </div>
          )}
        </div>

        {/* Reservation Info */}
        {reservationData && (
          <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-300 mb-3">📋 Informace o rezervaci</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-semibold text-red-300">Tým:</span> {reservationData.team_name}</p>
              <p><span className="font-semibold text-red-300">Počet obětí:</span> {reservationData.team_number}</p>
              <p><span className="font-semibold text-red-300">Čas:</span> {reservationData.time_slot}</p>
              <p><span className="font-semibold text-red-300">Email:</span> {reservationData.email}</p>
              <p><span className="font-semibold text-red-300">Tabulka:</span> {reservationData.table === 'reservations_mira' ? 'Tabulka 2' : 'Tabulka 1'}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadQRCode}
            disabled={!qrCodeDataURL}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-red-400 hover:border-red-300 shadow-red-500/50"
          >
            📱 Stáhnout QR Kód
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 border border-red-600 hover:border-red-500"
          >
            👻 Zavřít
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🌙 QR kód obsahuje všechny informace o vaší rezervaci v temných laboratořích
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
