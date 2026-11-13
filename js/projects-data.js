/**
 * Comprehensive Project Showcase Data for Ankit Kumar
 * Aspiring AI Engineer | Full-Stack Developer | Machine Learning Enthusiast
 * Sikkim Manipal Institute of Technology (SMIT) — Batch 2024–2028
 */

const portfolioProjects = [
  {
    id: "tracker-dumka",
    title: "Tracker – Dumka Sports Academy",
    shortTitle: "Dumka Sports Tracker",
    tagline: "Sports Academy Management, Athlete Tracking & Performance Analytics Platform",
    category: "fullstack",
    categoryDisplay: "Full-Stack Development | Sports Management",
    image: "assets/images/project_tracker_dumka.png",
    featured: true,
    status: "deployed",
    statusText: "Live Production",
    liveUrl: "https://dumka-sports-tracker.vercel.app/",
    githubUrl: "https://github.com/ankitkumar2006official-design/Tracker",
    description: "A centralized sports academy management and tracking platform engineered to digitize athlete attendance, streamline multi-sport training workflows, maintain athlete rosters, and generate performance analytics.",
    tags: ["React", "Node.js", "Express.js", "MongoDB Atlas", "Vercel", "REST APIs", "TailwindCSS"],
    highlights: [
      "Streamlines end-to-end athlete registration, discipline tracking, and roster management",
      "Interactive administrative dashboard visualizing athlete attendance, schedules, and training cohorts",
      "Dynamic data management pipelines with secure REST API endpoints and schema validation",
      "Architected with cloud-native Vercel serverless deployment and MongoDB Atlas cloud storage"
    ],
    // 10 Detailed View Attributes
    details: {
      problemStatement: "Local sports academies like Dumka Sports Academy previously relied on fragmented paper records, manual registers, and ad-hoc spreadsheets to track athlete attendance, physical training progress, and tournament eligibility. This caused data loss, lack of visibility into athlete progress, and severe administrative overhead for coaches and academy directors.",
      proposedSolution: "Developed 'Tracker', a responsive full-stack web application that serves as a single source of truth for sports academy administration. It empowers coaches and managers to register athletes, record daily attendance, monitor fitness benchmarks, manage training schedules, and generate analytical reports through an intuitive dashboard.",
      architecture: "Modern three-tier client-server architecture. The frontend is built with React and modern CSS for high responsiveness, communicating via secure RESTful APIs with an Express.js/Node.js backend hosted as serverless functions on Vercel, backed by a managed MongoDB Atlas cluster.",
      techStack: [
        { label: "Frontend", val: "React, Modern CSS / TailwindCSS, Lucide Icons, Vite" },
        { label: "Backend", val: "Node.js, Express.js REST APIs" },
        { label: "Database", val: "MongoDB, MongoDB Atlas Cloud" },
        { label: "Deployment & DevOps", val: "Vercel, Git, GitHub" }
      ],
      keyFeatures: [
        "Comprehensive Athlete Directory: Profile tracking, personal records, assigned sports (Archery, Athletics, Football, etc.), and contact information.",
        "Attendance & Workout Logging: Daily check-in system with instant status tagging and monthly percentage calculation.",
        "Administrative Dashboard: High-level metric cards showing total active athletes, daily attendance rates, and active sporting disciplines.",
        "Role-Based Data Filtering: Quick search, category filtering by sport discipline and training cohort.",
        "Export & Reporting: Structured data summaries for coach evaluations and academy reviews."
      ],
      backendImplementation: "Engineered modular Express.js controllers and routing handlers to manage athlete CRUD operations and attendance records. Implemented request body validation, centralized error handling middleware, and clean CORS configuration for Vercel's serverless runtime environment.",
      databaseDesign: "Flexible MongoDB document schema containing normalized Athlete, Attendance, and Program models. Indexed athlete IDs and dates for fast query resolution, compound indexes on attendance records to prevent duplicate daily check-ins per athlete.",
      aiMlImplementation: "Current iteration incorporates rule-based attendance trending and threshold indicators for coaches. Future roadmap includes predictive fitness regression models and fatigue scoring based on historical training logs.",
      technicalChallenges: "Managing serverless cold starts and persistent MongoDB connection pooling on Vercel serverless functions. Addressed by establishing a cached Mongoose connection pattern to avoid exhausting MongoDB Atlas connection limits during concurrent invocations.",
      databaseHealthReport: "Database Connection & Deployment Health Analysis: When deployed to Vercel's serverless environment, applications communicating with MongoDB Atlas may intermittently encounter a 'Database Offline' or 'Server Selection Timeout' if the Atlas Network Access IP Whitelist does not allow access from anywhere (0.0.0.0/0), or if connection pooling is re-instantiated on every lambda cold start. Verifying Atlas IP Whitelisting and ensuring standard Mongoose connection caching in the serverless handler resolves this condition reliably.",
      futureImprovements: [
        "Automated biometric check-in integration (QR code / RFID card scanning)",
        "Automated SMS/WhatsApp notifications to guardians for attendance alerts",
        "Performance benchmark visualization charts with radar profiles for athlete physical fitness",
        "Offline-first PWA caching for remote sports grounds with poor cellular connectivity"
      ]
    }
  },
  {
    id: "mediguard-ai",
    title: "MediGuard AI – Operation Ward Zero",
    shortTitle: "MediGuard AI",
    tagline: "AI-Powered Healthcare Management & Intelligent Patient Triage Platform",
    category: "ai",
    categoryDisplay: "AI Healthcare | Full-Stack Development",
    image: "assets/images/project_mediguard_ai.png",
    featured: true,
    status: "deployed",
    statusText: "Live Production",
    liveUrl: "https://frontend-fawn-eight-96.vercel.app/",
    githubUrl: "https://github.com/ankitkumar2006official-design/Medicare-AI-Healthcare",
    description: "An AI-powered clinical healthcare management platform designed to optimize emergency department workflows, automate patient triage prioritization, and provide real-time clinical decision support under high patient load.",
    tags: ["React", "Node.js", "Express", "AI Healthcare", "REST APIs", "Vercel", "MongoDB"],
    highlights: [
      "Real-time emergency triage scoring system prioritizing high-risk patients instantly",
      "Operation Ward Zero dashboard monitoring clinical capacity, bed allocations, and vital signs",
      "Seamless patient workflow management from admission and vitals logging to treatment handoff",
      "Robust backend architecture with authentication, data encryption, and role separation"
    ],
    // 10 Detailed View Attributes
    details: {
      problemStatement: "Emergency rooms and intensive care wards frequently experience critical bottlenecks, delay in triage, and physician cognitive overload during patient influx. Delays in identifying deteriorating vital signs directly impact patient mortality and resource utilization.",
      proposedSolution: "MediGuard AI ('Operation Ward Zero') solves this by combining automated clinical workflow management with intelligent risk stratification. The platform continuously tracks patient vitals, calculates emergency priority scores, and surfaces actionable clinical insights to medical personnel.",
      architecture: "Decoupled full-stack architecture featuring a React Single Page Application (SPA) on the frontend communicating via asynchronous REST endpoints to a Node.js/Express backend service, integrated with cloud databases and AI inference modules.",
      techStack: [
        { label: "Frontend", val: "React, TailwindCSS, Lucide React, Vite" },
        { label: "Backend", val: "Node.js, Express.js RESTful Microservices" },
        { label: "AI & Intelligence", val: "Predictive Triage Scoring, Clinical Decision Support Algorithms" },
        { label: "Database & Auth", val: "MongoDB Atlas, JWT Authentication, Role-Based Access Control" },
        { label: "Deployment", val: "Vercel Frontend, Render/Vercel Cloud Services" }
      ],
      keyFeatures: [
        "Patient Admission & Workflow Management: Fast digital intake capturing clinical demographics, chief complaints, and past medical history.",
        "Operation Ward Zero Command Dashboard: Real-time visual overview of emergency beds, department occupancy, and pending admissions.",
        "Vital Signs & Telemetry Monitor: Continuous logging of heart rate, SpO2, blood pressure, temperature, and respiratory metrics with automated anomaly alerts.",
        "AI-Assisted Triage Prioritization: Algorithmic classification categorizing incoming patients into urgent, priority, and stable queues.",
        "Secure Role-Based Authentication: Protected routes ensuring patient clinical records are accessible solely to authenticated hospital staff."
      ],
      backendImplementation: "Constructed resilient Express.js services with comprehensive JWT middleware, bcrypt password hashing, request payload sanitization, and structured HTTP response wrappers to maintain strict healthcare data compliance.",
      databaseDesign: "Normalized schema architecture with collections for Users (doctors, nurses, admins), Patients, VitalsLog, and TriageAlerts. Implemented audit timestamps and indexed patient record numbers for sub-10ms query lookups.",
      aiMlImplementation: "Implements clinical rule engines and predictive risk models that evaluate multiple vital sign inputs against standard Early Warning Scores (EWS) to detect septic shock, respiratory distress, and cardiovascular decompensation before symptoms escalate.",
      technicalChallenges: "Ensuring zero-latency UI updates when vital signs fluctuate while adhering to strict data confidentiality standards and avoiding false-positive alerts that cause clinician alarm fatigue.",
      futureImprovements: [
        "Integration with HL7 / FHIR healthcare interoperability standards",
        "Direct wearable IoT sensor telemetry via WebSockets for real-time ICU streaming",
        "Voice-to-text clinical notes dictation using Gemini Whisper AI models",
        "Multi-hospital ward synchronization and inter-facility transfer coordination"
      ]
    }
  },
  {
    id: "geocommerce-ai",
    title: "GeoCommerce AI",
    shortTitle: "GeoCommerce AI",
    tagline: "Geographic Commerce Intelligence & Regional Consumer Demand Platform",
    category: "ai",
    categoryDisplay: "Artificial Intelligence | Data Science | E-Commerce Analytics",
    image: "assets/images/project_geocommerce_ai.png",
    featured: true,
    status: "deployed",
    statusText: "Live Production",
    liveUrl: "https://geoecommerce-ai.vercel.app/",
    githubUrl: "https://github.com/ankitkumar2006official-design/GeoecommerceAI",
    description: "An AI-powered geographic commerce intelligence platform designed to analyze e-commerce sales datasets, uncover regional consumer demand patterns, and generate generative business strategies using Google Gemini AI.",
    tags: ["React", "Python", "Gemini API", "MongoDB Atlas", "Data Science", "Pandas", "Vercel"],
    highlights: [
      "Analyzes multi-city sales datasets to detect regional purchasing spikes and seasonal trends",
      "Interactive geographic analytics dashboards mapping demand density across urban & tier-2 hubs",
      "Google Gemini AI integration synthesizing strategic supply-chain and inventory recommendations",
      "Seamless integration with MongoDB Atlas for scalable transaction and product data pipelines"
    ],
    // 10 Detailed View Attributes
    details: {
      problemStatement: "E-commerce retailers struggle to understand how geographic and regional nuances affect consumer purchasing behavior. Standard sales dashboards treat all markets homogenously, leading to overstocked inventory in low-demand hubs, stockouts in surging regions, and wasted regional marketing spend.",
      proposedSolution: "GeoCommerce AI bridges the gap between spatial data science and commerce intelligence. It analyzes transactional data across cities and states, visualizes regional consumer demand clusters, and leverages Google Gemini AI to automatically generate contextual supply-chain and marketing advisories.",
      architecture: "Full-stack AI analytics architecture. The frontend provides rich interactive data visualizations and geographic maps in React; the backend ingests transactional datasets, performs statistical aggregations, stores them in MongoDB Atlas, and invokes the Gemini API for generative business intelligence.",
      techStack: [
        { label: "Frontend", val: "React, Chart.js / Recharts, TailwindCSS, Modern UI Components" },
        { label: "AI Engine", val: "Google Gemini AI API, Prompt Engineering Pipelines" },
        { label: "Data Science & Backend", val: "Python / Node.js, Pandas, Statistical Analysis" },
        { label: "Database & Cloud", val: "MongoDB Atlas Cloud, Vercel Serverless Platform" }
      ],
      keyFeatures: [
        "Geographic Sales Analytics: Interactive heatmaps and city-wise breakdowns detailing gross merchandise value (GMV), order frequency, and average order value (AOV).",
        "Regional Consumer Demand Analysis: Pinpoints localized category preferences (e.g., fashion surges vs. electronics demand by climatic zone and region).",
        "Product Performance Breakdown: SKU-level velocity metrics, return rates, and cross-regional margin evaluations.",
        "Gemini AI Strategic Synthesizer: Natural-language business advisory module that takes raw sales aggregations and produces bulleted executive summaries and inventory distribution advice.",
        "Dataset Management Hub: Secure ingestion pipelines supporting CSV / JSON transaction uploads with automated schema parsing and cleaning."
      ],
      backendImplementation: "Engineered scalable API endpoints for data aggregation, regional geospatial grouping, and Gemini API prompt orchestration with rate-limiting and response caching to optimize LLM token consumption.",
      databaseDesign: "MongoDB Atlas document collections storing Stores, SalesTransactions, GeospatialMetrics, and AIInsights. Geospatial indexing enables fast bounding-box queries and multi-city comparative lookups.",
      aiMlImplementation: "Integrated Google's Gemini API with structured few-shot prompt templates that transform raw numerical sales vectors into actionable supply chain playbooks, localized promotional suggestions, and demand anomaly explanations.",
      technicalChallenges: "Processing high-volume e-commerce datasets without UI freezing and synthesizing complex multi-dimensional regional trends into prompt-sized contexts for Gemini while maintaining high accuracy and zero hallucination.",
      futureImprovements: [
        "Predictive geospatial forecasting using time-series ARIMA/LSTM models for pre-holiday surges",
        "Automated ERP inventory webhook triggers for automated stock transfer orders",
        "Competitor regional pricing scrapers and sentiment correlation from local e-commerce reviews",
        "Multi-currency and global regional exchange rate normalization"
      ]
    }
  },
  {
    id: "ai-engineer-agent",
    title: "Autonomous AI Software Engineer Agent",
    shortTitle: "AI Software Engineer Agent",
    tagline: "Autonomous Agent for Natural Language Code Generation, Debugging & Workflow Automation",
    category: "ai",
    categoryDisplay: "Artificial Intelligence | Autonomous AI Agents",
    image: "assets/images/project_ai_engineer_agent.png",
    featured: false,
    status: "in-development",
    statusText: "In Development",
    liveUrl: "https://ai-software-engineer-agent-blond.vercel.app/",
    githubUrl: "https://github.com/ankitkumar2006official-design/AI-SOFTWARE-ENGINEER-AGENT",
    description: "An AI-powered software engineering assistant designed to autonomously understand natural language development tasks, decompose complex goals, generate modular code, debug errors, and automate software workflows.",
    tags: ["Python", "AI Agents", "LangChain", "Gemini API", "AST Parsing", "Git Automation", "Docker"],
    highlights: [
      "Decomposes high-level natural language developer prompts into structured execution plans",
      "Generates modular, idiomatic code with AST-level syntax verification and dependency resolution",
      "Self-reflective error correction loop analyzing test output and runtime tracebacks to fix bugs",
      "Under active development — focused on transparent, autonomous developer tooling"
    ],
    // 10 Detailed View Attributes
    details: {
      problemStatement: "Software engineers spend substantial time on boilerplate code generation, searching for subtle syntax/runtime bugs, writing repetitive tests, and resolving environment incompatibilities. Existing AI tools often operate as passive autocomplete snippets without full project context or autonomous verification loops.",
      proposedSolution: "Developing an autonomous AI Software Engineer Agent that functions as an autonomous pair programmer. It accepts project-level instructions, scans existing repository context, reasons through architectural dependencies, synthesizes solutions, runs tests in a sandbox, and self-corrects until tasks pass all verifications.",
      architecture: "Agentic Loop architecture incorporating Perception (repo file tree & AST parsing), Planning (goal decomposition and task dag generation), Execution (LLM code generation & file I/O), and Self-Reflection (unit test execution & traceback analysis).",
      techStack: [
        { label: "Core Language", val: "Python 3.11+" },
        { label: "LLM & Agent Framework", val: "Google Gemini API, LangChain / LangGraph" },
        { label: "Code Analysis & AST", val: "Tree-sitter, Python `ast` module, GitPython" },
        { label: "Execution Environment", val: "Sandboxed Subprocesses, Docker Containers" },
        { label: "Version Control", val: "Git, GitHub API" }
      ],
      keyFeatures: [
        "Natural Language Task Understanding: Parses high-level feature requests into discrete file modification plans.",
        "AST-Aware Code Generation: Analyzes repository imports and symbol declarations to generate context-compatible functions and classes.",
        "Autonomous Error Debugging: Captures stdout/stderr from test runners, isolates stack traces, and queries the LLM with surgical error context.",
        "Self-Reflection & Repair Loop: Evaluates whether proposed diffs resolve the issue without introducing regressions, retrying with adjusted reasoning if tests fail.",
        "Project Context Indexing: Embeds repository structure and code snippets for fast semantic retrieval during multi-file refactoring."
      ],
      backendImplementation: "Built modular Python agent runners with strict sandboxing to prevent unsafe code execution. Implemented robust diff generation logic using unified diff protocols to modify source trees without clobbering untouched blocks.",
      databaseDesign: "File-based JSON artifact logs and local ChromaDB vector store caching code embeddings and task execution histories for cross-session agent memory.",
      aiMlImplementation: "Leverages Gemini API with structured ReAct (Reasoning + Acting) prompt loops, few-shot coding exemplars, and chain-of-thought verification to maximize code validity and minimize hallucinated APIs.",
      technicalChallenges: "Preventing infinite self-correction loops when errors arise from missing system dependencies rather than logic bugs, and keeping the agent's context window manageable during large multi-file refactoring passes.",
      futureImprovements: [
        "Interactive human-in-the-loop approval checkpoints before executing destructive filesystem actions",
        "Integration into VS Code as an interactive extension sidecar",
        "Multi-agent collaboration (Planner Agent, Coder Agent, Security Auditor Agent, QA Agent)",
        "Automated Pull Request drafting with comprehensive changelogs and benchmark reports"
      ]
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = portfolioProjects;
}
