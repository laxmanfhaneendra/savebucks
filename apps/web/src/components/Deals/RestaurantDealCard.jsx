import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Star, 
  Bookmark, 
  BookmarkCheck,
  Tag,
  Utensils
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RestaurantDealCard({ 
  deal, 
  distance,
  onSave,
  isSaved = false,
  showDistance = true,
  className = '' 
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onSave) return;
    
    setSaving(true);
    try {
      await onSave(deal.id);
      setSaved(!saved);
    } catch (err) {
      console.error('Failed to save deal:', err);
    }
    setSaving(false);
  };

  const formatDiscount = () => {
    if (deal.deal_type === 'percentage') {
      return `${deal.discount_value}% OFF`;
    } else if (deal.deal_type === 'fixed') {
      return `$${deal.discount_value} OFF`;
    } else if (deal.deal_type === 'bogo') {
      return 'BOGO';
    } else if (deal.deal_type === 'freebie') {
      return 'FREE ITEM';
    }
    return deal.discount_text || 'DEAL';
  };

  const formatExpiry = () => {
    if (!deal.valid_until) return null;
    const expiryDate = new Date(deal.valid_until);
    const now = new Date();
    const diffHours = (expiryDate - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'Expired';
    if (diffHours < 24) return `Ends in ${Math.round(diffHours)}h`;
    return `Ends ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
  };

  const restaurant = deal.company || deal.restaurant || {};
  const expiry = formatExpiry();
  const isExpiringSoon = expiry && (expiry.includes('Ends in') || expiry.includes('today'));

  return (
    <Link 
      to={`/deal/${deal.id}`}
      className={`block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all ${className}`}
    >
      {/* Image section */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-teal-50">
        {deal.image_url ? (
          <img 
            src={deal.image_url} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        ) : restaurant.logo_url ? (
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-12 h-12 text-emerald-300" />
          </div>
        )}

        {/* Discount badge */}
        <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
          {formatDiscount()}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 text-emerald-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Cuisine tag */}
        {restaurant.cuisine_type && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {Array.isArray(restaurant.cuisine_type) 
              ? restaurant.cuisine_type[0] 
              : restaurant.cuisine_type}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Restaurant info */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {restaurant.name || 'Restaurant'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              {restaurant.avg_rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {restaurant.avg_rating?.toFixed(1)}
                </span>
              )}
              {restaurant.price_range && (
                <span className="text-gray-400">{restaurant.price_range}</span>
              )}
              {showDistance && distance !== undefined && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {distance < 1 ? `${Math.round(distance * 5280)} ft` : `${distance.toFixed(1)} mi`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Deal title */}
        <p className="text-gray-700 font-medium line-clamp-2 mb-3">
          "{deal.title}"
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {expiry && (
            <span className={`flex items-center gap-1 text-sm ${
              isExpiringSoon ? 'text-orange-600 font-medium' : 'text-gray-500'
            }`}>
              <Clock className="w-4 h-4" />
              {expiry}
            </span>
          )}

          {deal.promo_code && (
            <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
              <Tag className="w-3.5 h-3.5" />
              Code Available
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Compact variant for lists
export function RestaurantDealCardCompact({ deal, distance, onSave, isSaved }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onSave) return;
    
    setSaving(true);
    try {
      await onSave(deal.id);
      setSaved(!saved);
    } catch (err) {
      console.error('Failed to save deal:', err);
    }
    setSaving(false);
  };

  const restaurant = deal.company || deal.restaurant || {};

  return (
    <Link 
      to={`/deal/${deal.id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 flex-shrink-0 overflow-hidden">
        {deal.image_url || restaurant.logo_url ? (
          <img 
            src={deal.image_url || restaurant.logo_url} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-6 h-6 text-emerald-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            {deal.discount_value ? `${deal.discount_value}% OFF` : 'DEAL'}
          </span>
          {distance !== undefined && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {distance.toFixed(1)} mi
            </span>
          )}
        </div>
        <h4 className="font-medium text-gray-900 truncate">{restaurant.name}</h4>
        <p className="text-sm text-gray-600 truncate">{deal.title}</p>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors"
      >
        {saved ? (
          <BookmarkCheck className="w-5 h-5 text-emerald-600" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
      </button>
    </Link>
  );
}
