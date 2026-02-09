import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { toast } from '../../lib/toast'
import { formatPrice, dateAgo, truncate } from '../../lib/format'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Tag,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Bookmark,
  BadgeCheck,
  Sparkles,
  Zap,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import ReviewsAndRatings from '../../components/Deal/ReviewsAndRatings'
import { ModernEmptyState } from '../../components/EmptyState/ModernEmptyState'

// Compact Image Gallery
const CompactGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const validImages = Array.isArray(images) ? images.filter(Boolean) : []

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <span className="text-sm">No image</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <motion.div
        className="aspect-square bg-white rounded-xl border border-slate-200 p-3 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ImageWithFallback
          src={validImages[activeIndex]}
          alt={title}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {validImages.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {validImages.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-12 h-12 flex-shrink-0 rounded-lg border-2 p-1 transition-all ${i === activeIndex
                  ? 'border-violet-500 ring-2 ring-violet-200'
                  : 'border-slate-200 hover:border-slate-300'
                }`}
            >
              <ImageWithFallback src={img} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Inline Price Badge
const PriceBadge = ({ deal }) => {
  const hasDiscount = deal.original_price && deal.original_price > deal.price
  const discount = hasDiscount
    ? Math.round(((deal.original_price - deal.price) / deal.original_price) * 100)
    : deal.discount_percentage

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-2xl font-bold text-emerald-600">
        {formatPrice(deal.price)}
      </span>

      {hasDiscount && (
        <span className="text-base text-slate-400 line-through">
          {formatPrice(deal.original_price)}
        </span>
      )}

      {discount > 0 && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-2.5 py-1 text-white text-sm font-bold rounded-full ${discount >= 50
              ? 'bg-gradient-to-r from-red-500 to-pink-500'
              : discount >= 30
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
        >
          -{discount}%
        </motion.span>
      )}
    </div>
  )
}

// Coupon Code Component
const CouponCode = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-amber-50 border border-dashed border-amber-300 rounded-lg px-3 py-2"
    >
      <Tag className="w-4 h-4 text-amber-600" />
      <code className="font-mono font-bold text-amber-900 flex-1">{code}</code>
      <motion.button
        onClick={handleCopy}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded font-medium transition-colors ${copied
            ? 'bg-emerald-600 text-white'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
      >
        <Copy className="w-3 h-3" />
        {copied ? 'Copied!' : 'Copy'}
      </motion.button>
    </motion.div>
  )
}

// Vote Buttons
const VoteButtons = ({ deal, onVote }) => (
  <div className="flex items-center gap-2">
    <motion.button
      onClick={() => onVote('up')}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${deal?.userVote === 1
          ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200'
          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
        }`}
    >
      <ThumbsUp className="w-4 h-4" />
      <span>{deal.upvotes || 0}</span>
    </motion.button>

    <motion.button
      onClick={() => onVote('down')}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${deal?.userVote === -1
          ? 'bg-red-100 text-red-700 ring-2 ring-red-200'
          : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
        }`}
    >
      <ThumbsDown className="w-4 h-4" />
      <span>{deal.downvotes || 0}</span>
    </motion.button>

    <span className="text-sm text-slate-500 ml-2">
      Score: <span className="font-bold text-slate-900">{(deal.upvotes || 0) - (deal.downvotes || 0)}</span>
    </span>
  </div>
)

// Trust Badges Inline
const TrustBadges = () => (
  <div className="flex items-center gap-4 text-xs text-slate-500">
    <div className="flex items-center gap-1.5">
      <Shield className="w-4 h-4 text-emerald-500" />
      <span>Secure</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Truck className="w-4 h-4 text-blue-500" />
      <span>Fast delivery</span>
    </div>
    <div className="flex items-center gap-1.5">
      <RotateCcw className="w-4 h-4 text-purple-500" />
      <span>Easy returns</span>
    </div>
  </div>
)

// Main Component
export default function StreamlinedDealPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Fetch deal
  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => api.getDeal(id),
    enabled: !!id
  })

  // Mutations
  const bookmarkMutation = useMutation({
    mutationFn: (dealId) => api.toggleBookmark(dealId),
    onSuccess: () => {
      setIsBookmarked(!isBookmarked)
      toast.success(isBookmarked ? 'Removed from saves' : 'Saved!')
    }
  })

  const voteMutation = useMutation({
    mutationFn: ({ dealId, vote }) => {
      const value = vote === 'up' ? 1 : vote === 'down' ? -1 : null
      return api.voteDeal(dealId, value)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['deal', id])
      toast.success('Vote recorded')
    },
    onError: () => toast.error('Failed to vote')
  })

  const handleVote = (vote) => {
    if (!user) {
      toast.error('Please login to vote')
      return
    }
    const currentVote = deal?.userVote
    const newVote = currentVote === vote ? null : vote
    voteMutation.mutate({ dealId: id, vote: newVote })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: deal.title,
          url: window.location.href
        })
      } catch {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied!')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-pulse">
            <div className="lg:col-span-2">
              <div className="aspect-square bg-slate-200 rounded-xl" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-8 bg-slate-200 rounded w-1/2" />
              <div className="h-32 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error
  if (error || !deal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-md w-full">
          <ModernEmptyState
            type="notFound"
            title="Deal Not Found"
            description="This deal might have expired or been removed."
            action={{
              label: 'Browse All Deals',
              onClick: () => navigate('/')
            }}
          />
        </div>
      </div>
    )
  }

  const images = [
    deal.featured_image,
    ...(Array.isArray(deal.deal_images) ? deal.deal_images : []),
    deal.image_url
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-20">
      {/* Navigation Header */}
      <div className="fixed top-14 inset-x-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-4 h-10 flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-violet-600 flex-shrink-0">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-300" />
          {deal.categories && (
            <>
              <Link to={`/category/${deal.categories.slug}`} className="hover:text-violet-600 flex-shrink-0 whitespace-nowrap">
                {deal.categories.name}
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-300" />
            </>
          )}
          <span className="text-slate-900 truncate">{deal.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left: Image (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CompactGallery images={images} title={deal.title} />
              </motion.div>
              
              {/* Trust Badges on Desktop */}
              <div className="hidden lg:block bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <TrustBadges />
              </div>
            </div>
          </div>

          {/* Right: Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Title & Meta */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 lg:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 flex gap-2">
                 <motion.button
                    onClick={() => user ? bookmarkMutation.mutate(id) : toast.error('Login to save')}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-xl transition-colors ${isBookmarked ? 'bg-red-50 text-red-500' : 'bg-slate-50 hover:bg-slate-100 text-slate-400'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
              </div>

              <div className="pr-24"> {/* Space for buttons */}
                 <div className="flex items-center gap-2 mb-3">
                    {deal.companies && (
                       <Link
                          to={`/company/${deal.companies.slug}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                          {deal.companies.logo_url && (
                             <img src={deal.companies.logo_url} className="w-3.5 h-3.5 object-contain" alt="" />
                          )}
                          {deal.companies.name}
                        </Link>
                    )}
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                       <Clock className="w-3 h-3" /> {dateAgo(deal.created_at)}
                    </span>
                 </div>
                 
                 <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
                    {deal.title}
                 </h1>
                 
                 <PriceBadge deal={deal} />
                 
                  {deal.original_price && deal.original_price > deal.price && (
                    <p className="mt-3 text-sm text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 inline-block px-3 py-1.5 rounded-lg border border-emerald-100">
                      <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      You save {formatPrice(deal.original_price - deal.price)}
                    </p>
                  )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                 <div className="w-full sm:flex-1">
                    <motion.a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => api.trackDealClick(deal.id).catch(() => { })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-slate-200 transition-all"
                    >
                      Get This Deal
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                 </div>
                 <div className="w-full sm:w-auto">
                    <VoteButtons deal={deal} onVote={handleVote} />
                 </div>
              </div>
              
               {deal.coupon_code && (
                <div className="mt-5">
                  <CouponCode code={deal.coupon_code} />
                </div>
              )}
            </div>

            {/* Description */}
            {deal.description && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 lg:p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <BadgeCheck className="w-5 h-5 text-violet-500" />
                   Details & Highlights
                </h3>
                <div className={`prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed ${!showFullDescription && deal.description.length > 300 ? 'line-clamp-4' : ''}`}>
                   {deal.description.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                   ))}
                </div>
                
                {deal.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 flex items-center gap-1 text-violet-600 hover:text-violet-700 text-sm font-bold"
                  >
                    {showFullDescription ? (
                      <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Read full description <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}

                {deal.tags && deal.tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    {deal.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        #{tag.name || tag.slug || tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Trust Badges */}
             <div className="lg:hidden bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <TrustBadges />
              </div>

            {/* Merchant Card */}
             <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center p-2 border border-slate-200">
                      {deal.companies?.logo_url ? (
                         <img src={deal.companies.logo_url} alt="" className="w-full h-full object-contain" />
                      ) : (
                         <span className="text-xl font-bold text-slate-400">{(deal.companies?.name || deal.merchant || 'S').charAt(0)}</span>
                      )}
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">{deal.companies?.name || deal.merchant}</h4>
                      <Link to={`/company/${deal.companies?.slug || deal.merchant}`} className="text-sm text-violet-600 hover:underline">
                         View all deals
                      </Link>
                   </div>
                </div>
                <a
                  href={deal.companies?.website_url || deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                >
                   Visit Store
                </a>
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        {deal?.id && (
          <div className="mt-10 lg:mt-16">
             <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Community Feedback</h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-full">
                   {(deal.upvotes || 0) + (deal.downvotes || 0)}
                </span>
             </div>
             <ReviewsAndRatings dealId={String(deal.id)} />
          </div>
        )}
      </div>
    </div>
  )
}
