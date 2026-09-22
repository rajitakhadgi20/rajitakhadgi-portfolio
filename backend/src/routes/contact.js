import { Router } from "express";
import nodemailer from "nodemailer";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const contactRouter = Router();

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// Public: submit the contact form
contactRouter.post("/", async (req, res) => {
  const { name, email, subject = "", message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const info = db
    .prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)")
    .run(name, email, subject, message);

  // Best-effort email notification — the message is already saved either way.
  if (transporter && process.env.CONTACT_TO_EMAIL) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch (err) {
      console.error("Failed to send contact email:", err.message);
    }
  }

  res.status(201).json({ id: info.lastInsertRowid, ok: true });
});

// Admin: list messages, newest first
contactRouter.get("/", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(rows);
});

// Admin: mark read/unread
contactRouter.put("/:id/read", requireAuth, (req, res) => {
  const { read = 1 } = req.body || {};
  const info = db.prepare("UPDATE messages SET read = ? WHERE id = ?").run(read ? 1 : 0, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Message not found." });
  res.json({ ok: true });
});

// Admin: delete
contactRouter.delete("/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Message not found." });
  res.status(204).end();
});
