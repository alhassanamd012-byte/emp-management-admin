'use client';
import { useEffect, useRef, useState } from 'react';

const API = 'https://emp-management-api-4icz.onrender.com';

const FILTERS = [
  { label: 'Last 2 Hours', value: '2h' },
  { label: 'Last 1 Day', value: '1d' },
  { label: 'Last 1 Week', value: '1w' },
  { label: 'Last 1 Month', value: '1m' },
  { label: 'All Time', value: 'all' },
];

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const sendingRef = useRef(false);

  const [history, setHistory] = useState<any[]>([]);
  const [historyFilter, setHistoryFilter] = useState('1d');
  const [historyLoading, setHistoryLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    fetch(API + '/api/employees', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json()).then(d => { if (d.success) setEmployees(d.employees); });
  }, []);

  const fetchHistory = async (filter: string) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(API + '/api/notifications/history?filter=' + filter);
      const data = await res.json();
      if (data.success) setHistory(data.logs);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(historyFilter);
  }, [historyFilter]);

  const handleSend = async () => {
    if (!title || !message) {
      alert('Please enter title and message');
      return;
    }
    if (sendingRef.current) return;
    sendingRef.current = true;
    setLoading(true);
    try {
      const url = selectedEmployee === 'all'
        ? API + '/api/notifications/send-all'
        : API + '/api/notifications/send';
      const body = selectedEmployee === 'all'
        ? { title, body: message }
        : { employeeId: selectedEmployee, title, body: message };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        alert('Notification sent successfully!');
        setTitle('');
        setMessage('');
        fetchHistory(historyFilter);
      } else {
        alert(data.message || 'Failed to send notification');
      }
    } catch (err) {
      alert('Cannot connect to server');
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Send Notifications</h2>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>Send announcements to employees</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
            🔔 New Notification
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Send To</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', background: 'white', color: '#1e293b' }}
            >
              <option value="all">📢 All Employees</option>
              {employees.map((emp: any) => (
                <option key={emp._id} value={emp._id}>{emp.name} — {emp.employeeId}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Office Announcement"
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your announcement message..."
              rows={5}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#93c5fd' : '#1d4ed8', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Sending...' : selectedEmployee === 'all' ? '📢 Send to All Employees' : '📤 Send to Employee'}
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>💡 Quick Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Holiday Announcement', message: 'Office will be closed tomorrow due to public holiday.' },
              { title: 'Salary Credited', message: 'Your salary for this month has been credited to your account.' },
              { title: 'Meeting Reminder', message: 'Reminder: Team meeting today at 3:00 PM in the conference room.' },
              { title: 'Office Timing Change', message: 'Office timings have been updated. Please check with your manager.' },
              { title: 'Important Notice', message: 'Please make sure to mark your attendance on time every day.' },
            ].map((template) => (
              <div
                key={template.title}
                onClick={() => { setTitle(template.title); setMessage(template.message); }}
                style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{template.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{template.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div style={{ marginTop: '32px', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>📋 Notification History</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setHistoryFilter(f.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: historyFilter === f.value ? '#1d4ed8' : '#e2e8f0',
                  background: historyFilter === f.value ? '#1d4ed8' : 'white',
                  color: historyFilter === f.value ? 'white' : '#475569',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading...</div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No notifications found for this period</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Date & Time', 'Title', 'Message', 'Sent To', 'Recipients'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((log: any, i: number) => (
                <tr key={log._id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{log.title}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#475569', maxWidth: '300px' }}>{log.body}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#1e293b' }}>{log.sentTo}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#475569', textAlign: 'center' }}>{log.recipientCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
