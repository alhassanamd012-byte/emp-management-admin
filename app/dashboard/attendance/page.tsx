'use client';
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchAttendance = async () => {
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/attendance', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setAttendance(data.attendance);
  };

  useEffect(() => { fetchAttendance(); }, []);

  const filtered = attendance.filter((a: any) =>
    new Date(a.date).toISOString().split('T')[0] === selectedDate
  );

  const present = filtered.filter((a: any) => a.status === 'present').length;
  const absent = filtered.filter((a: any) => a.status === 'absent').length;
  const late = filtered.filter((a: any) => a.status === 'late').length;

  const statusStyle: any = {
    present: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    absent: { background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3' },
    late: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
    'half-day': { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' },
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Attendance</h2>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>Daily attendance records</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', outline: 'none', background: 'white', color: '#334155', fontWeight: '500' }}
        />
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { label: 'Present', value: present, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
          { label: 'Absent', value: absent, color: '#dc2626', bg: '#fff1f2', border: '#fecdd3', icon: '❌' },
          { label: 'Late', value: late, color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏰' },
        ].map(({ label, value, color, bg, border, icon }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Attendance Records</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee', 'Department', 'Check In', 'Check Out', 'Status', 'Zone'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: any) => (
                <tr key={a._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap' }}>{a.employee?.name || 'N/A'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>{a.employee?.department || 'N/A'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', whiteSpace: 'nowrap' }}>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString('en-IN') : '-'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', whiteSpace: 'nowrap' }}>{a.checkOut ? new Date(a.checkOut).toLocaleTimeString('en-IN') : '-'}</td>
                  <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...statusStyle[a.status] }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...(a.isWithinZone ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' } : { background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3' }) }}>
                      {a.isWithinZone ? '✅ Inside Zone' : '❌ Outside Zone'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                    <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>No attendance records found for this date</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
