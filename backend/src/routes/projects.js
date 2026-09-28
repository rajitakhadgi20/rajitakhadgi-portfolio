import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const projectsRouter = Router();

function toPublic(row) {
  return {
    id: row.id,
    title: row.title,
    tags: JSON.parse(row.tags || "[]"),
    desc: row.desc,
    img: row.img,
    figma: row.figma,
    showFigmaLink: row.show_figma_link !== 0,
    date: row.date,
    client: row.client,
    role: row.role,
    coverImage: row.cover_image,
    caseStudyImages: JSON.parse(row.case_study_images || "[]"),
    caseStudyDesc: row.case_study_desc,
  };
}

// Slim version for the public homepage/project grid: skips the (potentially huge)
// cover + case-study images, which are only needed on a single case-study page and
// are fetched separately via GET /:id when someone opens one.
function toSummary(row) {
  return {
    id: row.id,
    title: row.title,
    tags: JSON.parse(row.tags || "[]"),
    desc: row.desc,
    img: row.img,
    figma: row.figma,
    showFigmaLink: row.show_figma_link !== 0,
    date: row.date,
    client: row.client,
    role: row.role,
  };
}

projectsRouter.get("/", async (req, res) => {
  if (req.query.summary === "1") {
    const rows = await db
      .prepare("SELECT id, title, tags, desc, img, figma, show_figma_link, date, client, role FROM projects ORDER BY sort_order ASC, id ASC")
      .all();
    return res.json(rows.map(toSummary));
  }
  const rows = await db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

projectsRouter.get("/:id", async (req, res) => {
  const row = await db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Project not found." });
  res.json(toPublic(row));
});

projectsRouter.post("/", requireAuth, async (req, res) => {
  const {
    title, tags = [], desc = "", img = "", figma = "#", showFigmaLink = true,
    date = "", client = "", role = "",
    coverImage = "", caseStudyImages = [], caseStudyDesc = "",
  } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title is required." });

  const maxOrderRow = await db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS m FROM projects").get();
  const maxOrder = maxOrderRow.m;
  const row = await db
    .prepare(
      `INSERT INTO projects (title, tags, desc, img, figma, show_figma_link, date, client, role, cover_image, case_study_images, case_study_desc, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .get(title, JSON.stringify(tags), desc, img, figma, showFigmaLink ? 1 : 0, date, client, role, coverImage, JSON.stringify(caseStudyImages), caseStudyDesc, maxOrder + 1);

  res.status(201).json(toPublic(row));
});

projectsRouter.put("/reorder/all", requireAuth, async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array of project ids." });
  const update = db.prepare("UPDATE projects SET sort_order = ? WHERE id = ?");
  const updateMany = db.transaction(async (ids) => {
    for (const [i, id] of ids.entries()) await update.run(i, id);
  });
  await updateMany(order);
  const rows = await db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(toPublic));
});

projectsRouter.put("/:id", requireAuth, async (req, res) => {
  const existing = await db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Project not found." });

  const {
    title = existing.title,
    tags = JSON.parse(existing.tags || "[]"),
    desc = existing.desc,
    img = existing.img,
    figma = existing.figma,
    showFigmaLink = existing.show_figma_link !== 0,
    date = existing.date,
    client = existing.client,
    role = existing.role,
    coverImage = existing.cover_image,
    caseStudyImages = JSON.parse(existing.case_study_images || "[]"),
    caseStudyDesc = existing.case_study_desc,
  } = req.body || {};

  const row = await db.prepare(
    `UPDATE projects SET title = ?, tags = ?, desc = ?, img = ?, figma = ?, show_figma_link = ?,
      date = ?, client = ?, role = ?, cover_image = ?, case_study_images = ?, case_study_desc = ?,
      updated_at = datetime('now') WHERE id = ?
      RETURNING *`
  ).get(title, JSON.stringify(tags), desc, img, figma, showFigmaLink ? 1 : 0, date, client, role, coverImage, JSON.stringify(caseStudyImages), caseStudyDesc, req.params.id);

  res.json(toPublic(row));
});

projectsRouter.delete("/:id", requireAuth, async (req, res) => {
  const info = await db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Project not found." });
  res.status(204).end();
});