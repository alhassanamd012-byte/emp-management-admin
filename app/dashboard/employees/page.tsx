'use client';
import { useEffect, useRef, useState } from 'react';
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const token = useRef('');
  useEffect(() => {
    token.current = localStorage.getItem('token') || '';
    load();
  }, []);
  async function load() {
    const r = await fetch('https://emp-management-api-4icz.onrender.com/api/employees', {
      headers: { Authorization: 'Bearer ' + token.current }
    });
    const d = await r.json();
    if (d.success) setEmployees(d.employees);
  }
  async function handleAdd(e: any) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const body: any = {};
    fd.forEach((v, k) => body[k] = v);
    const r = await fetch('https://emp-management-api-4icz.onrender.com/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token.current },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    if (d.success) { setView('list'); load(); }
    else alert(d.message);
    setLoading(false);
  }
  async function handleEdit(e: any) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const body: any = {};
    fd.forEach((v, k) => body[k] = v);
    const r = await fetch('https://emp-management-api-4icz.onrender.com/api/employees/' + selected._id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token.current },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    if (d.success) { setView('list'); load(); }
    setLoading(false);
  }
  async function handleDelete(id: string) {
    if (!confirm('Delete this employee?')) return;
    await fetch('https://emp-management-api-4icz.onrender.com/api/employees/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token.current }
    });
    load();
  }
  const box = { background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
  const inp = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, color: '#1e293b', background: 'white' };
  const lbl = { display: 'block', fontSize: '13px', fontWeight: '600' as const, color: '#475569', marginBottom: '6px' };
  const btn = (color: string, bg: string) => ({ background: bg, color, border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' as const, fontSize: '14px' });
  if (view === 'add') return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => setView('list')} style={{ ...btn('#64748b', '#f1f5f9'), padding: '8px 16px' }}>← Back</button>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Add New Employee</h2>
        </div>
        <div style={box}>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div><label style={lbl}>Full Name *</label><input name="name" type="text" required style={inp} /></div>
              <div><label style={lbl}>Email *</label><input name="email" type="email" required style={inp} /></div>
              <div><label style={lbl}>Phone *</label><input name="phone" type="text" required style={inp} /></div>
              <div><label style={lbl}>Password *</label><input name="password" type="password" required style={inp} /></div>
              <div><label style={lbl}>Employee ID *</label><input name="employeeId" type="text" required style={inp} /></div>
              <div><label style={lbl}>Department *</label><input name="department" type="text" required style={inp} /></div>
              <div><label style={lbl}>Designation *</label><input name="designation" type="text" required style={inp} /></div>
              <div><label style={lbl}>Joining Date *</label><input name="joiningDate" type="date" required style={inp} /></div>
              <div><label style={lbl}>Basic Salary (₹) *</label><input name="basicSalary" type="number" required style={inp} /></div>
              <div><label style={lbl}>Allowances (₹)</label><input name="allowances" type="number" defaultValue="0" style={inp} /></div>
              <div><label style={lbl}>Deductions (₹)</label><input name="deductions" type="number" defaultValue="0" style={inp} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button type="submit" disabled={loading} style={{ ...btn('white', '#1d4ed8'), flex: 1, padding: '12px' }}>
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
              <button type="button" onClick={() => setView('list')} style={{ ...btn('#475569', '#f1f5f9'), flex: 1, padding: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  if (view === 'edit' && selected) return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => setView('list')} style={{ ...btn('#64748b', '#f1f5f9'), padding: '8px 16px' }}>← Back</button>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Edit Employee</h2>
        </div>
        <div style={box}>
          <form onSubmit={handleEdit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div><label style={lbl}>Full Name</label><input name="name" type="text" defaultValue={selected.name} style={inp} /></div>
              <div><label style={lbl}>Email</label><input name="email" type="email" defaultValue={selected.email} style={inp} /></div>
              <div><label style={lbl}>Phone</label><input name="phone" type="text" defaultValue={selected.phone} style={inp} /></div>
              <div><label style={lbl}>Employee ID</label><input name="employeeId" type="text" defaultValue={selected.employeeId} style={inp} /></div>
              <div><label style={lbl}>Department</label><input name="department" type="text" defaultValue={selected.department} style={inp} /></div>
              <div><label style={lbl}>Designation</label><input name="designation" type="text" defaultValue={selected.designation} style={inp} /></div>
              <div><label style={lbl}>Joining Date</label><input name="joiningDate" type="date" defaultValue={selected.joiningDate?.split('T')[0]} style={inp} /></div>
              <div><label style={lbl}>Basic Salary (₹)</label><input name="basicSalary" type="number" defaultValue={selected.basicSalary} style={inp} /></div>
              <div><label style={lbl}>Allowances (₹)</label><input name="allowances" type="number" defaultValue={selected.allowances} style={inp} /></div>
              <div><label style={lbl}>Deductions (₹)</label><input name="deductions" type="number" defaultValue={selected.deductions} style={inp} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button type="submit" disabled={loading} style={{ ...btn('white', '#16a34a'), flex: 1, padding: '12px' }}>
                {loading ? 'Updating...' : 'Update Employee'}
              </button>
              <button type="button" onClick={() => setView('list')} style={{ ...btn('#475569', '#f1f5f9'), flex: 1, padding: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  if (view === 'detail' && selected) return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => setView('list')} style={{ ...btn('#64748b', '#f1f5f9'), padding: '8px 16px' }}>← Back</button>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Employee Details</h2>
        </div>
        <div style={box}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#1d4ed8' }}>
              {selected.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{selected.name}</h3>
              <p style={{ color: '#64748b', margin: '4px 0 0' }}>{selected.designation} — {selected.department}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Employee ID', value: selected.employeeId },
              { label: 'Email', value: selected.email },
              { label: 'Phone', value: selected.phone },
              { label: 'Department', value: selected.department },
              { label: 'Designation', value: selected.designation },
              { label: 'Joining Date', value: new Date(selected.joiningDate).toLocaleDateString('en-IN') },
              { label: 'Basic Salary', value: '₹' + Number(selected.basicSalary).toLocaleString('en-IN') },
              { label: 'Allowances', value: '₹' + Number(selected.allowances).toLocaleString('en-IN') },
              { label: 'Deductions', value: '₹' + Number(selected.deductions).toLocaleString('en-IN') },
              { label: 'Net Salary', value: '₹' + (Number(selected.basicSalary) + Number(selected.allowances) - Number(selected.deductions)).toLocaleString('en-IN') },
              { label: 'Status', value: selected.isActive ? '✅ Active' : '❌ Inactive' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => setView('edit')} style={{ ...btn('white', '#1d4ed8'), flex: 1, padding: '12px' }}>✏️ Edit</button>
            <button onClick={() => setView('list')} style={{ ...btn('#475569', '#f1f5f9'), flex: 1, padding: '12px' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Employees</h2>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px', margin: '4px 0 0' }}>{employees.length} total employees</p>
        </div>
        <button onClick={() => setView('add')} style={{ ...btn('white', '#1d4ed8'), padding: '10px 20px' }}>+ Add Employee</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {employees.map((emp: any) => (
          <div key={emp._id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#1d4ed8', flexShrink: 0 }}>
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{emp.name}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>{emp.designation}</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Employee ID</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{emp.employeeId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Department</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{emp.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Salary</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>₹{Number(emp.basicSalary).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button onClick={() => { setSelected(emp); setView('detail'); }} style={{ flex: 1, background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>View</button>
              <button onClick={() => { setSelected(emp); setView('edit'); }} style={{ flex: 1, background: '#f0fdf4', color: '#16a34a', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Edit</button>
              <button onClick={() => handleDelete(emp._id)} style={{ flex: 1, background: '#fff1f2', color: '#e11d48', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Delete</button>
            </div>
          </div>
        ))}
        {employees.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>No employees found</p>
            <p style={{ fontSize: '14px', marginTop: '8px', margin: '8px 0 0' }}>Click + Add Employee to add one</p>
          </div>
        )}
      </div>
    </div>
  );
      }
