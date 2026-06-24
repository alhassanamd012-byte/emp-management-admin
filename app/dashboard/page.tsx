'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingSalaries: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      if (data.success) setStats(prev => ({ ...prev, totalEmployees: data.employees.length }));
    });
    fetch('http://localhost:5000/api/attendance', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      if (data.success) {
        const today = new Date().toDateString();
        const todayAttendance = data.attendance.filter((a: any) =>
          new Date(a.date).toDateString() === today
        );
        const present = todayAttendance.filter((a: any) => a.status === 'present').length;
        setStats(prev => ({ ...prev, presentToday: present, absentToday: todayAttendance.length - present }));
      }
    });
    fetch('http://localhost:5000/api/salary', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      if (data.success) {
        const pending = data.salaries.filter((s: any) => s.status === 'pending').length;
        setStats(prev => ({ ...prev, pendingSalaries: pending }));
      }
    });
  }, []);

  const cards = [
    { title: 'Total Employees', value: stats.totalEmployees, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: '👥' },
    { title: 'Present Today', value: stats.presentToday, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
    { title: 'Absent Today', value: stats.absentToday, color: '#dc2626', bg: '#fff1f2', border: '#fecdd3', icon: '❌' },
    { title: 'Pending Salaries', value: stats.pendingSalaries, color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '💰' },
  ];

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Dashboard</h2>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>{today}</p>
      </div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {cards.map((card) => (
          <div key={card.title} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: card.bg, border: `1px solid ${card.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px'
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Attendance Rate', value: stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) + '%' : '0%', color: '#16a34a' },
              { label: 'Total Employees', value: stats.totalEmployees, color: '#1d4ed8' },
              { label: 'Pending Salaries', value: stats.pendingSalaries, color: '#d97706' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>System Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'System', value: 'AICT EMS' },
              { label: 'Version', value: 'v1.0.0' },
              { label: 'Status', value: '🟢 Online' },
              { label: 'Database', value: '🟢 Connected' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
