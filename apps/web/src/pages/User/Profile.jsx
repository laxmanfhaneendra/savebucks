import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Settings,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Star,
  MessageCircle,
  TrendingUp,
  Tag,
  Heart,
  Trophy,
  Users,
  ChevronRight,
  ExternalLink,
  Clock,
  Award,
  Flame,
  Share2,
  MoreHorizontal,
  Edit3,
  BadgeCheck,
  Grid,
  List
} from 'lucide-react'
import { Container } from '../../components/Layout/Container'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatCompactNumber, dateAgo } from '../../lib/format'
import SocialDealCard from '../../components/Homepage/SocialDealCard'
import { ModernEmptyState } from '../../components/EmptyState/ModernEmptyState'

// Tab items
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'deals', label: 'Deals', icon: Grid },
  { id: 'activity', label: 'Activity', icon: TrendingUp },
  { id: 'badges', label: 'Badges', icon: Award },
]

// Stats card
const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl border border-slate-100 p-4 text-center hover:shadow-lg hover:border-violet-100 transition-all duration-300"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-2xl font-bold text-slate-900">{formatCompactNumber(value)}</div>
    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{label}</div>
  </motion.div>
)

// Deal card compact
const DealCardCompact = ({ deal }) => (
  <Link
    to={`/deal/${deal.id}`}
    className="group flex gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-violet-200 transition-all"
  >
    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
      {deal.image_url || deal.featured_image ? (
        <img
          src={deal.featured_image || deal.image_url}
          alt={deal.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Tag className="w-6 h-6 text-slate-300" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-slate-900 text-sm line-clamp-1 group-hover:text-violet-700 transition-colors">
        {deal.title}
      </h4>
      <p className="text-xs text-slate-500 mt-0.5">{dateAgo(deal.created_at)}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-emerald-600 font-semibold text-sm">${deal.price}</span>
        <span className="flex items-center gap-0.5 text-xs text-slate-400">
          <TrendingUp className="w-3 h-3" />
          {deal.upvotes || 0}
        </span>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 self-center transition-colors" />
  </Link>
)

// Activity item
const ActivityItem = ({ activity }) => {
  const icons = {
    deal: Tag,
    comment: MessageCircle,
    vote: TrendingUp,
    follow: Users,
  }
  const Icon = icons[activity.type] || Star

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700">{activity.description}</p>
        <span className="text-xs text-slate-400">{dateAgo(activity.created_at)}</span>
      </div>
    </div>
  )
}

// Badge component
const BadgeCard = ({ badge }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center p-4"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
      <Trophy className="w-8 h-8 text-white" />
    </div>
    <h4 className="font-medium text-slate-900 text-sm">{badge.name}</h4>
    <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
  </motion.div>
)

// Main Profile Component
const Profile = () => {
  const { handle } = useParams()
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', handle],
    queryFn: () => api.getUser(handle),
    enabled: !!handle
  })

  // Fetch user's deals
  const { data: deals } = useQuery({
    queryKey: ['user-deals', handle],
    queryFn: () => api.getUserDeals(handle),
    enabled: !!handle && activeTab === 'deals'
  })

  const isOwnProfile = currentUser?.handle === handle

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <Container>
          <div className="max-w-4xl mx-auto py-8">
            <div className="flex gap-6 items-start mb-8">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <Container>
          <div className="max-w-4xl mx-auto py-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h1>
            <p className="text-slate-600 mb-6">This profile doesn't exist or was removed.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  // Overview content
  const OverviewContent = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Tag} value={profile.deals_count || 0} label="Deals" color="bg-gradient-to-br from-violet-500 to-purple-600" />
        <StatCard icon={MessageCircle} value={profile.comments_count || 0} label="Comments" color="bg-gradient-to-br from-blue-500 to-cyan-600" />
        <StatCard icon={Star} value={profile.karma || 0} label="Karma" color="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard icon={Users} value={profile.followers_count || 0} label="Followers" color="bg-gradient-to-br from-emerald-500 to-teal-600" />
      </div>

      {/* Recent Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Recent Deals</h3>
          <button
            onClick={() => setActiveTab('deals')}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {profile.recent_deals && profile.recent_deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.recent_deals.slice(0, 3).map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <SocialDealCard deal={deal} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8">
            <ModernEmptyState
              type="noDeals"
              title="No deals posted"
              description="This user hasn't posted any deals yet."
              action={null}
            />
          </div>
        )}
      </div>
    </div>
  )

  // Deals content
  const DealsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">All Deals ({profile.deals_count || 0})</h3>
        {/* Placeholder for future sort/filter controls */}
      </div>
      
      {deals && deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >
              <SocialDealCard deal={deal} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <ModernEmptyState
            type="noDeals"
            title="No deals found"
            description="This user hasn't posted any deals yet."
            action={null}
          />
        </div>
      )}
    </div>
  )

  // Activity content
  const ActivityContent = () => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="font-bold text-slate-900">Recent Activity</h3>
      </div>
      <div className="px-6 divide-y divide-slate-50">
        {profile.recent_activity && profile.recent_activity.length > 0 ? (
          profile.recent_activity.map((activity, i) => (
            <ActivityItem key={i} activity={activity} />
          ))
        ) : (
          <div className="py-8">
            <ModernEmptyState
              type="noResults"
              title="No recent activity"
              description="This user hasn't been active recently."
              action={null}
              icon={TrendingUp}
            />
          </div>
        )}
      </div>
    </div>
  )

  // Badges content
  const BadgesContent = () => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="font-bold text-slate-900">Earned Badges</h3>
      </div>
      <div className="p-6">
        {profile.badges && profile.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {profile.badges.map((badge, i) => (
              <BadgeCard key={i} badge={badge} />
            ))}
          </div>
        ) : (
          <ModernEmptyState
            type="noResults"
            title="No badges yet"
            description="Badges are earned by posting deals and helping the community."
            action={null}
            icon={Award}
          />
        )}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewContent />
      case 'deals': return <DealsContent />
      case 'activity': return <ActivityContent />
      case 'badges': return <BadgesContent />
      default: return <OverviewContent />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-violet-600">
                        {(profile.display_name || profile.handle || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-slate-50">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">
                  {profile.display_name || profile.handle}
                </h1>
                {profile.role === 'admin' && (
                  <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-slate-500 mt-1">@{profile.handle}</p>

              {profile.bio && (
                <p className="text-slate-700 mt-3 max-w-lg">{profile.bio}</p>
              )}

              <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined {dateAgo(profile.created_at)}
                </div>
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700">
                    <LinkIcon className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
                    <Users className="w-4 h-4" />
                    Follow
                  </button>
                  <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl border border-slate-100 p-1.5 mb-8 shadow-sm">
            <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  )
}

export default Profile
