import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { tripsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, MapPin, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await tripsAPI.getAll();
      setTrips(res.data);
    } catch (error) {
      console.error('Failed to load trips', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    navigate('/trips/new');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">GlobeTrotter</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Trips</h2>
            <p className="text-gray-600 mt-1">Plan and manage your travel adventures</p>
          </div>
          <button
            onClick={handleCreateTrip}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 transition"
          >
            <PlusCircle size={20} />
            New Trip
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
            <button
              onClick={handleCreateTrip}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100"
              >
                {trip.cover_photo && (
                  <img
                    src={trip.cover_photo}
                    alt={trip.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{trip.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
