'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/employees', label: 'Employees', icon: '👥' },
    { href: '/dashboard/attendance', label: 'Attendance', icon: '📅' },
    { href: '/dashboard/salary', label: 'Salary', icon: '💰' },
    { href: '/dashboard/leaves', label: 'Leave Requests', icon: '📝' },
    { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', minWidth: '240px', background: '#1e3a8a', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.5px' }}>AICT</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Employee Management</p>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '4px',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  fontSize: '14px', fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer', transition: 'all 0.2s',
                  borderLeft: isActive ? '3px solid white' : '3px solid transparent',
                }}>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>
        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)',
            color: '#fca5a5', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main style={{ marginLeft: '240px', flex: 1, background: '#f1f5f9', minHeight: '100vh', width: 'calc(100vw - 240px)' }}>
        {children}
      </main>
    </div>
  );
}
