import React, { useState, useEffect } from "react";
import { 
  User, 
  Cpu, 
  Globe, 
  GraduationCap, 
  Github, 
  Linkedin, 
  Mail, 
  Award, 
  FileCode2, 
  Terminal, 
  Sparkles, 
  Settings2, 
  RotateCcw, 
  ExternalLink,
  BookOpen,
  FolderDot
} from "lucide-react";
import { defaultProfile } from "./data/defaultProfile";
import { ProfileData } from "./types";
import TerminalConsole from "./components/TerminalConsole";
import AlgorithmVisualizer from "./components/AlgorithmVisualizer";
import AICareerHelper from "./components/AICareerHelper";
import ProfileEditor from "./components/ProfileEditor";

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeSkillFilter, setActiveSkillFilter] = useState<string>("All");

  // Load profile state on start from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("informatics_local_profile_v2");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (err) {
        console.error("Gagal mematangkan profil dari storage:", err);
      }
    }
  }, []);

  // Update bio directly callback from AI Bio refiner
  const handleUpdateBio = (newBio: string) => {
    const updated = { ...profile, bio: newBio };
    setProfile(updated);
    localStorage.setItem("informatics_local_profile_v2", JSON.stringify(updated));
  };

  // Save profile and persist to storage
  const handleSaveProfile = (updated: ProfileData) => {
    setProfile(updated);
    localStorage.setItem("informatics_local_profile_v2", JSON.stringify(updated));
    setIsEditorOpen(false);
  };

  const handleResetDefault = () => {
    if (window.confirm("Apakah kamu yakin ingin mengembalikan profil ke setelan standar mahasiswa?")) {
      setProfile(defaultProfile);
      localStorage.removeItem("informatics_local_profile_v2");
    }
  };

  const categories = ["All", "Frontend", "Backend", "Data Science", "Security"];
  
  const filteredSkills = activeSkillFilter === "All" 
    ? profile.skills 
    : profile.skills.filter(s => s.category === activeSkillFilter);

  // Split name for elegant visual accent
  const nameParts = profile.name.split(" ");
  const firstName = nameParts[0] || "DEV";
  const lastName = nameParts.slice(1).join(" ") || "STUDENT";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex grid-bg relative selection:bg-blue-600 selection:text-white leading-relaxed">
      
      {/* LEFT SIDEBAR NAVIGATION BAR (Directly from Design HTML with absolute styling) */}
      <div className="w-20 border-r border-white/10 hidden md:flex flex-col items-center py-10 justify-between select-none shrink-0 min-h-screen z-15 bg-black/40">
        <div className="font-extrabold text-2xl tracking-tighter text-blue-500 font-mono">D/P.</div>
        <div className="flex flex-col gap-16 [writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.3em] font-bold opacity-50 uppercase text-white">
          <span>Works & Projects</span>
          <span>Expertise Board</span>
          <span>Informatics Bio</span>
        </div>
        <div className="flex flex-col gap-2.5 items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
          <div className="w-1.5 h-6 bg-blue-550 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* MAIN MAIN CONTAINER FRAME */}
      <main className="flex-1 flex flex-col p-4 sm:p-8 lg:p-12 relative min-w-0 z-10">

        {/* HERO HEADER SECTION WITH LOGO & STATUS BAR */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="px-3.5 py-1.5 bg-blue-600 text-[10px] font-black tracking-widest uppercase rounded-sm">
              ACTIVE STATUS
            </div>
            <div className="mono text-[11px] text-white/50 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              GPA: {profile.gpa} / Semester {profile.semester}
            </div>
          </div>
          <div className="text-left sm:text-right mono text-[10px] uppercase tracking-widest text-white/40 leading-relaxed font-mono">
            <p>Department of Informatics Engineering</p>
            <p>{profile.university}</p>
          </div>
        </header>

        {/* HERO TITLE BLOCK WITH HUGE BOLD OUTLINE TYPOGRAPHY */}
        <section className="relative mb-14 min-h-[220px] md:min-h-[260px] flex flex-col justify-end">
          {/* Huge background text */}
          <h1 className="text-huge outline-text absolute -top-14 md:-top-20 left-0 select-none pointer-events-none uppercase font-black z-0 font-sans">
            INFORMATICS
          </h1>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 w-full">
            <div>
              <h2 className="text-5xl md:text-[84px] font-black leading-none tracking-tighter uppercase font-sans">
                {firstName}
                <br />
                <span className="text-blue-500">{lastName}.</span>
              </h2>
              <p className="text-blue-400 text-xs font-bold tracking-widest uppercase font-mono mt-4 block">
                {profile.title}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 duration-200 cursor-pointer"
                id="edit-profile-trigger"
              >
                PROFIL BARU
              </button>
              <button
                onClick={handleResetDefault}
                className="px-4 py-3 border border-white/20 text-white font-black text-xs uppercase tracking-widest hover:border-white transition-all hover:bg-white/5"
                title="Reset data ke bawaan"
                id="reset-profile-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* BIO & METRICS BENTO GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          
          {/* Left Block: Bio Brief description */}
          <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-blue-500 font-bold uppercase block">
                [// Biografi Singkat]
              </span>
              <p className="text-lg sm:text-xl font-light leading-relaxed text-white/90">
                {profile.bio}
              </p>
            </div>

            {/* Academic widgets lists using bold box patterns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 border border-white/10 bg-black/40 relative group">
                <p className="mono text-[9px] text-blue-500 uppercase tracking-widest mb-1.5 font-bold">Universitas</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white truncate" title={profile.university}>
                  {profile.university}
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-black/40">
                <p className="mono text-[9px] text-blue-500 uppercase tracking-widest mb-1.5 font-bold">IPK Terkini</p>
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  🏆 {profile.gpa} / 4.00
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-black/40">
                <p className="mono text-[9px] text-blue-500 uppercase tracking-widest mb-1.5 font-bold font-mono">Fokus Minat</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  Teknik Informatika
                </p>
              </div>
            </div>
          </div>

          {/* Right Block: Avatar & GPA Circle Metric */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border border-white/10 bg-black/20 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-550/10 rounded-full blur-2xl opacity-50" />
            <img 
              src={profile.avatarUrl} 
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-32 h-32 rounded-none object-cover border border-white/15 grayscale hover:grayscale-0 transition-all duration-300 shadow-lg mb-4"
            />
            <div className="text-center font-mono">
              <p className="text-[10px] text-blue-500 tracking-widest font-bold uppercase">DEV-RIG ONLINE</p>
              <p className="text-xs opacity-60 mt-1">{profile.email}</p>
            </div>
          </div>
        </section>

        {/* RECENT SKILLS & EXPERTISE MATRIX EXPANSIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          
          {/* Direct Skill Filter and Rating List - 12 columns fully optimized */}
          <div className="col-span-12 border border-white/10 bg-black/30 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono tracking-widest text-blue-500 font-bold uppercase">[01 // MATRIKS KEAHLIAN]</span>
                </div>
                
                {/* Horizontal high-contrast filter chips */}
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveSkillFilter(cat)}
                      className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-150 ${
                        activeSkillFilter === cat
                          ? "bg-blue-600 text-white font-black"
                          : "border border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of skill components representation in bold format */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredSkills.map((skill, idx) => (
                  <div key={idx} className="p-4 border border-white/5 bg-white/[0.02] hover:border-blue-500/40 transition-colors group">
                    <div className="flex justify-between items-center text-[11px] font-mono mb-2">
                      <span className="text-white/90 font-bold tracking-wide uppercase">
                        {skill.name}
                      </span>
                      <span className="text-blue-500 font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300 group-hover:bg-blue-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECOND MIDDLE ROW INTERACTIVE CORE ALGORITHM & TERMINAL */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Section: Sandbox Algorithm Simulator with Bold Typography style injection */}
          <div className="border border-white/10 bg-black/40 overflow-hidden">
            <AlgorithmVisualizer />
          </div>

          {/* Section: Interactive Shell Script prompt terminal console */}
          <div className="border border-white/10 bg-black/40 overflow-hidden">
            <TerminalConsole profile={profile} />
          </div>
        </section>

        {/* THIRD BOTTOM ROW DEEP LEARNING AI MOCK CAREER ASSISTANTS */}
        <section className="mb-12">
          <div className="border border-white/10 bg-black/40 overflow-hidden">
            <AICareerHelper profile={profile} onUpdateBio={handleUpdateBio} />
          </div>
        </section>

        {/* CORE PORTFOLIO WORK EXPERIENCE HISTORIES TIMELINE */}
        <section className="border border-white/10 bg-black/40 p-6 md:p-8 mb-12">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-blue-500 font-bold uppercase">[02 // PRESTASI & PENGALAMAN]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.experiences.map((exp, idx) => (
              <div 
                key={exp.id} 
                className="bg-[#0c0c0c] border border-white/10 p-5 space-y-3 hover:border-blue-500/50 transition-all duration-200 group relative"
              >
                <div className="absolute top-4 right-4 text-[9px] font-mono text-white/30 font-bold">
                  [0{idx + 1}]
                </div>
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-blue-400 bg-blue-950/40 border border-blue-500/20 px-2.5 py-0.5 uppercase">
                  {exp.period}
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-wide group-hover:text-blue-400 transition-colors">
                    {exp.role}
                  </h4>
                  <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    {exp.company}
                  </p>
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SOCIAL COMMUNICATION BAR AND COLLABORATOR CREDITS */}
        <footer className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            <a 
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a 
              href={`https://linkedin.com/in/${profile.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:border-white transition-colors"
            >
              LinkedIn
            </a>
          </div>

          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] leading-relaxed text-center md:text-right">
            © {new Date().getFullYear()} DYNAMIC DEVHUB PROFILE. OPERATING WITH SERVER-SIDE GEMINI INTEL.
          </p>
        </footer>

        {/* COLLABORATIVE PROFILE EDITOR DRAWER POPUP */}
        {isEditorOpen && (
          <ProfileEditor
            profile={profile}
            onSave={handleSaveProfile}
            onClose={() => setIsEditorOpen(false)}
          />
        )}

      </main>

      {/* RIGHT SIDEBAR DECORATIVE ELEMENT (Directly from Design HTML with absolute styling) */}
      <div className="w-12 border-l border-white/10 hidden xl:flex flex-col py-16 items-center justify-center select-none shrink-0 min-h-screen bg-black/40">
        <div className="[writing-mode:vertical-rl] rotate-180 font-mono text-[9px] text-white/30 uppercase tracking-[0.45em] whitespace-nowrap">
          SYSTEM INTERFACES FOR MAHASISWA INFORMATIKA
        </div>
      </div>

    </div>
  );
}
