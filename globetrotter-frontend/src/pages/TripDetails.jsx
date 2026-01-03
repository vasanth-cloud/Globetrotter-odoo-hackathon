import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI, citiesAPI, itineraryAPI, budgetAPI, activitiesAPI } from '../services/api';
import { ArrowLeft, MapPin, Calendar, DollarSign, Plus, Search, Trash2, X } from 'lucide-react';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCity, setShowAddCity] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityCategory, setActivityCategory] = useState('');

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    try {
      const [tripRes, stopsRes, budgetRes] = await Promise.all([
        tripsAPI.getById(id),
        itineraryAPI.getStops(id),
        budgetAPI.getSummary(id).catch(() => ({ data: { total_budget: 0 } })),
      ]);
      setTrip(tripRes.data);
      setStops(stopsRes.data);
      setBudget(budgetRes.data);
    } catch (error) {
      console.error('Failed to load trip', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query) => {
    if (query.length < 2) return;
    try {
      const res = await citiesAPI.search(query);
      setCities(res.data);
    } catch (error) {
      console.error('Failed to search cities', error);
    }
  };

  const searchActivitiesFn = async (query, category) => {
    try {
      const res = await activitiesAPI.search(query, category);
      setActivities(res.data);
    } catch (error) {
      console.error('Failed to search activities', error);
    }
  };

  const handleAddStop = async (city) => {
    try {
      const startDate = stops.length > 0 
        ? new Date(stops[stops.length - 1].departure_date)
        : new Date(trip.start_date);
      
      const arrivalDate = new Date(startDate);
      arrivalDate.setDate(arrivalDate.getDate() + (stops.length > 0 ? 1 : 0));
      
      const departureDate = new Date(arrivalDate);
      departureDate.setDate(departureDate.getDate() + 3);

      await itineraryAPI.addStop(id, {
        city_id: city.id,
        arrival_date: arrivalDate.toISOString(),
        departure_date: departureDate.toISOString(),
      });

      setShowAddCity(false);
      setSearchQuery('');
      setCities([]);
      loadTripData();
    } catch (error) {
      console.error('Failed to add stop', error);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!confirm('Remove this city from your trip?')) return;
    try {
      await itineraryAPI.deleteStop(stopId);
      loadTripData();
    } catch (error) {
      console.error('Failed to delete stop', error);
    }
  };

  const handleAddActivity = async (activity) => {
    try {
      await itineraryAPI.addActivity(selectedStop.id, {
        activity_id: activity.id,
      });
      setShowAddActivity(false);
      setActivitySearch('');
      setActivityCategory('');
      setActivities([]);
      loadTripData();
    } catch (error) {
      console.error('Failed to add activity', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{trip?.name}</h1>
            <p className="text-gray-600 mt-2">{trip?.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(trip?.start_date)} - {formatDate(trip?.end_date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {stops.length} stops
              </span>
              {budget && (
                <span className="flex items-center gap-1">
                  <DollarSign size={16} />
                  ${budget.total_budget?.toFixed(2) || '0.00'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Itinerary</h2>
              <button
                onClick={() => setShowAddCity(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add City
              </button>
            </div>

            {stops.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No stops yet</h3>
                <p className="text-gray-500 mb-6">Start building your itinerary</p>
                <button
                  onClick={() => setShowAddCity(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add First City
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 flex-1">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          {index < stops.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-300 my-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            {stop.city?.name}, {stop.city?.country}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            {formatDate(stop.arrival_date)} - {formatDate(stop.departure_date)}
                          </p>
                          {stop.city?.description && (
                            <p className="text-gray-600 text-sm mb-3">{stop.city.description}</p>
                          )}
                          
                          {/* Activities */}
                          {stop.activities && stop.activities.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="text-sm font-semibold text-gray-700">Activities:</h4>
                              {stop.activities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-800">{activity.name}</div>
                                    <div className="text-sm text-gray-600">{activity.description}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      ${activity.estimated_cost} • {activity.duration_hours}h • {activity.category}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => {
                              setSelectedStop(stop);
                              setShowAddActivity(true);
                              searchActivitiesFn('', '');
                            }}
                            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Activity
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Total Budget</div>
                <div className="text-3xl font-bold text-gray-800">
                  ${budget?.total_budget?.toFixed(2) || '0.00'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-700">Transport</span>
                  <span className="font-semibold">${budget?.transport?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-700">Accommodation</span>
                  <span className="font-semibold">${budget?.stay?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-700">Activities</span>
                  <span className="font-semibold">${budget?.activities?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-700">Meals</span>
                  <span className="font-semibold">${budget?.meals?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Other</span>
                  <span className="font-semibold">${budget?.other?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add City Modal */}
      {showAddCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Add City to Trip</h3>
              <button onClick={() => setShowAddCity(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchCities(e.target.value);
                  }}
                  placeholder="Search for a city..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {cities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => handleAddStop(city)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="font-semibold text-gray-800">{city.name}</div>
                  <div className="text-sm text-gray-600">{city.country}</div>
                  {city.description && (
                    <div className="text-sm text-gray-500 mt-1">{city.description}</div>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Cost Index: {city.cost_index}</span>
                    <span>Popularity: {city.popularity}/100</span>
                  </div>
                </div>
              ))}
              {searchQuery.length >= 2 && cities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No cities found. Try a different search term.
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowAddCity(false);
                setSearchQuery('');
                setCities([]);
              }}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Add Activity to {selectedStop?.city?.name}
              </h3>
              <button onClick={() => setShowAddActivity(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={activitySearch}
                  onChange={(e) => {
                    setActivitySearch(e.target.value);
                    searchActivitiesFn(e.target.value, activityCategory);
                  }}
                  placeholder="Search activities..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={activityCategory}
                onChange={(e) => {
                  setActivityCategory(e.target.value);
                  searchActivitiesFn(activitySearch, e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food & Dining</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="relaxation">Relaxation</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => handleAddActivity(activity)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{activity.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span className="bg-blue-100 px-2 py-1 rounded">{activity.category}</span>
                        <span>${activity.estimated_cost}</span>
                        <span>{activity.duration_hours} hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Search for activities to add to this stop
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowAddActivity(false);
                setActivitySearch('');
                setActivityCategory('');
                setActivities([]);
              }}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
