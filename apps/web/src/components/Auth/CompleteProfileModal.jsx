import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Loader2, Check, X, AlertCircle } from 'lucide-react'

export default function CompleteProfileModal() {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [handle, setHandle] = React.useState('')
  const [checking, setChecking] = React.useState(false)
  const [available, setAvailable] = React.useState(null)
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  // Open when logged in and missing handle
  React.useEffect(() => {
    if (isAuthenticated && user && (!user.handle || user.handle.trim() === '')) {
      setOpen(true)
    }
  }, [isAuthenticated, user])

  const validateLocal = (value) => {
    if (!value || value.length < 3) return 'Username must be at least 3 characters'
    if (value.length > 24) return 'Username must be at most 24 characters'
    if (!/^[a-z0-9_]+$/i.test(value)) return 'Use letters, numbers, and underscores only'
    return ''
  }

  const checkAvailability = React.useCallback(async (value) => {
    const localErr = validateLocal(value)
    setError(localErr)
    if (localErr) {
      setAvailable(null)
      return
    }
    setChecking(true)
    setAvailable(null)
    try {
      await api.getUser(value)
      // If no error, user exists
      setAvailable(false)
    } catch (e) {
      // If 404, it's available
      if (e.status === 404) {
        setAvailable(true)
      } else {
        setAvailable(null)
      }
    } finally {
      setChecking(false)
    }
  }, [])

  // Debounce availability check
  const debouncedValue = useDebouncedValue(handle, 300)
  React.useEffect(() => {
    if (open && debouncedValue) {
      checkAvailability(debouncedValue)
    } else {
      setAvailable(null)
    }
  }, [debouncedValue, open, checkAvailability])

  async function onSubmit(e) {
    e.preventDefault()
    const localErr = validateLocal(handle)
    if (localErr) {
      setError(localErr)
      return
    }
    if (available === false) {
      setError('That username is taken')
      return
    }
    try {
      setSaving(true)
      await updateProfile({ handle })
      setOpen(false)
    } catch (e) {
      setError(e.message || 'Failed to save username')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Profile</h2>
            <p className="text-slate-300 text-sm">
              Choose a unique username to join the community
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="text-lg font-medium">@</span>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={handle}
                    onChange={(e) => { setHandle(e.target.value.trim()); setError('') }}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 transition-all outline-none ${error
                        ? 'border-red-300 focus:border-red-500 focus:bg-white'
                        : available === true
                          ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/30'
                          : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                      }`}
                    placeholder="deal_hunter"
                    autoFocus
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {checking ? (
                      <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                    ) : available === true ? (
                      <Check className="w-5 h-5 text-emerald-500" />
                    ) : available === false ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                </div>

                {/* Status Message */}
                <div className="mt-2 flex items-center gap-2 min-h-[20px]">
                  {error ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </p>
                  ) : available === true ? (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Username is available
                    </p>
                  ) : available === false ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Username is taken
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Use letters, numbers, and underscores
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={saving}
                >
                  Do this later
                </button>
                <button
                  type="submit"
                  disabled={saving || checking || available === false || !!error || !handle}
                  className="px-6 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}


