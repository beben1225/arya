import React, { useState } from "react";
import { Send, Check, Briefcase, RefreshCw, Cpu } from "lucide-react";
import { ProfileData, ChatMessage } from "../types";

interface AICareerHelperProps {
  profile: ProfileData;
  onUpdateBio: (newBio: string) => void;
}

export default function AICareerHelper({ profile, onUpdateBio }: AICareerHelperProps) {
  const [activeTab, setActiveTab] = useState<"interview" | "bio">("interview");
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Halo! Saya adalah AI Career Assistant-mu. Pilih jenis simulasi wawancara kerja di bawah ini untuk memulai latihan teknis!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [interviewType, setInterviewType] = useState("Data Structures & Algorithms");

  // Bio Refiner State
  const [refineOptions, setRefineOptions] = useState<{ professional?: string; geek?: string } | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [appliedOption, setAppliedOption] = useState<"professional" | "geek" | null>(null);

  // Chat handling
  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;
    
    const userMsg: ChatMessage = {
      sender: "user",
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${userMsg.text} (Topik Latihan Wawancara: ${interviewType})`,
          history: messages,
          profileData: profile
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || "Gagal menghubungi asisten AI.");
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ Maaf, terjadi kesalahan koneksi server: ${error.message || "Pastikan GEMINI_API_KEY telah dikonfigurasi di secrets."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Bio Refiner handling
  const handleRefineBio = async () => {
    if (isRefining) return;
    setIsRefining(true);
    setRefineOptions(null);
    setAppliedOption(null);

    try {
      const response = await fetch("/api/ai/refine-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: profile.skills.map(s => s.name),
          projects: profile.projects.map(p => p.title),
          currentBio: profile.bio
        })
      });

      const data = await response.json();
      if (response.ok) {
        setRefineOptions(data);
      } else {
        throw new Error(data.error || "Failed to parse");
      }
    } catch (err: any) {
      console.error(err);
      // Fallback response inside helper when offline/errors
      setRefineOptions({
        professional: `Mahasiswa S1 Teknik Informatika berdedikasi tinggi dengan keahlian utama dalam ${profile.skills.slice(0, 3).map(s => s.name).join(", ")}. Berpengalaman mengerjakan berbagai proyek tangguh seperti ${profile.projects.slice(0, 2).map(p => p.title).join(", ")}. Memiliki minat besar dalam riset rekayasa perangkat lunak dan siap berkontribusi profesional pada tingkat global.`,
        geek: `Keyboard-warrior & mahasiswa Informatika yang keranjingan bermain logic stack! Menguasai seni ${profile.skills.slice(0, 3).map(s => s.name).join(", ")} untuk mengubah kopi hangat menjadi baris kode fungsional. Otak di balik proyek ${profile.projects.slice(0, 2).map(p => p.title).join(", ")}. Selalu bersemangat melipatgandakan performa runtime ke efisiensi maksimal!`
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleApplyBio = (type: "professional" | "geek") => {
    const textToApply = refineOptions?.[type];
    if (textToApply) {
      onUpdateBio(textToApply);
      setAppliedOption(type);
    }
  };

  const startNewMockSession = () => {
    setMessages([
      {
        sender: "ai",
        text: `Mari kita mulai simulasi wawancara teknis baru untuk topik *"${interviewType}"*. Saya bertindak sebagai Senior Software Engineer Anda. Silakan perkenalkan diri Anda secara singkat dan bagaimana Anda menguasai bidang ini!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-black border border-white/10 rounded-none p-6 text-white flex flex-col h-[400px] shadow-sm justify-between hover:border-blue-500/40 transition-colors duration-300">
      
      {/* Tab control headers */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono tracking-widest text-blue-500 font-bold uppercase">
              [04 // ASISTEN KARIR AI]
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("interview")}
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 transition-all ${
                activeTab === "interview" ? "bg-blue-600 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Simulasi Interview
            </button>
            <button
              onClick={() => setActiveTab("bio")}
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 transition-all ${
                activeTab === "bio" ? "bg-blue-600 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Resume Bio Enhancer
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Panels content container */}
      <div className="flex-1 my-3 flex flex-col min-h-0 justify-between">
        {activeTab === "interview" ? (
          <div className="flex flex-col h-full justify-between gap-2.5 min-h-0">
            {/* Topic configuration drop down */}
            <div className="flex items-center justify-between gap-1.5 bg-white/[0.02] p-1.5 px-3 rounded-none border border-white/10">
              <span className="text-[9px] font-mono font-bold text-white/50 tracking-wider">SELECT TOPIC:</span>
              <div className="flex items-center gap-2">
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="bg-transparent text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wide focus:outline-none border-none p-0 cursor-pointer"
                >
                  <option className="bg-black text-white" value="Data Structures & Algorithms">Algorithms & DSA</option>
                  <option className="bg-black text-white" value="Full-Stack Web Development">Full-Stack Web Dev</option>
                  <option className="bg-black text-white" value="Database System Design">System Design</option>
                  <option className="bg-black text-white" value="Cybersecurity and Networks">Security & Infra</option>
                </select>
                <button
                  onClick={startNewMockSession}
                  className="bg-blue-950/40 hover:bg-blue-900/40 text-blue-400 font-mono text-[9px] px-2.0 py-0.5 border border-blue-500/30 transition-all font-bold uppercase tracking-widest"
                >
                  MULAI BARU
                </button>
              </div>
            </div>

            {/* Simulated Chat Feed */}
            <div className="flex-1 overflow-y-auto bg-black border border-white/5 p-3 space-y-3 font-mono text-xs min-h-0 select-text">
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[85%] ${
                      isUser ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-none border leading-relaxed text-[10px] ${
                        isUser
                          ? "bg-blue-950/40 border-blue-550/30 text-white"
                          : "bg-white/[0.02] border-white/10 text-white/90"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[8px] text-white/30 mt-1 px-1 font-mono uppercase">{msg.timestamp}</span>
                  </div>
                );
              })}
              {isSending && (
                <div className="flex items-center gap-2 text-[9px] text-white/40 italic pl-1 font-mono">
                  <Cpu className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>PEWAWANCARA AI SEDANG MERESPONS...</span>
                </div>
              )}
            </div>

            {/* Input send message toolbar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Tulis balasan teknismu di sini..."
                className="flex-1 bg-black border border-white/10 rounded-none px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !userInput.trim()}
                className="bg-blue-600 hover:bg-blue-550 disabled:opacity-45 text-white rounded-none px-3 flex items-center justify-center transition-colors"
              >
                KIRIM
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between gap-3 min-h-0">
            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
              Asisten AI akan menganalisis data <strong>skills</strong> dan <strong>proyek</strong> yang telah tersimpan di profil, lalu memformulasikan pitch deskripsi biografi profesional teroptimal dengan satu ketukan.
            </p>

            {/* Generated display results comparison */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
              {isRefining ? (
                <div className="h-full flex flex-col justify-center items-center gap-3 bg-white/[0.01] rounded-none border border-white/10">
                  <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Merumuskan bio kreatif...</span>
                </div>
              ) : refineOptions ? (
                <div className="space-y-4 pr-1">
                  {/* Style 1 Column */}
                  <div className="bg-white/[0.01] p-3 rounded-none border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-blue-400 font-mono font-bold flex items-center gap-1 uppercase tracking-wider">
                        <Briefcase className="w-3.5 h-3.5" /> PROFESSIONAL & CAREER STYLE
                      </span>
                      <button
                        onClick={() => handleApplyBio("professional")}
                        className="bg-white hover:bg-blue-600 text-black hover:text-white font-mono font-black text-[9px] uppercase px-3 py-1 transition-all"
                      >
                        {appliedOption === "professional" ? "Diterapkan" : "TERAPKAN"}
                      </button>
                    </div>
                    <p className="text-[10px] text-white/80 font-mono leading-relaxed bg-black p-2 rounded-none border border-white/5 italic">
                      "{refineOptions.professional}"
                    </p>
                  </div>

                  {/* Style 2 Column */}
                  <div className="bg-white/[0.01] p-3 rounded-none border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1 uppercase tracking-wider">
                        <Cpu className="w-3.5 h-3.5" /> HACKER & SOFTWARE GEEK STYLE
                      </span>
                      <button
                        onClick={() => handleApplyBio("geek")}
                        className="bg-white hover:bg-blue-600 text-black hover:text-white font-mono font-black text-[9px] uppercase px-3 py-1 transition-all"
                      >
                        {appliedOption === "geek" ? "Diterapkan" : "TERAPKAN"}
                      </button>
                    </div>
                    <p className="text-[10px] text-white/80 font-mono leading-relaxed bg-black p-2 rounded-none border border-white/5 italic">
                      "{refineOptions.geek}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center bg-white/[0.02] rounded-none border border-dashed border-white/20">
                  <button
                    onClick={handleRefineBio}
                    className="bg-blue-600 hover:bg-blue-550 text-white font-mono text-[10px] font-black px-5 py-3 uppercase tracking-widest transition-all"
                  >
                    OPTIMALKAN BIO RESUME DENGAN GEMINI AI
                  </button>
                  <p className="text-[9px] text-white/40 font-mono mt-2 uppercase tracking-wide">DAPATKAN DESKRIPSI BIO MODERN DENGAN SEGERA</p>
                </div>
              )}
            </div>

            {refineOptions && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleRefineBio}
                  className="text-[9px] text-white/50 font-mono uppercase tracking-widest flex items-center gap-1.5 hover:text-white"
                >
                  <RefreshCw className="w-3 h-3" /> regenerasi opsi bio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
