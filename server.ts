import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent startup crashes when API key is missing
let aiClient: any = null;

function getAIClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
  }
  
  if (!aiClient) {
    // Dynamically require or import to adhere to lazy load patterns
    const { GoogleGenAI } = require("@google/genai");
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoints

// Endpoint 1: Practice Coding / Mock Interview Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, profileData } = req.body;
    const ai = getAIClient();

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Inject system instructions and context about the student
    const studentContext = profileData
      ? `Nama: ${profileData.name}
Universitas: ${profileData.university}
Jurusan: S1 Teknik Informatika (GPA: ${profileData.gpa}, Semester: ${profileData.semester})
Keahlian: ${profileData.skills.map((s: any) => `${s.name} (${s.level}%)`).join(", ")}
Proyek: ${profileData.projects.map((p: any) => p.title).join(", ")}`
      : "";

    const systemInstruction = `Kamu adalah Asisten Karir & Pewawancara Teknis AI untuk mahasiswa Teknik Informatika yang ramah dan suportif (bernama "Informatics AI Coach").
Konteks Mahasiswa saat ini:
${studentContext}

Tugas Utama:
1. Jalin komunikasi profesional dan ramah menggunakan Bahasa Indonesia (boleh campur istilah tech bahasa Inggris standar).
2. Sediakan latihan wawancara teknis (Coding Interview, Algo, Web Dev, System Design) sesuai input user.
3. Berikan feedback yang membangun pada kode atau jawaban user. Jelaskan konsep dengan ringkas namun mendalam.
4. Jawab pertanyaan akademis / pemecahan masalah terkait Informatika.

Berikan respon yang estetik menggunakan pemformatan Markdown. Gunakan blok kode (code blocks) yang tepat.`;

    // Call Gemini API using modern SDK patterns
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { text: message }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Maaf, saya tidak dapat memproses tanggapan tersebut.";
    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/chat:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Endpoint 2: AI Tech Bio Generator & Resume Enhancer
app.post("/api/ai/refine-bio", async (req, res) => {
  try {
    const { skills, projects, currentBio } = req.body;
    const ai = getAIClient();

    const prompt = `Tulis ulang deskripsi bio atau elevator pitch profesional yang ringkas, modern, dan menonjol untuk profil portfolio mahasiswa teknik informatika.
Data saat ini:
- Bio Saat Ini: "${currentBio || "Belum ada"}"
- Teknologi & Skill: ${skills.join(", ")}
- Proyek Utama: ${projects.join(", ")}

Buat 2 pilihan gaya:
1. Professional & Career Focus (Fokus karir, magang, siap kerja)
2. Interactive Dev/Geek Style (Lebih santai, antusias, berorientasi hacker & open-source)

Tulis hasilnya dalam Bahasa Indonesia dengan format JSON terstruktur:
{
  "professional": "bio 1 di sini...",
  "geek": "bio 2 di sini..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/refine-bio:", error);
    res.status(500).json({ error: error.message || "Failed to generate dynamic bio" });
  }
});

// Serve Frontend using Vite or static directory

async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import to avoid loading vite on production starts
    const { createServer: createViteServer } = require("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevProfile] Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Error starting server:", err);
});
