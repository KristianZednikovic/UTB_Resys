import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import LightRays from './LightRays';

const InfoPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState({ R1: [], R2: [] });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate time slots based on current time (10 minutes before)
  const generateTimeSlots = (currentTime) => {
    const slots = [];
    
    // Start 10 minutes before current time
    let currentSlot = new Date(currentTime);
    currentSlot.setMinutes(currentSlot.getMinutes() - 10);
    
    // Round to nearest 10 minutes
    const startMinute = currentSlot.getMinutes();
    const roundedMinute = Math.floor(startMinute / 10) * 10;
    currentSlot.setMinutes(roundedMinute);
    currentSlot.setSeconds(0);
    currentSlot.setMilliseconds(0);

    // Generate 10 time slots
    for (let i = 0; i < 10; i++) {
      const timeString = currentSlot.toLocaleTimeString('cs-CZ', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      slots.push({
        time: timeString,
        datetime: new Date(currentSlot)
      });
      currentSlot.setMinutes(currentSlot.getMinutes() + 10);
    }

    return slots;
  };

  // Fetch table data
  const fetchTableData = async () => {
    try {
      // Fetch data for both tables
      const [r1Response, r2Response] = await Promise.all([
        fetch('/backend/get_time_availability.php'),
        fetch('/backend/get_time_availability_mira.php')
      ]);

      const r1Data = await r1Response.json();
      const r2Data = await r2Response.json();

      // Generate time slots
      const slots = generateTimeSlots(currentTime);
      
      // Map time slots with availability data
      const r1Slots = slots.map(slot => {
        const timeKey = slot.time;
        const isAvailable = r1Data.available_times && r1Data.available_times.includes(timeKey);
        return {
          ...slot,
          available: isAvailable,
          table: 'R1'
        };
      });

      const r2Slots = slots.map(slot => {
        const timeKey = slot.time;
        const isAvailable = r2Data.available_times && r2Data.available_times.includes(timeKey);
        return {
          ...slot,
          available: isAvailable,
          table: 'R2'
        };
      });

      setTimeSlots({ R1: r1Slots, R2: r2Slots });
    } catch (error) {
      console.error('Error fetching table data:', error);
      // Generate slots without availability data
      const slots = generateTimeSlots(currentTime);
      const r1Slots = slots.map(slot => ({ ...slot, available: true, table: 'R1' }));
      const r2Slots = slots.map(slot => ({ ...slot, available: true, table: 'R2' }));
      setTimeSlots({ R1: r1Slots, R2: r2Slots });
    }
  };

  // Fetch data when component mounts and time changes
  useEffect(() => {
    fetchTableData();
  }, [currentTime]);

  const formatCurrentTime = (date) => {
    return date.toLocaleTimeString('cs-CZ', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Light Rays Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
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

      {/* Navigation */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              📊 Informace o rezervacích
            </h1>
            <div className="text-2xl text-white mb-6">
              Aktuální čas: <span className="text-blue-400 font-mono">{formatCurrentTime(currentTime)}</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-900/80 border-2 border-white rounded-3xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b-2 border-white">
                    <th className="text-left py-4 px-6 text-xl font-bold">R1</th>
                    <th className="text-left py-4 px-6 text-xl font-bold">R2</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.R1.map((slot, index) => (
                    <tr key={index} className="border-b border-gray-600">
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-mono">{slot.time}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            slot.available 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {slot.available ? 'Volné' : 'Obsazeno'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-mono">{timeSlots.R2[index].time}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            timeSlots.R2[index].available 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {timeSlots.R2[index].available ? 'Volné' : 'Obsazeno'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              <span className="text-white">Volné</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-white">Obsazeno</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
