import { useState, useEffect } from 'react';
import { citiesAPI } from '../services/api';
import { Search, MapPin } from 'lucide-react';

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Cities</h1>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {city.image_url && (
                  <img
                    src={city.image_url}
                    alt={city.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{city.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin size={16} className="mr-1" />
                    {city.country}
                  </div>
                  {city.description && (
                    <p className="text-gray-600 text-sm">{city.description}</p>
                  )}
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Cost Index: {city.cost_index}</span>
                    <span className="text-blue-600 font-semibold">Popularity: {city.popularity}</span>
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
