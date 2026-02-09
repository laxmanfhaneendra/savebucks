import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { useLocation } from '../../context/LocationContext'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Settings,
  Bookmark,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  Bell,
  Gift,
  MapPin,
  Navigation,
  Loader2
} from 'lucide-react'
import NotificationBell from '../User/NotificationBell'
import { Avatar } from '../ui/Avatar'
import { SearchBar } from '../Search/SearchBar'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { location, getCurrentLocation, isLoading: locationLoading } = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => api.getUser(user?.user_metadata?.handle || user?.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000
  })

  const handleSignOut = () => {
    signOut()
    setIsMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 lg:h-16">
      {/* Dark glassmorphism background */}
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800" />

      <div className="relative h-full max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <motion.img
            src="/logo.svg"
            alt="SaveBucks"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-9 sm:h-10 w-auto"
          />
        </Link>

        {/* Home Button */}
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 ml-2"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Location Button */}
        <button
          onClick={() => getCurrentLocation()}
          disabled={locationLoading}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-amber-500 hover:bg-slate-800 transition-all duration-200"
        >
          {locationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span className="max-w-[120px] truncate">
            {location?.address?.display || 'Set Location'}
          </span>
        </button>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-xl mx-auto">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center">
            <Link
              to="/forums"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
            <Link
              to="/saved-items"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </Link>
          </div>

          {/* Post Button - Gradient with glow */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/post"
              className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 rounded-full text-sm font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Post Deal</span>
            </Link>
          </motion.div>

          {user && <NotificationBell />}

          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <Avatar
                    className="w-9 h-9 shadow-sm"
                    gradient="emerald"
                    fallback={userProfile?.display_name || user.email || 'U'}
                  />
                </motion.button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[220px] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-900/10 p-2 animate-in fade-in-0 zoom-in-95"
                  sideOffset={8}
                  align="end"
                >
                  <div className="px-3 py-3 mb-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {userProfile?.display_name || userProfile?.handle || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {userProfile?.karma ? `${userProfile.karma} karma` : user.email}
                    </p>
                  </div>

                  <DropdownMenu.Item asChild>
                    <Link
                      to={`/user/${userProfile?.handle || user?.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-900/5 rounded-xl outline-none cursor-pointer transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      to="/referrals"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-900/5 rounded-xl outline-none cursor-pointer transition-colors"
                    >
                      <Gift className="w-4 h-4" />
                      Referrals
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      to="/notification-settings"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-900/5 rounded-xl outline-none cursor-pointer transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Link>
                  </DropdownMenu.Item>

                  {userProfile?.role === 'admin' && (
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-900/5 rounded-xl outline-none cursor-pointer transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin
                      </Link>
                    </DropdownMenu.Item>
                  )}

                  <div className="h-px bg-slate-900/5 my-1.5" />

                  <DropdownMenu.Item
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-500/10 rounded-xl outline-none cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signin"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </motion.div>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/20 border-b border-slate-800"
          >
            <nav className="p-3 space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <Home className="w-5 h-5" /> Home
              </Link>
              <Link to="/forums" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <Users className="w-5 h-5" /> Community
              </Link>
              <Link to="/companies" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <Building2 className="w-5 h-5" /> Companies
              </Link>
              <Link to="/saved-items" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <Bookmark className="w-5 h-5" /> Saved
              </Link>
              <Link to="/post" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-xl font-semibold shadow-md">
                <Plus className="w-5 h-5" /> Post Deal
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
