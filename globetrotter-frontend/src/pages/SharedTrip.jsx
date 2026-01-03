import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI, itineraryAPI } from '../services/api';
import { Calendar, MapPin, DollarSign, Clock, Share2, Copy, CheckCircle, Globe, Users, Heart } from 'lucide-react';

export default function SharedTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSharedTrip();
  }, [id]);

  const loadSharedTrip = async () => {
    try {
      const [tripRes, stopsRes] = await Promise.all([
        tripsAPI.getById(id),
        itineraryAPI.getStops(id),
      ]);
      setTrip(tripRes.data);
      setStops(stopsRes.data);
    } catch (error) {
      console.error('Failed to load shared trip', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotalCost = () => {
    return stops.reduce((total, stop) => {
      const activitiesCost = stop.activities?.reduce((sum, act) => sum + parseFloat(act.estimated_cost || 0), 0) || 0;
      return total + activitiesCost;
    }, 0);
  };

  const getTripDuration = () => {
    if (trip?.start_date && trip?.end_date) {
      const days = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));
      return days;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading amazing journey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
              <Share2 size={16} />
              <span className="text-sm font-semibold">Public Itinerary</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:shadow-xl transition-all hover:scale-105 font-semibold"
            >
              {copied ? (
                <>
                  <CheckCircle size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{trip?.name}</h1>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
              {trip?.description || 'An amazing journey waiting to be explored'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-white/80" />
                <span className="text-xs text-white/80 font-medium uppercase">Duration</span>
              </div>
              <div className="text-2xl font-bold">{getTripDuration()} Days</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-white/80" />
                <span className="text-xs text-white/80 font-medium uppercase">Destinations</span>
              </div>
              <div className="text-2xl font-bold">{stops.length}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-white/80" />
                <span className="text-xs text-white/80 font-medium uppercase">Budget</span>
              </div>
              <div className="text-2xl font-bold">${calculateTotalCost().toFixed(0)}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={20} className="text-white/80" />
                <span className="text-xs text-white/80 font-medium uppercase">Activities</span>
              </div>
              <div className="text-2xl font-bold">
                {stops.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0)}
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="mt-6 text-white/90">
            <span className="font-medium">{formatDate(trip?.start_date)} → {formatDate(trip?.end_date)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trip Itinerary</h2>
            <p className="text-gray-600 mt-1">Follow this journey day by day</p>
          </div>
        </div>
        
        {stops.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations yet</h3>
            <p className="text-gray-600">This trip is still being planned</p>
          </div>
        ) : (
          <div className="space-y-8">
            {stops.map((stop, index) => (
              <div key={stop.id} className="group">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Stop Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center font-bold text-xl flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-2">
                            {stop.city?.name}, {stop.city?.country}
                          </h3>
                          <div className="flex items-center gap-2 text-white/90">
                            <Calendar size={16} />
                            <span className="font-medium">
                              {formatDate(stop.arrival_date)} - {formatDate(stop.departure_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <MapPin size={32} className="text-white/30" />
                    </div>
                  </div>

                  {/* Stop Content */}
                  <div className="p-8">
                    {stop.city?.description && (
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">{stop.city.description}</p>
                    )}

                    {stop.activities && stop.activities.length > 0 && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          Planned Activities
                        </h4>
                        <div className="grid gap-4">
                          {stop.activities.map((activity, actIndex) => (
                            <div key={activity.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-100 hover:border-purple-200 transition-colors">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {actIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-lg font-bold text-gray-900 mb-1">{activity.name}</h5>
                                  <p className="text-gray-600 mb-3">{activity.description}</p>
                                  <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg font-medium text-gray-700">
                                      <Clock size={16} className="text-blue-600" />
                                      {activity.duration_hours}h
                                    </span>
                                    <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg font-medium text-gray-700">
                                      <DollarSign size={16} className="text-green-600" />
                                      ${activity.estimated_cost}
                                    </span>
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase">
                                      {activity.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < stops.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-purple-300 to-blue-300 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Love This Itinerary?</h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Create your own personalized trip and start planning your next adventure with GlobeTrotter
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-purple-600 px-10 py-5 rounded-xl hover:shadow-2xl transition-all hover:scale-105 font-bold text-lg inline-flex items-center gap-3"
            >
              <Globe size={24} />
              Start Planning Your Trip
            </button>
            <p className="mt-4 text-white/80 text-sm">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="underline font-bold hover:text-white">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
