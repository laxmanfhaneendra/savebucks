import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PendingApprovals from './pages/PendingApprovals.jsx';
import FeatureManagement from './pages/FeatureManagement.jsx';
import UserManagement from './pages/UserManagement.jsx';
import Analytics from './pages/Analytics.jsx';
import SystemHealth from './pages/SystemHealth.jsx';
import { adminApi } from './lib/api.js';
import { supa } from './lib/supa.js';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', component: AdminDashboard },
  { id: 'approvals', label: 'Approvals', component: PendingApprovals },
  { id: 'feature', label: 'Featured Deals', component: FeatureManagement },
  { id: 'users', label: 'Users', component: UserManagement },
  { id: 'analytics', label: 'Analytics', component: Analytics },
  { id: 'health', label: 'System Health', component: SystemHealth },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  const ActiveComponent = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.component || AdminDashboard,
    [activeTab]
  );

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setChecking(false);
    }
  }, []);

  const { data: adminAccess, isLoading: adminLoading, refetch: refetchAdmin } = useQuery({
    queryKey: ['admin', 'whoami'],
    queryFn: () => adminApi.checkAdmin().then((res) => Boolean(res?.isAdmin)),
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setAdminAllowed(false);
      setChecking(false);
      return;
    }
    if (adminLoading) {
      return;
    }
    setAdminAllowed(Boolean(adminAccess));
    setChecking(false);
  }, [adminAccess, adminLoading, isAuthenticated]);

  const handleSignOut = async () => {
    if (supa) {
      await supa.auth.signOut();
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setAdminAllowed(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-shell">
        <header className="admin-header">
          <div style={{ fontWeight: 700 }}>SaveBucks Admin</div>
        </header>
        <Login onSuccess={() => {
          setIsAuthenticated(true);
          setChecking(true);
          refetchAdmin();
        }} />
      </div>
    );
  }

  if (checking || adminLoading) {
    return (
      <div className="admin-shell">
        <header className="admin-header">
          <div style={{ fontWeight: 700 }}>SaveBucks Admin</div>
        </header>
        <div className="admin-content">
          <div className="admin-card">Checking admin access...</div>
        </div>
      </div>
    );
  }

  if (!adminAllowed) {
    return (
      <div className="admin-shell">
        <header className="admin-header">
          <div style={{ fontWeight: 700 }}>SaveBucks Admin</div>
          <button className="admin-button ghost" onClick={handleSignOut}>Sign out</button>
        </header>
        <div className="admin-content">
          <div className="admin-card" style={{ color: '#b91c1c' }}>
            Access denied. Your account does not have admin privileges.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div style={{ fontWeight: 700 }}>SaveBucks Admin</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-button ${activeTab === tab.id ? 'primary' : 'ghost'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <button className="admin-button ghost" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>
      <main className="admin-content">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;
