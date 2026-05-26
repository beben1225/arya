import React, { useState } from "react";
import { X, Save, Plus, Trash2, Settings, Mail, Github, Linkedin, Award } from "lucide-react";
import { ProfileData, TechSkill, Project } from "../types";

interface ProfileEditorProps {
  profile: ProfileData;
  onSave: (updated: ProfileData) => void;
  onClose: () => void;
}

export default function ProfileEditor({ profile, onSave, onClose }: ProfileEditorProps) {
  const [edited, setEdited] = useState<ProfileData>({ ...profile });

  // Skill Add State
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<any>("Frontend");
  const [newSkillLevel, setNewSkillLevel] = useState(80);

  // Project Add State
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjStack, setNewProjStack] = useState("");
  const [newProjSim, setNewProjSim] = useState<any>("simple");

  const handleChangeField = (field: keyof ProfileData, value: string) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  // Add Skill handler
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: TechSkill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel
    };
    setEdited((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    setNewSkillName("");
  };

  // Delete Skill handler
  const handleDeleteSkill = (index: number) => {
    setEdited((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index)
    }));
  };

  // Add Project handler
  const handleAddProject = () => {
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;
    const newProj: Project = {
      id: "p_" + Date.now(),
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      techStack: newProjStack.split(",").map(t => t.trim()).filter(Boolean),
      simulationType: newProjSim
    };
    setEdited((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjStack("");
  };

  // Delete Project handler
  const handleDeleteProject = (id: string) => {
    setEdited((prev) => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-black border border-white/10 rounded-none w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-550" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">KUSTOMISASI PANEL DASHBOARD PROFIL</h2>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Sistem Persistensi Kompilasi Profil & Portofolio</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 border border-white/10 hover:bg-white/5 rounded-none transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Profil Universitas */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono text-blue-450 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2 font-black">
              <Award className="w-4 h-4" /> [01 / METADATA AKADEMIK & SOSIAL]
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 font-bold block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={edited.name}
                  onChange={(e) => handleChangeField("name", e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 font-bold block mb-1">Headline/Gelar</label>
                <input
                  type="text"
                  value={edited.title}
                  onChange={(e) => handleChangeField("title", e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] focus:border-blue-500 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold">Universitas</label>
                <input
                  type="text"
                  value={edited.university}
                  onChange={(e) => handleChangeField("university", e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold">IPK / GPA</label>
                  <input
                    type="text"
                    value={edited.gpa}
                    onChange={(e) => handleChangeField("gpa", e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500 text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold">Semester</label>
                  <input
                    type="text"
                    value={edited.semester}
                    onChange={(e) => handleChangeField("semester", e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Akademik
                </label>
                <input
                  type="email"
                  value={edited.email}
                  onChange={(e) => handleChangeField("email", e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" /> Username Github
                  </label>
                  <input
                    type="text"
                    value={edited.github}
                    onChange={(e) => handleChangeField("github", e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5" /> Username LinkedIn
                  </label>
                  <input
                    type="text"
                    value={edited.linkedin}
                    onChange={(e) => handleChangeField("linkedin", e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block mb-1 font-bold">Biografi Ringkas</label>
              <textarea
                value={edited.bio}
                rows={3}
                onChange={(e) => handleChangeField("bio", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-none p-3 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 2: Kompetensi Teknologi */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono text-blue-450 uppercase tracking-widest border-b border-white/10 pb-2 font-black">
              [02 / KEAHLIAN TEKNOLOGI MATRIKS]
            </h3>
            
            <div className="bg-white/[0.01] p-5 rounded-none border border-white/10 space-y-4">
              <div className="flex flex-wrap gap-2">
                {edited.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-2 bg-black border border-white/10 rounded-none px-3 py-1 text-xs text-white"
                  >
                    <span className="font-bold">{skill.name}</span>
                    <span className="text-[10px] font-mono font-bold text-blue-500">{skill.level}%</span>
                    <button 
                      type="button"
                      onClick={() => handleDeleteSkill(index)}
                      className="text-white/40 hover:text-rose-500 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add form row */}
              <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-white/10 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[9px] font-mono tracking-widest uppercase text-white/40 block mb-1">Nama Keahlian</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="misal: Rust (Actix), WebAssembly"
                    className="w-full bg-[#0d0d0d] border border-white/10 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono tracking-widest uppercase text-white/40 block mb-1">Kategori</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as any)}
                    className="bg-[#0d0d0d] border border-white/10 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="w-32">
                  <label className="text-[9px] font-mono tracking-widest uppercase text-white/40 block mb-1">Kecocokan: {newSkillLevel}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-none accent-blue-550 cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-black px-4 py-2 uppercase tracking-wide flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> TAMBAH
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Proyek Portofolio */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono text-blue-450 uppercase tracking-widest border-b border-white/10 pb-2 font-black">
              [03 / BUNDEL PORTFOLIO PROYEK]
            </h3>
            
            <div className="space-y-4">
              {edited.projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="bg-white/[0.01] p-4 rounded-none border border-white/10 flex justify-between items-start gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{proj.title}</h4>
                    <p className="text-[10px] text-blue-400 bg-white/5 border border-white/5 px-2 py-0.5 inline-block font-mono max-w-fit">{proj.techStack.join(", ")}</p>
                    <p className="text-[11px] text-white/60 pt-1">{proj.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="text-white/40 hover:text-rose-500 p-2 border border-white/10 hover:bg-white/5 rounded-none transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add form layout */}
              <div className="bg-[#050505] p-5 rounded-none border border-dashed border-white/20 space-y-4">
                <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold block">// TAMBAHKAN PROYEK PORTFOLIO BARU</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block mb-1">Judul Proyek</label>
                    <input
                      type="text"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="misal: Kubernetes Concurrency Node"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block mb-1">Daftar Teknologi (Pisah Koma)</label>
                    <input
                      type="text"
                      value={newProjStack}
                      onChange={(e) => setNewProjStack(e.target.value)}
                      placeholder="Go, Rust, Docker, Gke"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block mb-1">Deskripsi Ringkas</label>
                  <textarea
                    value={newProjDesc}
                    rows={2}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Masukan rangkuman teknis fungsional proyek..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-none p-3 text-xs font-sans text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-between items-center bg-white/[0.01] p-3 rounded-none border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-white/70 uppercase">Hubungkan Interaktif</span>
                    <span className="text-[9px] text-white/45 uppercase tracking-wide">Pilih Simulasi Sandboks Utama</span>
                  </div>
                  <select
                    value={newProjSim}
                    onChange={(e) => setNewProjSim(e.target.value as any)}
                    className="bg-[#0a0a0a] border border-white/10 rounded-none px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="simple">Simulasi Sederhana</option>
                    <option value="sorting">Bubble Sort Visualisator</option>
                    <option value="bst">Binary Search Tree Node</option>
                    <option value="fibonacci">Fibonacci Time Complexity</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-black px-5 py-2.5 uppercase tracking-widest transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> REKAM PROYEK BARU
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-5 px-6 border-t border-white/10 bg-black flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Penyimpanan Otomatis Sinkronisasi Browser Terdeteksi</span>
          <button
            onClick={() => onSave(edited)}
            className="bg-white hover:bg-blue-650 text-black hover:text-white font-mono font-black text-xs uppercase tracking-widest px-6 py-3 rounded-none transition-colors duration-200"
          >
            <Save className="w-4 h-4 inline-block mr-1.5" /> SIMPAN PROFIL BARU
          </button>
        </div>
      </div>
    </div>
  );
}
