import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const experienceRouter = Router();

const TYPES = ["Full Time", "Part Time", "Internship", "Traineeship", "Freelance", "Other"];

function toPublic(row) {
  return {
    id: row.id,
    role: row.role,
    company: row.company,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
  };
}

// Public: list, ordered for display. Freelance entries are excluded from the
// public site — per the design notes, "This doesn't show on the website".
experienceRouter.get("/", async (req, res) => {
  const rows = await db
    .prepare("SELECT * FROM experience WHERE type != 'Freelance' ORDER BY sort_order ASC, id ASC")
    .all();
  res.json(rows.map(toPublic));
});

// Admin: list ALL entries, including Freelance ones, so the dashboard can manage them
experienceRouter.get("/all", requireAuth, async (req, res) => {
  const rows = await db.prepare("SELECT * FROM experience ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

experienceRouter.post("/", requireAuth, async (req, res) => {
  const {
    role, company = "", type = "Full Time",
    startDate = "", endDate = "", description = "",
  } = req.body || {};
  if (!role) return res.status(400).json({ error: "Role is required." });
  if (!TYPES.includes(type)) return res.status(400).json({ error: `Type must be one of: ${TYPES.join(", ")}` });

  const maxOrderRow = await db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS m FROM experience").get();
  const maxOrder = maxOrderRow.m;
  const info = await db
    .prepare(
      "INSERT INTO experience (role, company, type, start_date, end_date, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(role, company, type, startDate, endDate, description, maxOrder + 1);

  const row = await db.prepare("SELECT * FROM experience WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(toPublic(row));
});

experienceRouter.put("/reorder/all", requireAuth, async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array of ids." });
  const update = db.prepare("UPDATE experience SET sort_order = ? WHERE id = ?");
  const updateMany = db.transaction(async (ids) => {
    for (const [i, id] of ids.entries()) await update.run(i, id);
  });
  await updateMany(order);
  const rows = await db.prepare("SELECT * FROM experience ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

experienceRouter.put("/:id", requireAuth, async (req, res) => {
  const existing = await db.prepare("SELECT * FROM experience WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Entry not found." });

  const {
    role = existing.role,
    company = existing.company,
    type = existing.type,
    startDate = existing.start_date,
    endDate = existing.end_date,
    description = existing.description,
  } = req.body || {};

  if (!TYPES.includes(type)) return res.status(400).json({ error: `Type must be one of: ${TYPES.join(", ")}` });

  await db.prepare(
    "UPDATE experience SET role = ?, company = ?, type = ?, start_date = ?, end_date = ?, description = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(role, company, type, startDate, endDate, description, req.params.id);

  const row = await db.prepare("SELECT * FROM experience WHERE id = ?").get(req.params.id);
  res.json(toPublic(row));
});

experienceRouter.delete("/:id", requireAuth, async (req, res) => {
  const info = await db.prepare("DELETE FROM experience WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Entry not found." });
  res.status(204).end();
});