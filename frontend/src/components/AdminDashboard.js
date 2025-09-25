import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    timeSlot: '',
    search: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [timeChangeModal, setTimeChangeModal] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});
  const navigate = useNavigate();

  // Separate reservations by table
  const table1Reservations = reservations.filter(res => res.table_name !== 'reservations_mira');
  const table2Reservations = reservations.filter(res => res.table_name === 'reservations_mira');

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/admin');
      return;
    }
    
    fetchReservations();
    fetchTimeAvailability();
  }, [navigate]);

  const fetchReservations = async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.timeSlot) queryParams.append('time_slot', filters.timeSlot);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/backend/admin_reservations.php?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        
        // If authentication error, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('adminUser');
          navigate('/admin');
          return;
        }
        
        setError(errorData.error || `HTTP ${response.status}: Failed to fetch reservations`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.reservations) {
        setReservations(data.reservations);
        setStats(data.stats);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || 'Failed to fetch reservations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeAvailability = async () => {
    try {
      // Fetch availability for both tables
      const [table1Response, table2Response] = await Promise.all([
        fetch('/backend/get_time_availability.php'),
        fetch('/backend/get_time_availability_mira.php')
      ]);

      if (table1Response.ok && table2Response.ok) {
        const [table1Data, table2Data] = await Promise.all([
          table1Response.json(),
          table2Response.json()
        ]);

        setAvailableTimeSlots({
          table1: table1Data.availability || {},
          table2: table2Data.availability || {}
        });
      }
    } catch (err) {
      console.error('Error fetching time availability:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteReservation = async (reservation) => {
    try {
      // Determine which cancel endpoint to use based on table name
      const cancelEndpoint = reservation.table_name === 'reservations_mira' 
        ? '/backend/cancel_reservation_mira.php' 
        : '/backend/cancel_reservation.php';

      const response = await fetch(cancelEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          email: reservation.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete reservation');
        return;
      }

      // Refresh reservations list
      await fetchReservations();
      setDeleteConfirm(null);
      
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleTimeChange = async (reservation, newTimeSlot) => {
    try {
      // Determine which endpoint to use based on table name
      const changeEndpoint = reservation.table_name === 'reservations_mira' 
        ? '/backend/time_change_mira.php' 
        : '/backend/time_change.php';

      const response = await fetch(changeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          newTimeSlot: newTimeSlot
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to change time slot');
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh reservations and availability
        await fetchReservations();
        await fetchTimeAvailability();
        setTimeChangeModal(null);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || 'Failed to change time slot');
      }
      
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server session
      await fetch('/backend/admin_logout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem('adminUser');
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Reservation Management Console</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_reservations || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <span className="text-2xl">💀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Table 1</p>
                <p className="text-2xl font-semibold text-gray-900">{table1Reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🧪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Table 2</p>
                <p className="text-2xl font-semibold text-gray-900">{table2Reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Slots</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.unique_time_slots || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              <select
                name="timeSlot"
                value={filters.timeSlot}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Time Slots</option>
                <option value="15:00">15:00 - 15:10</option>
                <option value="15:10">15:10 - 15:20</option>
                <option value="15:20">15:20 - 15:30</option>
                <option value="15:30">15:30 - 15:40</option>
                <option value="15:40">15:40 - 15:50</option>
                <option value="15:50">15:50 - 16:00</option>
                <option value="16:00">16:00 - 16:10</option>
                <option value="16:10">16:10 - 16:20</option>
                <option value="16:20">16:20 - 16:30</option>
                <option value="16:30">16:30 - 16:40</option>
                <option value="16:40">16:40 - 16:50</option>
                <option value="16:50">16:50 - 17:00</option>
                <option value="17:00">17:00 - 17:10</option>
                <option value="17:10">17:10 - 17:20</option>
                <option value="17:20">17:20 - 17:30</option>
                <option value="17:30">17:30 - 17:40</option>
                <option value="17:40">17:40 - 17:50</option>
                <option value="17:50">17:50 - 18:00</option>
                <option value="18:00">18:00 - 18:10</option>
                <option value="18:10">18:10 - 18:20</option>
                <option value="18:20">18:20 - 18:30</option>
                <option value="18:30">18:30 - 18:40</option>
                <option value="18:40">18:40 - 18:50</option>
                <option value="18:50">18:50 - 19:00</option>
                <option value="19:00">19:00 - 19:10</option>
                <option value="19:10">19:10 - 19:20</option>
                <option value="19:20">19:20 - 19:30</option>
                <option value="19:30">19:30 - 19:40</option>
                <option value="19:40">19:40 - 19:50</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Team name or email..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchReservations}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Time Change Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            <p className="text-blue-800 text-sm">
              <strong>Tip:</strong> Click on time slots to modify reservation times. Available slots are shown in green.
            </p>
          </div>
        </div>

        {/* Reservations Tables - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table 1 - 💀 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💀</span>
                <h3 className="text-lg font-medium text-gray-900">Table 1</h3>
                <span className="ml-auto text-sm text-gray-500">{table1Reservations.length} reservations</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table1Reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reservation.team_name}</div>
                          <div className="text-xs text-gray-500">#{reservation.team_number}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {reservation.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => setTimeChangeModal(reservation)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-md flex items-center gap-2 group"
                        >
                          <span>⏰</span>
                          <span>{reservation.time_slot}</span>
                          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">✏️</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {reservation.team_number}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setDeleteConfirm(reservation)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition duration-200 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {table1Reservations.length === 0 && (
              <div className="text-center py-8">
                <span className="text-4xl">💀</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
                <p className="mt-1 text-sm text-gray-500">Table 1 is empty</p>
              </div>
            )}
          </div>

          {/* Table 2 - 🧪 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🧪</span>
                <h3 className="text-lg font-medium text-gray-900">Table 2</h3>
                <span className="ml-auto text-sm text-gray-500">{table2Reservations.length} reservations</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table2Reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reservation.team_name}</div>
                          <div className="text-xs text-gray-500">#{reservation.team_number}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {reservation.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => setTimeChangeModal(reservation)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-md flex items-center gap-2 group"
                        >
                          <span>⏰</span>
                          <span>{reservation.time_slot}</span>
                          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">✏️</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {reservation.team_number}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setDeleteConfirm(reservation)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition duration-200 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {table2Reservations.length === 0 && (
              <div className="text-center py-8">
                <span className="text-4xl">🧪</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
                <p className="mt-1 text-sm text-gray-500">Table 2 is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Change Modal */}
      {timeChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Time Slot</h3>
            <p className="text-gray-600 mb-4">
              Select a new time slot for <strong>{timeChangeModal.team_name}</strong>
            </p>
            
            <div className="grid grid-cols-3 gap-2 mb-6 max-h-60 overflow-y-auto">
              {[
                '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
                '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
                '17:00', '17:10', '17:20', '17:30', '17:40', '17:50',
                '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
                '19:00', '19:10', '19:20', '19:30', '19:40', '19:50'
              ].map((timeSlot) => {
                const isCurrentSlot = timeSlot === timeChangeModal.time_slot;
                const isAvailable = timeChangeModal.table_name === 'reservations_mira' 
                  ? availableTimeSlots.table2?.[timeSlot] 
                  : availableTimeSlots.table1?.[timeSlot];
                const isDisabled = isCurrentSlot || !isAvailable;
                
                return (
                  <button
                    key={timeSlot}
                    onClick={() => !isDisabled && handleTimeChange(timeChangeModal, timeSlot)}
                    disabled={isDisabled}
                    className={`px-3 py-2 text-sm rounded-md transition duration-200 ${
                      isCurrentSlot
                        ? 'bg-blue-100 text-blue-800 cursor-default'
                        : isAvailable
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {timeSlot}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setTimeChangeModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Reservation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the reservation for <strong>{deleteConfirm.team_name}</strong> 
              ({deleteConfirm.email})? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReservation(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
