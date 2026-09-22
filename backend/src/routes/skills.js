import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const skillsRouter = Router();

function toPublic(row) {
  return { id: row.id, title: row.title, description: row.description, image: row.image };
}

skillsRouter.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM skills ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

skillsRouter.post("/", requireAuth, (req, res) => {
  const { title, description = "", image = "" } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title is required." });

  const maxOrder = db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS m FROM skills").get().m;
  const info = db
    .prepare("INSERT INTO skills (title, description, image, sort_order) VALUES (?, ?, ?, ?)")
    .run(title, description, image, maxOrder + 1);

  const row = db.prepare("SELECT * FROM skills WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(toPublic(row));
});

skillsRouter.put("/reorder/all", requireAuth, (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array of ids." });
  const update = db.prepare("UPDATE skills SET sort_order = ? WHERE id = ?");
  const updateMany = db.transaction((ids) => { ids.forEach((id, i) => update.run(i, id)); });
  updateMany(order);
  const rows = db.prepare("SELECT * FROM skills ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

skillsRouter.put("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM skills WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Skill not found." });

  const {
    title = existing.title,
    description = existing.description,
    image = existing.image,
  } = req.body || {};

  db.prepare("UPDATE skills SET title = ?, description = ?, image = ?, updated_at = datetime('now') WHERE id = ?")
    .run(title, description, image, req.params.id);

  const row = db.prepare("SELECT * FROM skills WHERE id = ?").get(req.params.id);
  res.json(toPublic(row));
});

skillsRouter.delete("/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM skills WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Skill not found." });
  res.status(204).end();
});