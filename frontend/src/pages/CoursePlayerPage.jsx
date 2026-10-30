import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Check,
  HelpCircle,
  Clock,
  Layers,
  Code,
  Flame,
  Zap,
  ArrowRight,
  BrainCircuit,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  FastForward,
  Compass,
  FileCheck,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import {
  getStoredProgress,
  completeLessonRealtime,
  saveCourseProgress,
  saveAiAssessment,
  batchCompleteLessons,
  applyAiFastTrackProgress,
  isCourseMcqCompleted
} from '../services/courseProgressService';

// Standard 20 Lessons Full Curriculum for all Courses
const COURSES_CURRICULUM = {
  'ui-ux': {
    id: 'ui-ux',
    title: 'UI/UX Design Masterclass',
    category: 'Design',
    instructor: 'Sarah Jenkins',
    totalLessons: 20,
    modules: [
      {
        level: 1,
        title: 'Level 1: UX Research & Information Architecture',
        lessons: [
          { id: 'ux_l1_1', title: '1.1 User Personas & Empathy Mapping', duration: '15 mins', content: `User Research is the foundational cornerstone of digital product experience. An Empathy Map visualizes user attitudes and behaviors across four quadrants: Says, Thinks, Does, and Feels.\n\n### Key Principles:\n1. **Says**: Verbatim quotes captured during qualitative discovery interviews.\n2. **Thinks**: Unvoiced concerns, mental models, and expectations.\n3. **Does**: Physical or digital behavioral actions observed during usability tasks.\n4. **Feels**: Emotional states like anxiety, excitement, or confusion.\n\n### Pro Tip for Designers:\nAlways validate user personas against analytics telemetry rather than assumptions to eliminate designer bias.` },
          { id: 'ux_l1_2', title: '1.2 Information Architecture & User Flow Mapping', duration: '20 mins', content: `Information Architecture (IA) structures website or app content so navigation feels second nature.\n\n### Core Deliverables:\n- **Tree Testing**: Quantitative testing of site menu navigation without visual cues.\n- **Wireflow Diagrams**: Hybrid flows combining low-fidelity wireframes with decision logic branches.\n- **Taxonomy Schemes**: Consistent naming conventions across metadata and navigation.` },
          { id: 'ux_l1_3', title: '1.3 Qualitative User Interview Methodologies', duration: '18 mins', content: `Master open-ended questioning techniques to discover genuine user friction points without introducing leading questions.` },
          { id: 'ux_l1_4', title: '1.4 Competitive Audits & Heuristic Evaluation', duration: '22 mins', content: `Evaluate existing market solutions using Jakob Nielsen's 10 Usability Heuristics to identify usability gaps.` },
          { id: 'ux_l1_5', title: '1.5 Quantitative Survey Synthesis & Metrics', duration: '15 mins', content: `Transform raw user survey data into actionable priority matrices using System Usability Scale (SUS) benchmarks.` }
        ],
        quiz: {
          question: 'Which quadrant of an Empathy Map captures emotional state and unsaid anxieties?',
          options: ['Says', 'Thinks', 'Does', 'Feels'],
          correctIndex: 3,
          explanation: 'The "Feels" quadrant captures emotional responses and affective states of users.'
        }
      },
      {
        level: 2,
        title: 'Level 2: Figma Auto-Layout & Design Tokens',
        lessons: [
          { id: 'ux_l2_1', title: '2.1 Mastering Auto-Layout & Responsive Constraints', duration: '25 mins', content: `Auto-Layout in Figma replicates CSS Flexbox behavior directly inside design frames.\n\n### Rules for Scalable Component Design:\n- Use **Fill Container** for responsive card bodies.\n- Use **Hug Contents** for buttons with dynamic text labels.\n- Set **Min and Max Widths** to prevent components from breaking on ultra-wide viewports.` },
          { id: 'ux_l2_2', title: '2.2 Design Tokens & 8pt Baseline Grid', duration: '20 mins', content: `Design tokens are atomic style definitions (colors, spacing, typography) that sync between Figma and CSS variables in code.` },
          { id: 'ux_l2_3', title: '2.3 Component Properties & Variant Sets', duration: '22 mins', content: `Construct flexible component variants with boolean toggles, text properties, and instance swapping.` },
          { id: 'ux_l2_4', title: '2.4 Typography Scales & Color Harmony Systems', duration: '18 mins', content: `Establish mathematical modular scales for headings, body text, and accessible WCAG contrast palettes.` },
          { id: 'ux_l2_5', title: '2.5 Iconography Systems & Vector Alignment', duration: '15 mins', content: `Design pixel-perfect 24px icon grids with consistent stroke weights and bounding box padding.` }
        ],
        quiz: {
          question: 'In Figma Auto-Layout, which property makes a child element expand to fill its parent width?',
          options: ['Hug contents', 'Fill container', 'Fixed width', 'Absolute position'],
          correctIndex: 1,
          explanation: 'Fill container causes child elements to stretch across the available width of the parent frame.'
        }
      },
      {
        level: 3,
        title: 'Level 3: Micro-Interactions & Interactive Prototyping',
        lessons: [
          { id: 'ux_l3_1', title: '3.1 Smart Animate & Component Variants', duration: '30 mins', content: `Smart Animate interpolates layer dimensions, positions, and opacities between component variant states.\n\n### Prototyping Best Practices:\n- Keep layer names identical across variant states.\n- Use cubic-bezier easing curves (0.4, 0.0, 0.2, 1) for natural fluid movement.` },
          { id: 'ux_l3_2', title: '3.2 Easing Curves & Motion Timings', duration: '20 mins', content: `Master enter, exit, and emphasis animation timings to create smooth UI feel.` },
          { id: 'ux_l3_3', title: '3.3 Overlays, Modals & Mobile Gesture Triggers', duration: '25 mins', content: `Prototype drag triggers, swipe actions, and modal overlay animations.` },
          { id: 'ux_l3_4', title: '3.4 Interactive Form Validation States', duration: '22 mins', content: `Build live input focus, error Shake animations, and success state micro-interactions.` },
          { id: 'ux_l3_5', title: '3.5 High-Fidelity Mobile App Prototype Testing', duration: '28 mins', content: `Mirror interactive prototypes to real mobile devices for remote usability testing.` }
        ],
        quiz: {
          question: 'What is required for Figma Smart Animate to smoothly morph between two frames?',
          options: ['Identical layer names and hierarchy', 'Same color on all layers', 'All layers must be grouped as vectors', 'Files must be exported to SVG'],
          correctIndex: 0,
          explanation: 'Smart Animate matches layers by exact name and nesting depth across states.'
        }
      },
      {
        level: 4,
        title: 'Level 4: Design Systems & Dev Handoff',
        lessons: [
          { id: 'ux_l4_1', title: '4.1 WCAG 2.1 AAA Accessibility Audits', duration: '30 mins', content: `Ensure all text and interactive UI elements meet WCAG color contrast standards.\n\n### Requirements:\n- Normal text requires a minimum contrast ratio of **4.5:1**.\n- Large text (18pt+) requires a minimum of **3:1**.\n- Form controls and icons require **3:1** against surrounding surfaces.` },
          { id: 'ux_l4_2', title: '4.2 Component Documentation & Code Specs', duration: '25 mins', content: `Document usage guidelines, component states, and token names for frontend engineers.` },
          { id: 'ux_l4_3', title: '4.3 Figma Dev Mode & Asset Export Optimization', duration: '20 mins', content: `Inspect CSS, Swift, and Android code snippets and export optimized SVG/PNG assets.` },
          { id: 'ux_l4_4', title: '4.4 Design System Governance & Version Control', duration: '24 mins', content: `Manage library updates, breaking changes, and component deprecation workflows.` },
          { id: 'ux_l4_5', title: '4.5 Final Capstone: Enterprise Design System Publishing', duration: '35 mins', content: `Package and publish a production-ready component library with full token documentation.` }
        ],
        quiz: {
          question: 'What is the minimum WCAG AA color contrast ratio required for standard body text?',
          options: ['2.5:1', '3:1', '4.5:1', '7:1'],
          correctIndex: 2,
          explanation: 'WCAG 2.1 Level AA mandates a minimum contrast ratio of 4.5:1 for normal body text.'
        }
      }
    ]
  },
  'react-dev': {
    id: 'react-dev',
    title: 'React Development',
    category: 'Development',
    instructor: 'David Chan',
    totalLessons: 20,
    modules: [
      {
        level: 1,
        title: 'Level 1: React 18 Core & Custom Hooks',
        lessons: [
          { id: 'react_l1_1', title: '1.1 React Fiber, Virtual DOM & State Immutability', duration: '25 mins', content: `React 18 Fiber reconciler enables concurrent rendering, prioritizing user interactions over background re-renders.` },
          { id: 'react_l1_2', title: '1.2 useMemo, useCallback & Performance Tuning', duration: '30 mins', content: `Optimize React components by caching computationally heavy logic and callback references.` },
          { id: 'react_l1_3', title: '1.3 Building Reusable Custom Hooks', duration: '22 mins', content: `Extract component logic into clean custom hooks like useFetch, useDebounce, and useLocalStorage.` },
          { id: 'react_l1_4', title: '1.4 Controlled Forms & Validation Patterns', duration: '20 mins', content: `Manage form state, input validation, and async submissions efficiently.` },
          { id: 'react_l1_5', title: '1.5 React 18 Concurrent Rendering & useTransition', duration: '28 mins', content: `Mark non-urgent state updates with useTransition to maintain 60fps input responsiveness.` }
        ],
        quiz: {
          question: 'What is the purpose of React 18 useTransition hook?',
          options: ['To animate CSS page transitions', 'To mark state updates as non-urgent/interruptible', 'To replace useEffect completely', 'To reload the browser page'],
          correctIndex: 1,
          explanation: 'useTransition marks state updates as transitions that can be interrupted by higher-priority urgent user inputs.'
        }
      },
      {
        level: 2,
        title: 'Level 2: State Management with Redux Toolkit',
        lessons: [
          { id: 'react_l2_1', title: '2.1 Redux Store & Slice Configuration', duration: '30 mins', content: `Configure global application state with Redux Toolkit createSlice and Immer.js.` },
          { id: 'react_l2_2', title: '2.2 Async Actions with createAsyncThunk', duration: '25 mins', content: `Handle pending, fulfilled, and rejected async API data fetching states.` },
          { id: 'react_l2_3', title: '2.3 RTK Query Automated Data Caching', duration: '32 mins', content: `Eliminate boilerplate data fetching code with RTK Query endpoints and tag invalidation.` },
          { id: 'react_l2_4', title: '2.4 Selector Memoization with Reselect', duration: '20 mins', content: `Derive computed state without triggering redundant component renders.` },
          { id: 'react_l2_5', title: '2.5 Redux Middleware & Persistence Layers', duration: '24 mins', content: `Log state transitions and persist session tokens securely across browser reloads.` }
        ],
        quiz: {
          question: 'How does Redux Toolkit allow direct state mutation syntax like state.count += 1?',
          options: ['It uses Immer library under the hood', 'It modifies global window', 'It disables immutability', 'It replaces JavaScript arrays'],
          correctIndex: 0,
          explanation: 'Redux Toolkit uses Immer to track mutations and safely generate a new immutable state draft.'
        }
      },
      {
        level: 3,
        title: 'Level 3: Next.js 14 App Router & Server Components',
        lessons: [
          { id: 'react_l3_1', title: '3.1 React Server Components (RSC) Architecture', duration: '35 mins', content: `Stream zero-bundle-size server components directly from Next.js server runtime.` },
          { id: 'react_l3_2', title: '3.2 Dynamic App Router & Nested Layouts', duration: '25 mins', content: `Build file-based routes, layout templates, and loading UI skeletons.` },
          { id: 'react_l3_3', title: '3.3 Server Actions & Form Mutations', duration: '30 mins', content: `Execute server-side database mutations directly from client forms without API route boilerplate.` },
          { id: 'react_l3_4', title: '3.4 Next.js Image & Font Optimization', duration: '20 mins', content: `Eliminate Cumulative Layout Shift (CLS) with automated webp conversion and local font hosting.` },
          { id: 'react_l3_5', title: '3.5 Route Handlers & REST API Endpoints', duration: '28 mins', content: `Create secure Edge API routes with Request and Response Web Standard objects.` }
        ],
        quiz: {
          question: 'Where do React Server Components in Next.js 14 execute?',
          options: ['Exclusively in the client browser', 'Exclusively on the server', 'Inside Web Workers', 'Inside service workers only'],
          correctIndex: 1,
          explanation: 'React Server Components execute strictly on the server and stream lightweight rendered results.'
        }
      },
      {
        level: 4,
        title: 'Level 4: Full-Stack Security, Testing & Production Deployment',
        lessons: [
          { id: 'react_l4_1', title: '4.1 Next.js Edge Middleware & Session Guards', duration: '30 mins', content: `Protect private routes and validate JWT authentication at the network edge.` },
          { id: 'react_l4_2', title: '4.2 Unit & Component Testing with React Testing Library', duration: '28 mins', content: `Write resilient tests verifying user behavior over internal implementation details.` },
          { id: 'react_l4_3', title: '4.3 End-to-End E2E Testing with Playwright', duration: '32 mins', content: `Automate full user flow testing across Chrome, Firefox, and Safari viewports.` },
          { id: 'react_l4_4', title: '4.4 Docker Multi-Stage Next.js Production Builds', duration: '25 mins', content: `Containerize Next.js applications into lightweight Alpine Docker images.` },
          { id: 'react_l4_5', title: '4.5 Final Capstone: Enterprise Web App Deployment', duration: '40 mins', content: `Deploy full-stack React app to Vercel/AWS with continuous Integration CI/CD pipelines.` }
        ],
        quiz: {
          question: 'Which metric measures unexpected visual displacement of elements during page load?',
          options: ['LCP', 'CLS', 'TTFB', 'FCP'],
          correctIndex: 1,
          explanation: 'CLS (Cumulative Layout Shift) measures visual stability during page loading.'
        }
      }
    ]
  },
  'python-data': {
    id: 'python-data',
    title: 'Python for Data Science & AI',
    category: 'Data Science',
    instructor: 'Dr. Michael Vance',
    totalLessons: 20,
    modules: [
      {
        level: 1,
        title: 'Level 1: NumPy Arrays & Vectorization',
        lessons: [
          { id: 'ds_l1_1', title: '1.1 NumPy N-Dimensional Arrays & Memory Layout', duration: '30 mins', content: `NumPy achieves 50x speedups over Python lists using contiguous C-arrays and SIMD vector instructions.` },
          { id: 'ds_l1_2', title: '1.2 Matrix Operations & Linear Algebra (np.dot)', duration: '25 mins', content: `Execute high-speed matrix multiplications, inversions, and matrix transpose transformations.` },
          { id: 'ds_l1_3', title: '1.3 Array Broadcasting & Reshaping Rules', duration: '22 mins', content: `Master NumPy broadcasting arithmetic across mismatched tensor dimensions.` },
          { id: 'ds_l1_4', title: '1.4 Boolean Masking & Fancy Indexing', duration: '20 mins', content: `Filter large dataset matrices conditionally without writing explicit loop statements.` },
          { id: 'ds_l1_5', title: '1.5 Random Sampling & Statistical Vector Math', duration: '24 mins', content: `Generate standard normal distributions, seed random samplers, and compute tensor standard deviations.` }
        ],
        quiz: {
          question: 'Why are NumPy vectorized operations significantly faster than Python for-loops?',
          options: ['They run inside cloud servers', 'They execute in compiled contiguous C memory with SIMD vectorization', 'They use GPU always', 'They compile to HTML'],
          correctIndex: 1,
          explanation: 'NumPy executes contiguous memory vector instructions via optimized C libraries.'
        }
      },
      {
        level: 2,
        title: 'Level 2: Data Wrangling & Analysis with Pandas',
        lessons: [
          { id: 'ds_l2_1', title: '2.1 Pandas DataFrames & Series Indexing', duration: '30 mins', content: `Master tabular data structures with loc, iloc, and column transformations.` },
          { id: 'ds_l2_2', title: '2.2 Cleaning Missing Data & Outlier Detection', duration: '25 mins', content: `Handle missing NaN values with dropna, fillna, and IQR outlier detection.` },
          { id: 'ds_l2_3', title: '2.3 GroupBy Aggregations & Pivot Tables', duration: '28 mins', content: `Summarize complex multi-dimensional data with groupby and agg transformations.` },
          { id: 'ds_l2_4', title: '2.4 Merging, Joining & Concatenating Datasets', duration: '22 mins', content: `Combine multiple relational data tables using inner, outer, left, and right joins.` },
          { id: 'ds_l2_5', title: '2.5 Exploratory Data Analysis (EDA) & Matplotlib', duration: '35 mins', content: `Visualize distributions, correlation heatmaps, and box plots with Seaborn and Matplotlib.` }
        ],
        quiz: {
          question: 'Which Pandas method is used for positional integer-based indexing?',
          options: ['df.loc[]', 'df.iloc[]', 'df.idx[]', 'df.find[]'],
          correctIndex: 1,
          explanation: 'df.iloc[] accesses rows and columns by positional integer index.'
        }
      },
      {
        level: 3,
        title: 'Level 3: Machine Learning with Scikit-Learn',
        lessons: [
          { id: 'ds_l3_1', title: '3.1 Supervised Learning: Linear & Logistic Regression', duration: '35 mins', content: `Build predictive regression models and binary classification boundaries.` },
          { id: 'ds_l3_2', title: '3.2 Decision Trees & Random Forest Ensembles', duration: '30 mins', content: `Train decision tree ensembles to capture non-linear feature relationships.` },
          { id: 'ds_l3_3', title: '3.3 Gradient Boosting (XGBoost & LightGBM)', duration: '32 mins', content: `Optimize tabular model performance with sequential boosting algorithms.` },
          { id: 'ds_l3_4', title: '3.4 Model Evaluation: Confusion Matrix & ROC-AUC', duration: '25 mins', content: `Evaluate classification precision, recall, F1-score, and ROC curve metrics.` },
          { id: 'ds_l3_5', title: '3.5 Feature Scaling & Cross-Validation Pipelines', duration: '28 mins', content: `Prevent data leakage using StandardScaler and K-Fold cross validation pipelines.` }
        ],
        quiz: {
          question: 'Which metric is best for evaluating imbalanced classification datasets?',
          options: ['Raw Accuracy', 'Precision, Recall and F1-Score', 'Mean Squared Error', 'R-Squared'],
          correctIndex: 1,
          explanation: 'F1-Score provides a balanced evaluation on imbalanced datasets.'
        }
      },
      {
        level: 4,
        title: 'Level 4: Deep Learning & Neural Network Deployment',
        lessons: [
          { id: 'ds_l4_1', title: '4.1 Neural Networks & Backpropagation Principles', duration: '35 mins', content: `Understand feedforward layers, activation functions (ReLU, Sigmoid), and gradient descent.` },
          { id: 'ds_l4_2', title: '4.2 Building Deep Models with PyTorch / TensorFlow', duration: '38 mins', content: `Define neural network layers, loss functions, and Adam optimizer training loops.` },
          { id: 'ds_l4_3', title: '4.3 Convolutional Neural Networks (CNN) for Computer Vision', duration: '30 mins', content: `Apply 2D convolutions, pooling layers, and transfer learning for image classification.` },
          { id: 'ds_l4_4', title: '4.4 Natural Language Processing (NLP) & Transformers', duration: '32 mins', content: `Tokenize text, generate embeddings, and utilize self-attention Transformer mechanisms.` },
          { id: 'ds_l4_5', title: '4.5 Final Capstone: FastAPI Model Inference API Deployment', duration: '40 mins', content: `Export trained machine learning models into high-performance FastAPI microservices.` }
        ],
        quiz: {
          question: 'What is the primary purpose of Dropout layers in neural networks?',
          options: ['To speed up hard drive reading', 'To randomly deactivate neurons and prevent overfitting', 'To increase memory', 'To invert matrices'],
          correctIndex: 1,
          explanation: 'Dropout deactivates random neurons during training to reduce overfitting.'
        }
      }
    ]
  },
  'content-strat': {
    id: 'content-strat',
    title: 'Content Strategy & Technical Writing',
    category: 'Design',
    instructor: 'Emily Watson',
    totalLessons: 20,
    modules: [
      {
        level: 1,
        title: 'Level 1: UX Writing & Information Hierarchy',
        lessons: [
          { id: 'cs_l1_1', title: '1.1 UX Microcopy & Clear Actionable Error Messages', duration: '20 mins', content: `UX writing guides users through interfaces with clarity and confidence.` },
          { id: 'cs_l1_2', title: '1.2 Voice & Tone Frameworks for Digital Products', duration: '22 mins', content: `Define brand personality guidelines across helpful, professional, and celebratory contexts.` },
          { id: 'cs_l1_3', title: '1.3 Onboarding Copy & Feature Discovery Tours', duration: '18 mins', content: `Craft concise tooltip copy that drives user feature adoption without cognitive overload.` },
          { id: 'cs_l1_4', title: '1.4 Empty States & Confirmation Dialog Copy', duration: '15 mins', content: `Turn empty dashboard states into actionable invitations for user engagement.` },
          { id: 'cs_l1_5', title: '1.5 Scannable Layouts & Heading Hierarchy', duration: '20 mins', content: `Structure digital text with scannable subheadings, bullet lists, and bold lead-ins.` }
        ],
        quiz: {
          question: 'Which of the following is best practice for user-facing error messages?',
          options: ['"Error 0x80040154"', '"Something went wrong"', '"Password must be at least 8 characters. Please enter a valid password."', '"Invalid input in column 4"'],
          correctIndex: 2,
          explanation: 'The best error message explains specifically what is missing and how to resolve it.'
        }
      },
      {
        level: 2,
        title: 'Level 2: Technical API Documentation & Specifications',
        lessons: [
          { id: 'cs_l2_1', title: '2.1 Writing Developer-First API Reference Guides', duration: '25 mins', content: `Great developer documentation provides interactive request/response payload examples.` },
          { id: 'cs_l2_2', title: '2.2 OpenAPI 3.0 (Swagger) Specification Schema', duration: '30 mins', content: `Define REST API parameters, authentication schemes, and responses in YAML/JSON.` },
          { id: 'cs_l2_3', title: '2.3 Code Sample Snippets in Python, JS & cURL', duration: '24 mins', content: `Format copy-pasteable code blocks with comprehensive parameter comments.` },
          { id: 'cs_l2_4', title: '2.4 Documenting Rate Limits, Authentication & Errors', duration: '22 mins', content: `Provide detailed troubleshooting tables for 401, 403, 429, and 500 HTTP status codes.` },
          { id: 'cs_l2_5', title: '2.5 SDK Quickstart Tutorials & Integration Guides', duration: '28 mins', content: `Guide developer users from zero setup to their first successful API request in under 5 minutes.` }
        ],
        quiz: {
          question: 'What standard format is widely used to document REST APIs in JSON/YAML?',
          options: ['OpenAPI (Swagger) Specification', 'HTML5 spec', 'PostCSS', 'Docker Compose'],
          correctIndex: 0,
          explanation: 'OpenAPI Specification is the machine-readable standard for REST API documentation.'
        }
      },
      {
        level: 3,
        title: 'Level 3: Design Systems & Content Governance',
        lessons: [
          { id: 'cs_l3_1', title: '3.1 Content Style Guides & Terminology Glossaries', duration: '24 mins', content: `Establish single-source-of-truth style guides for technical terms and mechanics.` },
          { id: 'cs_l3_2', title: '3.2 Accessibility in Content: Alt Text & Screen Readers', duration: '20 mins', content: `Write descriptive image alternative text and aria-label microcopy for screen readers.` },
          { id: 'cs_l3_3', title: '3.3 Inclusive Language & Universal Terminology', duration: '18 mins', content: `Eliminate biased terminology and adopt universally understandable language.` },
          { id: 'cs_l3_4', title: '3.4 Content Audits & Redundant Content Deprecation', duration: '25 mins', content: `Audit legacy documentation sites to prune out-of-date articles and broken links.` },
          { id: 'cs_l3_5', title: '3.5 Content Component Tokens in Figma', duration: '22 mins', content: `Store UI text strings as reusable content tokens inside design libraries.` }
        ],
        quiz: {
          question: 'Why is descriptive alt text essential for web images?',
          options: ['It increases image resolution', 'It allows screen readers to communicate image context to visually impaired users', 'It increases server speed', 'It changes font styles'],
          correctIndex: 1,
          explanation: 'Alt text communicates visual image content to users relying on assistive screen readers.'
        }
      },
      {
        level: 4,
        title: 'Level 4: Content Operations & Global Localization',
        lessons: [
          { id: 'cs_l4_1', title: '4.1 Localization (i18n) & International String Formats', duration: '30 mins', content: `Structure UI strings for multi-language translation and dynamic text expansion.` },
          { id: 'cs_l4_2', title: '4.2 SEO Content Strategy & Search Intent Optimization', duration: '28 mins', content: `Optimize technical documentation for organic search indexing without keyword stuffing.` },
          { id: 'cs_l4_3', title: '4.3 Content Analytics & Reading Dropoff Telemetry', duration: '25 mins', content: `Analyze user scroll depth and search analytics to identify documentation gaps.` },
          { id: 'cs_l4_4', title: '4.4 Automated Docs-as-Code Publishing Pipelines', duration: '26 mins', content: `Publish documentation automatically using Markdown, Git, and static site generators.` },
          { id: 'cs_l4_5', title: '4.5 Final Capstone: End-to-End Technical Documentation Launch', duration: '35 mins', content: `Publish a complete developer portal with quickstarts, API specs, and SDK tutorials.` }
        ],
        quiz: {
          question: 'What does i18n stand for in software globalization?',
          options: ['Interactive 18 Nodes', 'Internationalization', 'Internet 18 Network', 'Image 18 Neutral'],
          correctIndex: 1,
          explanation: 'i18n stands for Internationalization (18 letters between i and n).'
        }
      }
    ]
  }
};

// =========================================================================
// COMPREHENSIVE BASIC-TO-PRO 20-QUESTION ASSESSMENTS & AI ENGINE
// =========================================================================
const COURSE_BASIC_TO_PRO_TESTS = {
  'ui-ux': [
    // --- 5 BASIC QUESTIONS (Level 1: UX Research & Information Architecture) ---
    {
      id: 'uiux_b1',
      tier: 'Basic',
      level: 1,
      domain: 'UX Research & Empathy',
      question: 'Which quadrant of an Empathy Map captures the user\'s emotional state, unsaid fears, and unspoken anxieties?',
      options: ['Says', 'Thinks', 'Does', 'Feels'],
      correctIndex: 3,
      explanation: 'The "Feels" quadrant specifically captures emotional reactions, affective states, and subjective anxieties experienced during product interaction.'
    },
    {
      id: 'uiux_b2',
      tier: 'Basic',
      level: 1,
      domain: 'Information Architecture',
      question: 'What is the primary objective of Card Sorting methodologies during the UX discovery phase?',
      options: [
        'To test server database query speeds',
        'To discover how users instinctively categorize content and navigation mental models',
        'To pick accessible UI color schemes',
        'To write developer backend API schemas'
      ],
      correctIndex: 1,
      explanation: 'Card sorting helps designers understand mental models so website taxonomy and menu navigation feel intuitive.'
    },
    {
      id: 'uiux_b3',
      tier: 'Basic',
      level: 1,
      domain: 'User Discovery Interviews',
      question: 'When conducting qualitative user discovery interviews, what type of questioning technique avoids introducing designer bias?',
      options: [
        'Leading questions that confirm your initial hypothesis',
        'Open-ended exploratory questions that let users narrate their genuine past behaviors',
        'Binary Yes/No questions to save interview time',
        'Questions about exact pixel dimensions'
      ],
      correctIndex: 1,
      explanation: 'Open-ended questions (e.g., "Tell me about the last time you...") prevent designer confirmation bias and reveal true user behaviors.'
    },
    {
      id: 'uiux_b4',
      tier: 'Basic',
      level: 1,
      domain: 'User Personas',
      question: 'What is the primary purpose of creating evidence-based User Personas in digital product design?',
      options: [
        'To choose decorative avatar illustrations for pitch decks',
        'To synthesize user motivations, goals, pain points, and behavioral archetypes for empathetic decision-making',
        'To assign database access roles to employees',
        'To replace live user usability testing completely'
      ],
      correctIndex: 1,
      explanation: 'Personas ground the design team in realistic user needs and prevent self-referential design decisions.'
    },
    {
      id: 'uiux_b5',
      tier: 'Basic',
      level: 1,
      domain: 'Site Maps & Navigation',
      question: 'In Information Architecture, what is the core structural difference between a Site Map and a User Flow?',
      options: [
        'Site Maps show high-level structural hierarchy; User Flows map the sequential step-by-step decision path through a task',
        'Site Maps are only for mobile apps; User Flows are for desktop web only',
        'There is no difference between them; they are synonyms',
        'Site Maps are generated automatically by compilers'
      ],
      correctIndex: 0,
      explanation: 'Site maps illustrate content hierarchy, while user flows map directional user decision logic.'
    },

    // --- 5 INTERMEDIATE QUESTIONS (Level 2: Figma Auto-Layout & Design Tokens) ---
    {
      id: 'uiux_i1',
      tier: 'Intermediate',
      level: 2,
      domain: 'Auto-Layout & Flex Systems',
      question: 'In Figma Auto-Layout, which resizing constraint causes a nested child element to dynamically stretch and fill its parent container width?',
      options: ['Hug contents', 'Fill container', 'Fixed width', 'Absolute position'],
      correctIndex: 1,
      explanation: '"Fill container" causes child elements to expand responsively across the available bounding box of the parent frame.'
    },
    {
      id: 'uiux_i2',
      tier: 'Intermediate',
      level: 2,
      domain: 'Design Tokens & Grids',
      question: 'Why is an 8pt (or 4pt half-step) grid system standard practice across modern UI design systems?',
      options: [
        'Because 8 is lucky in graphic design',
        'It cleanly scales across 1x, 2x, 3x device pixel densities and creates mathematical visual rhythm',
        'Because older displays only supported 8 colors',
        'It eliminates the need for vector typography'
      ],
      correctIndex: 1,
      explanation: 'The 8pt grid aligns with common screen resolutions and pixel densities without creating blurry sub-pixel rendering.'
    },
    {
      id: 'uiux_i3',
      tier: 'Intermediate',
      level: 2,
      domain: 'Accessibility Standards',
      question: 'According to WCAG 2.1 Level AA guidelines, what is the minimum required color contrast ratio for standard body text?',
      options: ['2.5 : 1', '3.0 : 1', '4.5 : 1', '7.0 : 1'],
      correctIndex: 2,
      explanation: 'WCAG 2.1 AA mandates at least 4.5:1 for normal text (under 18pt) and 3:1 for large text or essential graphical UI components.'
    },
    {
      id: 'uiux_i4',
      tier: 'Intermediate',
      level: 2,
      domain: 'Component Properties',
      question: 'In Figma, which component property should you use to toggle an optional icon visibility on or off without creating separate variant layers?',
      options: ['Variant property', 'Boolean property', 'Text property', 'Instance swap property'],
      correctIndex: 1,
      explanation: 'Boolean properties allow designers to show or hide layers conditionally without exploding component variant matrix size.'
    },
    {
      id: 'uiux_i5',
      tier: 'Intermediate',
      level: 2,
      domain: 'Token Hierarchy',
      question: 'What is the primary benefit of defining atomic Design Tokens (colors, typography, spacing) in a design system?',
      options: [
        'It compresses Figma file sizes for web download',
        'It creates a single source of truth that synchronizes design variables directly with CSS variables and code tokens',
        'It locks design files so engineers cannot view them',
        'It automatically executes database migrations'
      ],
      correctIndex: 1,
      explanation: 'Design tokens act as the bridge between design tools and codebases, enabling rapid global theming and consistent UI scaling.'
    },

    // --- 5 ADVANCED QUESTIONS (Level 3: Micro-Interactions & Prototyping) ---
    {
      id: 'uiux_a1',
      tier: 'Advanced',
      level: 3,
      domain: 'Smart Animate & Motion',
      question: 'What fundamental rule must be satisfied for Figma Smart Animate to smoothly morph between two variant states without a crossfade?',
      options: [
        'Layers must have identical names and matching layer hierarchy across both frames',
        'Frames must be exported as SVG vector assets',
        'Both states must use identical background hex colors',
        'Layers must be flattened into a single boolean union'
      ],
      correctIndex: 0,
      explanation: 'Smart Animate tracks matching layer names and hierarchy depth to calculate spatial transitions and opacity changes.'
    },
    {
      id: 'uiux_a2',
      tier: 'Advanced',
      level: 3,
      domain: 'Micro-Interaction Timings',
      question: 'What is the recommended duration range for standard UI micro-interactions (e.g., hover states, drawer opens, modal entrances) to feel snappy yet smooth?',
      options: [
        '10ms – 50ms (instant cut)',
        '150ms – 300ms with ease-out timing curve',
        '800ms – 1200ms with ease-in',
        '3000ms – 5000ms cinematic dissolve'
      ],
      correctIndex: 1,
      explanation: 'UI transitions between 150ms–300ms feel responsive without causing cognitive delay or feeling abrupt to the user.'
    },
    {
      id: 'uiux_a3',
      tier: 'Advanced',
      level: 3,
      domain: 'Mobile Gesture Triggers',
      question: 'Which prototype trigger in Figma is used to simulate native bottom sheet pull-down dismissal or carousel card dragging?',
      options: ['While hovering', 'On drag', 'Key/gamepad', 'Mouse enter'],
      correctIndex: 1,
      explanation: '\'On drag\' triggers interactive transitions responsive to finger or mouse drag gestures with directional velocity.'
    },
    {
      id: 'uiux_a4',
      tier: 'Advanced',
      level: 3,
      domain: 'Interactive Form States',
      question: 'When prototyping an interactive input field, which UX micro-interaction pattern best communicates an inline validation error to the user?',
      options: [
        'Full page reload popup dialog',
        'Instant inline border color change, contextual helper text, and subtle horizontal error shake animation',
        'Disabling the entire browser window',
        'Playing a loud audio chime only'
      ],
      correctIndex: 1,
      explanation: 'Inline visual cues (border highlight, shake micro-animation, and clear error text) provide immediate clarity without disrupting user flow.'
    },
    {
      id: 'uiux_a5',
      tier: 'Advanced',
      level: 3,
      domain: 'Easing Physics Curves',
      question: 'Why are Ease-Out curves (cubic-bezier(0.0, 0.0, 0.2, 1)) preferred over Ease-In curves for UI entrance animations (modals, dropdowns)?',
      options: [
        'Ease-out starts fast and decelerates naturally, making UI feedback feel instantaneous to user touch',
        'Ease-out uses less GPU power in browsers',
        'Ease-in is deprecated in modern CSS3',
        'Ease-out makes colors appear brighter'
      ],
      correctIndex: 0,
      explanation: 'Decelerating (ease-out) animations respond instantly to user intent while settling gently into final position.'
    },

    // --- 5 PRO QUESTIONS (Level 4: Enterprise Design Systems & Usability Benchmarking) ---
    {
      id: 'uiux_p1',
      tier: 'Pro',
      level: 4,
      domain: 'Enterprise Design Systems',
      question: 'In enterprise design systems (Token Studio / CSS Variables), what is the architectural role of Semantic / Alias Tokens?',
      options: [
        'Global tokens are stored in Git; Semantic tokens are only in Figma',
        'Global tokens define raw primitive values (e.g. blue-600), while Semantic tokens assign contextual purpose (e.g. bg-action-primary)',
        'Global tokens are for typography; Semantic tokens are for spacing',
        'There is no difference; they are synonymous terms'
      ],
      correctIndex: 1,
      explanation: 'Semantic tokens create an abstraction layer over raw primitives, enabling multi-brand theming and seamless dark-mode toggling.'
    },
    {
      id: 'uiux_p2',
      tier: 'Pro',
      level: 4,
      domain: 'Usability Benchmarking (SUS)',
      question: 'In a formal usability evaluation, a System Usability Scale (SUS) score of 68 represents which industry benchmark?',
      options: [
        'Failing / Critical design flaws',
        'Average benchmark baseline (50th percentile / Grade C)',
        'Flawless top 1% enterprise perfection',
        'The test sample was statistically invalid'
      ],
      correctIndex: 1,
      explanation: 'A SUS score of 68 is the global average baseline (Grade C). Scores above 80 indicate exceptional user satisfaction and usability.'
    },
    {
      id: 'uiux_p3',
      tier: 'Pro',
      level: 4,
      domain: 'Jakob Nielsen Heuristics',
      question: 'Jakob Nielsen\'s heuristic "Visibility of System Status" is best demonstrated by which UI pattern?',
      options: [
        'Hidden navigation menus with no labels',
        'Real-time progress bars, loading spinners, active state badges, and upload percentage indicators',
        'Removing confirmation dialogs',
        'Using monochrome text only'
      ],
      correctIndex: 1,
      explanation: 'Visibility of System Status ensures users always know what stage of processing the application is currently performing.'
    },
    {
      id: 'uiux_p4',
      tier: 'Pro',
      level: 4,
      domain: 'Design System Governance',
      question: 'When updating an enterprise design system library, what constitutes a "Major / Breaking" semantic version bump (e.g. 2.0.0)?',
      options: [
        'Fixing a typo in a documentation comment',
        'Removing or renaming component props, altering core layout dimensions, or deleting token variables that break consumer layouts',
        'Adding a new optional color variant',
        'Re-exporting an existing SVG icon'
      ],
      correctIndex: 1,
      explanation: 'Breaking changes require engineering refactors in consumer repositories; SemVer Major versions alert teams to migration requirements.'
    },
    {
      id: 'uiux_p5',
      tier: 'Pro',
      level: 4,
      domain: 'Developer Handoff',
      question: 'In Figma Dev Mode handoff, which asset specification is critical to ensure SVG icons scale smoothly in responsive web and mobile code?',
      options: [
        'Exporting with fixed pixel widths and rasterizing to PNG',
        'Exporting with viewBox bounding box, vector fill/stroke currentColor inheritance, and removing hardcoded width/height attributes',
        'Exporting as PDF only',
        'Flattening all layers to JPEG'
      ],
      correctIndex: 1,
      explanation: 'Clean viewBox SVG definitions allow CSS currentColor property and responsive sizing to adapt seamlessly in frontend code.'
    }
  ],
  'react-dev': [
    // 5 Basic
    { id: 'react_b1', tier: 'Basic', level: 1, domain: 'React Core & JSX', question: 'What is the purpose of the key prop when rendering lists in React?', options: ['To style the list items in CSS', 'To help React Fiber identify which items have changed for efficient Virtual DOM diffing', 'To encrypt component props', 'To bind HTTP requests'], correctIndex: 1, explanation: 'Keys give elements a stable identity across renders, allowing React to minimize DOM mutations.' },
    { id: 'react_b2', tier: 'Basic', level: 1, domain: 'State Management', question: 'In React 18, why must state never be mutated directly (e.g. state.count = 5)?', options: ['It causes a syntax error', 'Direct mutations bypass React\'s setter scheduler, preventing component re-rendering', 'React state is read-only in memory', 'Direct mutation only works in TypeScript'], correctIndex: 1, explanation: 'Calling setter functions schedules batch re-renders based on shallow reference comparisons.' },
    { id: 'react_b3', tier: 'Basic', level: 1, domain: 'Hooks Lifecycle', question: 'What happens if you omit the dependency array in useEffect(callback)?', options: ['It runs only on initial mount', 'It runs after every single render of the component', 'It throws a runtime exception', 'It never executes'], correctIndex: 1, explanation: 'Without a dependency array, the effect executes after the initial render and after every update.' },
    { id: 'react_b4', tier: 'Basic', level: 1, domain: 'Props & Components', question: 'In React, what are props and how do they flow through the component tree?', options: ['Two-way mutable variables', 'One-way read-only data passed from parent to child components', 'Global database tables', 'Server-side cookies'], correctIndex: 1, explanation: 'React enforces unidirectional data flow where parent components pass immutable props downward.' },
    { id: 'react_b5', tier: 'Basic', level: 1, domain: 'Conditional Rendering', question: 'Which syntax in JSX renders a component conditionally when a boolean is true?', options: ['{condition && <Component />}', '{if (condition) <Component />}', '{<Component> if condition}', '{switch(condition) <Component>}'], correctIndex: 0, explanation: 'Inline logical && operator is standard JSX syntax for short-circuit conditional rendering.' },

    // 5 Intermediate
    { id: 'react_i1', tier: 'Intermediate', level: 2, domain: 'Performance Optimization', question: 'Which hook should you use to preserve a function reference between renders and avoid re-rendering memoized child components?', options: ['useMemo', 'useCallback', 'useRef', 'useTransition'], correctIndex: 1, explanation: 'useCallback returns a memoized version of the callback function that only changes when dependencies change.' },
    { id: 'react_i2', tier: 'Intermediate', level: 2, domain: 'Mutable Refs', question: 'What is the key advantage of useRef over useState for storing timer IDs or DOM node references?', options: ['useRef updates trigger automatic re-renders', 'Updating useRef.current does NOT trigger a component re-render', 'useRef works only in class components', 'useRef encrypts stored values'], correctIndex: 1, explanation: 'useRef persists values across renders without initiating a new render pass when the value changes.' },
    { id: 'react_i3', tier: 'Intermediate', level: 2, domain: 'Context API', question: 'What performance pitfall occurs when Context Provider value is passed an inline object literal without useMemo?', options: ['Context throws a TypeError', 'Every consumer component re-renders on every parent render because object reference identity changes', 'The context is reset to null', 'State becomes global and asynchronous'], correctIndex: 1, explanation: 'Inline object literals create new object instances on each render, forcing all consumers to re-render.' },
    { id: 'react_i4', tier: 'Intermediate', level: 2, domain: 'Redux Slices', question: 'How does Redux Toolkit enable safe "mutating" syntax in slice reducers?', options: ['By using raw pointer arithmetic', 'By leveraging Immer.js internally to produce immutable state drafts', 'By disabling shallow comparisons', 'By copying the entire RAM'], correctIndex: 1, explanation: 'Immer detects changes to a draft state and produces an immutable updated state tree.' },
    { id: 'react_i5', tier: 'Intermediate', level: 2, domain: 'Custom Hooks', question: 'What naming convention is required for React to recognize and enforce hook rules on custom hooks?', options: ['Must start with get', 'Must start with use in camelCase (e.g. useDebounce)', 'Must end with Hook', 'Must be uppercase'], correctIndex: 1, explanation: 'The "use" prefix allows ESLint and the React compiler to enforce the Rules of Hooks.' },

    // 5 Advanced
    { id: 'react_a1', tier: 'Advanced', level: 3, domain: 'Concurrent Features', question: 'What is the primary function of useTransition in React 18?', options: ['To animate CSS transitions with physics curves', 'To mark state updates as non-urgent transitions, keeping user input UI responsive during heavy renders', 'To handle page route transitions', 'To replace Redux Toolkit'], correctIndex: 1, explanation: 'useTransition marks state updates as non-blocking so high-priority events (typing, clicking) stay smooth.' },
    { id: 'react_a2', tier: 'Advanced', level: 3, domain: 'Custom Hook Architecture', question: 'When creating a custom hook like useDebounce, why is cleanup function inside useEffect critical?', options: ['To clear pending setTimeout timers when the value changes before timer completion', 'To delete browser cookies', 'To unmount the entire application', 'To reset Redux store'], correctIndex: 0, explanation: 'Clearing previous timeouts inside effect cleanup prevents stale function execution and memory leaks.' },
    { id: 'react_a3', tier: 'Advanced', level: 3, domain: 'Error Boundaries', question: 'How do React Error Boundaries catch JavaScript errors in child component trees?', options: ['Using try/catch in useEffect', 'Using static getDerivedStateFromError and componentDidCatch in class components', 'Using window.onerror only', 'Using console.error'], correctIndex: 1, explanation: 'Error boundaries catch render-phase errors in children and display fallback UI.' },
    { id: 'react_a4', tier: 'Advanced', level: 3, domain: 'Suspense & Code Splitting', question: 'What is the role of React.lazy() and <Suspense> in modern React architectures?', options: ['To compile TypeScript', 'To dynamically load component bundles on demand, reducing initial bundle size and showing fallback loaders', 'To write database queries', 'To encrypt API tokens'], correctIndex: 1, explanation: 'React.lazy dynamically imports components at runtime while Suspense coordinates the loading state.' },
    { id: 'react_a5', tier: 'Advanced', level: 3, domain: 'useId & Accessibility', question: 'Why was the useId hook introduced in React 18 for accessible form controls?', options: ['To generate unique stable IDs that synchronize seamlessly between SSR and client hydration', 'To generate random user passwords', 'To replace HTML label tags', 'To index database rows'], correctIndex: 0, explanation: 'useId guarantees matching unique IDs across server-rendered HTML and client hydration without hydration mismatch errors.' },

    // 5 Pro
    { id: 'react_p1', tier: 'Pro', level: 4, domain: 'Next.js & Server Components', question: 'In Next.js 14 App Router, what is the default rendering architecture for components inside the app/ directory?', options: ['Client-Side Rendered (CSR) with hydration only', 'React Server Components (RSC) rendered on the server with zero client JavaScript bundle overhead', 'Static HTML with no React runtime', 'WebAssembly modules'], correctIndex: 1, explanation: 'Components in Next.js App Router are React Server Components by default, executing exclusively on the server.' },
    { id: 'react_p2', tier: 'Pro', level: 4, domain: 'State Slicing & RTK Query', question: 'How does RTK Query automate data caching and cache invalidation?', options: ['Using manual setInterval polling', 'Using declarative "tagTypes" and "providesTags" / "invalidatesTags" subscriptions', 'By writing data to localStorage exclusively', 'By disabling HTTP 304 headers'], correctIndex: 1, explanation: 'RTK Query uses automated tag-based cache management to invalidate and refetch data seamlessly when mutations occur.' },
    { id: 'react_p3', tier: 'Pro', level: 4, domain: 'Server Actions', question: 'What is a Next.js Server Action and how is it defined in code?', options: ['An external Express server endpoint', 'An async server function declared with the "use server" directive that can be invoked directly from client or server forms', 'A Docker container script', 'A service worker background thread'], correctIndex: 1, explanation: 'Server Actions allow seamless type-safe server mutations without writing manual boilerplate API routes.' },
    { id: 'react_p4', tier: 'Pro', level: 4, domain: 'Micro-Frontends & Module Federation', question: 'In enterprise React architecture, what is Webpack Module Federation used for?', options: ['To bundle CSS only', 'To share and dynamically load remote React components and dependencies across independently deployed frontend applications at runtime', 'To replace Git', 'To minfy images'], correctIndex: 1, explanation: 'Module Federation enables decoupled micro-frontend architectures with shared vendor singletons.' },
    { id: 'react_p5', tier: 'Pro', level: 4, domain: 'Hydration Optimization & Streaming', question: 'How does React 18 HTML streaming with Suspense improve First Contentful Paint (FCP) and Time to Interactive (TTI)?', options: ['It stops JavaScript execution', 'It streams early HTML shells from the server while async data chunks load progressively without blocking the whole page', 'It removes React Fiber', 'It caches all HTML in DNS'], correctIndex: 1, explanation: 'Streaming SSR allows browsers to render initial markup instantly while heavy components stream and hydrate progressively.' }
  ],
  'python-data': [
    // 5 Basic
    { id: 'py_b1', tier: 'Basic', level: 1, domain: 'Pandas & NumPy', question: 'In Pandas, which method is used to inspect summary statistics (mean, std, min, max, quartiles) of numerical DataFrame columns?', options: ['df.info()', 'df.describe()', 'df.summary()', 'df.head()'], correctIndex: 1, explanation: 'df.describe() outputs descriptive statistics summarizing distribution shapes.' },
    { id: 'py_b2', tier: 'Basic', level: 1, domain: 'Data Structures', question: 'Which NumPy data structure enables vectorized multidimensional array computations in C-speed?', options: ['numpy.list', 'numpy.ndarray', 'numpy.vector', 'numpy.matrix3D'], correctIndex: 1, explanation: 'numpy.ndarray stores contiguous homogeneous memory buffers for ultra-fast vectorized math.' },
    { id: 'py_b3', tier: 'Basic', level: 1, domain: 'Missing Values', question: 'Which method fills NaN / null values in a Pandas DataFrame with a specified replacement value?', options: ['df.dropna()', 'df.fillna(value)', 'df.replaceNull()', 'df.clean()'], correctIndex: 1, explanation: 'df.fillna() fills NA/NaN values using the specified method or constant value.' },
    { id: 'py_b4', tier: 'Basic', level: 1, domain: 'Filtering', question: 'In Pandas, how do you filter rows where column "age" is greater than 25?', options: ['df.filter(age > 25)', 'df[df["age"] > 25]', 'df.where("age > 25")', 'df.select("age > 25")'], correctIndex: 1, explanation: 'Boolean indexing df[df["column"] > value] is standard Pandas filtering syntax.' },
    { id: 'py_b5', tier: 'Basic', level: 1, domain: 'Plotting', question: 'Which Matplotlib function is called to display the rendered figure on screen?', options: ['plt.render()', 'plt.show()', 'plt.display()', 'plt.draw()'], correctIndex: 1, explanation: 'plt.show() opens the visualization window and renders the active figure.' },

    // 5 Intermediate
    { id: 'py_i1', tier: 'Intermediate', level: 2, domain: 'Feature Engineering', question: 'When preparing categorical variables with no inherent order for Machine Learning models, which encoding technique is appropriate?', options: ['Label Encoding', 'One-Hot Encoding', 'Ordinal Encoding', 'Min-Max Normalization'], correctIndex: 1, explanation: 'One-Hot Encoding creates binary indicator columns without implying false ordinal relationships.' },
    { id: 'py_i2', tier: 'Intermediate', level: 2, domain: 'Data Leakage', question: 'Why must feature scaling (StandardScaler) be fitted ONLY on training data, then transformed on test data?', options: ['To speed up CPU runtime', 'To prevent data leakage from the test set into the model training pipeline', 'Because test data has no mean or variance', 'Scikit-learn errors if you fit on test data'], correctIndex: 1, explanation: 'Fitting scalers on test data leaks future statistical parameters into training distributions.' },
    { id: 'py_i3', tier: 'Intermediate', level: 2, domain: 'Evaluation Metrics', question: 'In an imbalanced dataset (e.g. 99% non-fraud, 1% fraud), why is raw Accuracy a misleading performance metric?', options: ['Accuracy cannot be calculated on binary labels', 'A naive model predicting "non-fraud" for all samples gets 99% accuracy while catching 0 fraud (use Precision/Recall/F1 instead)', 'Accuracy is only for regression models', 'Accuracy only works in NumPy'], correctIndex: 1, explanation: 'Accuracy is heavily skewed by majority class dominance in imbalanced datasets.' },
    { id: 'py_i4', tier: 'Intermediate', level: 2, domain: 'Correlation', question: 'Which correlation coefficient measures monotonic relationships between two ranked variables?', options: ['Pearson correlation', 'Spearman rank correlation', 'Cosine similarity', 'Euclidean distance'], correctIndex: 1, explanation: 'Spearman correlation evaluates monotonic relationships using ranked values without assuming linearity.' },
    { id: 'py_i5', tier: 'Intermediate', level: 2, domain: 'Train Test Split', question: 'In Scikit-learn train_test_split, what does the "stratify" parameter accomplish?', options: ['It sorts the rows by index', 'It ensures target class proportion is identical in both train and test splits', 'It removes outlier rows', 'It normalizes column values'], correctIndex: 1, explanation: 'Stratification preserves target label proportions across training and test subsets.' },

    // 5 Advanced
    { id: 'py_a1', tier: 'Advanced', level: 3, domain: 'Model Regularization', question: 'What is the defining mathematical property of L1 Regularization (Lasso) compared to L2 (Ridge)?', options: ['L1 penalizes sum of squared weights', 'L1 adds the sum of absolute coefficients to loss, driving less informative feature weights strictly to zero (feature selection)', 'L1 prevents all overfitting in neural nets', 'L1 cannot be used with gradient descent'], correctIndex: 1, explanation: 'Lasso (L1) creates sparse models by forcing coefficients of redundant features to exactly zero.' },
    { id: 'py_a2', tier: 'Advanced', level: 3, domain: 'Cross Validation', question: 'When evaluating models on imbalanced classification tasks, which cross-validation split strategy is recommended?', options: ['KFold', 'StratifiedKFold', 'ShuffleSplit', 'TimeSeriesSplit'], correctIndex: 1, explanation: 'StratifiedKFold ensures each cross-validation fold preserves the target class distribution.' },
    { id: 'py_a3', tier: 'Advanced', level: 3, domain: 'Random Forest Architecture', question: 'What two randomization mechanisms reduce variance in Random Forest ensembles?', options: ['Random initialization and random stop', 'Bootstrap sampling (Bagging) and random feature subset selection at each tree split', 'Random learning rates and random epochs', 'Random activation functions'], correctIndex: 1, explanation: 'Bootstrapping data and random feature subspace sampling decorrelate the individual trees.' },
    { id: 'py_a4', tier: 'Advanced', level: 3, domain: 'ROC-AUC Metrics', question: 'What does the Area Under the Receiver Operating Characteristic (ROC-AUC) curve evaluate?', options: ['Training loss over epochs', 'The model\'s capability to discriminate positive and negative classes across all classification thresholds (True Positive vs False Positive rate)', 'GPU memory utilization', 'Data normalization percentage'], correctIndex: 1, explanation: 'ROC-AUC assesses ranking quality across all decision threshold cutoffs.' },
    { id: 'py_a5', tier: 'Advanced', level: 3, domain: 'Hyperparameter Tuning', question: 'Why is Optuna / Bayesian Optimization more efficient than exhaustive GridSearchCV for large hyperparameter spaces?', options: ['It uses brute force on every permutation', 'It models the objective function probabilistically (Tree-structured Parzen Estimator) to sample promising hyperparameter regions', 'It only tests integer parameters', 'It skips model training'], correctIndex: 1, explanation: 'Bayesian optimization uses past evaluation results to intelligently navigate the search space.' },

    // 5 Pro
    { id: 'py_p1', tier: 'Pro', level: 4, domain: 'Ensemble Learning', question: 'How do Gradient Boosted Trees (XGBoost / LightGBM) construct sequential decision trees compared to Random Forests?', options: ['They train all trees independently in parallel', 'Each successive tree is trained to predict the pseudo-residuals (gradient errors) of the previous ensemble combination', 'They only use linear activation functions', 'They do not use decision trees'], correctIndex: 1, explanation: 'Gradient boosting builds trees sequentially, where each new tree corrects residual errors made by the previous ensemble.' },
    { id: 'py_p2', tier: 'Pro', level: 4, domain: 'Deep Learning & Neural Architectures', question: 'What is the vanishing gradient problem in deep neural networks, and how do ReLU activations / Residual connections mitigate it?', options: ['Gradients grow infinitely large', 'Backpropagated gradients through saturating sigmoids approach zero; ReLU provides constant gradient 1 for positive inputs and ResNets provide direct identity skip-paths', 'Gradients become negative numbers', 'Loss function returns NaN'], correctIndex: 1, explanation: 'ReLU and residual skip-connections maintain stable gradient flow across deep network depths.' },
    { id: 'py_p3', tier: 'Pro', level: 4, domain: 'Transformer Attention', question: 'What is the mathematical purpose of Scaled Dot-Product Attention in Transformer architectures?', options: ['To sort vocabulary alphabetically', 'To compute pairwise contextual compatibility weights between Query (Q) and Key (K) vectors and weight the Value (V) representations: softmax(QK^T / sqrt(d_k)) * V', 'To compress image files', 'To perform gradient descent'], correctIndex: 1, explanation: 'Self-attention calculates dynamic contextual relevance between every token pair in the sequence.' },
    { id: 'py_p4', tier: 'Pro', level: 4, domain: 'Model Explainability (SHAP)', question: 'In production Machine Learning, what do SHAP (SHapley Additive exPlanations) values provide?', options: ['Training speed metrics', 'Game-theoretic optimal feature attributions quantifying each feature\'s marginal contribution to individual predictions', 'Data storage compression', 'Model encryption keys'], correctIndex: 1, explanation: 'SHAP calculates Shapley values from cooperative game theory for local and global model explainability.' },
    { id: 'py_p5', tier: 'Pro', level: 4, domain: 'MLOps & Model Drift', question: 'What is Concept Drift in production ML systems and how is it detected?', options: ['Software bugs in Python code', 'Statistical changes in the relationship between input features and target labels over time P(Y|X), detected via population stability index (PSI) and live metric tracking', 'Hard drive storage degradation', 'Memory leaks in Docker'], correctIndex: 1, explanation: 'Concept drift occurs when real-world patterns change, requiring automated retraining pipelines.' }
  ],
  'content-strat': [
    // 5 Basic
    { id: 'cs_b1', tier: 'Basic', level: 1, domain: 'Content Architecture', question: 'What is the primary role of a Technical Style Guide (e.g., Microsoft Writing Style Guide, Google Dev Docs Guide)?', options: ['To select website fonts', 'To enforce consistent voice, terminology, tone, capitalization, and formatting standards across documentation', 'To compile code repositories', 'To track user billing'], correctIndex: 1, explanation: 'Style guides ensure brand voice consistency and readability across multi-author content.' },
    { id: 'cs_b2', tier: 'Basic', level: 1, domain: 'User Intent', question: 'In Docs-as-Code content strategy, what is the key distinction between a Tutorial and an API Reference?', options: ['Tutorials are written in HTML; References are in PDF', 'Tutorials are learning-oriented step-by-step journeys for beginners; References are information-oriented precise technical specifications for practitioners', 'There is no difference', 'References only contain images'], correctIndex: 1, explanation: 'Tutorials guide users through completing a project, while reference docs provide complete parameters and schemas.' },
    { id: 'cs_b3', tier: 'Basic', level: 1, domain: 'Readability', question: 'Which readability metric is standard for measuring the reading grade level of enterprise user guides?', options: ['Flesch-Kincaid Grade Level', 'SHA-256 Hash', 'CSS Specificity Index', 'SQL Explain Score'], correctIndex: 0, explanation: 'Flesch-Kincaid measures sentence length and syllable density to target 7th-9th grade reading clarity.' },
    { id: 'cs_b4', tier: 'Basic', level: 1, domain: 'Heading Hierarchy', question: 'Why should technical articles maintain strict sequential heading hierarchy (H1 -> H2 -> H3)?', options: ['To make fonts colourful', 'To create a clear mental model and enable assistive screen readers to navigate section outlines properly', 'To speed up network downloads', 'To reduce word counts'], correctIndex: 1, explanation: 'Semantic heading hierarchy improves both human comprehension and accessibility navigation.' },
    { id: 'cs_b5', tier: 'Basic', level: 1, domain: 'Tone & Voice', question: 'Which voice and tone guideline is recommended for technical troubleshooting documentation?', options: ['Poetic, playful, and conversational', 'Direct, empathetic, active voice, and concise step-by-step instructions', 'Passive, bureaucratic, and academic', 'Aggressive and sales-oriented'], correctIndex: 1, explanation: 'Users facing technical issues need calm, concise, active-voice instructions to resolve blockers quickly.' },

    // 5 Intermediate
    { id: 'cs_i1', tier: 'Intermediate', level: 2, domain: 'Information Chunking', question: 'Why is visual information chunking (headings, bullet points, callout boxes) critical for digital product documentation?', options: ['Search engines penalize long paragraphs', 'Users scan digital content in F-patterns rather than reading word-for-word; chunking enhances scanability and reduces cognitive load', 'Browsers crash on large text blocks', 'Chunking makes fonts larger'], correctIndex: 1, explanation: 'Chunking structures content for fast hierarchical scanning.' },
    { id: 'cs_i2', tier: 'Intermediate', level: 2, domain: 'Taxonomy', question: 'What is Controlled Vocabulary in documentation metadata and faceted search?', options: ['A list of banned words', 'A carefully curated, standardized set of tags and category terms to prevent indexing fragmentation', 'Encrypted database records', 'Translated words only'], correctIndex: 1, explanation: 'Controlled vocabularies eliminate duplicate synonyms (e.g. "auth" vs "login" vs "sign-in") in search indexes.' },
    { id: 'cs_i3', tier: 'Intermediate', level: 2, domain: 'SEO & Search Intent', question: 'When writing developer documentation, what does "Search Intent Optimization" focus on?', options: ['Stuffing keywords 50 times in each article', 'Aligning document titles and introductory code snippets with the exact error message or query developers search for on Google', 'Purchasing search ads', 'Hiding text in background colors'], correctIndex: 1, explanation: 'Developers search with high task-intent. Matching headings to intent boosts organic rank.' },
    { id: 'cs_i4', tier: 'Intermediate', level: 2, domain: 'Callout Components', question: 'When should a Caution or Warning callout box be used in technical procedures?', options: ['For decorative styling on every step', 'Exclusively when an action could cause data loss, security vulnerabilities, or destructive system states', 'To display author bios', 'To link social media channels'], correctIndex: 1, explanation: 'Overusing alerts causes banner blindness. Restrict Warnings to destructive or critical safety items.' },
    { id: 'cs_i5', tier: 'Intermediate', level: 2, domain: 'Code Snippet UX', question: 'What UX feature is essential for code blocks in developer documentation portals?', options: ['Auto-playing background music', 'One-click "Copy to Clipboard" button, syntax highlighting, and clear language identifiers', 'Disabling text selection', 'Watermarking code snippets'], correctIndex: 1, explanation: 'One-click copy and syntax highlighting make developer onboarding smooth and error-free.' },

    // 5 Advanced
    { id: 'cs_a1', tier: 'Advanced', level: 3, domain: 'Docs-as-Code Pipelines', question: 'In a modern Docs-as-Code continuous publishing workflow, which tool is commonly used to lint prose for style violations in CI/CD?', options: ['Vale', 'Babel', 'Webpack', 'PostCSS'], correctIndex: 0, explanation: 'Vale is an extensible command-line prose linter that tests Markdown files against custom editorial rules in CI/CD.' },
    { id: 'cs_a2', tier: 'Advanced', level: 3, domain: 'OpenAPI / Swagger Specs', question: 'What is the major architectural benefit of generating API documentation directly from OpenAPI (OAS 3.0) YAML specs?', options: ['It eliminates manual doc duplication and guarantees documentation stays 100% synchronized with live backend endpoints', 'It compiles Python to JavaScript', 'It replaces database schemas', 'It generates automatic video courses'], correctIndex: 0, explanation: 'Single-source OpenAPI schemas generate interactive documentation, client SDKs, and mock servers simultaneously.' },
    { id: 'cs_a3', tier: 'Advanced', level: 3, domain: 'Content Versioning', question: 'How should enterprise developer portals manage API documentation across multiple software releases (e.g. v1, v2, v3)?', options: ['Overwriting previous documentation immediately', 'Using a versioned documentation selector with persistent URLs and clear deprecation notices on legacy versions', 'Deleting old release notes', 'Sending PDFs via email'], correctIndex: 1, explanation: 'Version selectors allow developers on older SDK releases to access accurate documentation.' },
    { id: 'cs_a4', tier: 'Advanced', level: 3, domain: 'Information Reuse', question: 'In modular docs-as-code, what is Content Transclusion / Snippet Re-use?', options: ['Copy-pasting paragraphs across 50 files', 'Including a single reusable Markdown snippet (e.g. prerequisites, install steps) across multiple articles via imports', 'Translating text with AI', 'Compressing images'], correctIndex: 1, explanation: 'Transclusion ensures updates to shared components propagate across all consumer documents instantly.' },
    { id: 'cs_a5', tier: 'Advanced', level: 3, domain: 'Static Site Generators', question: 'Which static documentation site generators (SSGs) are industry standard for Docs-as-Code portals?', options: ['Docusaurus, VitePress, Nextra, MkDocs', 'Wordpress, Joomla, Drupal', 'Microsoft Excel', 'Photoshop'], correctIndex: 0, explanation: 'Modern Markdown/MDX static generators provide ultra-fast loading, search indexing, and Git-based collaboration.' },

    // 5 Pro
    { id: 'cs_p1', tier: 'Pro', level: 4, domain: 'Global Localization (i18n)', question: 'When architecting content for global localization, what is "Text Expansion" and how should UI content accommodate it?', options: ['Increasing font sizes in CSS', 'Translated languages (e.g., German, French) frequently take 20%–40% more characters than English; strings must avoid hardcoded pixel width limits', 'Translating code variable names', 'Exporting text as PNG images'], correctIndex: 1, explanation: 'German and Spanish translations require significantly longer character counts. Flexible UI containers prevent truncated text.' },
    { id: 'cs_p2', tier: 'Pro', level: 4, domain: 'Content Telemetry & Governance', question: 'Which content telemetry metric best indicates that a technical troubleshooting article successfully resolved user issues?', options: ['High bounce rate combined with negative survey votes', 'High "Was this helpful? -> Yes" ratio, high code snippet copy-to-clipboard rate, and zero subsequent support ticket filings', 'Page load time in milliseconds', 'Number of comments on the blog'], correctIndex: 1, explanation: 'Copy-to-clipboard clicks paired with low escalation ticket rates confirm the documentation immediately unblocked the developer.' },
    { id: 'cs_p3', tier: 'Pro', level: 4, domain: 'Content Auditing & Deprecation', question: 'What governance process ensures outdated API documentation is archived safely without creating 404 broken links?', options: ['Immediate file deletion from Git', 'Setting up HTTP 301 permanent redirects to current equivalent pages and adding deprecation warning banners', 'Blocking search engine bots', 'Hiding the search bar'], correctIndex: 1, explanation: '301 redirects preserve SEO rank and prevent broken external links across developer blogs and stack overflow answers.' },
    { id: 'cs_p4', tier: 'Pro', level: 4, domain: 'Content KPIs & Business Impact', question: 'How is Content Strategy ROI typically measured in product and engineering organizations?', options: ['Total number of words written per month', 'Reduction in customer support ticket deflection costs, faster Time-to-First-Hello-World for developers, and accelerated API adoption', 'Number of commas used', 'Time spent writing docs'], correctIndex: 1, explanation: 'Support ticket deflection and rapid developer activation directly correlate to engineering productivity and revenue.' },
    { id: 'cs_p5', tier: 'Pro', level: 4, domain: 'Enterprise Taxonomy Governance', question: 'In enterprise knowledge management, how do automated semantic search vector embeddings (RAG) enhance documentation retrieval?', options: ['They convert all text to binary', 'They map queries and documents into dense high-dimensional semantic spaces, returning relevant answers even when the user searches with different synonyms', 'They replace all documentation writers', 'They disable keyword search'], correctIndex: 1, explanation: 'Vector embeddings enable semantic similarity search that matches conceptual intent beyond exact keyword strings.' }
  ]
};

// AI Recommendation Generator (Calculates Level Clearing & Adaptive Session Start)
const generateAiCourseRecommendation = (courseKey, score, userAnswers, questionsList, courseObj) => {
  const totalQuestions = questionsList.length;
  const correctCount = questionsList.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  // Group by tier
  const tierStats = {
    Basic: { total: 0, correct: 0 },
    Intermediate: { total: 0, correct: 0 },
    Advanced: { total: 0, correct: 0 },
    Pro: { total: 0, correct: 0 }
  };

  // Group by domain
  const domainStats = {};

  questionsList.forEach((q) => {
    const isCorrect = userAnswers[q.id] === q.correctIndex;
    if (tierStats[q.tier]) {
      tierStats[q.tier].total += 1;
      if (isCorrect) tierStats[q.tier].correct += 1;
    }

    if (!domainStats[q.domain]) {
      domainStats[q.domain] = { total: 0, correct: 0 };
    }
    domainStats[q.domain].total += 1;
    if (isCorrect) domainStats[q.domain].correct += 1;
  });

  // Calculate Level Clearing Logic
  const basicCorrect = tierStats.Basic.correct;
  const basicTotal = tierStats.Basic.total || 5;
  const basicPercentage = Math.round((basicCorrect / basicTotal) * 100);
  const basicCleared = basicCorrect >= Math.ceil(basicTotal * 0.6); // >= 60% (e.g. 3 of 5)

  const interCorrect = tierStats.Intermediate.correct;
  const interTotal = tierStats.Intermediate.total || 5;
  const interPercentage = Math.round((interCorrect / interTotal) * 100);
  const intermediateCleared = basicCleared && (interCorrect >= Math.ceil(interTotal * 0.6));

  const advCorrect = tierStats.Advanced.correct;
  const advTotal = tierStats.Advanced.total || 5;
  const advPercentage = Math.round((advCorrect / advTotal) * 100);
  const advancedCleared = intermediateCleared && (advCorrect >= Math.ceil(advTotal * 0.6));

  const proCorrect = tierStats.Pro.correct;
  const proTotal = tierStats.Pro.total || 5;
  const proPercentage = Math.round((proCorrect / proTotal) * 100);
  const proCleared = advancedCleared && (proCorrect >= Math.ceil(proTotal * 0.8));

  const domainBreakdown = Object.entries(domainStats).map(([domain, data]) => ({
    domain,
    total: data.total,
    correct: data.correct,
    percentage: Math.round((data.correct / data.total) * 100)
  }));

  const strongestDomains = domainBreakdown.filter(d => d.percentage >= 75).map(d => d.domain);
  const focusDomains = domainBreakdown.filter(d => d.percentage < 75).map(d => d.domain);

  const courseTitle = courseObj.title || 'Course';
  const mod1 = courseObj.modules[0];
  const mod2 = courseObj.modules[1];
  const mod3 = courseObj.modules[2];
  const mod4 = courseObj.modules[3];

  // Determine Mastery Tier & AI Roadmap
  let masteryTier = 'Basic Explorer';
  let tierColor = '#16a34a';
  let badgeTitle = '🌱 Basic Foundations Explorer';
  let summary = '';
  let fastTrackEligible = false;
  let fastTrackLessonIds = [];
  let fastTrackCompletedLevels = [];
  let recommendedStartLevel = 1;
  let sessionStartHeadline = '';
  let sessionStartReason = '';
  let recommendedLessons = [];
  let aiTips = [];

  if (proCleared || score >= 85) {
    masteryTier = 'Pro Master';
    tierColor = '#7c3aed';
    badgeTitle = '🏆 Pro Master Tier';
    summary = `Exceptional mastery across all 20 questions in ${courseTitle}! You cleared Basic, Intermediate, and Advanced topics with deep architectural insight.`;
    fastTrackEligible = true;
    recommendedStartLevel = 4;
    fastTrackCompletedLevels = [1, 2, 3];
    sessionStartHeadline = `🏆 Levels 1, 2 & 3 Cleared — Session Starts at Level 4 (${mod4?.title || 'Capstone'})`;
    sessionStartReason = `All foundational, intermediate, and advanced lessons across Levels 1, 2, and 3 are marked as Completed. You start directly from Level 4!`;

    // Auto complete Levels 1, 2, 3 lessons & quizzes
    [mod1, mod2, mod3].forEach((m, idx) => {
      if (m?.lessons) m.lessons.forEach(l => fastTrackLessonIds.push(l.id));
      fastTrackLessonIds.push(`quiz_m_${idx + 1}`);
    });

    recommendedLessons = mod4?.lessons || [];
    aiTips = [
      `Levels 1, 2, and 3 are 100% cleared and marked completed.`,
      `Begin immediately with ${mod4?.title || 'Level 4'}.`,
      `Finalize your verified capstone project to earn your verified credential!`
    ];
  } else if (advancedCleared || score >= 70) {
    masteryTier = 'Advanced Specialist';
    tierColor = '#2563eb';
    badgeTitle = '🚀 Advanced Practitioner Tier';
    summary = `Strong performance in ${courseTitle}! You cleared Basic and Intermediate tiers with high confidence.`;
    fastTrackEligible = true;
    recommendedStartLevel = 3;
    fastTrackCompletedLevels = [1, 2];
    sessionStartHeadline = `🚀 Levels 1 & 2 Cleared — Session Starts at Level 3 (${mod3?.title || 'Advanced'})`;
    sessionStartReason = `You demonstrated solid mastery of foundational and intermediate concepts. Levels 1 & 2 are marked as Completed, and your live session starts from Level 3!`;

    // Auto complete Levels 1 & 2 lessons & quizzes
    [mod1, mod2].forEach((m, idx) => {
      if (m?.lessons) m.lessons.forEach(l => fastTrackLessonIds.push(l.id));
      fastTrackLessonIds.push(`quiz_m_${idx + 1}`);
    });

    recommendedLessons = [
      ...(mod3?.lessons || []),
      ...(mod4?.lessons || [])
    ];
    aiTips = [
      `Levels 1 & 2 foundations completed and fast-tracked.`,
      `Start your interactive session at Level 3 (${mod3?.title || 'Level 3'}).`,
      `Focus areas: ${focusDomains.length > 0 ? focusDomains.join(', ') : 'Advanced architectural patterns'}.`
    ];
  } else if (basicCleared || score >= 45) {
    masteryTier = 'Intermediate Specialist';
    tierColor = '#d97706';
    badgeTitle = '⚡ Basic Cleared • Intermediate Level';
    summary = `Great job! You solved ${basicCorrect}/${basicTotal} (${basicPercentage}%) of the Basic Level 1 MCQ test. Level 1 is cleared and your course is ready to start from Level 2!`;
    fastTrackEligible = true;
    recommendedStartLevel = 2;
    fastTrackCompletedLevels = [1];
    sessionStartHeadline = `✨ Level 1 Cleared — Session Starts at Level 2 (${mod2?.title || 'Level 2'})`;
    sessionStartReason = `Congratulations on passing the Level 1 MCQ assessment! Our AI has marked all Level 1 lessons as Completed so you start learning directly from Level 2 (${mod2?.title || 'State Management'}).`;

    // Auto complete Level 1 lessons & quiz
    if (mod1?.lessons) mod1.lessons.forEach(l => fastTrackLessonIds.push(l.id));
    fastTrackLessonIds.push('quiz_m_1');

    recommendedLessons = [
      ...(mod2?.lessons || []),
      ...(mod3?.lessons || []),
      ...(mod4?.lessons || [])
    ];
    aiTips = [
      `Level 1 (${mod1?.title || 'Core Foundations'}) is marked 100% completed with verified checkmarks.`,
      `Start your learning directly at Level 2 (${mod2?.title || 'Level 2'}).`,
      `Review key concepts in ${focusDomains.length > 0 ? focusDomains.join(', ') : 'component state and custom hooks'}.`
    ];
  } else {
    masteryTier = 'Basic Explorer';
    tierColor = '#059669';
    badgeTitle = '🌱 Basic Foundations Explorer';
    summary = `Good diagnostic attempt in ${courseTitle}. To build genuine expertise, our AI recommends starting from Level 1 foundations.`;
    fastTrackEligible = false;
    recommendedStartLevel = 1;
    fastTrackCompletedLevels = [];
    sessionStartHeadline = `🌱 Foundations Recommended — Session Starts at Level 1 (${mod1?.title || 'Level 1'})`;
    sessionStartReason = `To ensure comprehensive mastery, our AI recommends completing the foundational Level 1 lessons and quizzes.`;
    recommendedLessons = mod1?.lessons || [];
    aiTips = [
      `Start with Level 1 (${mod1?.title || 'Foundations'}) to build strong core mental models.`,
      `Complete each module quiz to validate concept retention.`,
      `Retake this AI test anytime to benchmark your growth.`
    ];
  }

  return {
    score,
    correctCount,
    totalQuestions,
    masteryTier,
    tierColor,
    badgeTitle,
    summary,
    tierStats,
    basicCleared,
    basicPercentage,
    intermediateCleared,
    interPercentage,
    advancedCleared,
    advPercentage,
    proCleared,
    proPercentage,
    domainBreakdown,
    strongestDomains,
    focusDomains,
    fastTrackEligible,
    fastTrackLessonIds,
    fastTrackCompletedLevels,
    recommendedStartLevel,
    sessionStartHeadline,
    sessionStartReason,
    recommendedLessons,
    aiTips,
    evaluatedAt: new Date().toISOString()
  };
};

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCourseKey = courseId || 'ui-ux';
  const course = COURSES_CURRICULUM[activeCourseKey] || COURSES_CURRICULUM['ui-ux'];

  // Basic-to-Pro Question Bank
  const skillTestQuestions = COURSE_BASIC_TO_PRO_TESTS[activeCourseKey] || COURSE_BASIC_TO_PRO_TESTS['ui-ux'];

  // Stored progress state
  const [progressState, setProgressState] = useState(() => {
    const all = getStoredProgress();
    return all[activeCourseKey] || {
      completedLessons: [],
      totalLessons: 20,
      progressPercentage: 0
    };
  });

  // Current selected lesson & module: initialize to user's current level if available
  const [activeModuleIndex, setActiveModuleIndex] = useState(() => {
    const all = getStoredProgress();
    const curr = all[activeCourseKey];
    if (curr?.currentLevel && curr.currentLevel > 1 && curr.currentLevel <= course.modules.length) {
      return curr.currentLevel - 1;
    }
    return 0;
  });

  const [activeLesson, setActiveLesson] = useState(() => {
    const mod = course.modules[activeModuleIndex] || course.modules[0];
    return mod.lessons[0];
  });

  // Tab state: 'lesson' | 'quiz' | 'assessment'
  const isMcqDone = isCourseMcqCompleted(progressState);
  const initialTab = searchParams.get('tab')
    ? (searchParams.get('tab') === 'assessment' ? 'assessment' : 'lesson')
    : (!isMcqDone ? 'assessment' : 'lesson');
  const [activeTab, setActiveTab] = useState(initialTab);

  // Diagnostic Quiz state (per module)
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // AI Assessment State
  const [assessmentFilterTier, setAssessmentFilterTier] = useState('All');
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(() => {
    if (searchParams.get('mode') === 'test') return false;
    // A 0% result is still a submitted assessment (for example, when every
    // question was left unanswered), so do not rely on the score being truthy.
    return progressState.aiAssessment?.completed === true ||
      progressState.aiAssessment?.score !== undefined;
  });
  const [assessmentResult, setAssessmentResult] = useState(() => {
    return progressState.aiAssessment || null;
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [fastTrackApplied, setFastTrackApplied] = useState(() => {
    return !!(progressState.completedLessons?.length > 0 && progressState.aiAssessment);
  });

  // Sync with real-time progress updates
  useEffect(() => {
    const handleUpdate = () => {
      const all = getStoredProgress();
      if (all[activeCourseKey]) {
        const currentProg = all[activeCourseKey];
        setProgressState(currentProg);
        if (currentProg.aiAssessment && !assessmentResult) {
          setAssessmentResult(currentProg.aiAssessment);
          setAssessmentSubmitted(true);
        }
      }
    };
    window.addEventListener('learnify_progress_updated', handleUpdate);
    return () => window.removeEventListener('learnify_progress_updated', handleUpdate);
  }, [activeCourseKey, assessmentResult]);

  // Handle URL tab changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const modeParam = searchParams.get('mode');
    if (tabParam === 'assessment') {
      setActiveTab('assessment');
      if (modeParam === 'test') {
        setAssessmentSubmitted(false);
      }
    }
  }, [searchParams]);

  const isLessonCompleted = (id) => progressState.completedLessons?.includes(id);

  const handleCompleteCurrentLesson = () => {
    const updated = completeLessonRealtime(activeCourseKey, activeLesson.id, 20);
    setProgressState(updated);

    if (updated.progressPercentage >= 100) {
      setShowCelebration(true);
    }
  };

  const currentModule = course.modules[activeModuleIndex] || course.modules[0];

  const handleQuizSubmit = () => {
    if (quizSelected === null) return;
    setQuizAnswered(true);
    if (quizSelected === currentModule.quiz.correctIndex) {
      completeLessonRealtime(activeCourseKey, `quiz_m_${activeModuleIndex + 1}`, 20);
    }
  };

  // Quick Demo Auto-Fill: Clears Level 1 (Basic)
  const handleQuickPassLevel1 = () => {
    const answers = {};
    skillTestQuestions.forEach((q, idx) => {
      if (q.tier === 'Basic' || idx < 10) {
        answers[q.id] = q.correctIndex;
      } else {
        answers[q.id] = (q.correctIndex + 1) % q.options.length;
      }
    });
    setAssessmentAnswers(answers);
  };

  // Quick Demo Auto-Fill: 100% Pro Master
  const handleQuickPassPro = () => {
    const answers = {};
    skillTestQuestions.forEach((q) => {
      answers[q.id] = q.correctIndex;
    });
    setAssessmentAnswers(answers);
  };

  // AI Assessment Submission Handler
  const handleAssessmentSubmit = () => {
    const totalQuestions = skillTestQuestions.length;

    // Learners can submit at any point. Missing answers intentionally count as
    // incorrect so the recommendation reflects the questions they attempted.
    const correctCount = skillTestQuestions.reduce((total, q) => {
      return total + (assessmentAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);

    const score = Math.round((correctCount / totalQuestions) * 100);

    const aiResult = generateAiCourseRecommendation(
      activeCourseKey,
      score,
      assessmentAnswers,
      skillTestQuestions,
      course
    );

    // Apply fast-track completion immediately to persist Level 1 completion
    if (aiResult.fastTrackEligible && aiResult.fastTrackLessonIds?.length > 0) {
      const updated = applyAiFastTrackProgress(
        activeCourseKey,
        aiResult.fastTrackLessonIds,
        aiResult.fastTrackCompletedLevels || [1],
        aiResult.recommendedStartLevel || 2,
        aiResult
      );
      setProgressState(updated);
      setFastTrackApplied(true);
    } else {
      saveAiAssessment(activeCourseKey, aiResult);
    }

    // Set active module to recommended starting level
    const targetModuleIndex = Math.max(0, (aiResult.recommendedStartLevel || 1) - 1);
    const targetModule = course.modules[targetModuleIndex] || course.modules[0];
    const targetLesson = targetModule.lessons[0];

    setActiveModuleIndex(targetModuleIndex);
    setActiveLesson(targetLesson);

    setAssessmentSubmitted(true);
    setAssessmentResult(aiResult);
  };

  // One-Click AI Fast-Track & Apply Roadmap: Starts course from recommended level
  const handleApplyAiLearningPath = () => {
    if (!assessmentResult) return;

    if (assessmentResult.fastTrackEligible && assessmentResult.fastTrackLessonIds?.length > 0) {
      const updated = applyAiFastTrackProgress(
        activeCourseKey,
        assessmentResult.fastTrackLessonIds,
        assessmentResult.fastTrackCompletedLevels || [1],
        assessmentResult.recommendedStartLevel || 2,
        assessmentResult
      );
      setProgressState(updated);
    }

    // Switch to recommended starting module and lesson (e.g. Level 2)
    const targetModuleIndex = Math.max(0, (assessmentResult.recommendedStartLevel || 1) - 1);
    const targetModule = course.modules[targetModuleIndex] || course.modules[0];
    const targetLesson = targetModule.lessons[0];

    setActiveModuleIndex(targetModuleIndex);
    setActiveLesson(targetLesson);
    setActiveTab('lesson');
    setFastTrackApplied(true);
  };

  // Filtered assessment questions based on selected tier
  const filteredQuestions = useMemo(() => {
    if (assessmentFilterTier === 'All') return skillTestQuestions;
    return skillTestQuestions.filter(q => q.tier === assessmentFilterTier);
  }, [skillTestQuestions, assessmentFilterTier]);

  const answeredCount = Object.keys(assessmentAnswers).length;

  const tierCounts = useMemo(() => {
    return {
      All: skillTestQuestions.length,
      Basic: skillTestQuestions.filter(q => q.tier === 'Basic').length,
      Intermediate: skillTestQuestions.filter(q => q.tier === 'Intermediate').length,
      Advanced: skillTestQuestions.filter(q => q.tier === 'Advanced').length,
      Pro: skillTestQuestions.filter(q => q.tier === 'Pro').length,
    };
  }, [skillTestQuestions]);

  const totalLessonsCount = 20;
  const completedCount = progressState.completedLessons?.length || 0;
  const completionPercentage = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

  return (

    <div className="d-flex flex-column gap-3">
      {/* Top Breadcrumb & Progress Bar */}
      <div className="learnify-card-wrapper p-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/dashboard/courses"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px' }}
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>{course.title}</h5>
              <span className="badge bg-primary-subtle text-primary small fw-semibold">{course.category}</span>
            </div>
            <div className="text-muted small">Instructor: {course.instructor} • 20 Full Lessons</div>
          </div>
        </div>

        {/* Real-time Progress Widget */}
        <div className="d-flex align-items-center gap-3">
          <div style={{ minWidth: '170px' }}>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted fw-semibold">Progress</span>
              <span className="fw-bold" style={{ color: '#2563eb' }}>
                {completedCount} / 20 Lessons ({completionPercentage}%)
              </span>
            </div>
            <div className="learnify-progress-bar-bg">
              <div
                className="learnify-progress-bar-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div
            className="px-3 py-1.5 rounded-pill d-flex align-items-center gap-1 fw-bold"
            style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.8rem', border: '1px solid #a7f3d0' }}
          >
            <Zap size={14} style={{ color: '#059669' }} />
            <span>+50 XP / Lesson</span>
          </div>
        </div>
      </div>

      {/* Main Learning Interface: 2-Column Layout */}
      <div className="row g-3 align-items-start position-relative">
        {/* Left Sidebar: Course Modules & All 20 Lessons Navigation */}
        <div className="col-lg-4" style={{ position: 'sticky', top: '16px', zIndex: 10, alignSelf: 'flex-start' }}>
          <div
            className="learnify-card-wrapper p-3 d-flex flex-column gap-3"
            style={{
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto'
            }}
          >

            <div className="d-flex align-items-center justify-content-between">
              <span className="fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.06em' }}>
                Curriculum (All 20 Lessons)
              </span>
              <span className="badge bg-primary text-white small">20 Lessons</span>
            </div>

            {/* AI Skill Test Quick Launcher in Sidebar */}
            <div
              onClick={() => setActiveTab('assessment')}
              className="p-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{
                background: activeTab === 'assessment' ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#f8fafc',
                border: activeTab === 'assessment' ? '2px solid #2563eb' : (!isMcqDone ? '1.5px solid #f59e0b' : '1px dashed #94a3b8'),
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div className={`p-2 rounded-circle ${!isMcqDone ? 'bg-warning text-dark' : 'bg-primary text-white'} d-flex align-items-center justify-content-center`}>
                  <BrainCircuit size={16} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: '#0f172a' }}>
                    {!isMcqDone ? 'Complete MCQ Test' : 'AI Basic-to-Pro Test'}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {assessmentResult ? `Score: ${assessmentResult.score}% • ${assessmentResult.masteryTier}` : (!isMcqDone ? '20 Qs Test Required' : 'Diagnostic Assessment')}
                  </div>
                </div>
              </div>
              <Sparkles size={16} className={!isMcqDone ? 'text-warning' : 'text-primary'} />
            </div>

            {course.modules.map((mod, modIdx) => {
              const isModCompleted = progressState.completedLevels?.includes(mod.level) ||
                (mod.lessons.length > 0 && mod.lessons.every(l => isLessonCompleted(l.id)));
              const isCurrentModule = activeModuleIndex === modIdx && activeTab === 'lesson';
              const quizCompleted = isLessonCompleted(`quiz_m_${mod.level}`);

              return (
                <div
                  key={mod.level}
                  className="rounded-3 p-2.5 mb-2.5"
                  style={{
                    background: isModCompleted
                      ? '#f0fdf4'
                      : (isCurrentModule ? '#eff6ff' : '#f8fafc'),
                    border: isModCompleted
                      ? '1.5px solid #86efac'
                      : (isCurrentModule ? '1.5px solid #2563eb' : '1px solid #e2e8f0'),
                    boxShadow: isCurrentModule ? '0 4px 12px rgba(37, 99, 235, 0.08)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    className="fw-bold small mb-2 d-flex align-items-center justify-content-between p-1"
                    style={{
                      color: isModCompleted ? '#166534' : (isCurrentModule ? '#1e40af' : '#0f172a'),
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setActiveModuleIndex(modIdx);
                      setActiveLesson(mod.lessons[0]);
                      setActiveTab('lesson');
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {isModCompleted ? (
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '18px', height: '18px' }}>
                          <CheckCircle2 size={13} />
                        </div>
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{
                            width: '18px',
                            height: '18px',
                            background: isCurrentModule ? '#2563eb' : '#cbd5e1',
                            color: '#ffffff',
                            fontSize: '0.65rem'
                          }}
                        >
                          {mod.level}
                        </div>
                      )}
                      <span className="fw-bold" style={{ fontSize: '0.84rem' }}>{mod.title}</span>
                    </div>

                    {isModCompleted ? (
                      <span
                        className="badge rounded-pill fw-bold text-success d-flex align-items-center gap-1 flex-shrink-0"
                        style={{ background: '#dcfce7', border: '1px solid #bbf7d0', fontSize: '0.68rem', padding: '3px 8px' }}
                      >
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="badge bg-white text-muted border small flex-shrink-0">{mod.lessons.length} Lessons</span>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-1">
                    {mod.lessons.map((les) => {
                      const completed = isLessonCompleted(les.id);
                      const isCurrent = activeLesson.id === les.id && activeTab === 'lesson';

                      return (
                        <div
                          key={les.id}
                          onClick={() => {
                            setActiveModuleIndex(modIdx);
                            setActiveLesson(les);
                            setActiveTab('lesson');
                          }}
                          className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                          style={{
                            cursor: 'pointer',
                            background: isCurrent ? '#ffffff' : (completed ? 'rgba(255,255,255,0.7)' : 'transparent'),
                            boxShadow: isCurrent ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                            border: isCurrent ? '1px solid #bfdbfe' : '1px solid transparent',
                            fontSize: '0.82rem'
                          }}
                        >
                          <div className="d-flex align-items-center gap-2 text-truncate">
                            {completed ? (
                              <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                            ) : (
                              <div className="rounded-circle border flex-shrink-0" style={{ width: '14px', height: '14px', borderColor: '#94a3b8' }}></div>
                            )}
                            <span className={`text-truncate ${isCurrent ? 'fw-bold text-primary' : (completed ? 'text-success fw-medium' : 'text-dark')}`}>
                              {les.title}
                            </span>
                          </div>
                          {completed ? (
                            <span className="badge bg-success-subtle text-success small flex-shrink-0" style={{ fontSize: '0.65rem' }}>Done</span>
                          ) : (
                            <span className="text-muted flex-shrink-0" style={{ fontSize: '0.7rem' }}>{les.duration}</span>
                          )}
                        </div>
                      );
                    })}

                    {/* Module Quiz Button */}
                    {mod.quiz && (
                      <div
                        onClick={() => {
                          setActiveModuleIndex(modIdx);
                          setActiveTab('quiz');
                          setQuizSelected(null);
                          setQuizAnswered(false);
                        }}
                        className="p-2 rounded-2 d-flex align-items-center justify-content-between mt-1"
                        style={{
                          cursor: 'pointer',
                          background: quizCompleted ? '#ecfdf5' : (activeTab === 'quiz' && activeModuleIndex === modIdx ? '#ffffff' : 'rgba(245, 158, 11, 0.08)'),
                          border: quizCompleted ? '1px solid #a7f3d0' : '1px dashed #f59e0b',
                          fontSize: '0.8rem',
                          color: quizCompleted ? '#065f46' : '#b45309',
                          fontWeight: 600
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {quizCompleted ? <CheckCircle2 size={15} className="text-success" /> : <HelpCircle size={15} />}
                          <span>Module Assessment Quiz</span>
                        </div>
                        <span className={`badge ${quizCompleted ? 'bg-success text-white' : 'bg-warning text-dark'} small`}>
                          {quizCompleted ? '✓ Passed' : 'Quiz'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Area: Lesson Viewer / Assessment */}
        <div className="col-lg-8">
          <div className="learnify-card-wrapper p-4 d-flex flex-column justify-content-between" style={{ minHeight: '720px' }}>
            <div>
              {/* Tab Navigation */}
              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
                    style={{
                      background: activeTab === 'lesson' ? '#2563eb' : '#f1f5f9',
                      color: activeTab === 'lesson' ? '#ffffff' : '#475569',
                      border: 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <BookOpen size={14} /> Lesson Tutorial
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
                    style={{
                      background: activeTab === 'quiz' ? '#2563eb' : '#f1f5f9',
                      color: activeTab === 'quiz' ? '#ffffff' : '#475569',
                      border: 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <HelpCircle size={14} /> Diagnostic Quiz
                  </button>

                  <button
                    onClick={() => setActiveTab('assessment')}
                    className="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 position-relative"
                    style={{
                      background: activeTab === 'assessment' ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : '#f1f5f9',
                      color: activeTab === 'assessment' ? '#ffffff' : '#475569',
                      border: 'none',
                      boxShadow: activeTab === 'assessment' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <Sparkles size={14} />
                    <span>{!isMcqDone ? 'Complete MCQ Test' : 'AI MCQ Test'}</span>
                    {assessmentResult && (
                      <span className="badge bg-white text-dark rounded-pill" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        {assessmentResult.score}%
                      </span>
                    )}
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2 small text-muted">
                  <Clock size={14} />
                  <span>{activeTab === 'assessment' ? `${skillTestQuestions.length} MCQs` : `Est: ${activeLesson.duration}`}</span>
                </div>
              </div>

              {/* TAB 1: LESSON CONTENT */}
              {activeTab === 'lesson' && (
                <div>
                  {!isMcqDone && (
                    <div
                      className="p-3.5 rounded-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2"
                      style={{ background: '#fffbeb', border: '1.5px solid #fde68a', color: '#92400e' }}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <BrainCircuit size={20} color="#b45309" />
                        <div>
                          <div className="fw-bold" style={{ fontSize: '0.88rem' }}>MCQ Test Required Before Resuming Course</div>
                          <div className="small text-muted">Complete the diagnostic MCQ test to calibrate your level and resume lessons seamlessly.</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('assessment')}
                        className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1 shadow-sm"
                        style={{ fontSize: '0.8rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', border: 'none' }}
                      >
                        <BrainCircuit size={14} />
                        <span>Complete MCQ Now</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <h3 className="fw-bold mb-0" style={{ color: '#0f172a' }}>{activeLesson.title}</h3>
                    {isLessonCompleted(activeLesson.id) && (
                      <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1 px-3 py-1.5 rounded-pill fw-bold">
                        <CheckCircle2 size={14} /> COMPLETED
                      </span>
                    )}
                  </div>

                  <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      lineHeight: 1.7,
                      fontSize: '0.94rem',
                      whiteSpace: 'pre-line',
                      color: '#334155'
                    }}
                  >
                    {activeLesson.content}
                  </div>
                </div>
              )}

              {/* TAB 2: DIAGNOSTIC QUIZ */}
              {activeTab === 'quiz' && (
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-warning-subtle text-warning fw-bold px-3 py-1 rounded-pill">
                      MODULE ASSESSMENT
                    </span>
                    <h4 className="fw-bold mb-0" style={{ color: '#0f172a' }}>{currentModule.title} Diagnostic</h4>
                  </div>

                  <div className="p-4 rounded-4 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <h6 className="fw-bold mb-3" style={{ color: '#0f172a', fontSize: '1.05rem' }}>
                      {currentModule.quiz?.question}
                    </h6>

                    <div className="d-flex flex-column gap-2 mb-4">
                      {currentModule.quiz?.options.map((opt, idx) => {
                        const isSelected = quizSelected === idx;
                        let optStyle = {
                          background: '#ffffff',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          color: '#0f172a'
                        };

                        if (quizAnswered) {
                          if (idx === currentModule.quiz.correctIndex) {
                            optStyle = { background: '#dcfce7', border: '2px solid #16a34a', color: '#14532d' };
                          } else if (isSelected) {
                            optStyle = { background: '#fee2e2', border: '2px solid #ef4444', color: '#991b1b' };
                          }
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => !quizAnswered && setQuizSelected(idx)}
                            className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                            style={{
                              ...optStyle,
                              cursor: quizAnswered ? 'default' : 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <span className="fw-semibold small">{opt}</span>
                            {quizAnswered && idx === currentModule.quiz.correctIndex && (
                              <CheckCircle2 size={18} className="text-success" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {quizAnswered && (
                      <div className="p-3 rounded-3 mb-3" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <div className="fw-bold small text-primary mb-1">Explanation:</div>
                        <div className="small text-muted">{currentModule.quiz.explanation}</div>
                      </div>
                    )}

                    {!quizAnswered ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={quizSelected === null}
                        className="learnify-continue-btn"
                        style={{ padding: '8px 24px' }}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizAnswered(false);
                          setQuizSelected(null);
                          setActiveTab('lesson');
                        }}
                        className="btn btn-secondary rounded-pill px-4"
                      >
                        Continue to Next Module
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BASIC-TO-PRO AI SKILL TEST & RECOMMENDATION ENGINE */}
              {activeTab === 'assessment' && (
                <div>
                  {/* Assessment Header */}
                  <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span
                          className="px-2.5 py-0.5 rounded-pill text-white fw-bold d-inline-flex align-items-center gap-1"
                          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', fontSize: '0.72rem' }}
                        >
                          <BrainCircuit size={12} /> AI SKILL TEST
                        </span>
                        <span className="badge bg-secondary-subtle text-secondary small">Adaptive Basic to Pro</span>
                      </div>
                      <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
                        {course.title} • Basic to Pro Diagnostic Test
                      </h4>
                      <p className="text-muted small mb-0">
                        Answer multi-tier MCQs to calibrate your knowledge. Our AI will analyze your domain proficiencies and generate a personalized fast-track roadmap to complete the course!
                      </p>
                    </div>

                    {assessmentSubmitted && assessmentResult && (
                      <button
                        onClick={() => {
                          setAssessmentSubmitted(false);
                          setAssessmentResult(null);
                          setAssessmentAnswers({});
                          setFastTrackApplied(false);
                        }}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-1"
                      >
                        <RotateCcw size={13} /> Retake Test
                      </button>
                    )}
                  </div>

                  {/* ========================================================= */}
                  {/* 1. TEST TAKING VIEW (When Not Yet Submitted) */}
                  {/* ========================================================= */}
                  {!assessmentSubmitted ? (
                    <div className="d-flex flex-column gap-3">
                      {/* Tier Filter Pills & Progress Bar */}
                      <div className="p-3 rounded-3 d-flex flex-column gap-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                          {/* Filter Pills */}
                          <div className="d-flex align-items-center gap-1.5 flex-wrap">
                            <span className="small fw-bold text-muted me-1">Filter Tier:</span>
                            {[
                              { label: `All (${tierCounts.All})`, value: 'All', color: '#2563eb' },
                              { label: `🟢 Basic (${tierCounts.Basic})`, value: 'Basic', color: '#16a34a' },
                              { label: `🔵 Intermediate (${tierCounts.Intermediate})`, value: 'Intermediate', color: '#2563eb' },
                              { label: `🟣 Advanced (${tierCounts.Advanced})`, value: 'Advanced', color: '#7c3aed' },
                              { label: `🟡 Pro (${tierCounts.Pro})`, value: 'Pro', color: '#d97706' }
                            ].map((tier) => (
                              <button
                                key={tier.value}
                                onClick={() => setAssessmentFilterTier(tier.value)}
                                className="btn btn-sm rounded-pill px-2.5 py-1"
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  background: assessmentFilterTier === tier.value ? tier.color : '#ffffff',
                                  color: assessmentFilterTier === tier.value ? '#ffffff' : '#475569',
                                  border: assessmentFilterTier === tier.value ? 'none' : '1px solid #cbd5e1'
                                }}
                              >
                                {tier.label}
                              </button>
                            ))}
                          </div>

                          {/* Question Tracker */}
                          <div style={{ minWidth: '180px' }}>
                            <div className="d-flex justify-content-between small mb-1">
                              <span className="text-muted fw-semibold">Answered</span>
                              <span className="fw-bold" style={{ color: '#2563eb' }}>
                                {answeredCount} / {skillTestQuestions.length}
                              </span>
                            </div>
                            <div className="learnify-progress-bar-bg" style={{ height: '6px' }}>
                              <div
                                className="learnify-progress-bar-fill"
                                style={{ width: `${(answeredCount / skillTestQuestions.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Demo Test Helpers */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 border-top">
                          <div className="d-flex align-items-center gap-1.5 flex-wrap">
                            <span className="small text-muted fw-semibold me-1">Quick Demo Helpers:</span>
                            <button
                              type="button"
                              onClick={handleQuickPassLevel1}
                              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1"
                              style={{ fontSize: '0.76rem' }}
                              title="Auto-fill with Level 1 Basic passing answers"
                            >
                              <Zap size={13} />
                              <span>⚡ Auto-Pass Level 1 (Demo)</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleQuickPassPro}
                              className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1"
                              style={{ fontSize: '0.76rem' }}
                              title="Auto-fill with 100% Pro answers"
                            >
                              <Sparkles size={13} />
                              <span>⚡ 100% Pro Master (Demo)</span>
                            </button>
                            {answeredCount > 0 && (
                              <button
                                type="button"
                                onClick={() => setAssessmentAnswers({})}
                                className="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-muted"
                                style={{ fontSize: '0.74rem' }}
                              >
                                Clear Answers
                              </button>
                            )}
                          </div>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {skillTestQuestions.length} Total MCQs across 4 Mastery Tiers
                          </span>
                        </div>
                      </div>

                      {/* Question Cards */}
                      <div className="d-flex flex-column gap-3">
                        {filteredQuestions.map((q, idx) => {
                          const originalIdx = skillTestQuestions.findIndex(item => item.id === q.id);
                          const isAnswered = assessmentAnswers[q.id] !== undefined;

                          const tierBadgeStyles = {
                            Basic: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
                            Intermediate: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
                            Advanced: { bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff' },
                            Pro: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' }
                          };
                          const style = tierBadgeStyles[q.tier] || tierBadgeStyles.Basic;

                          return (
                            <div
                              key={q.id}
                              className="p-3.5 rounded-3"
                              style={{
                                background: '#ffffff',
                                border: isAnswered ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                                boxShadow: isAnswered ? '0 2px 8px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)'
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-2">
                                  <span
                                    className="px-2 py-0.5 rounded-pill fw-bold"
                                    style={{
                                      fontSize: '0.72rem',
                                      background: style.bg,
                                      color: style.color,
                                      border: `1px solid ${style.border}`
                                    }}
                                  >
                                    Level {q.level} • {q.tier}
                                  </span>
                                  <span className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
                                    {q.domain}
                                  </span>
                                </div>
                                <span className="small text-muted fw-semibold">
                                  Question {originalIdx + 1} of {skillTestQuestions.length}
                                </span>
                              </div>

                              <h6 className="fw-bold mb-3" style={{ color: '#0f172a', fontSize: '0.96rem', lineHeight: 1.5 }}>
                                {q.question}
                              </h6>

                              {/* Options */}
                              <div className="row g-2">
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = assessmentAnswers[q.id] === optIdx;
                                  const letters = ['A', 'B', 'C', 'D'];

                                  return (
                                    <div className="col-12" key={optIdx}>
                                      <div
                                        onClick={() => {
                                          setAssessmentAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                        }}
                                        className="p-2.5 px-3 rounded-2 d-flex align-items-center gap-2.5"
                                        style={{
                                          cursor: 'pointer',
                                          background: isSelected ? '#eff6ff' : '#f8fafc',
                                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        <div
                                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                          style={{
                                            width: '24px',
                                            height: '24px',
                                            fontSize: '0.75rem',
                                            background: isSelected ? '#2563eb' : '#e2e8f0',
                                            color: isSelected ? '#ffffff' : '#475569'
                                          }}
                                        >
                                          {letters[optIdx]}
                                        </div>
                                        <span
                                          className="small"
                                          style={{
                                            color: isSelected ? '#1e40af' : '#334155',
                                            fontWeight: isSelected ? 600 : 500
                                          }}
                                        >
                                          {opt}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Action Banner */}
                      <div
                        className="p-3.5 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3 mt-2"
                        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid #bfdbfe' }}
                      >
                        <div>
                          <div className="fw-bold small" style={{ color: '#0f172a' }}>
                            {answeredCount === skillTestQuestions.length
                              ? `✓ All ${skillTestQuestions.length} questions answered! Ready for AI diagnosis.`
                              : `${answeredCount} answered • ${skillTestQuestions.length - answeredCount} unanswered.`}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            You can submit at any time. Unanswered questions count as incorrect.
                          </div>

                        </div>

                        <button
                          onClick={handleAssessmentSubmit}
                          className="learnify-continue-btn d-flex align-items-center gap-2"
                          style={{
                            background: answeredCount === skillTestQuestions.length
                              ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                              : '#2563eb',
                            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                          }}
                        >
                          <Sparkles size={16} />
                          <span>Generate AI Recommendations</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ========================================================= */
                    /* 2. AI RECOMMENDATION REPORT VIEW (When Submitted) */
                    /* ========================================================= */
                    <div className="d-flex flex-column gap-4">
                      {/* Top AI Assessment Hero Card */}
                      <div
                        className="p-4 rounded-4 position-relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #090e17 0%, #1e1b4b 50%, #0f172a 100%)',
                          color: '#ffffff',
                          border: '1.5px solid rgba(124, 58, 237, 0.4)',
                          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)'
                        }}
                      >
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                          <div>
                            <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill mb-2" style={{ background: 'rgba(255,255,255,0.12)', fontSize: '0.78rem' }}>
                              <Sparkles size={13} className="text-warning" />
                              <span className="fw-bold">{assessmentResult.badgeTitle}</span>
                            </div>
                            <h3 className="fw-extrabold font-heading mb-2 text-white">
                              {assessmentResult.masteryTier} Calibration
                            </h3>
                            <p className="text-white text-opacity-80 small mb-0" style={{ maxWidth: '480px', lineHeight: 1.6 }}>
                              {assessmentResult.summary}
                            </p>
                          </div>

                          {/* Gauge Score Widget */}
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle d-flex flex-column align-items-center justify-content-center shadow"
                              style={{
                                width: '100px',
                                height: '100px',
                                background: 'radial-gradient(circle, #312e81 0%, #1e1b4b 100%)',
                                border: '3px solid #818cf8'
                              }}
                            >
                              <span className="fs-3 fw-black text-white">{assessmentResult.score}%</span>
                              <span style={{ fontSize: '0.65rem', color: '#c7d2fe' }}>
                                {assessmentResult.correctCount}/{assessmentResult.totalQuestions} Correct
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Recommended Starting Level Banner */}
                        <div
                          className="mt-4 p-3.5 rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
                            border: '1.5px solid rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <div className="d-flex align-items-start gap-2.5">
                            <div className="p-2 rounded-circle bg-warning text-dark flex-shrink-0 mt-0.5">
                              <Zap size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-white mb-1" style={{ fontSize: '1rem' }}>
                                {assessmentResult.sessionStartHeadline || `AI Recommendation: Start Session at Level ${assessmentResult.recommendedStartLevel}`}
                              </div>
                              <div className="small text-white-50" style={{ lineHeight: 1.45 }}>
                                {assessmentResult.sessionStartReason || `Based on your test score (${assessmentResult.score}%), our AI has calibrated your path to start directly at Level ${assessmentResult.recommendedStartLevel}.`}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleApplyAiLearningPath}
                            className="btn btn-warning fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2 flex-shrink-0 shadow-sm"
                            style={{ color: '#0f172a', fontSize: '0.9rem' }}
                          >
                            <FastForward size={16} />
                            <span>Resume Course (Level {assessmentResult.recommendedStartLevel}) →</span>
                          </button>
                        </div>
                      </div>

                      {/* Fast-track Applied Notice */}
                      {fastTrackApplied && (
                        <div className="p-3.5 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 d-flex align-items-center justify-content-between flex-wrap gap-2 text-success small fw-semibold">
                          <div className="d-flex align-items-center gap-2">
                            <CheckCircle2 size={20} />
                            <span>
                              🎉 AI Learning Path Active! Lessons prior to Level {assessmentResult.recommendedStartLevel} have been completed (+XP). Ready to resume course!
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveTab('lesson')}
                            className="btn btn-sm btn-success text-white rounded-pill px-3.5 py-1.5 fw-bold d-flex align-items-center gap-1"
                          >
                            <span>Resume Course Lessons</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}


                      {/* Domain-by-Domain Proficiency Breakdown */}
                      <div>
                        <h6 className="fw-bold mb-2.5 d-flex align-items-center gap-1.5" style={{ color: '#0f172a' }}>
                          <Target size={16} className="text-primary" />
                          <span>Domain Competency Breakdown</span>
                        </h6>

                        <div className="row g-2">
                          {assessmentResult.domainBreakdown?.map((domain) => (
                            <div className="col-md-6" key={domain.domain}>
                              <div className="p-3 rounded-3 bg-light border h-100">
                                <div className="d-flex justify-content-between align-items-center small mb-1.5">
                                  <span className="fw-bold text-dark">{domain.domain}</span>
                                  <span className={`fw-bold ${domain.percentage >= 70 ? 'text-success' : 'text-primary'}`}>
                                    {domain.correct}/{domain.total} ({domain.percentage}%)
                                  </span>
                                </div>
                                <div className="learnify-progress-bar-bg" style={{ height: '7px' }}>
                                  <div
                                    className="learnify-progress-bar-fill"
                                    style={{
                                      width: `${domain.percentage}%`,
                                      background: domain.percentage >= 70 ? '#16a34a' : domain.percentage >= 40 ? '#2563eb' : '#d97706'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Tailored Course Completion Plan */}
                      <div
                        className="p-4 rounded-4"
                        style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
                      >
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-circle bg-primary bg-opacity-10 text-primary">
                            <BrainCircuit size={18} />
                          </div>
                          <div>
                            <h5 className="fw-bold mb-0 font-heading" style={{ color: '#0f172a' }}>
                              AI Course Completion Roadmap
                            </h5>
                            <div className="text-muted small">
                              Custom step-by-step instructions to master {course.title} based on your test results.
                            </div>
                          </div>
                        </div>

                        {/* AI Tips */}
                        <div className="p-3 rounded-3 mb-3" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                          <div className="fw-bold small text-primary mb-2 d-flex align-items-center gap-1.5">
                            <Compass size={15} /> Strategic AI Recommendations:
                          </div>
                          <ul className="mb-0 ps-3 small text-muted">
                            {assessmentResult.aiTips?.map((tip, tipIdx) => (
                              <li key={tipIdx} className="mb-1">{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommended Lessons List */}
                        <div className="mb-3">
                          <div className="fw-bold small text-dark mb-2">Priority Lessons to Complete Next:</div>
                          <div className="d-flex flex-column gap-2">
                            {assessmentResult.recommendedLessons?.map((les) => (
                              <div
                                key={les.id}
                                className="p-2.5 px-3 rounded-3 bg-white border d-flex align-items-center justify-content-between"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <div className="p-1.5 rounded-circle bg-light text-primary">
                                    <Play size={13} />
                                  </div>
                                  <div>
                                    <div className="fw-bold small text-dark">{les.title}</div>
                                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>Duration: {les.duration}</div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setActiveLesson(les);
                                    setActiveTab('lesson');
                                  }}
                                  className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  <span>Study Lesson</span>
                                  <ArrowRight size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap pt-2">
                          <button
                            onClick={handleApplyAiLearningPath}
                            className="learnify-continue-btn d-flex align-items-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
                          >
                            <FastForward size={16} /> Start Session from Level {assessmentResult.recommendedStartLevel}
                          </button>
                          <button
                            onClick={() => setActiveTab('lesson')}
                            className="btn btn-outline-secondary rounded-pill px-4"
                          >
                            Go to Lesson Tutorial
                          </button>
                        </div>

                      </div>

                      {/* Question-by-Question Review with Explanations */}
                      <div>
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-1.5" style={{ color: '#0f172a' }}>
                          <FileCheck size={16} className="text-primary" />
                          <span>Detailed Question Review & Explanations</span>
                        </h6>

                        <div className="d-flex flex-column gap-2.5">
                          {skillTestQuestions.map((q, idx) => {
                            const userAnswer = assessmentAnswers[q.id];
                            const isCorrect = userAnswer === q.correctIndex;

                            return (
                              <div
                                key={q.id}
                                className="p-3 rounded-3"
                                style={{
                                  background: '#ffffff',
                                  border: isCorrect ? '1px solid #bbf7d0' : '1px solid #fecaca'
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <span className="small fw-bold text-muted">Q{idx + 1} • Level {q.level} ({q.tier})</span>
                                  <span
                                    className="badge px-2 py-0.5 rounded-pill fw-bold"
                                    style={{
                                      background: isCorrect ? '#dcfce7' : '#fee2e2',
                                      color: isCorrect ? '#15803d' : '#b91c1c'
                                    }}
                                  >
                                    {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                                  </span>
                                </div>

                                <div className="fw-semibold text-dark small mb-2">{q.question}</div>

                                <div className="small mb-2">
                                  <span className="text-muted">Your Answer: </span>
                                  <strong className={isCorrect ? 'text-success' : 'text-danger'}>
                                    {userAnswer !== undefined ? q.options[userAnswer] : 'Not Answered'}
                                  </strong>
                                  {!isCorrect && (
                                    <div className="text-muted mt-0.5">
                                      Correct Answer: <strong className="text-success">{q.options[q.correctIndex]}</strong>
                                    </div>
                                  )}
                                </div>

                                <div className="p-2 px-3 rounded-2 bg-light border" style={{ fontSize: '0.78rem', color: '#475569' }}>
                                  <strong className="text-primary">Explanation: </strong>
                                  {q.explanation}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Real-time Complete Lesson Button (for Lesson tab) */}
            {activeTab === 'lesson' && (
              <div className="pt-3 border-top d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <Sparkles size={16} className="text-warning" />
                  <span>Marking complete immediately syncs your 20-lesson progress</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={handleCompleteCurrentLesson}
                    className="learnify-continue-btn d-flex align-items-center gap-2"
                    style={{
                      background: isLessonCompleted(activeLesson.id) ? '#16a34a' : '#2563eb',
                      boxShadow: isLessonCompleted(activeLesson.id) ? '0 4px 14px rgba(22, 163, 74, 0.4)' : '0 4px 14px rgba(37, 99, 235, 0.4)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{isLessonCompleted(activeLesson.id) ? 'Lesson Completed (+50 XP ✓)' : 'Complete Lesson (+50 XP)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Celebration Modal on 100% Course Completion */}
      {showCelebration && (
        <div
          className="position-fixed inset-0 d-flex align-items-center justify-content-center"
          style={{
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            className="p-5 rounded-4 text-center text-white position-relative"
            style={{
              background: 'linear-gradient(145deg, #090e17 0%, #1e293b 100%)',
              maxWidth: '520px',
              border: '2px solid #2563eb',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            <div
              className="rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ background: '#2563eb', width: '70px', height: '70px' }}
            >
              <Award size={36} color="#ffffff" />
            </div>

            <h2 className="fw-bold mb-2 font-heading">All 20 Lessons Mastered! 🎉</h2>
            <p className="text-muted small mb-4">
              You have completed all 20 lessons for <strong>{course.title}</strong>. Your verified cryptographic certificate is ready to download.
            </p>

            <div className="d-flex align-items-center justify-content-center gap-3">
              <button
                className="learnify-continue-btn d-flex align-items-center gap-2"
                onClick={() => navigate('/dashboard/certificates')}
              >
                <Award size={18} /> View Verified Certificate
              </button>
              <button
                className="btn btn-outline-light rounded-pill px-4"
                onClick={() => setShowCelebration(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayerPage;
