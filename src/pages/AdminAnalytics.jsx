import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'https://gurunetra.sfinteriordecoration.com/api';
const ADMIN_API_URL = API_URL.replace(/\/api\/?$/, '/admin');

const AdminAnalytics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [dateRange, setDateRange] = useState('7days');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if already authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch data when authenticated or dateRange changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, dateRange]);

  const checkAuth = async () => {
    try {
      // For cross-origin cookies in fetch, need credentials: 'include'
      const res = await fetch(`${ADMIN_API_URL}/check-auth.php`, { credentials: 'include' });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch(`${ADMIN_API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      const resData = await res.json();
      if (resData.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(resData.error || 'Login failed');
      }
    } catch (e) {
      setLoginError('Network error');
    }
    setIsLoggingIn(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${ADMIN_API_URL}/overview.php?range=${dateRange}`, { credentials: 'include' });
      if (res.status === 401) {
        setIsAuthenticated(false);
      } else if (res.ok) {
        const resData = await res.json();
        setData(resData.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark-bg)' }}>
        <form onSubmit={handleLogin} style={{ background: '#1e1e1e', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: 'white', marginBottom: '24px', textAlign: 'center' }}>Admin Login</h2>
          {loginError && <div style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', padding: '12px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' }}>{loginError}</div>}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: 'white' }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: 'white' }}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoggingIn}>
            {isLoggingIn ? 'LOGGING IN...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)', color: 'white', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>Analytics Dashboard</h1>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', background: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {isLoading || !data ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Loading analytics...</div>
        ) : (
          <>
            {/* Overview Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <StatCard title="Total Visitors" value={data.unique_visitors} />
              <StatCard title="Sessions" value={data.sessions} />
              <StatCard title="Page Views" value={data.page_views} />
              <StatCard title="Active Now" value={data.active_now} highlight={true} />
              <StatCard title="Avg Session" value={`${data.avg_duration}s`} />
              <StatCard title="Checkout Clicks" value={data.payment_clicks} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              
              {/* Traffic Chart Proxy */}
              <div style={{ background: '#1e1e1e', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>Traffic</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {data.traffic.length > 0 ? (
                    <table style={{ width: '100%', textAlign: 'left' }}>
                      <thead>
                        <tr><th style={{ padding: '8px 0', color: '#999' }}>Date</th><th style={{ padding: '8px 0', color: '#999', textAlign: 'right' }}>Visitors</th></tr>
                      </thead>
                      <tbody>
                        {data.traffic.map((row, i) => (
                          <tr key={i}>
                            <td style={{ padding: '8px 0', borderTop: '1px solid #222' }}>{row.date}</td>
                            <td style={{ padding: '8px 0', borderTop: '1px solid #222', textAlign: 'right' }}>{row.visitors}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: '#666' }}>No data</p>}
                </div>
              </div>

              {/* Top Pages */}
              <div style={{ background: '#1e1e1e', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>Top Pages</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {data.top_pages.length > 0 ? (
                    <table style={{ width: '100%', textAlign: 'left' }}>
                      <thead>
                        <tr><th style={{ padding: '8px 0', color: '#999' }}>Page URL</th><th style={{ padding: '8px 0', color: '#999', textAlign: 'right' }}>Views</th></tr>
                      </thead>
                      <tbody>
                        {data.top_pages.map((row, i) => (
                          <tr key={i}>
                            <td style={{ padding: '8px 0', borderTop: '1px solid #222', wordBreak: 'break-all' }}>{row.page_url.split(window.location.host)[1] || row.page_url}</td>
                            <td style={{ padding: '8px 0', borderTop: '1px solid #222', textAlign: 'right' }}>{row.views}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: '#666' }}>No data</p>}
                </div>
              </div>
              
              {/* Devices */}
              <div style={{ background: '#1e1e1e', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>Devices</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {data.devices.length > 0 ? (
                    <table style={{ width: '100%', textAlign: 'left' }}>
                      <thead>
                        <tr><th style={{ padding: '8px 0', color: '#999' }}>Device</th><th style={{ padding: '8px 0', color: '#999', textAlign: 'right' }}>Visitors</th></tr>
                      </thead>
                      <tbody>
                        {data.devices.map((row, i) => (
                          <tr key={i}>
                            <td style={{ padding: '8px 0', borderTop: '1px solid #222' }}>{row.device_type}</td>
                            <td style={{ padding: '8px 0', borderTop: '1px solid #222', textAlign: 'right' }}>{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: '#666' }}>No data</p>}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, highlight }) => (
  <div style={{ background: '#1e1e1e', padding: '24px', borderRadius: '12px', borderLeft: highlight ? '4px solid #2ecc71' : 'none' }}>
    <h4 style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '500' }}>{title}</h4>
    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: highlight ? '#2ecc71' : 'white' }}>{value || 0}</p>
  </div>
);

export default AdminAnalytics;
