import { useState, useEffect } from 'react';
import { citiesAPI } from '../services/api';
import { Search, MapPin, TrendingUp, DollarSign, Globe, Star } from 'lucide-react';

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('all');

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const res = await citiesAPI.search('');
      setCities(res.data);
    } catch (error) {
      console.error('Failed to load cities', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      loadCities();
      return;
    }
    try {
      const res = await citiesAPI.search(query);
      setCities(res.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const getCountries = () => {
    const countries = [...new Set(cities.map(city => city.country))];
    return countries.sort();
  };

  const filteredCities = selectedCountry === 'all' 
    ? cities 
    : cities.filter(city => city.country === selectedCountry);

  const getCostLevel = (costIndex) => {
    if (costIndex <= 30) return { label: 'Budget', color: 'text-green-600 bg-green-100' };
    if (costIndex <= 60) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Premium', color: 'text-purple-600 bg-purple-100' };
  };

  const getPopularityStars = (popularity) => {
    return Math.round((popularity / 100) * 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <Globe size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Explore Destinations</h1>
            <p className="text-gray-600 text-lg">Discover amazing cities around the world</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Box */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Cities
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Type city name..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                >
                  <option value="all">All Countries</option>
                  {getCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-bold text-gray-900">{filteredCities.length}</span> destination{filteredCities.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Cities Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Discovering amazing destinations...</p>
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No cities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => {
              const costLevel = getCostLevel(city.cost_index);
              const stars = getPopularityStars(city.popularity);

              return (
                <div
                  key={city.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer"
                >
                  {/* City Image */}
                  {city.image_url ? (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={city.image_url}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{city.name}</h3>
                        <div className="flex items-center text-white/90 text-sm mt-1">
                          <MapPin size={16} className="mr-1" />
                          {city.country}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="text-center text-white">
                        <MapPin size={48} className="mx-auto mb-2 opacity-80" />
                        <h3 className="text-2xl font-bold">{city.name}</h3>
                        <p className="text-white/90 text-sm mt-1">{city.country}</p>
                      </div>
                    </div>
                  )}

                  {/* City Details */}
                  <div className="p-6">
                    {city.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {city.description}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Cost Level */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign size={16} className="text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">Cost Level</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${costLevel.color}`}>
                          {costLevel.label}
                        </span>
                      </div>

                      {/* Popularity */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={16} className="text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">Popularity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-center flex-1">
                        <div className="text-xs text-gray-500 mb-1">Cost Index</div>
                        <div className="text-lg font-bold text-gray-900">{city.cost_index}</div>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div className="text-center flex-1">
                        <div className="text-xs text-gray-500 mb-1">Rating</div>
                        <div className="text-lg font-bold text-blue-600">{city.popularity}/100</div>
                      </div>
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
