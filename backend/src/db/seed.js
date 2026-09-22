import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./index.js";

// The 10 projects that used to be hard-coded in the frontend. Seeded once so the
// site has content from the start; edit/add/remove them from the admin dashboard
// after that.
const STARTER_PROJECTS = [
  { title: "Greenhub Organic Website",   tags: ["WEBSITE"],             desc: "An e-commerce platform promoting fresh organic products with a clean and sustainable shopping experience.", img: "/image/Before Greenhub.png",      figma: "https://www.figma.com/design/6P680q8duatdA5w56fOmL8/GreenHub-Organic-Website?node-id=0-1&t=UceY262qTV3WHTHo-1" },
  { title: "Hotel Booking App",          tags: ["MOBILE APP"],          desc: "A user-friendly hotel reservation app with smart filters, secure payments, and booking management.",        img: "/image/Before Hotel booking.png", figma: "https://www.figma.com/design/aP6SP3iJAVSH3rA4JznvgU/Hotel-Booking?node-id=0-1&t=QSJxFgJNn4G727Nt-1" },
  { title: "Thulo Help App",             tags: ["MOBILE APP"],          desc: "A service marketplace connecting customers with trusted local professionals for easy booking.",             img: "/image/Before Thulo help.png",    figma: "https://www.figma.com/design/uLdYPPUuHOT8UtyQlnLm88/Thulo-Help?node-id=0-1&t=xANCGXNWzgqFMHkr-1" },
  { title: "Trip Land Travel Website",   tags: ["WEBSITE"],             desc: "A modern travel booking platform for exploring destinations, planning trips, and managing reservations.",    img: "/image/Before trip.png",          figma: "https://www.figma.com/design/r8sWLMJGL3hcd1qsn6Qvhe/Trips-Land-Travel-website?node-id=0-1&t=MTdbmC34F9PkMbWD-1" },
  { title: "Daily UI Challenges",        tags: ["WEBSITE"],             desc: "A collection of modern UI design exercises focused on improving visual hierarchy and interface skills.",     img: "/image/Before daily ui.png",      figma: "https://www.figma.com/design/WJIQ1oMWyiSVe9pN5tQ1oQ/Daily-UI-Challenges?node-id=0-1&t=BkbzZ9rsSNnQQcqN-1" },
  { title: "News Website",               tags: ["WEBSITE"],             desc: "A responsive digital news platform delivering categorized stories with clear navigation.",                  img: "/image/Before news.png",          figma: "https://www.figma.com/design/eDGxaYVUycDTsq6eQU2JV5/News-Website?node-id=0-1&t=FDlqUKoWLyvarOsO-1" },
  { title: "Restaurant POS System",      tags: ["POS"],                 desc: "An intuitive point-of-sale system for managing orders, payments, inventory, and sales efficiently.",        img: "/image/Before Pos.png",           figma: "https://www.figma.com/design/GaVancyImH68InsNg8LjoZ/Restaurant-Pos?node-id=0-1&t=uJpSpQkgz1s6YZPj-1" },
  { title: "Ecommerce Clothing Website", tags: ["WEBSITE"],             desc: "Stylish online store with smart filters, product options, secure checkout, and bold streetwear design.",   img: "/image/Before ecommerce.png",     figma: "https://www.figma.com/design/6xhZWfV6TZS8qBjkBsZhOH/Ecommerce-Clothing--Cool-?node-id=0-1&t=OYeKz2NWxGfDnO2M-1" },
  { title: "Hydropower Website",         tags: ["WEBSITE"],             desc: "A clean industrial website highlighting hydropower products, electrical solutions, and major infrastructure.", img: "/image/Before Hydropower.png",  figma: "https://www.figma.com/design/Sqq5BgS33QWvblT5uQl3O3/Hydropower-Website?node-id=188-272&t=BkbzZ9rsSNnQQcqN-1" },
  { title: "Himalayan Travel Website",   tags: ["WEBSITE", "REDESIGN"], desc: "A trekking website redesign enhancing user experience and booking flow with a clean, immersive interface.", img: "/image/Before Himalayan.png",   figma: "https://www.figma.com/design/3nMOF4NZ55Cwggla5SHhe3/Redesign-Task?node-id=0-1&t=BkbzZ9rsSNnQQcqN-1" },
];

function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";
  if (!email || !password) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin seed.");
    return;
  }
  const existing = db.prepare("SELECT id FROM admins WHERE email = ?").get(email);
  const hash = bcrypt.hashSync(password, 10);
  if (existing) {
    db.prepare("UPDATE admins SET password_hash = ?, name = ? WHERE email = ?").run(hash, name, email);
    console.log(`Updated admin account: ${email}`);
  } else {
    db.prepare("INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)").run(name, email, hash);
    console.log(`Created admin account: ${email}`);
  }
}

function seedProjects() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM projects").get().c;
  if (count > 0) {
    console.log(`Projects table already has ${count} rows — skipping project seed.`);
    return;
  }
  const insert = db.prepare(
    "INSERT INTO projects (title, tags, desc, img, figma, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertMany = db.transaction((rows) => {
    rows.forEach((p, i) => insert.run(p.title, JSON.stringify(p.tags), p.desc, p.img, p.figma, i));
  });
  insertMany(STARTER_PROJECTS);
  console.log(`Seeded ${STARTER_PROJECTS.length} starter projects.`);
}

function seedExperience() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM experience").get().c;
  if (count > 0) {
    console.log(`Experience table already has ${count} rows — skipping.`);
    return;
  }
  const PLACEHOLDER_EXPERIENCE = [
    { role: "UI/UX Designer", company: "Your Company Name", startDate: "2024", endDate: "", description: "Replace this with a short summary of what you did in this role — key projects, impact, tools used." },
    { role: "Junior Designer", company: "Previous Company", startDate: "2022", endDate: "2024", description: "Replace this with a short summary of this role too. Edit or delete these placeholders from the admin dashboard." },
  ];
  const insert = db.prepare(
    "INSERT INTO experience (role, company, start_date, end_date, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertMany = db.transaction((rows) => {
    rows.forEach((e, i) => insert.run(e.role, e.company, e.startDate, e.endDate, e.description, i));
  });
  insertMany(PLACEHOLDER_EXPERIENCE);
  console.log(`Seeded ${PLACEHOLDER_EXPERIENCE.length} placeholder experience entries — edit these from the admin dashboard.`);
}

function seedGallery() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM gallery").get().c;
  if (count > 0) {
    console.log(`Gallery table already has ${count} rows — skipping.`);
    return;
  }
  const insert = db.prepare("INSERT INTO gallery (title, img, sort_order) VALUES (?, ?, ?)");
  const insertMany = db.transaction((rows) => {
    rows.forEach((p, i) => insert.run(p.title, p.img, i));
  });
  // Starts as a copy of the project images — manage independently from the admin dashboard from here on.
  insertMany(STARTER_PROJECTS.map((p) => ({ title: p.title, img: p.img })));
  console.log(`Seeded ${STARTER_PROJECTS.length} gallery items from the starter projects' images.`);
}

seedAdmin();
seedProjects();
seedExperience();
seedGallery();
console.log("Seed complete.");


