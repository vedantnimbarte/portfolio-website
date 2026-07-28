import { Experience, SkillCategory, Stat, FeatureBlock } from './types';
import { Cpu, Cloud, GitBranch } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const HERO_DATA = {
  name: "Vedant Nimbarte",
  title: "Senior Full Stack Developer",
  roles: ["Full Stack Developer", "AI & Systems Engineer", "Cloud Architect"],
  subtitle: "Architecting scalable cloud systems, building AI-native tools, and shipping high-performance software from the browser to the metal.",
  location: "Surat, Gujarat, India",
  email: "vedantnimbarteofficial@gmail.com",
  github: "https://github.com/vedantnimbarte",
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
  { title: "Languages", skills: ["TypeScript", "JavaScript", "Rust", "Python", "SQL"] },
  { title: "Frontend", skills: ["React", "Next.js", "SolidJS", "Tauri", "Tailwind CSS", "Three.js"] },
  { title: "Backend", skills: ["Node.js", "Express.js", "NestJS", "Microservices", "Kafka"] },
  { title: "Database", skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Mongoose"] },
  { title: "Cloud & DevOps", skills: ["AWS", "GCP", "Docker", "Kubernetes", "CI/CD", "Terraform"] },
  { title: "AI & Systems", skills: ["LLM Integration", "Inference Engines", "MCP", "System Design", "Performance Tuning"] },
];

// AI-native / cloud capabilities — surfaced in the About section.
export const CAPABILITIES: FeatureBlock[] = [
  {
    title: "AI Integration",
    description: "Embedding LLMs and agentic workflows directly into production — from inference engines to MCP-based memory layers and multi-provider coding agents.",
    icon: Cpu
  },
  {
    title: "Cloud Architecture",
    description: "Designing fault-tolerant systems on AWS and GCP with serverless patterns and managed services that scale without maintenance overhead.",
    icon: Cloud
  },
  {
    title: "DevOps & Reliability",
    description: "Automating the path to production with Docker/K8s CI/CD pipelines, ensuring 99.9% uptime through proactive monitoring and self-healing infra.",
    icon: GitBranch
  }
];
