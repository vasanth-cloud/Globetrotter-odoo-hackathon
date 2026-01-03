import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { Plus, Calendar, MapPin, DollarSign, Trash2, User, LogOut, TrendingUp, Globe } from 'lucide-react';

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
      setTrips(response.data);
    } catch (error) {
      console.error('Failed to load trips', error);
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripDuration = (start, end) => {
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getTripStatus = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    return start > now ? 'upcoming' : 'completed';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your adventures...</p>
        </div>
      </div>
    );
  };

  const upcomingTrips = trips.filter(trip => getTripStatus(trip.start_date) === 'upcoming');
  const completedTrips = trips.filter(trip => getTripStatus(trip.start_date) === 'completed');
  const totalDestinations = trips.reduce((sum, trip) => sum + (trip.stop_count || 0), 0);
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.total_budget || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Ready for your next adventure?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <User size={18} />
                <span className="hidden sm:inline font-medium">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">TOTAL</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{trips.length}</p>
            <p className="text-sm text-gray-500 mt-1">Trip{trips.length !== 1 ? 's' : ''} Planned</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe size={20} className="text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">PLACES</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalDestinations}</p>
            <p className="text-sm text-gray-500 mt-1">Destination{totalDestinations !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">UPCOMING</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{upcomingTrips.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active Trip{upcomingTrips.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">BUDGET</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalBudget.toFixed(0)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Planned</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
            <p className="text-gray-600 text-sm mt-1">
              {trips.length === 0 ? 'No trips planned yet' : `Managing ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
          >
            <Plus size={20} />
            New Trip
          </button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={48} className="text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Journey Starts Here</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Create your first trip and discover amazing destinations around the world. Plan every detail and make memories that last forever.
              </p>
              <button
                onClick={() => navigate('/create-trip')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-semibold text-lg"
              >
                <Plus size={24} />
                Plan Your First Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const duration = getTripDuration(trip.start_date, trip.end_date);
              const status = getTripStatus(trip.start_date);
              
              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:scale-105"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        status === 'upcoming' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-1">
                        {trip.name}
                      </h3>
                      <p className="text-white/90 text-sm mt-1 font-medium">{duration} day{duration !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed min-h-[40px]">
                      {trip.description || 'No description provided'}
                    </p>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar size={16} className="text-blue-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={16} className="text-purple-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {trip.stop_count || 0} destination{(trip.stop_count || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {trip.total_budget > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign size={16} className="text-green-600" />
                          </div>
                          <span className="text-gray-700 font-medium">
                            ${trip.total_budget.toFixed(2)} budget
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip.id}`);
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors font-semibold text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => handleDeleteTrip(trip.id, e)}
                        className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
