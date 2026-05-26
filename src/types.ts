export interface TechSkill {
  name: string;
  category: "Frontend" | "Backend" | "Data Science" | "Mobile" | "Security" | "Other";
  level: number; // 0 to 100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  simulationType: "sorting" | "bst" | "api" | "fibonacci" | "simple";
  githubUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ProfileData {
  name: string;
  title: string;
  university: string;
  gpa: string;
  semester: string;
  avatarUrl: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  skills: TechSkill[];
  projects: Project[];
  experiences: Experience[];
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
