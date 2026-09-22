import "dotenv/config";
import express from "express";
import cors from "cors";
import "./db/index.js"; // ensures tables exist
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { contactRouter } from "./routes/contact.js";
import { experienceRouter } from "./routes/experience.js";
import { galleryRouter } from "./routes/gallery.js";
import { profileRouter } from "./routes/profile.js";
import { certificatesRouter } from "./routes/certificates.js";
import { skillsRouter } from "./routes/skills.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: "15mb" })); // raised so base64 image/CV uploads fit

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/profile", profileRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/skills", skillsRouter);

app.use((req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Rajita Portfolio backend running on http://localhost:${PORT}`);
});