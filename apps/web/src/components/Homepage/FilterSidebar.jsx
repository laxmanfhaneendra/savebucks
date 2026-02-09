import React, { useState, useRef, useEffect } from 'react';
import {
  Flame,
  Clock,
  Smartphone,
  Home,
  Sparkles,
  DollarSign,
  Truck,
  Gift,
  Zap,
  Gamepad2,
  Book,
  Dumbbell,
  Heart,
  PawPrint,
  Percent,
  Coffee,
  Star,
  MapPin,
  Navigation,
  Loader2,
  Search,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '../ui/Separator';
import { useLocation } from '../../context/LocationContext';

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

const FILTERS = [
  { id: 'all', label: 'All Deals', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
  { id: 'near-you', label: 'Near You', icon: MapPin, color: 'from-sky-500 to-blue-500' },
  { id: 'trending', label: 'Trending', icon: Flame, color: 'from-rose-500 to-red-500' },
  { id: '50-off', label: '50%+ Off', icon: Percent, color: 'from-pink-500 to-rose-500' },
  { id: 'under-20', label: 'Under $20', icon: DollarSign, color: 'from-emerald-500 to-green-500' },
  { id: 'under-50', label: 'Under $50', icon: DollarSign, color: 'from-cyan-500 to-teal-500' },
  { id: 'free-shipping', label: 'Free Ship', icon: Truck, color: 'from-blue-500 to-cyan-500' },
  { id: 'ending-soon', label: 'Ending Soon', icon: Clock, color: 'from-orange-500 to-amber-500' },
  { id: 'new-arrivals', label: 'New', icon: Zap, color: 'from-green-500 to-emerald-500' },
  { id: 'freebies', label: 'Free Stuff', icon: Gift, color: 'from-fuchsia-500 to-pink-500' },
];


const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: Smartphone, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'fashion', label: 'Fashion', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'home', label: 'Home', icon: Home, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'toys', label: 'Toys & Games', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'sports', label: 'Sports', icon: Dumbbell, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'books', label: 'Books', icon: Book, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'food', label: 'Food', icon: Coffee, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'pets', label: 'Pets', icon: PawPrint, color: 'text-teal-400', bg: 'bg-teal-500/10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 }
};

export function FilterSidebar({ activeFilter = 'all', onFilterChange, activeCategory, onCategoryChange }) {
  const { location, getCurrentLocation, setManualLocation, isLoading: locationLoading } = useLocation();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowLocationSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNearYouClick = async (filterId) => {
    if (filterId === 'near-you' && !location) {
      // Request location first
      try {
        await getCurrentLocation();
      } catch (e) {
        console.warn('Could not get location');
      }
    }
    onFilterChange(filterId);
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=us&limit=1`
      );
      const results = await response.json();

      if (results.length > 0) {
        const result = results[0];
        const displayParts = result.display_name.split(',');
        const displayName = displayParts.slice(0, 2).join(',').trim();
        
        setManualLocation({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: {
            display: displayName,
            full: result.display_name
          },
          timestamp: Date.now()
        });
        setShowLocationSearch(false);
        setSearchQuery('');
      } else {
        setSearchError('Location not found. Try a city name or zip code.');
      }
    } catch (err) {
      setSearchError('Error searching. Please try again.');
    }
    setIsSearching(false);
  };

  const handleCitySelect = (city) => {
    setManualLocation({
      latitude: city.lat,
      longitude: city.lng,
      address: {
        city: city.city,
        state: city.state,
        display: `${city.city}, ${city.state}`,
        full: `${city.city}, ${city.state}, USA`
      },
      timestamp: Date.now()
    });
    setShowLocationSearch(false);
    setSearchQuery('');
  };

  const filteredCities = searchQuery
    ? POPULAR_CITIES.filter(city =>
        `${city.city} ${city.state}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : POPULAR_CITIES;

  return (
    <aside className="space-y-8">
      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-xl p-4 border border-slate-700"
        ref={searchRef}
      >
        <button
          onClick={() => setShowLocationSearch(!showLocationSearch)}
          className="w-full flex items-center gap-3 mb-3 text-left"
        >
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400">Your Location</p>
            <p className="text-sm font-medium text-white truncate">
              {location?.address?.display || 'Not set'}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showLocationSearch ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showLocationSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Search Input */}
              <form onSubmit={handleLocationSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any US city or zip..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm text-white placeholder-slate-400"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 animate-spin" />
                )}
              </form>

              {searchError && (
                <p className="text-xs text-red-400 mb-2">{searchError}</p>
              )}

              {/* Popular Cities */}
              <div className="max-h-40 overflow-y-auto scrollbar-hide space-y-1 mb-3">
                <p className="text-xs text-slate-500 uppercase font-medium mb-2">Popular Cities</p>
                {filteredCities.map((city) => (
                  <button
                    key={`${city.city}-${city.state}`}
                    onClick={() => handleCitySelect(city)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700 text-left transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="text-sm text-slate-300">{city.city}, {city.state}</span>
                  </button>
                ))}
              </div>

              <Separator className="bg-slate-700/50 mb-3" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto Detect Button */}
        <button
          onClick={() => getCurrentLocation()}
          disabled={locationLoading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all"
        >
          {locationLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              {location ? 'Use Current Location' : 'Detect My Location'}
            </>
          )}
        </button>
      </motion.div>

      {/* Filters */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Discover
        </h3>
        <motion.div 
          className="space-y-1.5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;

            return (
              <motion.div key={filter.id} variants={itemVariants}>
                <motion.button
                  onClick={() => handleNearYouClick(filter.id)}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold 
                    transition-all duration-300
                    ${isActive
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  <span>{filter.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <Separator className="bg-slate-700/50" />

      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
          <Star className="w-3 h-3 text-amber-500" />
          Categories
        </h3>
        <motion.div 
          className="grid grid-cols-2 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.div key={category.id} variants={itemVariants}>
                <motion.button
                  onClick={() => onCategoryChange(isActive ? null : category.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    w-full flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-xs font-semibold 
                    transition-all duration-300
                    ${isActive
                      ? `${category.bg} ${category.color} ring-2 ring-amber-500/50`
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-700/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${category.color}`} />
                  <span>{category.label}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </aside>
  );
}
