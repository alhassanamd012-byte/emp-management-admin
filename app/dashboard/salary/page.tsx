'use client';
import { useEffect, useState } from 'react';

const FILTERS = [
  { label: 'Last 2 Hours', value: '2h' },
  { label: 'Last 1 Day', value: '1d' },
  { label: 'Last 1 Week', value: '1w' },
  { label: 'Last 1 Month', value: '1m' },
  { label: 'All Time', value: 'all' },
];

export default function SalaryPage() {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [form, setForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: '',
    allowances: '',
    deductions: ''
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const fetchSalaries = async () => {
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/salary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setSalaries(data.salaries);
  };

  const fetchEmployees = async () => {
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
  };

  useEffect(() => { fetchSalaries(); fetchEmployees(); }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/salary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) { setShowForm(false); fetchSalaries(); }
    setLoading(false);
  };

  const handlePay = async (id: string) => {
    if (!confirm('Are you sure you want to mark this salary as paid?')) return;
    await fetch(`https://emp-management-api-4icz.onrender.com/api/salary/${id}/pay`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchSalaries();
  };

  const getDateCutoff = () => {
    const now = Date.now();
    if (dateFilter === '2h') return now - 7200000;
    if (dateFilter === '1d') return now - 86400000;
    if (dateFilter === '1w') return now - 604800000;
    if (dateFilter === '1m') return now - 2592000000;
    return 0;
  };
  const filteredSalaries = dateFilter === 'all' ? salaries : salaries.filter(s => {
    const d = s.createdAt ? new Date(s.createdAt) : new Date(s.year, (s.month || 1) - 1, 1);
    return d.getTime() >= getDateCutoff();
  });
  const totalPaid = filteredSalaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.netSalary, 0);
  const totalPending = filteredSalaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.netSalary, 0);

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Salary Management</h2>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>Manage employee payroll</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{ background: '#1d4ed8', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
        >
          + Generate Salary
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { label: 'Total Records', value: filteredSalaries.length, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: '📋' },
          { label: 'Total Paid', value: '₹' + totalPaid.toLocaleString('en-IN'), color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
          { label: 'Total Pending', value: '₹' + totalPending.toLocaleString('en-IN'), color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
        ].map(({ label, value, color, bg, border, icon }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '700', color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Generate Salary</h3>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '24px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Employee</label>
                  <select
                    value={form.employeeId}
                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    required
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', background: 'white' }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp: any) => (
                      <option key={emp._id} value={emp._id}>{emp.name} — {emp.employeeId}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Month</label>
                  <select
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', background: 'white' }}
                  >
                    {months.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Year</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {[
                  { label: 'Basic Salary (₹)', key: 'basicSalary' },
                  { label: 'Allowances (₹)', key: 'allowances' },
                  { label: 'Deductions (₹)', key: 'deductions' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{label}</label>
                    <input
                      type="number"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, background: '#1d4ed8', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                  {loading ? 'Generating...' : 'Generate Salary'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Table */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Salary Records</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setDateFilter(f.value)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid', borderColor: dateFilter === f.value ? '#1d4ed8' : '#e2e8f0', background: dateFilter === f.value ? '#1d4ed8' : 'white', color: dateFilter === f.value ? 'white' : '#475569', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
              >{f.label}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee', 'Month/Year', 'Basic Salary', 'Net Salary', 'Days Worked', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((s: any) => (
                <tr key={s._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap' }}>{s.employee?.name || 'N/A'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>{months[s.month - 1]} {s.year}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', whiteSpace: 'nowrap' }}>₹{Number(s.basicSalary).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '700', color: '#16a34a', whiteSpace: 'nowrap' }}>₹{Number(s.netSalary).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', whiteSpace: 'nowrap' }}>{s.totalDaysWorked} days</td>
                  <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...(s.status === 'paid' ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' } : { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }) }}>
                      {s.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    {s.status === 'pending' && (
                      <button
                        onClick={() => handlePay(s._id)}
                        style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSalaries.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💰</div>
                    <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>No salary records found</p>
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
