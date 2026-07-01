'use client';
import { useState, useEffect, useCallback } from 'react';

const API = 'https://emp-management-api-4icz.onrender.com';

interface Employee {
  _id: string;
  name: string;
  department: string;
  designation: string;
  employeeId: string;
  isInsideZone: boolean;
  lastLocationTime: string | null;
  outsideSince: string | null;
  lastLocation: { lat: number | null; lng: number | null } | null;
}

function timeAgo(isoString: string | null): string {
  if (!isoString) return 'Never';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTime(isoString: string | null): string {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function LiveStatusPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/employees/live-status`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
        setError('');
      } else {
        setError('Failed to load data');
      }
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
      setCountdown(30);
    }
  }, []);

  // Initial fetch + auto-refresh every 30s
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Countdown ticker
  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(tick);
  }, [lastRefresh]);

  const total = employees.length;
  const insideCount = employees.filter(e => e.isInsideZone).length;
  const outsideCount = employees.filter(e => !e.isInsideZone).length;
  const neverSeen = employees.filter(e => !e.lastLocationTime).length;

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
            📍 Live Employee Status
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
            Real-time zone tracking · Office geo-fence radius: 150m
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Last updated</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              {formatTime(lastRefresh.toISOString())}
            </div>
          </div>
          <button
            onClick={fetchStatus}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', background: '#1e3a8a', color: 'white',
              border: 'none', borderRadius: '10px', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600'
            }}
          >
            🔄 Refresh ({countdown}s)
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#dc2626', fontWeight: '500' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Employees', value: total, bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: '👥' },
          { label: 'Inside Zone', value: insideCount, bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: '🟢' },
          { label: 'Outside Zone', value: outsideCount, bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '🔴' },
          { label: 'No Data Yet', value: neverSeen, bg: '#fafafa', border: '#e2e8f0', color: '#64748b', icon: '⚪' },
        ].map(({ label, value, bg, border, color, icon }) => (
          <div key={label} style={{
            background: bg, border: `1px solid ${border}`,
            borderRadius: '16px', padding: '20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color }}>{value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
            Employee Zone Status
          </h2>
          {outsideCount > 0 && (
            <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', fontWeight: '600' }}>
              ⚠️ {outsideCount} outside zone
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '15px' }}>
            Loading employee status...
          </div>
        ) : employees.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📍</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>No employees found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Location data appears after employees check in</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee', 'Department', 'Status', 'Last Seen', 'Outside Since'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontSize: '12px', fontWeight: '600', color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid #f1f5f9'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees
                .sort((a, b) => {
                  // Outside employees first, then by name
                  if (!a.isInsideZone && b.isInsideZone) return -1;
                  if (a.isInsideZone && !b.isInsideZone) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map((emp, i) => {
                  const isOut = !emp.isInsideZone;
                  const hasData = !!emp.lastLocationTime;
                  return (
                    <tr
                      key={emp._id}
                      style={{
                        background: isOut ? '#fff5f5' : (i % 2 === 0 ? 'white' : '#fafafa'),
                        borderLeft: isOut ? '4px solid #ef4444' : '4px solid transparent',
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* Employee */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: isOut ? '#fecaca' : '#dbeafe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', fontWeight: '700',
                            color: isOut ? '#dc2626' : '#1d4ed8', flexShrink: 0
                          }}>
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{emp.name}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{emp.employeeId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '14px', color: '#475569' }}>{emp.department}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{emp.designation}</div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        {!hasData ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#f1f5f9', color: '#64748b',
                            padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                          }}>
                            ⚪ No Data
                          </span>
                        ) : isOut ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#fef2f2', color: '#dc2626',
                            padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                            border: '1px solid #fecaca'
                          }}>
                            🔴 Outside Zone
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#f0fdf4', color: '#15803d',
                            padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                            border: '1px solid #bbf7d0'
                          }}>
                            🟢 Inside Zone
                          </span>
                        )}
                      </td>

                      {/* Last Seen */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                          {timeAgo(emp.lastLocationTime)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {emp.lastLocationTime ? formatTime(emp.lastLocationTime) : '—'}
                        </div>
                      </td>

                      {/* Outside Since */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        {isOut && emp.outsideSince ? (
                          <div>
                            <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>
                              {timeAgo(emp.outsideSince)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                              since {formatTime(emp.outsideSince)}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '14px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}

        {/* Footer */}
        {!loading && employees.length > 0 && (
          <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8' }}>
            Auto-refreshing every 30 seconds · Office geo-fence: 26.373126°N, 85.54603°E · Radius: 150m
          </div>
        )}
      </div>
    </div>
  );
}
