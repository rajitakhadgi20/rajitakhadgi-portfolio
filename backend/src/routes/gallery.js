import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const galleryRouter = Router();

function toPublic(row) {
  return { id: row.id, title: row.title, img: row.img, tags: JSON.parse(row.tags || "[]") };
}

galleryRouter.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

galleryRouter.post("/", requireAuth, (req, res) => {
  const { title = "", img = "", tags = [] } = req.body || {};
  if (!img) return res.status(400).json({ error: "Image is required." });

  const maxOrder = db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS m FROM gallery").get().m;
  const info = db
    .prepare("INSERT INTO gallery (title, img, tags, sort_order) VALUES (?, ?, ?, ?)")
    .run(title, img, JSON.stringify(tags), maxOrder + 1);

  const row = db.prepare("SELECT * FROM gallery WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(toPublic(row));
});

galleryRouter.put("/reorder/all", requireAuth, (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array of ids." });
  const update = db.prepare("UPDATE gallery SET sort_order = ? WHERE id = ?");
  const updateMany = db.transaction((ids) => { ids.forEach((id, i) => update.run(i, id)); });
  updateMany(order);
  const rows = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

galleryRouter.put("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM gallery WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Item not found." });

  const {
    title = existing.title,
    img = existing.img,
    tags = JSON.parse(existing.tags || "[]"),
  } = req.body || {};

  db.prepare("UPDATE gallery SET title = ?, img = ?, tags = ?, updated_at = datetime('now') WHERE id = ?")
    .run(title, img, JSON.stringify(tags), req.params.id);

  const row = db.prepare("SELECT * FROM gallery WHERE id = ?").get(req.params.id);
  res.json(toPublic(row));
});

galleryRouter.delete("/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Item not found." });
  res.status(204).end();
});