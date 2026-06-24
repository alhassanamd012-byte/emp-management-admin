'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://emp-management-api-4icz.onrender.com/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError('Invalid email or password!');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        color: 'white',
      }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', margin: '0 auto 24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            🏢
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 12px', letterSpacing: '-1px' }}>AICT</h1>
          <p style={{ fontSize: '18px', opacity: 0.8, margin: '0 0 40px', lineHeight: 1.6 }}>
            Employee Management System
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            {[
              { icon: '👥', text: 'Manage all employees in one place' },
              { icon: '📅', text: 'Geo-fenced attendance tracking' },
              { icon: '💰', text: 'Automated payroll management' },
              { icon: '📍', text: 'Live location monitoring' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right Side - Login Form */}
      <div style={{
        width: '480px',
        minWidth: '480px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            Sign in to your admin account
          </p>
        </div>
        {error && (
          <div style={{
            background: '#fff1f2', border: '1px solid #fecdd3',
            borderRadius: '10px', padding: '12px 16px',
            color: '#dc2626', fontSize: '14px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aict.com"
              required
              style={{
                width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px',
                padding: '12px 16px', fontSize: '15px', outline: 'none',
                color: '#1e293b', background: '#f8fafc', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px',
                padding: '12px 16px', fontSize: '15px', outline: 'none',
                color: '#1e293b', background: '#f8fafc', boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#93c5fd' : '#1d4ed8',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '14px', fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div style={{ marginTop: '40px', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, textAlign: 'center' }}>
            🔒 Secured Admin Access — AICT Employee Management System
          </p>
        </div>
      </div>
    </div>
  );
}
