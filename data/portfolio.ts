export type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  year: string;
  technologies: string[];
  image: string;
  link: string;
  featured?: boolean;
};

export const categories = ["All", "AI/ML", "Web", "Mobile", "Data"];

export const projects: Project[] = [
  {
    id: 1,
    title: "Ministry of Higher Education RAG System",
    description:
      "Production RAG platform for automated content creation and intelligent retrieval over ministerial knowledge bases using advanced AI.",
    category: "AI/ML",
    year: "2025",
    technologies: ["LangChain", "FAISS", "Next.js", "Gemini"],
    image: "/assets/images/projects/RAG.PNG",
    link: "https://youtu.be/xApOFNzyXgg",
    featured: true,
  },
  {
    id: 2,
    title: "Voxtra — Speech Transcription & AI Summarization",
    description:
      "Advanced speech-to-text system with multi-level LLM summarization for extracting structured insights from audio.",
    category: "AI/ML",
    year: "2025",
    technologies: ["Whisper", "LLMs", "NLP", "Python"],
    image: "/assets/images/projects/5.png",
    link: "#",
    featured: true,
  },
  {
    id: 3,
    title: "BMS — Warehouse Management System",
    description:
      "Mobile application for warehouse management and optimization with 3D visualization and secure encrypted chat.",
    category: "Mobile",
    year: "2025",
    technologies: ["Flutter", "3D Visualization", "Firebase", "Encryption"],
    image: "/assets/images/projects/2.png",
    link: "#",
    featured: true,
  },
  {
    id: 4,
    title: "RAG System for Algérie Poste (APN)",
    description:
      "Retrieval-Augmented Generation system designed for intelligent document querying and knowledge access at APN scale.",
    category: "AI/ML",
    year: "2025",
    technologies: ["LangChain", "Vector DB", "LLMs"],
    image: "/assets/images/projects/7.png",
    link: "#",
  },
  {
    id: 5,
    title: "MGRPO — Multi-Modal GRPO",
    description:
      "Extension of GRPO with multi-modal capabilities integrating text, images, and structured data for advanced reasoning.",
    category: "AI/ML",
    year: "2025",
    technologies: ["Deep Learning", "Multi-modal AI", "Transformers"],
    image: "/assets/images/projects/4.png",
    link: "#",
  },
  {
    id: 6,
    title: "Sentiment Analysis LLM for Ramy",
    description:
      "LLM-powered sentiment analysis system for extracting opinions, emotions, and insights from text with high contextual accuracy.",
    category: "AI/ML",
    year: "2025",
    technologies: ["LLMs", "NLP", "Transformers", "Python"],
    image: "/assets/images/projects/6.jpg",
    link: "#",
  },
  {
    id: 7,
    title: "Multi E-commerce Platform for Algérie Poste",
    description:
      "Scalable multi-vendor e-commerce platform with scoring system, hosting infrastructure, and logistics optimization.",
    category: "Web",
    year: "2025",
    technologies: ["Next.js", "Node.js", "Database", "Cloud"],
    image: "/assets/images/projects/1.png",
    link: "#",
    featured: true,
  },
  {
    id: 8,
    title: "Oil & Gas Production Forecasting",
    description:
      "ARIMA-based time series model for forecasting Algeria's oil and gas production and revenue.",
    category: "Data",
    year: "2025",
    technologies: ["Python", "ARIMA", "Time Series"],
    image: "/assets/images/projects/oil&gas.png",
    link: "https://colab.research.google.com/drive/13N31tkvfJZf7nM9U0O8qBLgqnhOpqzue",
  },
  {
    id: 9,
    title: "Sleep Stages Classification",
    description:
      "Stacked ensemble learning for classifying sleep stages from physiological time series data.",
    category: "Data",
    year: "2025",
    technologies: ["Python", "ML", "Signal Processing"],
    image: "/assets/images/projects/sleepstages.jpg",
    link: "https://colab.research.google.com/drive/1xOeaHCSjtY-pKOtnRnj6Sn94jL1Vw1Dp",
  },
  {
    id: 10,
    title: "News Popularity Prediction",
    description:
      "Regression models to predict news article popularity from the UCI dataset with NLP features.",
    category: "Data",
    year: "2025",
    technologies: ["Python", "Regression", "NLP"],
    image: "/assets/images/projects/UCINEWS.png",
    link: "https://www.kaggle.com/datasets/thehapyone/uci-online-news-popularity-data-set",
  },
  {
    id: 11,
    title: "Book Recommendation Engine",
    description: "KNN-based recommendation system for personalized book suggestions.",
    category: "AI/ML",
    year: "2025",
    technologies: ["Python", "KNN", "Recommendation"],
    image: "/assets/images/projects/br.jpg",
    link: "#",
  },
  {
    id: 12,
    title: "SMS Text Classifier",
    description: "Neural network for classifying SMS messages into spam and ham categories.",
    category: "AI/ML",
    year: "2025",
    technologies: ["Python", "Neural Networks", "NLP"],
    image: "/assets/images/projects/UCINEWS.png",
    link: "https://colab.research.google.com/drive/1fFhr_RO3QnRGP2Stob-U0yF925FPjOii",
  },
  {
    id: 13,
    title: "Cafl — AI Learning Platform",
    description: "Mobile app with AI-driven question generation and adaptive learning experience.",
    category: "Mobile",
    year: "2024",
    technologies: ["Flutter", "AI", "Python"],
    image: "/assets/images/projects/CAFL.png",
    link: "https://youtu.be/TtgQK0Tv-rk",
    featured: true,
  },
  {
    id: 14,
    title: "Constraint Programming for Agri Planning",
    description: "Constraint programming for optimizing crop planning and resource allocation.",
    category: "AI/ML",
    year: "2024",
    technologies: ["Python", "Optimization", "CP"],
    image: "/assets/images/projects/agripl.jpg",
    link: "#",
  },
];

export const timeline = [
  { year: "2026", title: "Algeria Post Certificate", company: "Algeria Post", link: "/certificates/Algerie post.pdf" },
  { year: "2026", title: "BMS Certificate", company: "BMS", link: "/certificates/BMS.pdf" },
  { year: "2025", title: "Sonatrach Certificate", company: "Sonatrach", link: "/certificates/Sonatrach.pdf" },
  { year: "2025", title: "Algeria Telecom Certificate", company: "Algeria Telecom", link: "/certificates/algerie telecom.pdf" },
  { year: "2025", title: "Software Engineer Certificate", company: "HackerRank", link: "/certificates/software_engineer certificate.pdf" },
  { year: "2025", title: "Ethical Hacking Certificate", company: "Cisco Networking Academy", link: "/certificates/Ethical Hacking Certificat.pdf" },
  { year: "2025", title: "APN Certificate", company: "APN", link: "/certificates/APN.pdf" },
];

export const profile = {
  name: "Guerroudj Abdennour",
  firstName: "Guerroudj",
  lastName: "Abdennour",
  role: "AI & Full-Stack Developer",
  email: "guerroudjabdennour1@gmail.com",
  github: "https://github.com/AbdennourGuerroudj",
  linkedin: "https://www.linkedin.com/in/abdennour-guerroudj/",
  cv: "/assets/docs/cv.pdf",
  location: "Algeria — Remote Worldwide",
  stats: [
    { value: 14, suffix: "+", label: "AI Projects Shipped" },
    { value: 7, suffix: "", label: "Certifications" },
    { value: 6, suffix: "", label: "Core Stack Mastery" },
    { value: 2025, suffix: "", label: "Focused on LLM Era", raw: true },
  ],
};
