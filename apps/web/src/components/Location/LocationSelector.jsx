import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';

const POPULAR_CITIES = [
  { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
  { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
  { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 }
];

export default function LocationSelector({ 
  currentLocation, 
  onLocationChange, 
  compact = false,
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode using Nominatim (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
          const state = data.address?.state || '';
          
          onLocationChange({
            city,
            state,
            latitude,
            longitude,
            displayName: `${city}, ${state}`
          });
          setIsOpen(false);
        } catch (err) {
          // Fallback: just use coordinates
          onLocationChange({
            latitude,
            longitude,
            displayName: 'Current Location'
          });
          setIsOpen(false);
        }
        setIsLocating(false);
      },
      () => {
        setError('Unable to get your location. Please select manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCitySelect = (city) => {
    onLocationChange({
      city: city.city,
      state: city.state,
      latitude: city.lat,
      longitude: city.lng,
      displayName: `${city.city}, ${city.state}`
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=us&limit=1`
      );
      const results = await response.json();
      
      if (results.length > 0) {
        const result = results[0];
        onLocationChange({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          displayName: result.display_name.split(',').slice(0, 2).join(',')
        });
        setIsOpen(false);
        setSearchQuery('');
      } else {
        setError('Location not found. Please try a different search.');
      }
    } catch (err) {
      setError('Error searching for location');
    }
  };

  const filteredCities = POPULAR_CITIES.filter(city =>
    `${city.city} ${city.state}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayLocation = currentLocation?.displayName || 'Select Location';

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span className="truncate max-w-[150px]">{displayLocation}</span>
      </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <LocationDropdownContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              handleGetCurrentLocation={handleGetCurrentLocation}
              isLocating={isLocating}
              error={error}
              filteredCities={filteredCities}
              handleCitySelect={handleCitySelect}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-500 transition-colors w-full"
      >
        <MapPin className="w-5 h-5 text-emerald-600" />
        <span className="text-gray-700 flex-1 text-left truncate">{displayLocation}</span>
        <span className="text-emerald-600 text-sm font-medium">Change</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <LocationDropdownContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleGetCurrentLocation={handleGetCurrentLocation}
            isLocating={isLocating}
            error={error}
            filteredCities={filteredCities}
            handleCitySelect={handleCitySelect}
          />
        </div>
      )}
    </div>
  );
}

function LocationDropdownContent({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleGetCurrentLocation,
  isLocating,
  error,
  filteredCities,
  handleCitySelect
}) {
  return (
    <div className="p-4">
      {/* Search input */}
      <form onSubmit={handleSearch} className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search city or zip..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-sm"
        />
      </form>

      {/* Current location button */}
      <button
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 text-left transition-colors mb-3"
      >
        {isLocating ? (
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5 text-emerald-600" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {isLocating ? 'Detecting...' : 'Use current location'}
        </span>
      </button>

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      {/* Popular cities */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Popular Cities</p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filteredCities.map((city) => (
            <button
              key={`${city.city}-${city.state}`}
              onClick={() => handleCitySelect(city)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{city.city}, {city.state}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
