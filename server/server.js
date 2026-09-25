import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import triageRoutes from './routes/triageRoutes.js';
import { auth } from './middleware/authMiddleware.js';
import authRouter from './routes/authRoutes.js'


// ES Module mein __dirname calculate karne ke liye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Settings - Client/Browser requests ko allow karne ke liye
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Register Triage API Endpoint
app.use('/api/auth', authRouter);
app.use('/api/triage', triageRoutes);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

// const users = [
//   { id: 'u1', name: 'Asha Patil', role: 'patient', username: 'patient', password: bcrypt.hashSync('demo123', 8) },
//   { id: 'u2', name: 'Neha Deshmukh', role: 'healthWorker', username: 'worker', password: bcrypt.hashSync('demo123', 8) },
//   { id: 'u3', name: 'Dr. Meera Shah', role: 'doctor', username: 'doctor', password: bcrypt.hashSync('demo123', 8) },
//   { id: 'u4', name: 'Rahul Kulkarni', role: 'facilityAdmin', username: 'facility', password: bcrypt.hashSync('demo123', 8) },
//   { id: 'u5', name: 'Priya Nair', role: 'districtAdmin', username: 'district', password: bcrypt.hashSync('demo123', 8) }
// ];

const appointmentSchema = new mongoose.Schema({
  patient: String,
  doctor: String,
  time: String,
  reason: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

// function auth(req, res, next) {
//   try {
//     const h = req.headers.authorization || '';
//     req.user = jwt.verify(h.replace('Bearer ', ''), JWT_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// }

app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "Swasthya Sakha API" }),
);

// app.post('/api/auth/login', async (req, res) => {
//   const { username, password, role } = req.body || {};
//   const u = users.find((x) => x.username === username && x.role === role);
//   if (!u || !(await bcrypt.compare(password || '', u.password))) {
//     return res.status(401).json({ message: 'Invalid demo credentials' });
//   }
//   const token = jwt.sign({ id: u.id, name: u.name, role: u.role }, JWT_SECRET, { expiresIn: '8h' });
//   res.json({ token, user: { id: u.id, name: u.name, role: u.role } });
// });

// app.get('/api/me', auth, (req, res) => res.json({ user: req.user }));

app.get("/api/appointments", auth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  res.json(await Appointment.find().sort({ createdAt: -1 }).limit(100));
});

app.post("/api/appointments", auth, async (req, res) => {
  if (mongoose.connection.readyState !== 1)
    return res.status(503).json({ message: "MongoDB is not connected" });
  const a = await Appointment.create(req.body);
  res.status(201).json(a);
});

// MongoDB Connection
let mongo = "not configured";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/swasthya_sakha";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    mongo = "connected";
    console.log("MongoDB connected");
  })
  .catch((e) => console.error("MongoDB connection failed:", e.message));

app.get("/api/status", (req, res) => res.json({ api: "ok", mongo }));


const distPath = path.join(__dirname, '../client/dist');
const buildPath = path.join(__dirname, '../client/build');

const clientBuildPath = fs.existsSync(distPath) ? distPath : buildPath;

app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); 
  }

  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res
      .status(404)
      .send(
        `Build folder found at ${clientBuildPath}, but index.html is missing. Check build logs.`,
      );
  }
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} not found on this server.` });
});


// app.listen(PORT, () => console.log(`Swasthya Sakha API running on port ${PORT}`));


app.listen(PORT, () => console.log(`Swasthya Sakha API running on port ${PORT}`));

 



// 3Jp4QjBkpVl5dXvDrDhcclpxuf6_7hsjADr52q9n6EY76g15f
