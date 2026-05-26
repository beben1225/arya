import { ProfileData } from "../types";

export const defaultProfile: ProfileData = {
  name: "Ryan Arya Saputra",
  title: "Informatics Student & Full-Stack Developer",
  university: "Universitas Indonesia",
  gpa: "3.85",
  semester: "6",
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
  bio: "Mahasiswa S1 Teknik Informatika yang berfokus pada pengembangan aplikasi web full-stack, kecerdasan buatan, dan optimasi algoritma. Senang memecahkan tantangan algoritma kompleks dan membangun solusi digital yang berorientasi pada pengguna.",
  email: "ryan.arya@cs.ui.ac.id",
  github: "ryan-arya",
  linkedin: "ryan-arya",
  skills: [
    { name: "React (Vite)", category: "Frontend", level: 90 },
    { name: "TypeScript", category: "Frontend", level: 85 },
    { name: "Tailwind CSS", category: "Frontend", level: 95 },
    { name: "Node.js (Express)", category: "Backend", level: 80 },
    { name: "Python (FastAPI)", category: "Backend", level: 75 },
    { name: "PostgreSQL", category: "Backend", level: 80 },
    { name: "Docker", category: "Security", level: 70 },
    { name: "Data Structures & Algos", category: "Data Science", level: 85 },
    { name: "Machine Learning (Scikit-Learn)", category: "Data Science", level: 65 },
  ],
  projects: [
    {
      id: "p1",
      title: "SortCraft: Visualisator Algoritma Pengurutan",
      description: "Aplikasi interaktif berbasis web untuk memvisualisasikan cara kerja algoritma pengurutan populer (Bubble, Quick, Merge, & Insertion Sort) secara real-time dengan kontrol kecepatan variabel dan visualisasi stack frame.",
      techStack: ["React", "Tailwind CSS", "TypeScript", "Framer Motion"],
      simulationType: "sorting",
      githubUrl: "https://github.com/ryan-arya/sortcraft",
      liveUrl: "https://sortcraft-demo.vercel.app"
    },
    {
      id: "p2",
      title: "Interactive Binary Search Tree",
      description: "Visualisator grafis interaktif untuk melakukan operasi pohon biner (Insert, Delete, Search) beserta visualisasi traversal Pre-order, In-order, dan Post-order secara real-time.",
      techStack: ["React", "D3.js", "TypeScript"],
      simulationType: "bst",
      githubUrl: "https://github.com/ryan-arya/interactive-bst"
    },
    {
      id: "p3",
      title: "Secure JWT Proxy Gateway API",
      description: "API Gateway proxy ringan yang mendukung middleware autentikasi JWT, deteksi anomali request untuk mencegah XSS & SQLi, serta pencatatan rate-limiting menggunakan algoritma token-bucket.",
      techStack: ["Node.js", "Express", "JWT", "Redis"],
      simulationType: "api"
    },
    {
      id: "p4",
      title: "Dynamic Fibonacci Complexity Analyzer",
      description: "Simulasi perbandingan efisiensi algoritma deret Fibonacci antara metode Rekursif murni, Rekursif dengan Memoization, dan Dynamic Programming secara grafis untuk menghitung running time dan memory overhead.",
      techStack: ["React", "Tailwind CSS", "Recharts"],
      simulationType: "fibonacci"
    }
  ],
  experiences: [
    {
      id: "exp1",
      role: "Asisten Lab Alpro & Struktur Data",
      company: "Laboratorium Komputasi Departemen Ilmu Komputer",
      period: "Agustus 2025 - Sekarang",
      description: "Membimbing 40+ mahasiswa baru dalam mata kuliah Algoritma & Pemrograman dasar (C++) dan Struktur Data, menilai tugas mingguan, serta menyusun materi praktikum pemrograman."
    },
    {
      id: "exp2",
      role: "Full-Stack Web Developer Intern",
      company: "PT Solusi Teknologi Nusantara",
      period: "Juni - Agustus 2025",
      description: "Membantu migrasi sistem management internal ke arsitektur SPA dengan React dan FastAPI, mengoptimalkan query PostgreSQL yang mempercepat loading halaman dashboard sebesar 30%."
    },
    {
      id: "exp3",
      role: "Juara 2 Competitive Programming",
      company: "National Informatics Olympiad (NIO)",
      period: "Mei 2025",
      description: "Memecahkan 8 dari 10 masalah kompleks struktur data, graf, dan pemrograman dinamis dalam waktu 5 jam menggunakan bahasa C++."
    }
  ]
};
