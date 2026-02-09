import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useNearbyDeals(location, options = {}) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { 
    radius = 10, 
    category = null,
    cuisine = null,
    limit = 20 
  } = options;

  const fetchDeals = useCallback(async (pageNum = 1, append = false) => {
    if (!location?.latitude || !location?.longitude) return;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: location.latitude,
        lng: location.longitude,
        radius,
        limit,
        offset: (pageNum - 1) * limit
      });

      if (category) params.append('category', category);
      if (cuisine) params.append('cuisine', cuisine);

      const response = await fetch(`${API_URL}/api/deals/nearby?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby deals');
      }

      const data = await response.json();
      
      if (append) {
        setDeals(prev => [...prev, ...data.deals]);
      } else {
        setDeals(data.deals || []);
      }
      
      setHasMore((data.deals?.length || 0) >= limit);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching nearby deals:', err);
    } finally {
      setLoading(false);
    }
  }, [location, radius, category, cuisine, limit]);

  // Initial fetch when location changes
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetchDeals(1, false);
    }
  }, [location?.latitude, location?.longitude, category, cuisine]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchDeals(page + 1, true);
    }
  }, [loading, hasMore, page, fetchDeals]);

  const refresh = useCallback(() => {
    fetchDeals(1, false);
  }, [fetchDeals]);

  return { deals, loading, error, hasMore, loadMore, refresh };
}

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to get saved location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
        setLoading(false);
        return;
      } catch (e) {
        // Invalid saved location, continue to geolocation
      }
    }

    // Try to get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
            const state = data.address?.state || '';
            
            const newLocation = {
              city,
              state,
              latitude,
              longitude,
              displayName: `${city}, ${state}`
            };
            
            setLocation(newLocation);
            localStorage.setItem('userLocation', JSON.stringify(newLocation));
          } catch (err) {
            // Use coordinates only
            const newLocation = {
              latitude,
              longitude,
              displayName: 'Current Location'
            };
            setLocation(newLocation);
            localStorage.setItem('userLocation', JSON.stringify(newLocation));
          }
          setLoading(false);
        },
        () => {
          setError('Unable to get location. Please select manually.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  }, []);

  const updateLocation = useCallback((newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  }, []);

  return { location, loading, error, updateLocation };
}

export function useSaveDeal() {
  const [saving, setSaving] = useState(false);

  const saveDeal = async (dealId, authToken) => {
    if (!authToken) {
      throw new Error('Must be logged in to save deals');
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/deals/${dealId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save deal');
      }

      const data = await response.json();
      return data.saved;
    } finally {
      setSaving(false);
    }
  };

  return { saveDeal, saving };
}

export function useClaimDeal() {
  const [claiming, setClaiming] = useState(false);

  const claimDeal = async (dealId, authToken) => {
    if (!authToken) {
      throw new Error('Must be logged in to claim deals');
    }

    setClaiming(true);
    try {
      const response = await fetch(`${API_URL}/api/deals/${dealId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to claim deal');
      }

      return await response.json();
    } finally {
      setClaiming(false);
    }
  };

  return { claimDeal, claiming };
}
