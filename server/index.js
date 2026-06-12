import express from "express";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const upload = multer({ dest: "server/uploads/" });
const JWT_SECRET = process.env.JWT_SECRET || "training-hrms-secret";
const PORT = process.env.PORT || 5001;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true);
  },
}));
app.use(express.json());
app.use("/uploads", express.static("server/uploads"));

const departments = [
  { id: 1, name: "Software Development" },
  { id: 2, name: "Quality Assurance" },
  { id: 3, name: "Human Resources" },
  { id: 4, name: "Finance" },
  { id: 5, name: "Digital Marketing" },
  { id: 6, name: "Sales" },
  { id: 7, name: "Operations" },
  { id: 8, name: "Technical Support" },
];

const skills = ["React", "NodeJS", "PostgreSQL", "JavaScript", "HTML", "CSS", "Python", "Testing", "Salesforce"].map((name, index) => ({ id: index + 1, name }));

const users = [
  { id: 1, name: "Admin User", email: "admin@hrms.com", password: bcrypt.hashSync("123456", 8), role: "admin" },
  { id: 2, name: "Rahul Sharma", email: "manager@hrms.com", password: bcrypt.hashSync("123456", 8), role: "manager" },
  { id: 3, name: "Priya Verma", email: "hr@hrms.com", password: bcrypt.hashSync("123456", 8), role: "hr" },
  { id: 4, name: "Amit Patel", email: "employee@hrms.com", password: bcrypt.hashSync("123456", 8), role: "employee" },
];

let employees = [
  { id: 1, userId: 1, name: "Admin User", departmentId: 1, phone: "9876543210", city: "Indore", designation: "Director", salary: 150000, mode: "offline", semester: "N/A", domain: "Management", status: "present", attendance: "Present", skills: [1, 2, 3], images: 3 },
  { id: 2, userId: 2, name: "Rahul Sharma", departmentId: 1, phone: "9876543211", city: "Indore", designation: "Project Manager", salary: 85000, mode: "hybrid", semester: "N/A", domain: "Full Stack", status: "late", attendance: "Late", skills: [1, 2, 4], images: 2 },
  { id: 3, userId: 3, name: "Priya Verma", departmentId: 3, phone: "9876543212", city: "Bhopal", designation: "HR Manager", salary: 70000, mode: "offline", semester: "N/A", domain: "HRMS", status: "present", attendance: "Present", skills: [4, 8], images: 2 },
  { id: 4, userId: 4, name: "Amit Patel", departmentId: 1, phone: "9876543213", city: "Indore", designation: "React Developer", salary: 45000, mode: "online", semester: "6th", domain: "React", status: "absent", attendance: "Absent", skills: [1, 4, 5, 6], images: 4 },
  { id: 5, userId: 5, name: "Neha Jain", departmentId: 1, phone: "9876543214", city: "Ujjain", designation: "Node Developer", salary: 50000, mode: "hybrid", semester: "8th", domain: "Node", status: "present", attendance: "Present", skills: [2, 3, 4], images: 3 },
  { id: 6, userId: 6, name: "Rohit Singh", departmentId: 2, phone: "9876543215", city: "Dewas", designation: "QA Engineer", salary: 40000, mode: "offline", semester: "7th", domain: "Testing", status: "late", attendance: "Late", skills: [8], images: 1 },
];

let leaveApplications = [
  { id: 1, employeeId: 4, type: "Casual Leave", from: "2026-06-12", to: "2026-06-13", days: 2, reason: "Family function", managerStatus: "Approved", hrStatus: "Pending", finalStatus: "Pending" },
  { id: 2, employeeId: 5, type: "Sick Leave", from: "2026-06-10", to: "2026-06-10", days: 1, reason: "Fever", managerStatus: "Approved", hrStatus: "Approved", finalStatus: "Approved" },
  { id: 3, employeeId: 6, type: "Earned Leave", from: "2026-06-18", to: "2026-06-20", days: 3, reason: "Travel", managerStatus: "Pending", hrStatus: "Pending", finalStatus: "Pending" },
];

let assets = [
  { id: 1, code: "LAP-1001", name: "MacBook Air M4", type: "Laptop", employeeId: 2, status: "Allocated", cost: 125000 },
  { id: 2, code: "MON-2042", name: "Dell 24 Monitor", type: "Monitor", employeeId: 4, status: "Allocated", cost: 16000 },
  { id: 3, code: "IDC-9001", name: "Office ID Card", type: "ID Card", employeeId: 5, status: "Returned", cost: 250 },
  { id: 4, code: "KEY-5010", name: "Access Card", type: "Access", employeeId: null, status: "Available", cost: 500 },
];

let students = [
  { id: 1, name: "Arjun Verma", semester: "6th", city: "Indore", domain: "React", mode: "online" },
  { id: 2, name: "Meera Shah", semester: "8th", city: "Bhopal", domain: "Node", mode: "offline" },
  { id: 3, name: "Kabir Jain", semester: "7th", city: "Ujjain", domain: "PostgreSQL", mode: "hybrid" },
  { id: 4, name: "Nisha Patel", semester: "6th", city: "Indore", domain: "Full Stack", mode: "offline" },
  { id: 5, name: "Ravi Singh", semester: "8th", city: "Dewas", domain: "Testing", mode: "online" },
];

const auditLogs = [
  { id: 1, table: "employee_profiles", action: "UPDATE", oldValue: "salary 50000", newValue: "salary 65000", by: "Priya Verma", at: "2026-06-11 11:40" },
  { id: 2, table: "leave_applications", action: "APPROVE", oldValue: "Pending", newValue: "Approved", by: "Rahul Sharma", at: "2026-06-11 14:05" },
  { id: 3, table: "asset_allocations", action: "ASSIGN", oldValue: "Available", newValue: "Allocated", by: "Admin User", at: "2026-06-11 15:15" },
];

const notifications = [
  { id: 1, title: "Leave approved", message: "Sick Leave approved by HR", read: false },
  { id: 2, title: "Asset assigned", message: "Dell 24 Monitor assigned to Amit Patel", read: false },
  { id: 3, title: "Salary sheet ready", message: "June payroll report is available", read: true },
];

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const joinEmployee = (employee) => ({
  ...employee,
  department: departments.find((department) => department.id === employee.departmentId)?.name,
  skillNames: employee.skills.map((id) => skills.find((skill) => skill.id === id)?.name).filter(Boolean),
});

app.post("/api/auth/login", async (req, res) => {
  const user = users.find((item) => item.email === req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: "Invalid login" });
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token: jwt.sign(safeUser, JWT_SECRET, { expiresIn: "8h" }), user: safeUser });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    service: "Enterprise HRMS API",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/auth/signup", async (req, res) => {
  const id = users.length + 1;
  const user = { id, name: req.body.name, email: req.body.email, password: await bcrypt.hash(req.body.password, 8), role: "employee" };
  users.push(user);
  res.status(201).json({ id, name: user.name, email: user.email, role: user.role });
});

app.get("/api/bootstrap", auth, (req, res) => {
  const joined = employees.map(joinEmployee);
  const salaryTotal = employees.reduce((sum, employee) => sum + employee.salary, 0);
  res.json({
    user: req.user,
    departments,
    skills,
    employees: joined,
    leaveApplications: leaveApplications.map((leave) => ({ ...leave, employee: employees.find((employee) => employee.id === leave.employeeId)?.name })),
    assets: assets.map((asset) => ({ ...asset, employee: employees.find((employee) => employee.id === asset.employeeId)?.name || "Unassigned" })),
    students,
    auditLogs,
    notifications,
    stats: {
      employees: employees.length,
      departments: departments.length,
      skills: skills.length,
      uploadedImages: employees.reduce((sum, employee) => sum + employee.images, 0),
      leaveRequests: leaveApplications.length,
      pendingApprovals: leaveApplications.filter((leave) => leave.finalStatus === "Pending").length,
      assetsAllocated: assets.filter((asset) => asset.status === "Allocated").length,
      students: students.length,
      salaryTotal,
      tds: Math.round(salaryTotal * 0.1),
      pf: Math.round(salaryTotal * 0.12),
    },
  });
});

app.post("/api/employees", auth, (req, res) => {
  const employee = { ...req.body, id: employees.length + 1, salary: Number(req.body.salary || 0), departmentId: Number(req.body.departmentId), skills: req.body.skills || [], images: 0 };
  employees.push(employee);
  res.status(201).json(joinEmployee(employee));
});

app.put("/api/employees/:id", auth, (req, res) => {
  employees = employees.map((employee) => employee.id === Number(req.params.id) ? { ...employee, ...req.body } : employee);
  res.json(joinEmployee(employees.find((employee) => employee.id === Number(req.params.id))));
});

app.delete("/api/employees/:id", auth, (req, res) => {
  employees = employees.filter((employee) => employee.id !== Number(req.params.id));
  res.status(204).end();
});

app.post("/api/employees/upload", auth, upload.array("files", 5), (req, res) => {
  res.json({ files: req.files.map((file) => ({ name: file.originalname, url: `/uploads/${file.filename}` })) });
});

app.post("/api/leaves/:id/action", auth, (req, res) => {
  leaveApplications = leaveApplications.map((leave) => leave.id === Number(req.params.id) ? { ...leave, ...req.body } : leave);
  res.json(leaveApplications.find((leave) => leave.id === Number(req.params.id)));
});

app.get("/api/reports/salary.csv", auth, (req, res) => {
  const rows = ["Name,Department,Salary,TDS,PF,Net Salary", ...employees.map((employee) => {
    const tds = Math.round(employee.salary * 0.1);
    const pf = Math.round(employee.salary * 0.12);
    return `${employee.name},${departments.find((department) => department.id === employee.departmentId)?.name},${employee.salary},${tds},${pf},${employee.salary - tds - pf}`;
  })];
  res.type("text/csv").send(rows.join("\n"));
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
