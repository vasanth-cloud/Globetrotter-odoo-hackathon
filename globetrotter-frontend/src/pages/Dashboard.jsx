import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { Plus, Calendar, MapPin, Trash2, User, LogOut, Globe } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadTrips();
    loadUser();
  }, []);

  const loadUser = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  };

  const loadTrips = async () => {
    try {
      const response = await tripsAPI.getAll();
      setTrips(response.data || []);
    } catch (error) {
      console.error('Failed to load trips', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await tripsAPI.delete(id);
      loadTrips();
    } catch (error) {
      console.error('Failed to delete trip', error);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe size={32} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GlobeTrotter</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name || 'Traveler'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Trips</h2>
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
          >
            <Plus size={20} />
            Create Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Create your first trip to start planning</p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white px-4 text-center">{trip.name}</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description || 'No description'}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} />
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} />
                      {trip.stop_count || 0} stops
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trips/${trip.id}`);
                      }}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
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
