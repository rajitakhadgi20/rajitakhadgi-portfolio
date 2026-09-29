import { Router } from "express";
import sharp from "sharp";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const maintenanceRouter = Router();

const MAX_DIM = 1600;
const QUALITY = 82;
// Anything smaller than this is left alone — not worth the trouble.
const SKIP_UNDER_BYTES = 150_000;

async function shrink(dataUrl) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) return null;
  if (dataUrl.length < SKIP_UNDER_BYTES) return null;
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const buf = Buffer.from(base64, "base64");
  const out = await sharp(buf)
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: QUALITY })
    .toBuffer();
  const outUrl = `data:image/jpeg;base64,${out.toString("base64")}`;
  // Only worth it if we actually saved meaningful space.
  if (outUrl.length >= dataUrl.length * 0.9) return null;
  return { before: dataUrl.length, after: outUrl.length, outUrl };
}

// One-time cleanup: shrinks every big base64 image already sitting in the
// database (from before upload compression existed) so the site loads fast
// without you needing to manually re-upload each one.
maintenanceRouter.post("/optimize-images", requireAuth, async (req, res) => {
  const report = { checked: 0, optimized: 0, bytesBefore: 0, bytesAfter: 0, errors: [] };

  async function optimizeField(table, id, column, value) {
    report.checked++;
    try {
      const result = await shrink(value);
      if (!result) return null;
      report.optimized++;
      report.bytesBefore += result.before;
      report.bytesAfter += result.after;
      await db.prepare(`UPDATE ${table} SET ${column} = ? WHERE id = ?`).run(result.outUrl, id);
      return result.outUrl;
    } catch (e) {
      report.errors.push(`${table}.${column} #${id}: ${e.message}`);
      return null;
    }
  }

  async function optimizeJsonArrayField(table, id, column, arr) {
    if (!Array.isArray(arr) || !arr.length) return;
    let changed = false;
    const next = [];
    for (const item of arr) {
      report.checked++;
      try {
        const result = await shrink(item);
        if (result) {
          report.optimized++;
          report.bytesBefore += result.before;
          report.bytesAfter += result.after;
          next.push(result.outUrl);
          changed = true;
        } else {
          next.push(item);
        }
      } catch (e) {
        report.errors.push(`${table}.${column} #${id}: ${e.message}`);
        next.push(item);
      }
    }
    if (changed) {
      await db.prepare(`UPDATE ${table} SET ${column} = ? WHERE id = ?`).run(JSON.stringify(next), id);
    }
  }

  const projects = await db.prepare("SELECT id, img, cover_image, case_study_images FROM projects").all();
  for (const p of projects) {
    await optimizeField("projects", p.id, "img", p.img);
    await optimizeField("projects", p.id, "cover_image", p.cover_image);
    await optimizeJsonArrayField("projects", p.id, "case_study_images", JSON.parse(p.case_study_images || "[]"));
  }

  const gallery = await db.prepare("SELECT id, img FROM gallery").all();
  for (const g of gallery) {
    await optimizeField("gallery", g.id, "img", g.img);
  }

  const certificates = await db.prepare("SELECT id, image FROM certificates").all();
  for (const c of certificates) {
    await optimizeField("certificates", c.id, "image", c.image);
  }

  const skills = await db.prepare("SELECT id, image FROM skills").all();
  for (const s of skills) {
    await optimizeField("skills", s.id, "image", s.image);
  }

  const profile = await db.prepare("SELECT avatar, media_images FROM profile WHERE id = 1").get();
  if (profile) {
    await optimizeField("profile", 1, "avatar", profile.avatar);
    await optimizeJsonArrayField("profile", 1, "media_images", JSON.parse(profile.media_images || "[]"));
  }

  res.json(report);
});