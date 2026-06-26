'use client';
import { useEffect, useState } from 'react';
export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const fetchLeaves = async () => {
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/leaves', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setLeaves(data.leaves);
  };
  useEffect(() => { fetchLeaves(); }, []);
  const handleAction = async (id: string, status: string, employeeId: string) => {
    const res = await fetch(`https://emp-management-api-4icz.onrender.com/api/leaves/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      await fetch('https://emp-management-api-4icz.onrender.com/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          employeeId,
          title: status === 'approved' ? '✅ Leave Approved' : '❌ Leave Rejected',
          body: status === 'approved' ? 'Your leave request has been approved!' : 'Your leave request has been rejected.'
        })
      });
      fetchLeaves();
    }
  };
  const statusStyle: any = {
    pending: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
    approved: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    rejected: { background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3' },
  };
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Leave Requests</h2>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>Manage employee leave requests</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { label: 'Total Requests', value: leaves.length, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: '📋' },
          { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
        ].map(({ label, value, color, bg, border, icon }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{icon}</div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>All Leave Requests</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee', 'Department', 'Leave Date', 'Reason', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave: any) => (
                <tr key={leave._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap' }}>{leave.employee?.name || 'N/A'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>{leave.employee?.department || 'N/A'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', whiteSpace: 'nowrap' }}>{new Date(leave.leaveDate).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', maxWidth: '200px' }}>{leave.reason}</td>
                  <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...statusStyle[leave.status] }}>
                      {leave.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    {leave.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleAction(leave._id, 'approved', leave.employee?._id)}
                          style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleAction(leave._id, 'rejected', leave.employee?._id)}
                          style={{ background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                    <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>No leave requests found</p>
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
