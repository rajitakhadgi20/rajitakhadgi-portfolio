import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const FALLBACK = {
  fullName: "Rajita Khadgi",
  yearsExp: "1+",
  projectsDone: "8+",
  happyClients: "4+",
  longDesc:
    "Hello, I am Rajita Khadgi, a UI/UX designer and Computer Science student based in Kathmandu, Nepal. With hands-on experience through internships and traineeships, I have developed a strong foundation in designing intuitive, user-centered digital experiences. I enjoy transforming ideas into structured, visually polished interfaces that balance usability and aesthetics.\n\nThrough projects such as service-based applications, booking platforms, and web interfaces, I have gained practical experience in wireframing, prototyping, and solving real-world design challenges using Figma. I am passionate about leveraging technology to create meaningful solutions, continuously improving my skills, and contributing to impactful digital products.",
};

export function useProfile() {
  const [profile, setProfile] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/profile`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        if (cancelled) return;
        // Only trust fields that actually have a value — an empty admin field
        // falls back rather than showing blank text.
        setProfile((prev) => ({
          ...prev,
          ...Object.fromEntries(Object.entries(data || {}).filter(([, v]) => v !== "" && v != null)),
        }));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { profile, loading };
}