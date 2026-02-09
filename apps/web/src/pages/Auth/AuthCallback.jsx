import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supa } from '../../lib/supa.js'
import { authService } from '../../lib/auth.js'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Processing authentication...')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const processedRef = useRef(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent double execution in React Strict Mode
      if (processedRef.current) return
      processedRef.current = true

      try {
        // Check if we have a code parameter (OAuth callback)
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }
        
        if (code) {
          // Handle OAuth callback with code
          const { data, error: exchangeError } = await supa.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            // If exchange fails, check if we already have a session (race condition or double-mount)
            const { data: sessionData } = await supa.auth.getSession()
            if (sessionData?.session) {
                // We have a session, so the exchange likely already happened
                console.log('Session already exists, ignoring exchange error')
            } else {
                throw exchangeError
            }
          }
          
          if (data.session && data.session.user) {
            const user = data.session.user
            
            // Store tokens
            localStorage.setItem('access_token', data.session.access_token)
            localStorage.setItem('refresh_token', data.session.refresh_token)
            
            // Get or create user profile
            let { data: profile, error: profileError } = await supa
              .from('profiles')
              .select('handle, karma, role, created_at')
              .eq('id', user.id)
              .single()
            
            // If profile doesn't exist, it should be created by the trigger
            // But let's wait a moment and try again if it's not there
            if (profileError && profileError.code === 'PGRST116') {
              await new Promise(resolve => setTimeout(resolve, 1000))
              const { data: retryProfile } = await supa
                .from('profiles')
                .select('handle, karma, role, created_at')
                .eq('id', user.id)
                .single()
              profile = retryProfile
            }
            
            // Update auth service state
            authService.setUser({
              id: user.id,
              email: user.email,
              handle: profile?.handle || null,
              karma: profile?.karma || 0,
              role: profile?.role || 'user',
              created_at: profile?.created_at,
              avatar_url: user.user_metadata?.avatar_url || null,
            })
            
            setStatus('success')
            setMessage(`Welcome${profile?.handle ? ', ' + profile.handle : ''}!`)
            
            // Get redirect destination
            const from = searchParams.get('from') || '/'
            
            // Redirect after a short delay
            setTimeout(() => {
              navigate(decodeURIComponent(from), { replace: true })
            }, 1500)
            
            return
          }
        }
        
        // Fallback: try to get existing session
        const { data, error: sessionError } = await supa.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        if (data.session && data.session.user) {
          const user = data.session.user
          
          // Store tokens
          localStorage.setItem('access_token', data.session.access_token)
          localStorage.setItem('refresh_token', data.session.refresh_token)
          
          // Get or create user profile
          let { data: profile, error: profileError } = await supa
            .from('profiles')
            .select('handle, karma, role, created_at')
            .eq('id', user.id)
            .single()
          
          // If profile doesn't exist, it should be created by the trigger
          // But let's wait a moment and try again if it's not there
          if (profileError && profileError.code === 'PGRST116') {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const { data: retryProfile } = await supa
              .from('profiles')
              .select('handle, karma, role, created_at')
              .eq('id', user.id)
              .single()
            profile = retryProfile
          }
          
          // Update auth service state
          authService.setUser({
            id: user.id,
            email: user.email,
            handle: profile?.handle || null,
            karma: profile?.karma || 0,
            role: profile?.role || 'user',
            created_at: profile?.created_at,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
          
          setStatus('success')
          setMessage(`Welcome${profile?.handle ? ', ' + profile.handle : ''}!`)
          
          // Get redirect destination
          const from = searchParams.get('from') || '/'
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate(decodeURIComponent(from), { replace: true })
          }, 1500)
          
        } else {
          throw new Error('No session found')
        }
        
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Authentication failed')
        
        // Redirect to sign in page after a delay
        setTimeout(() => {
          navigate('/signin', { replace: true })
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          {/* Loading Spinner */}
          {status === 'processing' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Completing Sign In
                </h2>
                <p className="text-slate-600">
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="spring"
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Success!
                </h2>
                <p className="text-slate-600 mb-4">
                  {message}
                </p>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Redirecting...
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="spring"
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
              >
                <XCircle className="w-8 h-8 text-red-600" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Sign In Failed
                </h2>
                <p className="text-slate-600 mb-4">
                  {message}
                </p>
                <p className="text-sm text-slate-500">
                  Redirecting to sign in page...
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
