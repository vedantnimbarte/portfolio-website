import { Experience, Project, SkillCategory, Stat, FeatureBlock } from './types';
import { Cpu, Cloud, GitBranch, Terminal, Database, Globe } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'AI & Cloud', href: '#ai-cloud' },
  { label: 'Contact', href: '#contact' },
];

export const HERO_DATA = {
  name: "Vedant Nimbarte",
  title: "Senior Full Stack Developer",
  subtitle: "Architecting scalable cloud systems, integrating AI solutions, and leading high-performance engineering teams.",
  location: "Surat, Gujarat, India",
  email: "contact@vedantnimbarte.dev"
};

export const STATS: Stat[] = [
  { label: "Years Exp.", value: "5+" },
  { label: "Daily Users", value: "10k+" },
  { label: "System Uptime", value: "99.9%" },
  { label: "AI Ops/Mo", value: "50k+" },
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    role: "Senior Full Stack Developer",
    company: "Cloudairy",
    period: "April 2024 – Present",
    location: "Surat",
    highlights: [
      "Architected MERN applications supporting 10,000+ daily users with 99.9% uptime.",
      "Reduced API response time by 40% through optimized database indexing and caching strategies.",
      "Integrated OpenAI API handling 50,000+ calls/month for generative features.",
      "Improved code quality by 35% and reduced production bugs by 45% via strict CI/CD pipelines.",
      "Delivered 15+ critical features per quarter while mentoring junior developers."
    ]
  },
  {
    role: "Full Stack Developer (Freelance)",
    company: "Self-Employed",
    period: "March 2023 – April 2024",
    location: "Remote",
    highlights: [
      "Built a video processing microservice handling 1,000+ videos/day, reducing processing time by 60%.",
      "Engineered a Kafka-based messaging system processing 100,000+ messages/day with 99.5% uptime.",
      "Led a remote team of 5 developers, delivering 8 client projects with 100% satisfaction rates.",
      "Implemented comprehensive monitoring solutions for distributed systems."
    ]
  },
  {
    role: "Senior React Developer",
    company: "SAMP Technologies LLP",
    period: "December 2021 – March 2023",
    location: "Surat",
    highlights: [
      "Led a frontend team of 10, achieving 35% faster application load times.",
      "Delivered 12+ projects for a user base exceeding 20,000.",
      "Streamlined onboarding processes, reducing ramp-up time for junior devs by 40%."
    ]
  },
  {
    role: "NodeJS & React JS Developer",
    company: "Microtron Technologies",
    period: "January 2021 – November 2021",
    location: "Surat",
    highlights: [
      "Developed robust backends using SQL/NoSQL databases and ORM frameworks.",
      "Conducted code reviews and debugging sessions to maintain code integrity.",
      "Collaborated directly with clients to translate requirements into technical specifications."
    ]
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  { title: "Languages", skills: ["TypeScript", "JavaScript", "Python", "SQL", "HTML5", "CSS3"] },
  { title: "Frontend", skills: ["React", "Next.js", "SolidJS", "Redux", "Tailwind CSS", "Framer Motion"] },
  { title: "Backend", skills: ["Node.js", "Express.js", "NestJS", "Microservices", "Kafka"] },
  { title: "Database", skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Mongoose"] },
  { title: "Cloud & DevOps", skills: ["AWS", "GCP", "Docker", "Kubernetes", "CI/CD", "Ansible", "Terraform"] },
  { title: "AI & Arch", skills: ["OpenAI API", "LLM Integration", "System Design", "Scalability", "Performance Tuning"] },
];

export const PROJECTS_DATA: Project[] = [
  {
    title: "SyncSpace – All-in-One AI Workspace",
    description: "An integrated AI workspace designed as a modern alternative to Google Workspace. Brings together Docs, Presentations, Drive, and Project Management into a single unified interface with real-time AI agents.",
    tech: ["React JS", "Node JS", "TypeScript", "OpenAI API", "Gemini API", "Redis", "Docker", "Minio", "Vite"],
    metrics: ["99.9% Collaboration Uptime", "30% Faster Task Completion", "AI-Generated Docs/sec"],
    link: "https://github.com/vedantnimbarte",
    snapshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
    ]
  },
  {
    title: "Arcade Studio - Product Analytics",
    description: "End-to-end product analytics platform that helps teams track website performance and visualize user funnels. Features real-time behavior tracking and automated drop-off detection.",
    tech: ["React JS", "Node JS", "TypeScript", "Gemini API", "Redis", "Kubernetes", "Cloudflare R2", "Vite", "FFmpeg", "Chrome API"],
    metrics: ["1M+ Events Processed/Day", "50ms Dashboard Latency", "Real-time Funnel Tracking"],
    link: "https://github.com/vedantnimbarte",
    snapshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1504868584819-f8e90526ef21?auto=format&fit=crop&q=80&w=2076"
    ]
  },
  {
    title: "Video Processing Microservice",
    description: "High-throughput video encoding service designed for parallel processing and scalability. Supports adaptive bitrate streaming and automatic format conversion.",
    tech: ["Node JS", "TypeScript", "Redis", "Kubernetes", "Cloudflare R2", "FFmpeg"],
    metrics: ["1,000+ Parallel Encodes", "60% Cost Reduction", "Zero-Latency Queueing"],
    link: "https://github.com/vedantnimbarte",
    snapshots: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059"
    ]
  }
];

export const AI_CLOUD_FEATURES: FeatureBlock[] = [
  {
    title: "AI Integration",
    description: "Embedding LLM capabilities directly into production workflows. From chatbots to intelligent data analysis, transforming raw API calls into user value.",
    icon: Cpu
  },
  {
    title: "Cloud Architecture",
    description: "Designing fault-tolerant systems on AWS and GCP. Utilizing serverless patterns and managed services to ensure scalability without maintenance overhead.",
    icon: Cloud
  },
  {
    title: "DevOps & Reliability",
    description: "Automating the path to production with robust CI/CD pipelines (Docker/K8s). Ensuring 99.9% uptime through proactive monitoring and self-healing infra.",
    icon: GitBranch
  }
];