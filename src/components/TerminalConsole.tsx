import React, { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";
import { ProfileData } from "../types";

interface TerminalConsoleProps {
  profile: ProfileData;
}

interface CommandLog {
  text: string;
  type: "command" | "system" | "success" | "error" | "output";
}

export default function TerminalConsole({ profile }: TerminalConsoleProps) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    { text: "=== INFORMATICS COMPILER SHELL v2.0.0 ===", type: "system" },
    { text: "Ketik 'help' untuk petunjuk perintah terminal.", type: "output" },
    { text: "Sistem terminal interaktif berhasil diinisialisasi.", type: "success" },
  ]);
  const [theme, setTheme] = useState<"classic" | "neon" | "amber" | "matrix">("classic");
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getThemeClasses = () => {
    switch (theme) {
      case "neon":
        return {
          bg: "bg-[#020202] border-emerald-500/30 text-emerald-400",
          accent: "text-emerald-500",
          inputBg: "bg-emerald-950/10",
          text: "font-mono text-emerald-400",
          badge: "bg-emerald-555/10 text-emerald-400 border border-emerald-500/30"
        };
      case "amber":
        return {
          bg: "bg-[#020201] border-amber-500/30 text-amber-500",
          accent: "text-amber-500",
          inputBg: "bg-amber-950/10",
          text: "font-mono text-amber-500",
          badge: "bg-amber-500/10 text-amber-500 border border-amber-500/30"
        };
      case "matrix":
        return {
          bg: "bg-black border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
          accent: "text-green-400",
          inputBg: "bg-black",
          text: "font-mono text-green-500 tracking-wider",
          badge: "bg-green-500/10 text-green-400 border border-green-500/20"
        };
      default:
        return {
          bg: "bg-black border-white/10 text-white hover:border-blue-500/40 transition-colors duration-300",
          accent: "text-blue-500",
          inputBg: "bg-white/[0.02]",
          text: "font-mono text-slate-200",
          badge: "bg-blue-600 text-white"
        };
    }
  };

  const currentTheme = getThemeClasses();

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(" ");
    const primaryCmd = parts[0];
    const args = parts.slice(1);

    if (trimmed) {
      commandHistory.current.push(cmd);
      historyIndex.current = commandHistory.current.length;
    }

    const newLogs = [...logs, { text: `user@cs-dev-rig:~ $ ${cmd}`, type: "command" as const }];

    switch (primaryCmd) {
      case "help":
        newLogs.push(
          { text: "DAFTAR PERINTAH SHELL DEPARTEMEN:", type: "system" },
          { text: "  whoami        Menampilkan informasi dasar profil dev", type: "output" },
          { text: "  skills        Visualisasi persentase tingkat teknologi", type: "output" },
          { text: "  projects      Menampilkan portofolio proyek terkini", type: "output" },
          { text: "  gpa           Menampilkan transkrip & info akademis", type: "output" },
          { text: "  theme [name]  Ganti tema terminal (classic, neon, amber, matrix)", type: "output" },
          { text: "  matrix        Memicu mode visualisasi hujan sandi digital Matrix", type: "output" },
          { text: "  sort          Simulasi interaktif algoritma Sortir Bubble", type: "output" },
          { text: "  clear         Membersihkan isi log terminal ini", type: "output" }
        );
        break;

      case "whoami":
        newLogs.push(
          { text: `[IDENTITAS PENGGUNA TERPERINTAH]`, type: "system" },
          { text: `Nama       : ${profile.name}`, type: "output" },
          { text: `Gelar/Level: ${profile.title}`, type: "output" },
          { text: `Almamater  : ${profile.university}`, type: "output" },
          { text: `Semester   : ${profile.semester} / GPA: ${profile.gpa}`, type: "output" },
          { text: `Bio        : "${profile.bio}"`, type: "output" }
        );
        break;

      case "skills":
        newLogs.push({ text: "MATRIKS SKILL MAHASISWA:", type: "system" });
        profile.skills.forEach(skill => {
          const barLength = Math.round(skill.level / 10);
          const bar = `[${"=".repeat(barLength)}${" ".repeat(10 - barLength)}]`;
          newLogs.push({
            text: `  ${skill.name.padEnd(22)}: ${bar} ${skill.level}% (${skill.category})`,
            type: "output"
          });
        });
        break;

      case "projects":
        newLogs.push({ text: `DATA PROYEK SUMBER TERBUKA (TOTAL: ${profile.projects.length})`, type: "system" });
        profile.projects.forEach((proj, idx) => {
          newLogs.push({
            text: `[${idx + 1}] ${proj.title} - ${proj.techStack.join(", ")}`,
            type: "success"
          });
          newLogs.push({
            text: `    ${proj.description}`,
            type: "output"
          });
        });
        break;

      case "gpa":
        newLogs.push(
          { text: `INFO AKADEMIK RESMI`, type: "system" },
          { text: `IPK Kumulatif  : ${profile.gpa} / 4.00`, type: "success" },
          { text: `Semester Saat Ini: Semester ${profile.semester}`, type: "output" },
          { text: `Status Akademik : Aktif & Berkompeten`, type: "success" }
        );
        break;

      case "theme":
        const targetTheme = args[0];
        if (["classic", "neon", "amber", "matrix"].includes(targetTheme)) {
          setTheme(targetTheme as any);
          setIsMatrixActive(targetTheme === "matrix");
          newLogs.push({ text: `Tema terminal diubah ke '${targetTheme}'`, type: "success" });
        } else {
          newLogs.push({ text: "Sintaks salah. Gunakan: theme [classic | neon | amber | matrix]", type: "error" });
        }
        break;

      case "matrix":
        setIsMatrixActive(!isMatrixActive);
        setTheme("matrix");
        newLogs.push({ text: !isMatrixActive ? "Mengaktifkan Matrix Decoder Canvas..." : "Matrix effect dinonaktifkan.", type: "system" });
        break;

      case "sort":
        newLogs.push(
          { text: "MEMULAI ANALISIS SORTIR BUBBLE (DATA ACRA)", type: "system" },
          { text: "Data asal: [34, 12, 89, 5, 23]", type: "output" },
          { text: "Step 1: Tukar 34 & 12 -> [12, 34, 89, 5, 23]", type: "output" },
          { text: "Step 2: Tetap 34 & 89 -> [12, 34, 89, 5, 23]", type: "output" },
          { text: "Step 3: Tukar 89 & 5 -> [12, 34, 5, 89, 23]", type: "output" },
          { text: "Step 4: Tukar 89 & 23 -> [12, 34, 5, 23, 89]", type: "output" },
          { text: "... Iterasi selesai dalam waktu optimal!", type: "success" },
          { text: "Hasil akhir: [5, 12, 23, 34, 89]", type: "success" }
        );
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      default:
        newLogs.push({
          text: `Command '${primaryCmd}' tidak dikenali. Ketik 'help' untuk melihat daftar instruksi.`,
          type: "error"
        });
        break;
    }

    setLogs(newLogs);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex.current > 0) {
        historyIndex.current--;
        setInput(commandHistory.current[historyIndex.current]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex.current < commandHistory.current.length - 1) {
        historyIndex.current++;
        setInput(commandHistory.current[historyIndex.current]);
      } else {
        historyIndex.current = commandHistory.current.length;
        setInput("");
      }
    }
  };

  return (
    <div className={`rounded-none border ${currentTheme.bg} overflow-hidden h-[330px] flex flex-col relative`}>
      {/* Chrome header border */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black py-3 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-white/20" />
          <span className="text-[10px] tracking-widest uppercase font-bold font-mono opacity-60">farhan@cs-dev-shell</span>
        </div>
        <div className="flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5 opacity-60" />
          <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">BASH</span>
        </div>
      </div>

      {/* Output Console area */}
      <div 
        ref={terminalRef} 
        className={`flex-1 overflow-y-auto p-4 space-y-1.5 leading-relaxed overflow-x-hidden ${currentTheme.text} text-xs`}
        id="terminal-box"
      >
        {isMatrixActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 z-0 font-mono text-[9px] select-none text-green-500">
            {Array.from({ length: 15 }).map((_, col) => (
              <div 
                key={col} 
                className="absolute animate-[bounce_5s_infinite] flex flex-col whitespace-pre"
                style={{
                  left: `${col * 7}%`,
                  animationDelay: `${col * 0.3}s`,
                  top: `-${Math.random() * 50}px`
                }}
              >
                {"0101110011010110".split("").map((char, cl) => (
                  <span key={cl} style={{ opacity: Math.random() }}>{char}</span>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10 space-y-1">
          {logs.map((log, index) => {
            let textColor = "";
            if (log.type === "command") textColor = "text-blue-400 font-bold";
            else if (log.type === "system") textColor = "text-blue-500 font-bold uppercase tracking-widest text-[10px]";
            else if (log.type === "success") textColor = "text-emerald-400";
            else if (log.type === "error") textColor = "text-rose-500";

            return (
              <div key={index} className={`whitespace-pre-wrap ${textColor}`}>
                {log.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input container */}
      <div className={`p-3 px-4 border-t border-white/10 flex items-center gap-2 ${currentTheme.inputBg} relative z-10`}>
        <span className={`${currentTheme.accent} font-mono text-xs select-none font-bold`}>~ $</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik 'whoami', 'skills', 'gpa', atau 'help'..."
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 font-mono text-xs text-inherit placeholder:opacity-30"
          id="terminal-command-input"
        />
        <div className="flex gap-1.5 shrink-0 item-center">
          {["classic", "neon", "amber", "matrix"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t as any);
                setIsMatrixActive(t === "matrix");
              }}
              title={`Tema ${t}`}
              className={`w-2.5 h-2.5 rounded-none border ${theme === t ? "border-white bg-white" : "border-white/20"} transition-all`}
              style={{
                backgroundColor: t === "classic" ? "#3b82f6" : t === "neon" ? "#10b981" : t === "amber" ? "#f59e0b" : "#22c55e"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
