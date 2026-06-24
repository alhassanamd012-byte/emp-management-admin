'use client';
import { useEffect, useState } from 'react';

const emptyForm = {
  name: '', email: '', phone: '', password: '',
  employeeId: '', department: '', designation: '',
  joiningDate: '', basicSalary: '', allowances: '', deductions: ''
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchEmployees = async () => {
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://emp-management-api-4icz.onrender.com/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) { setShowForm(false); setForm(emptyForm); fetchEmployees(); }
    setLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`https://emp-management-api-4icz.onrender.com/api/employees/${editEmployee._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editEmployee)
    });
    const data = await res.json();
    if (data.success) { setEditEmployee(null); fetchEmployees(); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    await fetch(`https://emp-management-api-4icz.onrender.com/api/employees/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchEmployees();
  };

  const fields = [
    { label: 'Full Name', key: 'name', type: 'text' },
    { label: 'Email', key: 'email', type: 'email' },
    { label: 'Phone', key: 'phone', type: 'text' },
    { label: 'Password', key: 'password', type: 'password' },
    { label: 'Employee ID', key: 'employeeId', type: 'text' },
    { label: 'Department', key: 'department', type: 'text' },
    { label: 'Designation', key: 'designation', type: 'text' },
    { label: 'Joining Date', key: 'joiningDate', type: 'date' },
    { label: 'Basic Salary (₹)', key: 'basicSalary', type: 'number' },
    { label: 'Allowances (₹)', key: 'allowances', type: 'number' },
    { label: 'Deductions (₹)', key: 'deductions', type: 'number' },
  ];

  const Modal = ({ title, onClose, children }: any) => (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
      <div style={{background:'white',borderRadius:'16px',padding:'32px',width:'600px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h3 style={{fontSize:'20px',fontWeight:'700',color:'#1e293b'}}>{title}</h3>
          <button onClick={onClose} style={{fontSize:'24px',color:'#94a3b8',background:'none',border:'none',cursor:'pointer'}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{padding:'32px',background:'#f8fafc',minHeight:'100vh',width:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
        <div>
          <h2 style={{fontSize:'28px',fontWeight:'700',color:'#1e293b',margin:0}}>Employees</h2>
          <p style={{color:'#64748b',marginTop:'4px',fontSize:'14px'}}>{employees.length} total employees</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setForm(emptyForm); }}
          style={{background:'#1d4ed8',color:'white',padding:'10px 20px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}
        >
          + Add Employee
        </button>
      </div>

      {showForm && (
        <Modal title="Add New Employee" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} autoComplete="new-password">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              {fields.map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#475569',marginBottom:'6px'}}>{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof emptyForm]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                    style={{width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box'}} autoComplete="new-password"
                  />
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
              <button type="submit" disabled={loading} style={{flex:1,background:'#1d4ed8',color:'white',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{flex:1,background:'#f1f5f9',color:'#475569',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {editEmployee && (
        <Modal title="Edit Employee" onClose={() => setEditEmployee(null)}>
          <form onSubmit={handleEdit}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              {fields.filter(f => f.key !== 'password').map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#475569',marginBottom:'6px'}}>{label}</label>
                  <input
                    type={type}
                    value={editEmployee[key] || ''}
                    onChange={(e) => setEditEmployee({ ...editEmployee, [key]: e.target.value })}
                    style={{width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box'}} autoComplete="off"
                  />
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
              <button type="submit" disabled={loading} style={{flex:1,background:'#16a34a',color:'white',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>
                {loading ? 'Updating...' : 'Update Employee'}
              </button>
              <button type="button" onClick={() => setEditEmployee(null)} style={{flex:1,background:'#f1f5f9',color:'#475569',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedEmployee && (
        <Modal title="Employee Details" onClose={() => setSelectedEmployee(null)}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {[
              { label: 'Full Name', value: selectedEmployee.name },
              { label: 'Employee ID', value: selectedEmployee.employeeId },
              { label: 'Email', value: selectedEmployee.email },
              { label: 'Phone', value: selectedEmployee.phone },
              { label: 'Department', value: selectedEmployee.department },
              { label: 'Designation', value: selectedEmployee.designation },
              { label: 'Joining Date', value: new Date(selectedEmployee.joiningDate).toLocaleDateString('en-IN') },
              { label: 'Basic Salary', value: '₹' + Number(selectedEmployee.basicSalary).toLocaleString('en-IN') },
              { label: 'Allowances', value: '₹' + Number(selectedEmployee.allowances).toLocaleString('en-IN') },
              { label: 'Deductions', value: '₹' + Number(selectedEmployee.deductions).toLocaleString('en-IN') },
              { label: 'Net Salary', value: '₹' + (Number(selectedEmployee.basicSalary) + Number(selectedEmployee.allowances) - Number(selectedEmployee.deductions)).toLocaleString('en-IN') },
              { label: 'Status', value: selectedEmployee.isActive ? 'Active' : 'Inactive' },
            ].map(({ label, value }) => (
              <div key={label} style={{background:'#f8fafc',borderRadius:'10px',padding:'12px',border:'1px solid #e2e8f0'}}>
                <div style={{fontSize:'11px',color:'#94a3b8',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'4px'}}>{label}</div>
                <div style={{fontSize:'15px',fontWeight:'600',color:'#1e293b'}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
            <button
              onClick={() => { setEditEmployee(selectedEmployee); setSelectedEmployee(null); }}
              style={{flex:1,background:'#1d4ed8',color:'white',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}
            >
              ✏️ Edit
            </button>
            <button onClick={() => setSelectedEmployee(null)} style={{flex:1,background:'#f1f5f9',color:'#475569',padding:'12px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'600',fontSize:'15px'}}>
              Close
            </button>
          </div>
        </Modal>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
        {employees.map((emp: any) => (
          <div key={emp._id} style={{background:'white',borderRadius:'16px',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',border:'1px solid #e2e8f0'}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'20px'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:'700',color:'#1d4ed8',flexShrink:0}}>
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1e293b',margin:0}}>{emp.name}</h3>
                <p style={{fontSize:'13px',color:'#64748b',margin:'2px 0 0'}}>{emp.designation}</p>
              </div>
            </div>
            <div style={{borderTop:'1px solid #f1f5f9',paddingTop:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',color:'#94a3b8'}}>Employee ID</span>
                <span style={{fontSize:'13px',fontWeight:'600',color:'#334155'}}>{emp.employeeId}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',color:'#94a3b8'}}>Department</span>
                <span style={{fontSize:'13px',fontWeight:'600',color:'#334155'}}>{emp.department}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',color:'#94a3b8'}}>Salary</span>
                <span style={{fontSize:'13px',fontWeight:'700',color:'#16a34a'}}>₹{Number(emp.basicSalary).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'20px'}}>
              <button onClick={() => setSelectedEmployee(emp)} style={{flex:1,background:'#eff6ff',color:'#1d4ed8',border:'none',padding:'8px',borderRadius:'8px',cursor:'pointer',fontWeight:'600',fontSize:'13px'}}>
                View
              </button>
              <button onClick={() => setEditEmployee(emp)} style={{flex:1,background:'#f0fdf4',color:'#16a34a',border:'none',padding:'8px',borderRadius:'8px',cursor:'pointer',fontWeight:'600',fontSize:'13px'}}>
                Edit
              </button>
              <button onClick={() => handleDelete(emp._id)} style={{flex:1,background:'#fff1f2',color:'#e11d48',border:'none',padding:'8px',borderRadius:'8px',cursor:'pointer',fontWeight:'600',fontSize:'13px'}}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {employees.length === 0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'80px',color:'#94a3b8'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>👥</div>
            <p style={{fontSize:'18px',fontWeight:'600'}}>No employees found</p>
            <p style={{fontSize:'14px',marginTop:'8px'}}>Click + Add Employee to add one</p>
          </div>
        )}
      </div>
    </div>
  );
            }
