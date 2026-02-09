import React, { useState } from 'react';
import { supa } from '../lib/supa';

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!supa) {
        throw new Error('Supabase is not configured.');
      }
      const { data, error: authError } = await supa.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        throw authError;
      }
      if (data?.session?.access_token) {
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Admin Sign In</h2>
        <p style={{ color: '#64748b' }}>Use your SaveBucks admin credentials.</p>
        {error ? (
          <div style={{ color: '#b91c1c', marginTop: 12, fontSize: 14 }}>{error}</div>
        ) : null}
        <form onSubmit={handleSubmit} className="admin-section" style={{ marginTop: 16 }}>
          <input
            className="admin-input"
            type="email"
            placeholder="admin@savebucks.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="admin-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="admin-button primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
