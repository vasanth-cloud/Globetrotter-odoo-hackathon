import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI, itineraryAPI } from '../services/api';
import { ArrowLeft, Calendar, Clock, DollarSign, MapPin } from 'lucide-react';

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
      
      // Find which stop this date belongs to
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
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDayNumber = (date) => {
    const start = new Date(trip.start_date);
    const diffTime = Math.abs(date - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Trip
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{trip?.name} Timeline</h1>
              <p className="text-gray-600 mt-2">Day-by-day itinerary view</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={18} />
              {timelineData.length} days
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {timelineData.map((day, index) => (
            <div key={day.dateStr} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium opacity-90">Day {getDayNumber(day.date)}</div>
                    <div className="text-xl font-bold">{formatDate(day.date)}</div>
                  </div>
                  {day.stop && (
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <MapPin size={18} />
                      <span className="font-semibold">{day.stop.city.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {day.stop ? (
                  <>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin size={16} />
                      <span className="text-sm">
                        {day.stop.city.name}, {day.stop.city.country}
                      </span>
                    </div>

                    {day.activities.length > 0 ? (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 mb-3">Activities</h3>
                        {day.activities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                              <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {activity.duration_hours}h
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign size={14} />
                                  ${activity.estimated_cost}
                                </span>
                                <span className="bg-blue-100 px-2 py-1 rounded">
                                  {activity.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No activities planned for this day</p>
                        <button
                          onClick={() => navigate(`/trips/${id}`)}
                          className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Add Activities
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No destination for this day</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
