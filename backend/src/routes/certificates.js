import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const certificatesRouter = Router();

function toPublic(row) {
  return { id: row.id, title: row.title, image: row.image };
}

certificatesRouter.get("/", async (req, res) => {
  const rows = await db.prepare("SELECT * FROM certificates ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

certificatesRouter.post("/", requireAuth, async (req, res) => {
  const { title, image = "" } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title is required." });

  const maxOrderRow = await db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS m FROM certificates").get();
  const maxOrder = maxOrderRow.m;
  const row = await db
    .prepare("INSERT INTO certificates (title, image, sort_order) VALUES (?, ?, ?) RETURNING *")
    .get(title, image, maxOrder + 1);

  res.status(201).json(toPublic(row));
});

certificatesRouter.put("/reorder/all", requireAuth, async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array of ids." });
  const update = db.prepare("UPDATE certificates SET sort_order = ? WHERE id = ?");
  const updateMany = db.transaction(async (ids) => {
    for (const [i, id] of ids.entries()) await update.run(i, id);
  });
  await updateMany(order);
  const rows = await db.prepare("SELECT * FROM certificates ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

certificatesRouter.put("/:id", requireAuth, async (req, res) => {
  const existing = await db.prepare("SELECT * FROM certificates WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Certificate not found." });

  const { title = existing.title, image = existing.image } = req.body || {};

  const row = await db.prepare("UPDATE certificates SET title = ?, image = ?, updated_at = datetime('now') WHERE id = ? RETURNING *")
    .get(title, image, req.params.id);

  res.json(toPublic(row));
});

certificatesRouter.delete("/:id", requireAuth, async (req, res) => {
  const info = await db.prepare("DELETE FROM certificates WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Certificate not found." });
  res.status(204).end();
});