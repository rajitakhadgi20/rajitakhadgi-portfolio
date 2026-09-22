import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const profileRouter = Router();

function toPublic(row) {
  return {
    fullName: row.full_name,
    email: row.email,
    avatar: row.avatar,
    title: row.title,
    location: row.location,
    shortDesc: row.short_desc,
    longDesc: row.long_desc,
    cvUrl: row.cv_url,
    cvName: row.cv_name,
    yearsExp: row.years_exp,
    projectsDone: row.projects_done,
    happyClients: row.happy_clients,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    dribbbleUrl: row.dribbble_url,
    mediaImages: JSON.parse(row.media_images || "[]"),
  };
}

profileRouter.get("/", (req, res) => {
  const row = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(toPublic(row));
});

profileRouter.put("/", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM profile WHERE id = 1").get();

  const {
    fullName = existing.full_name,
    email = existing.email,
    avatar = existing.avatar,
    title = existing.title,
    location = existing.location,
    shortDesc = existing.short_desc,
    longDesc = existing.long_desc,
    cvUrl = existing.cv_url,
    cvName = existing.cv_name,
    yearsExp = existing.years_exp,
    projectsDone = existing.projects_done,
    happyClients = existing.happy_clients,
    githubUrl = existing.github_url,
    linkedinUrl = existing.linkedin_url,
    dribbbleUrl = existing.dribbble_url,
    mediaImages = JSON.parse(existing.media_images || "[]"),
  } = req.body || {};

  db.prepare(
    `UPDATE profile SET
      full_name = ?, email = ?, avatar = ?, title = ?, location = ?,
      short_desc = ?, long_desc = ?, cv_url = ?, cv_name = ?, years_exp = ?,
      projects_done = ?, happy_clients = ?, github_url = ?, linkedin_url = ?,
      dribbble_url = ?, media_images = ?, updated_at = datetime('now')
     WHERE id = 1`
  ).run(
    fullName, email, avatar, title, location,
    shortDesc, longDesc, cvUrl, cvName, yearsExp,
    projectsDone, happyClients, githubUrl, linkedinUrl,
    dribbbleUrl, JSON.stringify(mediaImages)
  );

  const row = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(toPublic(row));
});