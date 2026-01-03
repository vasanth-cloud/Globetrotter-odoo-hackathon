import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI, itineraryAPI } from '../services/api';
import { ArrowLeft, Calendar, Clock, DollarSign, MapPin, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

export default function TripTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimelineData();
  }, [id]);

  const loadTimelineData = async () => {
    try {
      const [tripRes, stopsRes] = await Promise.all([
        tripsAPI.getById(id),
        itineraryAPI.getStops(id),
      ]);
      setTrip(tripRes.data);
      setStops(stopsRes.data);
      generateTimeline(stopsRes.data, tripRes.data);
    } catch (error) {
      console.error('Failed to load timeline', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (stops, trip) => {
    const timeline = [];
    let currentDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const activeStop = stops.find(stop => {
        const arrival = new Date(stop.arrival_date);
        const departure = new Date(stop.departure_date);
        return currentDate >= arrival && currentDate <= departure;
      });

      timeline.push({
        date: new Date(currentDate),
        dateStr,
        stop: activeStop,
        activities: activeStop?.activities || [],
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setTimelineData(timeline);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getShortDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getDayNumber = (date) => {
    const start = new Date(trip.start_date);
    const diffTime = Math.abs(date - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const getTimeOfDayIcon = (index) => {
    const icons = [Sunrise, Sun, Sunset, Moon];
    return icons[index % icons.length];
  };

  const getDayColor = (index) => {
    const colors = [
      'from-orange-400 to-pink-500',
      'from-blue-400 to-cyan-500',
      'from-purple-400 to-pink-500',
      'from-green-400 to-teal-500',
      'from-indigo-400 to-purple-500',
      'from-yellow-400 to-orange-500',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your timeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-4"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Trip Details</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                {trip?.name}
              </h1>
              <p className="text-gray-600 mt-2">Day-by-day timeline view</p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-xl border border-blue-100">
              <Calendar size={20} className="text-blue-600" />
              <span className="font-bold text-gray-900">{timelineData.length} Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300"></div>

          <div className="space-y-8">
            {timelineData.map((day, index) => {
              const TimeIcon = getTimeOfDayIcon(index);
              const dayColor = getDayColor(index);

              return (
                <div key={day.dateStr} className="relative">
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-8 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center z-10 border-4 border-purple-200">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${dayColor}`}></div>
                  </div>

                  {/* Day Card */}
                  <div className="md:ml-24">
                    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                      {/* Day Header */}
                      <div className={`bg-gradient-to-r ${dayColor} text-white p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                              <TimeIcon size={32} className="text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold opacity-90 uppercase tracking-wide">Day {getDayNumber(day.date)}</div>
                              <div className="text-2xl font-bold mt-1">{formatDate(day.date)}</div>
                            </div>
                          </div>
                          {day.stop && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl">
                              <MapPin size={20} />
                              <span className="font-bold text-lg">{day.stop.city.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="p-8">
                        {day.stop ? (
                          <>
                            {/* Location Info */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                <MapPin size={20} className="text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 font-medium">Location</div>
                                <div className="text-gray-900 font-semibold">
                                  {day.stop.city.name}, {day.stop.city.country}
                                </div>
                              </div>
                            </div>

                            {day.activities.length > 0 ? (
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <span className="text-2xl">📍</span>
                                  Today's Activities
                                </h3>
                                <div className="space-y-4">
                                  {day.activities.map((activity, actIndex) => (
                                    <div key={activity.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-100 hover:border-purple-200 transition-all">
                                      <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${dayColor} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                                          {actIndex + 1}
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="text-lg font-bold text-gray-900 mb-1">{activity.name}</h4>
                                          <p className="text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
                                          <div className="flex flex-wrap items-center gap-3">
                                            <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg font-medium text-sm text-gray-700 shadow-sm">
                                              <Clock size={16} className="text-blue-600" />
                                              {activity.duration_hours} hours
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg font-medium text-sm text-gray-700 shadow-sm">
                                              <DollarSign size={16} className="text-green-600" />
                                              ${activity.estimated_cost}
                                            </span>
                                            <span className={`bg-gradient-to-r ${dayColor} text-white px-4 py-2 rounded-lg font-bold text-xs uppercase shadow-sm`}>
                                              {activity.category}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Calendar size={40} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 mb-4">No activities planned for this day</p>
                                <button
                                  onClick={() => navigate(`/trips/${id}`)}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                                >
                                  Add Activities
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MapPin size={40} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500">Travel day - No destination assigned</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Trip Summary</h3>
            <p className="text-white/90 mb-6">Your complete {timelineData.length}-day journey</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">{timelineData.length}</div>
                <div className="text-sm text-white/80">Total Days</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">{stops.length}</div>
                <div className="text-sm text-white/80">Destinations</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">
                  {timelineData.reduce((sum, day) => sum + day.activities.length, 0)}
                </div>
                <div className="text-sm text-white/80">Activities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
