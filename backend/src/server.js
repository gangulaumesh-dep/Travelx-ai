import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "travelx-dev-secret";
const root = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(root, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir));

const tokenFor = (u) => jwt.sign(
  { id: u.id, role: u.role, email: u.email },
  JWT_SECRET,
  { expiresIn: "7d" }
);

function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const raw = header.startsWith("Bearer ") ? header.slice(7) : header;
    req.user = jwt.verify(raw, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Login required" });
  }
}

const only = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) return next();
  return res.status(403).json({ message: "Not authorized" });
};

const money = (v) => Number(v || 0);

async function ensureTripSchema() {
  await pool.query(`
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS travellers INTEGER DEFAULT 1;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS origin VARCHAR(180);
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    CREATE TABLE IF NOT EXISTS trip_days(
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      day_number INT NOT NULL,
      title VARCHAR(180),
      trip_date DATE,
      completed BOOLEAN DEFAULT FALSE,
      day_budget NUMERIC(12,2) DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(trip_id, day_number)
    );
    CREATE TABLE IF NOT EXISTS trip_activities(
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      trip_day_id INTEGER REFERENCES trip_days(id) ON DELETE CASCADE,
      time_label VARCHAR(20),
      activity_type VARCHAR(40) DEFAULT 'Place',
      title VARCHAR(180) NOT NULL,
      description TEXT,
      planned_cost NUMERIC(12,2) DEFAULT 0,
      actual_cost NUMERIC(12,2),
      completed BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS trip_expenses(
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      activity_id INTEGER REFERENCES trip_activities(id) ON DELETE SET NULL,
      category VARCHAR(80),
      amount NUMERIC(12,2) NOT NULL CHECK(amount >= 0),
      note TEXT,
      spent_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trip_days_trip ON trip_days(trip_id, day_number);
    CREATE INDEX IF NOT EXISTS idx_trip_activities_day ON trip_activities(trip_day_id, sort_order);
    CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip ON trip_expenses(trip_id, spent_at DESC);
  `);
}

function tripDays(start, end) {
  if (!start || !end) return 1;
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.max(1, Math.floor((b - a) / 86400000) + 1);
}

function addDays(date, n) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function destinationActivities(destination, origin) {
  const name = destination || "your destination";
  return [
    { time: "06:00", type: "Travel", title: `Journey from ${origin || "your location"}`, description: `Start your journey towards ${name}.`, cost: 450 },
    { time: "08:00", type: "Food", title: "Breakfast / Tiffin", description: "Start the day with a local breakfast.", cost: 250 },
    { time: "09:30", type: "Place", title: `${name} local highlight`, description: `Explore a recommended attraction in ${name}.`, cost: 300 },
    { time: "13:00", type: "Food", title: "Lunch", description: "Lunch at a local restaurant.", cost: 500 },
    { time: "14:30", type: "Travel", title: "Travel to next location", description: "Travel from the previous location.", cost: 200 },
    { time: "15:30", type: "Place", title: "Local attraction", description: "Visit another local attraction and capture memories.", cost: 300 },
    { time: "18:30", type: "Food", title: "Local dinner", description: "Try a local dinner special.", cost: 700 },
    { time: "20:30", type: "Hotel", title: "Return to Hotel", description: "Return to your selected stay.", cost: 0 }
  ];
}

async function getOwnedTrip(tripId, userId) {
  const r = await pool.query("SELECT * FROM trips WHERE id=$1 AND user_id=$2", [tripId, userId]);
  return r.rows[0] || null;
}

async function buildTripPayload(tripId) {
  const trip = (await pool.query("SELECT * FROM trips WHERE id=$1", [tripId])).rows[0];
  if (!trip) return null;
  const days = (await pool.query("SELECT * FROM trip_days WHERE trip_id=$1 ORDER BY day_number", [tripId])).rows;
  for (const day of days) {
    day.activities = (await pool.query("SELECT * FROM trip_activities WHERE trip_day_id=$1 ORDER BY sort_order,id", [day.id])).rows;
  }
  const expenses = (await pool.query("SELECT * FROM trip_expenses WHERE trip_id=$1 ORDER BY spent_at DESC", [tripId])).rows;
  return { trip, days, expenses };
}

app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ ok: true, database: true }); }
  catch (e) { res.status(503).json({ ok: false, database: false, message: e.message }); }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "tourist" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
    if (!["tourist", "guide", "business"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length) return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 12);
    const created = await pool.query("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role", [name, email, hash, role]);
    const u = created.rows[0];
    if (role === "tourist") await pool.query("INSERT INTO tourist_profiles(user_id) VALUES($1) ON CONFLICT DO NOTHING", [u.id]);
    if (role === "guide") await pool.query("INSERT INTO guide_profiles(user_id) VALUES($1) ON CONFLICT DO NOTHING", [u.id]);
    if (role === "business") await pool.query("INSERT INTO business_profiles(user_id,business_name) VALUES($1,$2) ON CONFLICT DO NOTHING", [u.id, name]);
    res.status(201).json({ user: u, token: tokenFor(u) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const r = await pool.query("SELECT id,name,email,password_hash,role FROM users WHERE email=$1 AND is_active=true", [req.body.email]);
    if (!r.rows.length || !(await bcrypt.compare(req.body.password || "", r.rows[0].password_hash))) return res.status(401).json({ message: "Invalid credentials" });
    const { password_hash, ...u } = r.rows[0];
    res.json({ user: u, token: tokenFor(u) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get("/api/me", auth, async (req, res) => {
  const r = await pool.query("SELECT id,name,email,role,is_active,created_at FROM users WHERE id=$1", [req.user.id]);
  res.json(r.rows[0]);
});

app.get("/api/discoveries", async (_req, res) => {
  const r = await pool.query(`SELECT d.*,u.name submitted_by, COALESCE(json_agg(di.image_url) FILTER (WHERE di.id IS NOT NULL),'[]') images FROM discoveries d JOIN users u ON u.id=d.user_id LEFT JOIN discovery_images di ON di.discovery_id=d.id GROUP BY d.id,u.name ORDER BY d.created_at DESC`);
  res.json(r.rows);
});

app.post("/api/discoveries", auth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.body.latitude || !req.body.longitude || !req.file) return res.status(400).json({ message: "Photo and location are required" });
    const r = await pool.query("INSERT INTO discoveries(user_id,title,description,category,latitude,longitude,status) VALUES($1,$2,$3,$4,$5,$6,'pending') RETURNING *", [req.user.id, req.body.title, req.body.description, req.body.category, req.body.latitude, req.body.longitude]);
    await pool.query("INSERT INTO discovery_images(discovery_id,image_url) VALUES($1,$2)", [r.rows[0].id, `/uploads/${req.file.filename}`]);
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch("/api/discoveries/:id/verify", auth, only(["admin"]), async (req, res) => {
  const status = req.body.status;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  await pool.query("UPDATE discoveries SET status=$1,reviewed_by=$2,reviewed_at=NOW() WHERE id=$3", [status, req.user.id, req.params.id]);
  await pool.query("INSERT INTO discovery_verifications(discovery_id,authority_id,status,notes) VALUES($1,$2,$3,$4)", [req.params.id, req.user.id, status, req.body.notes || null]);
  res.json({ message: "Updated" });
});

app.post("/api/trips", auth, only(["tourist"]), async (req, res) => {
  try {
    const b = req.body;
    const r = await pool.query(`INSERT INTO trips(user_id,destination,start_date,end_date,budget,interests,status,travellers,origin) VALUES($1,$2,$3,$4,$5,$6,'planned',$7,$8) RETURNING *`, [req.user.id, b.destination, b.start_date || null, b.end_date || null, b.budget || 0, JSON.stringify(b.interests || []), Number(b.travellers || 1), b.origin || b.fromLocation || null]);
    res.status(201).json({ id: r.rows[0].id, trip: r.rows[0] });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get("/api/trips", auth, only(["tourist"]), async (req, res) => {
  const r = await pool.query("SELECT * FROM trips WHERE user_id=$1 ORDER BY created_at DESC", [req.user.id]);
  res.json(r.rows);
});

app.get("/api/trips/:id", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(await buildTripPayload(trip.id));
});

app.post("/api/trips/:id/generate", auth, only(["tourist"]), async (req, res) => {
  try {
    const trip = await getOwnedTrip(req.params.id, req.user.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    await pool.query("DELETE FROM trip_days WHERE trip_id=$1", [trip.id]);
    const days = tripDays(trip.start_date, trip.end_date);
    const templates = destinationActivities(trip.destination, trip.origin);
    for (let i = 0; i < days; i++) {
      const dayDate = trip.start_date ? addDays(trip.start_date.toISOString().slice(0, 10), i) : null;
      const title = i === 0 ? "Arrival & exploration" : i === days - 1 ? "Final day & return journey" : `Explore ${trip.destination}`;
      const d = await pool.query("INSERT INTO trip_days(trip_id,day_number,title,trip_date,day_budget) VALUES($1,$2,$3,$4,$5) RETURNING id", [trip.id, i + 1, title, dayDate, templates.reduce((sum, a) => sum + a.cost, 0)]);
      let activities = templates;
      if (i > 0) activities = templates.filter(a => !a.title.startsWith("Journey from"));
      if (i === days - 1) activities = [...activities, { time: "18:00", type: "Travel", title: `Return to ${trip.origin || "starting location"}`, description: `Return journey from ${trip.destination}.`, cost: 450 }];
      for (let order = 0; order < activities.length; order++) {
        const a = activities[order];
        await pool.query("INSERT INTO trip_activities(trip_day_id,time_label,activity_type,title,description,planned_cost,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7)", [d.rows[0].id, a.time, a.type, a.title, a.description, a.cost, order]);
      }
    }
    await pool.query("UPDATE trips SET status='active',updated_at=NOW() WHERE id=$1", [trip.id]);
    res.status(201).json(await buildTripPayload(trip.id));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch("/api/trips/:id", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const b = req.body;
  const r = await pool.query("UPDATE trips SET destination=COALESCE($1,destination),start_date=COALESCE($2,start_date),end_date=COALESCE($3,end_date),budget=COALESCE($4,budget),travellers=COALESCE($5,travellers),origin=COALESCE($6,origin),updated_at=NOW() WHERE id=$7 RETURNING *", [b.destination || null, b.start_date || null, b.end_date || null, b.budget ?? null, b.travellers ?? null, b.origin || null, trip.id]);
  res.json(r.rows[0]);
});

app.patch("/api/trips/:id/days/:dayId", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const r = await pool.query("UPDATE trip_days SET completed=COALESCE($1,completed),title=COALESCE($2,title),day_budget=COALESCE($3,day_budget) WHERE id=$4 AND trip_id=$5 RETURNING *", [req.body.completed ?? null, req.body.title || null, req.body.day_budget ?? null, req.params.dayId, trip.id]);
  if (!r.rows.length) return res.status(404).json({ message: "Day not found" });
  res.json(r.rows[0]);
});

app.patch("/api/trips/:id/activities/:activityId", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const r = await pool.query(`UPDATE trip_activities a SET time_label=COALESCE($1,time_label),activity_type=COALESCE($2,activity_type),title=COALESCE($3,title),description=COALESCE($4,description),planned_cost=COALESCE($5,planned_cost),actual_cost=COALESCE($6,actual_cost),completed=COALESCE($7,completed),updated_at=NOW() FROM trip_days d WHERE a.id=$8 AND a.trip_day_id=d.id AND d.trip_id=$9 RETURNING a.*`, [req.body.time, req.body.type, req.body.title, req.body.description, req.body.planned_cost ?? null, req.body.actual_cost ?? null, req.body.completed ?? null, req.params.activityId, trip.id]);
  if (!r.rows.length) return res.status(404).json({ message: "Activity not found" });
  res.json(r.rows[0]);
});

app.post("/api/trips/:id/activities", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const r = await pool.query("INSERT INTO trip_activities(trip_day_id,time_label,activity_type,title,description,planned_cost,sort_order) SELECT $1,$2,$3,$4,$5,$6,COALESCE(MAX(sort_order),0)+1 FROM trip_activities WHERE trip_day_id=$1 RETURNING *", [req.body.day_id, req.body.time || "10:00", req.body.type || "Free choice", req.body.title, req.body.description || "", money(req.body.planned_cost)]);
  res.status(201).json(r.rows[0]);
});

app.delete("/api/trips/:id/activities/:activityId", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const r = await pool.query("DELETE FROM trip_activities a USING trip_days d WHERE a.id=$1 AND a.trip_day_id=d.id AND d.trip_id=$2 RETURNING a.id", [req.params.activityId, trip.id]);
  if (!r.rows.length) return res.status(404).json({ message: "Activity not found" });
  res.json({ ok: true });
});

app.post("/api/trips/:id/expenses", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (money(req.body.amount) < 0) return res.status(400).json({ message: "Amount must be positive" });
  const r = await pool.query("INSERT INTO trip_expenses(trip_id,activity_id,category,amount,note) VALUES($1,$2,$3,$4,$5) RETURNING *", [trip.id, req.body.activity_id || null, req.body.category || "Other", money(req.body.amount), req.body.note || null]);
  if (req.body.activity_id) await pool.query("UPDATE trip_activities SET actual_cost=$1,updated_at=NOW() WHERE id=$2", [money(req.body.amount), req.body.activity_id]);
  res.status(201).json(r.rows[0]);
});

app.post("/api/trips/:id/complete", auth, only(["tourist"]), async (req, res) => {
  const trip = await getOwnedTrip(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const incomplete = await pool.query("SELECT COUNT(*)::int n FROM trip_days WHERE trip_id=$1 AND completed=false", [trip.id]);
  if (incomplete.rows[0].n) return res.status(400).json({ message: "Complete all trip days first" });
  const r = await pool.query("UPDATE trips SET status='completed',updated_at=NOW() WHERE id=$1 RETURNING *", [trip.id]);
  res.json(r.rows[0]);
});

app.get("/api/admin/stats", auth, only(["admin"]), async (_req, res) => {
  const a = await pool.query("SELECT COUNT(*)::int n FROM users");
  const b = await pool.query("SELECT COUNT(*)::int n FROM discoveries WHERE status='pending'");
  const c = await pool.query("SELECT COUNT(*)::int n FROM places WHERE status='published'");
  const d = await pool.query("SELECT COUNT(*)::int n FROM trips");
  res.json({ users: a.rows[0].n, pendingDiscoveries: b.rows[0].n, publishedPlaces: c.rows[0].n, trips: d.rows[0].n });
});

async function start() {
  try {
    await ensureTripSchema();
    app.listen(PORT, () => console.log(`TRAVELX API running on http://localhost:${PORT}`));
  } catch (e) {
    console.error("TRAVELX database initialization failed:", e.message);
    process.exit(1);
  }
}

start();
