import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Heart,
  Share2,
  ArrowUp,
  Store,
  Clock,
  User,
  ExternalLink,
  Flame,
  Zap,
  BadgeCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { formatPrice, dateAgo } from '../../lib/format';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export function SocialDealCard({ deal, index = 0 }) {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!deal || typeof deal !== 'object') return null;

  const images = deal.deal_images?.length > 0 ? deal.deal_images : (deal.image_url ? [deal.image_url] : []);
  const currentImage = images[0] || deal.featured_image || deal.image_url;

  const company = deal.company || deal.companies || {
    name: deal.merchant || 'Store',
    logo_url: null,
    is_verified: false
  };

  const submitter = deal.submitter || deal.user || {
    handle: 'anonymous',
    avatar_url: null
  };

  const discount = deal.discount_percentage ||
    (deal.price && deal.original_price && deal.original_price > deal.price
      ? Math.round(((deal.original_price - deal.price) / deal.original_price) * 100)
      : 0);

  const comments = deal.comments_count || 0;
  const votes = (deal.ups || 0) - (deal.downs || 0) + (isLiked ? 1 : 0);
  const isHot = votes > 50 || deal.is_trending;
  const isNew = deal.created_at && (Date.now() - new Date(deal.created_at).getTime()) < 24 * 60 * 60 * 1000;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Sign in to save deals');
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from saved' : 'Deal saved!');
  };

  const handleVote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Sign in to vote');
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/deal/${deal.id}`);
    toast.success('Link copied!');
  };

  return (
    <article className="h-full perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.06,
          ease: [0.215, 0.61, 0.355, 1]
        }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative h-full group"
      >
        <div className="relative h-full bg-white rounded-2xl border border-slate-200 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-300/50 transition-all duration-500 overflow-hidden flex flex-col">
          {/* Animated gradient border on hover */}
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-0 -z-10"
            animate={{ opacity: isHovered ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '1px' }}
          />

          {/* Card Link */}
          <Link 
            to={`/deal/${deal.id}`} 
            className="absolute inset-0 z-0"
            aria-label={`View deal: ${deal.title}`}
          />

          {/* Image Section */}
          <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
            {currentImage && !imageError ? (
              <motion.img
                src={currentImage}
                alt={deal.title}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                <Store className="w-10 h-10 text-slate-300 mb-2" />
                <span className="text-xs text-slate-400">No image</span>
              </div>
            )}

            {/* Dark overlay on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: isHovered ? 0.6 : 0.2 }}
              transition={{ duration: 0.3 }}
            />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {discount > 0 && (
                <motion.span 
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.06 + 0.2, type: 'spring', stiffness: 200 }}
                  className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/40"
                >
                  {discount}% OFF
                </motion.span>
              )}
              {isHot && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.06 + 0.3, type: 'spring' }}
                  className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/40 flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 animate-pulse" /> Hot
                </motion.span>
              )}
              {isNew && !isHot && !discount && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.06 + 0.3, type: 'spring' }}
                  className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/40 flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" /> New
                </motion.span>
              )}
            </div>

            {/* Heart Button - Top Right */}
            <motion.button
              onClick={handleBookmark}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.06 + 0.35, type: 'spring' }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-lg pointer-events-auto z-10
                ${isBookmarked 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/90 text-slate-500 hover:bg-rose-500 hover:text-white'}`}
            >
              <Heart className={`w-4 h-4 transition-transform ${isBookmarked ? 'fill-current scale-110' : ''}`} />
            </motion.button>

            {/* Store Badge - Bottom */}
            <motion.div 
              className="absolute bottom-3 left-3 pointer-events-auto z-10"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.06 + 0.4 }}
            >
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="" className="w-4 h-4 object-contain rounded" />
                ) : (
                  <Store className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                  {company.name}
                </span>
                {company.is_verified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </motion.div>

            {/* Quick Action - Bottom Right */}
            <motion.div 
              className="absolute bottom-3 right-3 pointer-events-auto z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(deal.deal_url, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 text-xs font-bold rounded-full shadow-lg shadow-amber-500/30 transition-all"
              >
                Get Deal <ExternalLink className="w-3 h-3" />
              </button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Title */}
            <h3 className="text-base font-bold text-slate-800 line-clamp-2 mb-3 group-hover:text-amber-600 transition-colors duration-300 leading-snug">
              {deal.title}
            </h3>

            {/* Price */}
            <div className="flex flex-col gap-1 mb-3">
              {deal.original_price > deal.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 line-through decoration-2 decoration-rose-400">
                    {formatPrice(deal.original_price)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">From</span>
                <motion.span 
                  className="text-2xl font-black text-emerald-600"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {deal.price === 0 ? 'FREE' : formatPrice(deal.price)}
                </motion.span>
              </div>
              {discount > 0 && deal.original_price > deal.price && (
                <span className="text-xs font-semibold text-emerald-600">
                  You save {formatPrice(deal.original_price - deal.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
              {deal.short_description || deal.description || 'Great deal - check it out!'}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 pointer-events-auto z-10">
              {/* Left: Time & Distance */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {dateAgo(deal.created_at)}
                </span>
                {deal.distanceKm !== undefined && deal.distanceKm !== null && (
                  <span className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                    <MapPin className="w-3 h-3" />
                    {(() => {
                      const miles = deal.distanceKm * 0.621371;
                      return miles < 0.1 
                        ? `${Math.round(miles * 5280)}ft` 
                        : `${miles.toFixed(1)}mi`;
                    })()}
                  </span>
                )}
                {!deal.distanceKm && deal.city && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {deal.city}
                  </span>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={handleVote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300
                    ${isLiked 
                      ? 'bg-amber-100 text-amber-600 border border-amber-200' 
                      : 'text-slate-500 hover:bg-amber-50 hover:text-amber-600'}`}
                >
                  <TrendingUp className={`w-4 h-4 ${isLiked ? 'text-amber-500' : ''}`} />
                  <span>{votes}</span>
                </motion.button>

                <Link 
                  to={`/deal/${deal.id}#comments`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments}</span>
                </Link>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}

export default SocialDealCard;
