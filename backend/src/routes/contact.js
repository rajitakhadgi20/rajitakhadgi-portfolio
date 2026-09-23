import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const contactRouter = Router();

// Sends a plain-text email via the Resend API (https://resend.com).
// Uses a normal HTTPS request, so it works even on hosts (like Render's free
// tier) that block outbound SMTP ports.
async function sendContactEmail({ name, email, subject, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return; // Not configured — message is still saved to the DB.

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }
}

// Public: submit the contact form
contactRouter.post("/", async (req, res) => {
  const { name, email, subject = "", message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const info = await db
    .prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)")
    .run(name, email, subject, message);

  // Best-effort email notification — the message is already saved either way.
  try {
    await sendContactEmail({ name, email, subject, message });
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
  }

  res.status(201).json({ id: info.lastInsertRowid, ok: true });
});

// Admin: list messages, newest first
contactRouter.get("/", requireAuth, async (req, res) => {
  const rows = await db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(rows);
});

// Admin: mark read/unread
contactRouter.put("/:id/read", requireAuth, async (req, res) => {
  const { read = 1 } = req.body || {};
  const info = await db.prepare("UPDATE messages SET read = ? WHERE id = ?").run(read ? 1 : 0, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Message not found." });
  res.json({ ok: true });
});

// Admin: delete
contactRouter.delete("/:id", requireAuth, async (req, res) => {
  const info = await db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Message not found." });
  res.status(204).end();
});