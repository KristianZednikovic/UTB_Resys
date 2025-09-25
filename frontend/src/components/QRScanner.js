import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const QRScanner = () => {
  // QR States
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success handler
  const onScanSuccess = async (result) => {
    // Prevent multiple scans
    if (isProcessing) {
      console.log('Already processing a scan, ignoring...');
      return;
    }
    
    setIsProcessing(true);
    console.log('QR Code detected:', result);
    
    try {
      const parsedData = JSON.parse(result.data);
      setScannedData(parsedData);
      
      // Save to scanner table
      await saveToScannerTable(parsedData);
    } catch (parseError) {
      // If it's not JSON, treat as plain text
      const rawData = {
        rawData: result.data,
        timestamp: new Date().toISOString()
      };
      setScannedData(rawData);
      
      // Save raw data to scanner table
      await saveToScannerTable(rawData);
    }
    stopScanning();
    setIsProcessing(false);
  };

  // Save scanned data to scanner table
  const saveToScannerTable = async (data) => {
    try {
      console.log('Attempting to save scanner data:', data);
      
      // Extract data with better fallbacks
      const timeSlot = data.timeSlot || data.time_slot || data.rawData || new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
      const teamName = data.teamName || data.team_name || data.rawData || 'Scanned_' + Date.now();
      const tableNumber = data.table === 'reservations_mira' ? 2 : (data.table === 'reservations' ? 1 : 1);
      
      const payload = {
        time_slot: timeSlot,
        team_name: teamName,
        table: tableNumber
      };
      
      console.log('Sending payload:', payload);
      
      const response = await fetch('/backend/save_scanner_data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (!response.ok) {
        console.error('Failed to save scanner data:', response.status, responseData);
        setError(`Failed to save data: ${response.status}`);
      } else {
        console.log('Scanner data saved successfully');
      }
    } catch (error) {
      console.error('Error saving scanner data:', error);
      setError(`Error saving data: ${error.message}`);
    }
  };

  // Error handler
  const onScanFail = (err) => {
    console.log('Scan error:', err);
  };

  // Start scanning
  const startScanning = async () => {
    try {
      setError('');
      setScannedData(null);
      setIsScanning(true);

      if (videoEl?.current && !scanner.current) {
        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          setError('Kamera není dostupná na tomto zařízení');
          setIsScanning(false);
          return;
        }

        // Create QR Scanner instance
        scanner.current = new QrScanner(
          videoEl.current,
          onScanSuccess,
          {
            onDecodeError: onScanFail,
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
            overlay: qrBoxEl?.current || undefined,
          }
        );

        // Start QR Scanner
        await scanner.current.start();
        setQrOn(true);
      }
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError(`Chyba při spouštění kamery: ${err.message}`);
      setIsScanning(false);
      setQrOn(false);
    }
  };

  // Stop scanning
  const stopScanning = () => {
    if (scanner.current) {
      scanner.current.stop();
      scanner.current.destroy();
      scanner.current = null;
    }
    setIsScanning(false);
    setQrOn(false);
  };

  // Reset scanner
  const resetScanner = () => {
    setScannedData(null);
    setError('');
    setIsProcessing(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current.destroy();
      }
    };
  }, []);


  const formatScannedData = (data) => {
    if (data.rawData) {
      return (
        <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-red-300 mb-3">📱 Naskenovaná data</h3>
          <p className="text-gray-300 break-all">{data.rawData}</p>
          <p className="text-xs text-gray-500 mt-2">Naskenováno: {new Date(data.timestamp).toLocaleString('cs-CZ')}</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-800/50 border border-red-700 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-red-300 mb-3">📋 Informace o rezervaci</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p><span className="font-semibold text-red-300">ID rezervace:</span> {data.reservationId || 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Tým:</span> {data.teamName || 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Počet obětí:</span> {data.participantCount || 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Email:</span> {data.email || 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Čas:</span> {data.timeSlot || 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Tabulka:</span> {data.table === 'reservations_mira' ? 'Tabulka 2' : data.table === 'reservations' ? 'Tabulka 1' : 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Datum:</span> {data.date || 'N/A'}</p>
          <p><span className="font-semibold text-red-300">Naskenováno:</span> {data.timestamp ? new Date(data.timestamp).toLocaleString('cs-CZ') : 'N/A'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg">
          <p className="text-red-300 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Start Button */}
      {!isScanning && !scannedData && (
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={startScanning}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            🎯 Spustit skenování
          </button>
           <button
             onClick={async () => {
               try {
                 console.log('Testing backend connection...');
                 const response = await fetch('/backend/test_scanner.php', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ test: 'data' })
                 });
                 const data = await response.text();
                 console.log('Test response:', data);
                 setError(`Backend test: ${response.status} - ${data}`);
               } catch (err) {
                 console.error('Test error:', err);
                 setError(`Test failed: ${err.message}`);
               }
             }}
             className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
           >
             🔧 Test Backend
           </button>
           <button
             onClick={async () => {
               try {
                 console.log('Testing with mock QR data...');
                 const mockData = {
                   timeSlot: '15:30',
                   teamName: 'Test Team',
                   table: 'reservations'
                 };
                 await saveToScannerTable(mockData);
                 setError(`Mock data test completed - check console for results`);
               } catch (err) {
                 console.error('Mock test error:', err);
                 setError(`Mock test failed: ${err.message}`);
               }
             }}
             className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
           >
             🧪 Test Mock Data
           </button>
        </div>
      )}

      {/* QR Scanner */}
      <div className="qr-reader relative w-full max-w-md">
        <video 
          ref={videoEl} 
          className="w-full h-full rounded-2xl border-2 border-white"
          style={{
            display: isScanning ? 'block' : 'none',
            objectFit: 'cover',
            aspectRatio: '4/3',
            maxHeight: '20rem'
          }}
          playsInline
          muted
          autoPlay
        />
        <div ref={qrBoxEl} className="qr-box">
          {!isScanning && (
            <div className="w-full h-64 bg-gray-800 border-2 border-white rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-400 px-4">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">Kamera bude aktivována po kliknutí na "Spustit skenování"</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative w-full h-full">
              {/* Scanning frame */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
              </div>
              {/* Scanning text */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm text-center">
                📱 Namířte kameru na QR kód
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stop Button */}
      {isScanning && (
        <button
          onClick={stopScanning}
          className="mt-6 bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
        >
          ⏹️ Zastavit skenování
        </button>
      )}

      {/* Scanned Data Display */}
      {scannedData && (
        <div className="mt-8 w-full max-w-md">
          {formatScannedData(scannedData)}
        </div>
      )}

      {/* Scan Again Button */}
      {scannedData && (
        <button
          onClick={resetScanner}
          className="mt-6 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          🔄 Skenovat znovu
        </button>
      )}

      <style jsx>{`
        .qr-reader {
          width: 100%;
          max-width: 28rem;
          height: 20rem;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .qr-reader video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1rem;
          max-height: 20rem;
        }

        .qr-reader .qr-box {
          width: 100% !important;
          left: 0 !important;
        }

        .qr-box.scan-region-highlight {
          height: 0px !important;
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .qr-reader {
            width: 100%;
            height: 60vw;
            max-height: 20rem;
            overflow: hidden;
          }
          
          .qr-reader video {
            height: 100%;
            object-fit: cover;
            max-height: 20rem;
          }
        }

        @media (max-width: 426px) {
          .qr-reader {
            height: 50vw;
            max-height: 16rem;
            overflow: hidden;
          }
          
          .qr-reader video {
            max-height: 16rem;
          }
        }

        /* Ensure video works on mobile */
        @media (max-width: 768px) {
          .qr-reader video {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;