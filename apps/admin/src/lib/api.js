const API_BASE = import.meta.env.VITE_API_BASE || '';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && !(config.body instanceof FormData)) {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    if (typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(errorText || 'Request failed', response.status);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

export const adminApi = {
  checkAdmin: () => apiRequest('/api/admin/whoami'),
  getDashboard: () => apiRequest('/api/admin/dashboard'),
  getPendingDeals: (page = 1) => apiRequest(`/api/admin/deals?status=pending&page=${page}`),
  getPendingCoupons: (page = 1) => apiRequest(`/api/admin/coupons?status=pending&page=${page}`),
  listDeals: ({ status = 'approved', page = 1, search = '' } = {}) =>
    apiRequest(`/api/admin/deals?status=${status}&page=${page}&search=${encodeURIComponent(search)}`),
  reviewDeal: ({ dealId, action, reason }) =>
    apiRequest(`/api/admin/deals/${dealId}/review`, {
      method: 'POST',
      body: { action, rejection_reason: reason },
    }),
  reviewCoupon: ({ couponId, action, reason }) =>
    apiRequest(`/api/admin/coupons/${couponId}/review`, {
      method: 'POST',
      body: { action, rejection_reason: reason },
    }),
  listUsers: ({ search = '', role = '', page = 1 } = {}) =>
    apiRequest(`/api/admin/users?search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&page=${page}`),
  updateUserRole: (userId, role) =>
    apiRequest(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role },
    }),
  getAnalytics: (period = '30') => apiRequest(`/api/admin/analytics?period=${period}`),
  getSystemHealth: () => apiRequest('/api/admin/system/health'),
  featureDeal: (dealId, featured) =>
    apiRequest(`/api/admin/deals/${dealId}/feature`, {
      method: 'POST',
      body: { featured },
    }),
};
