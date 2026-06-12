import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5001");
const palette = ["#0f766e", "#2563eb", "#f59e0b", "#dc2626", "#7c3aed", "#16a34a"];

function request(path, options = {}) {
  const token = localStorage.getItem("hrms-token");
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }).then(async (response) => {
    if (!response.ok) throw new Error((await response.json()).message || "Request failed");
    return response.status === 204 ? null : response.json();
  });
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "admin@hrms.com", password: "123456" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "signup") {
        await request("/api/auth/signup", { method: "POST", body: JSON.stringify(form) });
        setMode("login");
        return;
      }
      const data = await request("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("hrms-token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Full Stack Internship Project</p>
          <h1>Enterprise HRMS Training Suite</h1>
          <p className="muted">Login, employees, leaves, assets, audit trail, reports, students, and salary analytics in one fresh project.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <div className="form-title">
            <Lock size={18} />
            <strong>{mode === "login" ? "Secure Login" : "Create Student User"}</strong>
          </div>
          {mode === "signup" && <input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}
          <input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">{mode === "login" ? "Login to Dashboard" : "Create Account"}</button>
          <button className="link-button" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Need signup?" : "Already have login?"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <article className="stat-card">
      <span><Icon size={20} /></span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", city: "", designation: "", salary: "", departmentId: 1, mode: "offline", semester: "6th", domain: "Full Stack", attendance: "Present", skills: [1, 2] });

  const load = async () => {
    const next = await request("/api/bootstrap");
    setUser(next.user);
    setData(next);
  };

  useEffect(() => {
    // Restore a saved session once when the app starts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem("hrms-token")) load().catch(() => localStorage.removeItem("hrms-token"));
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!data) return [];
    return data.employees.filter((employee) => [employee.name, employee.department, employee.city, employee.domain, employee.mode, employee.attendance].join(" ").toLowerCase().includes(query.toLowerCase()));
  }, [data, query]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.departments.map((department) => ({
      name: department.name.replace("Software Development", "Software").replace("Quality Assurance", "QA"),
      employees: data.employees.filter((employee) => employee.departmentId === department.id).length,
    })).filter((item) => item.employees);
  }, [data]);

  const leaveOverview = useMemo(() => {
    if (!data) return [];
    return ["Approved", "Pending", "Rejected"].map((name) => ({
      name,
      value: data.leaveApplications.filter((leave) => leave.finalStatus === name).length,
    }));
  }, [data]);

  const assetOverview = useMemo(() => {
    if (!data) return [];
    return ["Allocated", "Available", "Returned", "Damaged", "Lost"].map((name) => ({
      name,
      value: data.assets.filter((asset) => asset.status === name).length,
    })).filter((item) => item.value);
  }, [data]);

  const assetAllocation = useMemo(() => {
    if (!data) return [];
    return data.assets.reduce((items, asset) => {
      const existing = items.find((item) => item.name === asset.type);
      if (existing) existing.assets += 1;
      else items.push({ name: asset.type, assets: 1 });
      return items;
    }, []);
  }, [data]);

  const cityDistribution = useMemo(() => {
    if (!data) return [];
    return data.employees.reduce((items, employee) => {
      const existing = items.find((item) => item.name === employee.city);
      if (existing) existing.employees += 1;
      else items.push({ name: employee.city, employees: 1 });
      return items;
    }, []);
  }, [data]);

  const modeDistribution = useMemo(() => {
    if (!data) return [];
    return ["online", "offline", "hybrid"].map((name) => ({
      name: name[0].toUpperCase() + name.slice(1),
      students: data.students.filter((student) => student.mode === name).length,
      employees: data.employees.filter((employee) => employee.mode === name).length,
    }));
  }, [data]);

  const createEmployee = async (event) => {
    event.preventDefault();
    await request("/api/employees", { method: "POST", body: JSON.stringify({ ...form, userId: Date.now(), status: form.attendance.toLowerCase() }) });
    setForm({ ...form, name: "", phone: "", city: "", designation: "", salary: "" });
    await load();
  };

  const leaveAction = async (leave, action) => {
    await request(`/api/leaves/${leave.id}/action`, { method: "POST", body: JSON.stringify({ managerStatus: action, hrStatus: action, finalStatus: action }) });
    await load();
  };

  const downloadSalaryReport = async () => {
    const response = await fetch(`${API}/api/reports/salary.csv`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("hrms-token")}` },
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "salary-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem("hrms-token");
    setUser(null);
    setData(null);
  };

  if (!data || !user) return <Login onLogin={(nextUser) => { setUser(nextUser); load(); }} />;

  const nav = [
    ["Dashboard", LayoutDashboard],
    ["Employees", Users],
    ["Leave Workflow", ClipboardList],
    ["Assets", BriefcaseBusiness],
    ["Reports", FileText],
    ["Students", GraduationCap],
    ["Audit", ShieldCheck],
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><ShieldCheck /><div><strong>Enterprise HRMS</strong><small>Workflow Engine</small></div></div>
        {nav.map(([item, Icon]) => (
          <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}><Icon size={18} />{item}</button>
        ))}
        <button onClick={logout}><LogOut size={18} />Logout</button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Role: {user.role}</p>
            <h1>{active}</h1>
          </div>
          <div className="search"><Search size={18} /><input placeholder="Filter semester, city, domain, attendance..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        </header>

        {active === "Dashboard" && (
          <>
            <section className="stats-grid">
              <Stat icon={Users} label="Employees" value={data.stats.employees} />
              <Stat icon={BriefcaseBusiness} label="Allocated Assets" value={data.stats.assetsAllocated} />
              <Stat icon={ClipboardList} label="Pending Leaves" value={data.stats.pendingApprovals} />
              <Stat icon={GraduationCap} label="Students" value={data.stats.students} />
              <Stat icon={Upload} label="Uploaded Files" value={data.stats.uploadedImages} />
              <Stat icon={Bell} label="Notifications" value={data.notifications.length} />
            </section>
            <section className="grid two">
              <div className="panel">
                <h2>Department-wise Statistics</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="employees" radius={[8, 8, 0, 0]}>{chartData.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}</Bar></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <h2>Salary Sheet Graph</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.employees}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Area type="monotone" dataKey="salary" stroke="#2563eb" fill="#93c5fd" /></AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <h2>Leave Overview</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={leaveOverview} dataKey="value" nameKey="name" outerRadius={90} label>{leaveOverview.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <h2>Asset Overview</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={assetOverview} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90} label>{assetOverview.map((_, index) => <Cell key={index} fill={palette[(index + 2) % palette.length]} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <h2>Asset Allocation by Type</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={assetAllocation}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="assets" radius={[8, 8, 0, 0]} fill="#f59e0b" /></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <h2>City-wise Distribution</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={cityDistribution} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={70} /><Tooltip /><Bar dataKey="employees" radius={[0, 8, 8, 0]} fill="#0f766e" /></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="panel">
                <h2>Online Offline Hybrid</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={modeDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={3} /><Line type="monotone" dataKey="employees" stroke="#16a34a" strokeWidth={3} /></LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}

        {active === "Employees" && (
          <section className="grid two">
            <form className="panel form-grid" onSubmit={createEmployee}>
              <h2>Create Employee Profile</h2>
              {["name", "phone", "city", "designation", "salary", "domain"].map((field) => <input key={field} placeholder={field} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}
              <select value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: Number(event.target.value) })}>{data.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select>
              <select value={form.attendance} onChange={(event) => setForm({ ...form, attendance: event.target.value })}><option>Present</option><option>Absent</option><option>Late</option></select>
              <input type="file" multiple />
              <button className="primary"><Plus size={16} />Save Employee</button>
            </form>
            <div className="panel">
              <h2>Employee Listing with JOIN Data</h2>
              <div className="table-wrap"><table><thead><tr><th>Name</th><th>Department</th><th>Skills</th><th>Salary</th><th>Status</th></tr></thead><tbody>{filteredEmployees.map((employee) => <tr key={employee.id}><td>{employee.name}<small>{employee.designation}</small></td><td>{employee.department}</td><td>{employee.skillNames.join(", ")}</td><td>₹{employee.salary.toLocaleString("en-IN")}</td><td><span className={`badge ${employee.attendance.toLowerCase()}`}>{employee.attendance}</span></td></tr>)}</tbody></table></div>
            </div>
          </section>
        )}

        {active === "Leave Workflow" && <section className="panel"><h2>Manager Approval, HR Final Approval & Leave Balance</h2><div className="cards-row">{data.leaveApplications.map((leave) => <article className="mini-card" key={leave.id}><strong>{leave.employee}</strong><p>{leave.type} • {leave.days} day(s)</p><small>{leave.from} to {leave.to}</small><div className="workflow"><span>{leave.managerStatus}</span><span>{leave.hrStatus}</span><span>{leave.finalStatus}</span></div><button onClick={() => leaveAction(leave, "Approved")}><CheckCircle2 size={16} />Approve</button><button onClick={() => leaveAction(leave, "Rejected")}>Reject</button></article>)}</div></section>}

        {active === "Assets" && <section className="panel"><h2>Asset Management System</h2><div className="cards-row">{data.assets.map((asset) => <article className="mini-card" key={asset.id}><strong>{asset.code}</strong><p>{asset.name}</p><small>{asset.type} • {asset.employee}</small><span className="badge">{asset.status}</span></article>)}</div></section>}

        {active === "Reports" && <section className="grid two"><div className="panel"><h2>Salary Report</h2><p className="muted">Total salary ₹{data.stats.salaryTotal.toLocaleString("en-IN")} • TDS ₹{data.stats.tds.toLocaleString("en-IN")} • PF ₹{data.stats.pf.toLocaleString("en-IN")}</p><button className="primary" onClick={downloadSalaryReport}><Download size={16} />Export CSV</button></div><div className="panel"><h2>Attendance Split</h2><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={["Present", "Absent", "Late"].map((name) => ({ name, value: data.employees.filter((employee) => employee.attendance === name).length }))} dataKey="value" nameKey="name">{palette.slice(0, 3).map((color) => <Cell key={color} fill={color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></section>}

        {active === "Students" && <section className="panel"><h2><Filter size={18} /> Phase 6 Student Filters</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Semester</th><th>City</th><th>Domain</th><th>Mode</th></tr></thead><tbody>{data.students.filter((student) => Object.values(student).join(" ").toLowerCase().includes(query.toLowerCase())).map((student) => <tr key={student.id}><td>{student.name}</td><td>{student.semester}</td><td>{student.city}</td><td>{student.domain}</td><td>{student.mode}</td></tr>)}</tbody></table></div></section>}

        {active === "Audit" && <section className="grid two"><div className="panel"><h2>Audit Trail JSONB Style Logs</h2>{data.auditLogs.map((log) => <article className="log" key={log.id}><strong>{log.table} • {log.action}</strong><p>{log.oldValue} → {log.newValue}</p><small>{log.by} • {log.at}</small></article>)}</div><div className="panel"><h2>Notification Engine</h2>{data.notifications.map((note) => <article className="log" key={note.id}><strong>{note.title}</strong><p>{note.message}</p></article>)}</div></section>}
      </main>
    </div>
  );
}

export default App;
