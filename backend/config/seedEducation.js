import EducationCourse from '../models/EducationCourse.js';
import { inMemoryStore } from './db.js';

export const INITIAL_EDUCATION_COURSES = [
  // =========================================================================
  // 1. UI/UX DESIGN MASTERCLASS
  // =========================================================================
  {
    studyRole: 'design',
    category: 'Design',
    title: 'UI/UX Design Masterclass',
    code: 'ui_ux_masterclass',
    icon: '🎨',
    description: 'Master industry-standard product design: user research, wireframing, Figma Auto-Layout, design tokens, interactive micro-animations, and design systems.',
    difficulty: 'All Levels',
    estimatedHours: 24,
    order: 1,
    modules: [
      {
        level: 1,
        title: 'Level 1 — UX Research & Information Architecture',
        description: 'User personas, empathy maps, journey mapping, card sorting, and structural user flows.',
        lessons: [
          {
            id: 'ux_l1_1',
            title: 'User Personas & Empathy Mapping',
            content: 'User research is the foundation of digital product design. Empathy maps categorize user behaviors into: Says, Thinks, Does, and Feels to uncover latent pain points and product opportunities.',
            duration: '20 mins',
            keyPoints: ['Quantitative vs Qualitative Research', 'Creating actionable user personas', 'Mapping friction points in user journeys']
          },
          {
            id: 'ux_l1_2',
            title: 'Information Architecture & User Flows',
            content: 'Information Architecture (IA) organizes content logically so users can navigate instinctively. User flows map step-by-step decision paths from entry point to goal conversion.',
            duration: '25 mins',
            keyPoints: ['Site mapping hierarchy', 'Wireflow diagrams', 'Card sorting methodologies']
          }
        ],
        assessment: {
          title: 'UX Foundations Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ux_q1_1',
              question: 'Which quadrant of an Empathy Map captures emotional state and unsaid anxieties?',
              options: ['Says', 'Thinks', 'Does', 'Feels'],
              correctIndex: 3,
              explanation: 'The "Feels" quadrant captures emotional responses and affective states of users.'
            },
            {
              id: 'ux_q1_2',
              question: 'What is the primary objective of Card Sorting in UX Design?',
              options: ['To pick color palettes', 'To organize information architecture based on user mental models', 'To test database speed', 'To write marketing copy'],
              correctIndex: 1,
              explanation: 'Card sorting helps UX designers discover how users instinctively categorize content and structure navigation.'
            }
          ]
        }
      },
      {
        level: 2,
        title: 'Level 2 — Wireframing & Figma Auto-Layout Systems',
        description: 'Low-fidelity sketching to high-fidelity components using Figma Auto-Layout, responsive constraints, and design tokens.',
        lessons: [
          {
            id: 'ux_l2_1',
            title: 'Figma Auto-Layout & Responsive Constraints',
            content: 'Auto-Layout enables dynamic button padding, responsive flex grids, and nested card layouts that automatically adapt across mobile, tablet, and desktop viewports.',
            duration: '30 mins',
            keyPoints: ['Hug contents vs Fill container', 'Min/Max width constraints', 'Independent axis padding and gap spacing']
          },
          {
            id: 'ux_l2_2',
            title: 'Design Tokens: Colors, Typography & Shadows',
            content: 'Design tokens are design variables (spacing units, color hex values, typography scale) stored in a standardized schema for seamless sync between Figma and code.',
            duration: '25 mins',
            keyPoints: ['Semantic color naming (surface-primary, text-muted)', '8pt baseline grid system', 'Elevation and shadow elevation tiers']
          }
        ],
        assessment: {
          title: 'Figma Systems Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ux_q2_1',
              question: 'In Figma Auto-Layout, which property makes a child element expand to fill its parent container width?',
              options: ['Hug contents', 'Fill container', 'Fixed width', 'Absolute position'],
              correctIndex: 1,
              explanation: 'Fill container causes child elements to stretch across the available width of the parent auto-layout frame.'
            }
          ]
        }
      },
      {
        level: 3,
        title: 'Level 3 — Micro-Interactions & Prototyping',
        description: 'Smart Animate transitions, component state variants, prototype triggers, and interactive overlays.',
        lessons: [
          {
            id: 'ux_l3_1',
            title: 'Smart Animate & Interactive Component Variants',
            content: 'Combine component variants with Smart Animate to build realistic dropdown toggles, modal dialogs, drawer navigations, and button loading spinners without duplicating artboards.',
            duration: '30 mins',
            keyPoints: ['Matching layer names for smooth morphs', 'Spring and cubic-bezier easing curves', 'Interactive variant triggers (On click, While hovering)']
          }
        ],
        assessment: {
          title: 'Interactive Prototyping Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ux_q3_1',
              question: 'What is required for Figma Smart Animate to smoothly morph between two frames?',
              options: ['Identical layer names and hierarchy', 'Same color on all layers', 'All layers must be grouped as vectors', 'Files must be exported to SVG'],
              correctIndex: 0,
              explanation: 'Figma Smart Animate relies on matching layer names in both states to calculate position, size, and opacity interpolation.'
            }
          ]
        }
      },
      {
        level: 4,
        title: 'Level 4 — Design Systems & Developer Handoff',
        description: 'Publishing reusable libraries, documentation, accessibility audits (WCAG), and engineering spec generation.',
        lessons: [
          {
            id: 'ux_l4_1',
            title: 'Design System Governance & Accessibility (WCAG 2.1)',
            content: 'Build accessible UI components meeting WCAG AAA color contrast ratios (minimum 4.5:1 for normal text). Package documentation with usage rules and prop definitions for developers.',
            duration: '35 mins',
            keyPoints: ['WCAG 2.1 color contrast compliance', 'Component variant documentation', 'Dev Mode inspection & CSS export']
          }
        ],
        assessment: {
          title: 'Design System Capstone Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ux_q4_1',
              question: 'What is the minimum WCAG AA color contrast ratio required for standard body text?',
              options: ['2.5:1', '3:1', '4.5:1', '7:1'],
              correctIndex: 2,
              explanation: 'WCAG 2.1 Level AA mandates a minimum contrast ratio of 4.5:1 for normal body text against its background.'
            }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 2. FULL-STACK REACT & NEXT.JS DEVELOPMENT
  // =========================================================================
  {
    studyRole: 'development',
    category: 'Development',
    title: 'React & Next.js Full-Stack Mastery',
    code: 'react_nextjs',
    icon: '⚛️',
    description: 'Build enterprise-grade modern web apps with React 18, React Hooks, Redux Toolkit, Next.js 14 App Router, Server Components, TypeScript, and TailwindCSS.',
    difficulty: 'Intermediate',
    estimatedHours: 36,
    order: 2,
    modules: [
      {
        level: 1,
        title: 'Level 1 — Modern React 18 Core & Custom Hooks',
        description: 'JSX, component tree lifecycle, useState, useEffect, useMemo, useCallback, and reusable custom hooks.',
        lessons: [
          {
            id: 'react_l1_1',
            title: 'React 18 State, Virtual DOM & Lifecycle',
            content: 'React uses a Virtual DOM diffing engine (Fiber reconciler) to minimize browser DOM manipulations. useState manages local component memory, while useEffect synchronizes with external systems.',
            duration: '25 mins',
            keyPoints: ['Pure components and immutable state updates', 'Dependency arrays in useEffect', 'Custom hook composition']
          },
          {
            id: 'react_l1_2',
            title: 'Performance Optimization: useMemo & useCallback',
            content: 'useMemo caches expensive computation outputs, while useCallback caches function references across renders to prevent unnecessary re-renders in memoized child components.',
            duration: '30 mins',
            keyPoints: ['Referential equality in JavaScript', 'React.memo wrapper', 'Preventing cascading re-renders']
          }
        ],
        assessment: {
          title: 'React Core Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'react_q1_1',
              question: 'What happens if you omit the dependency array in useEffect(callback)?',
              options: ['It runs only on initial mount', 'It runs after every single render of the component', 'It throws a compilation error', 'It never runs'],
              correctIndex: 1,
              explanation: 'Without a dependency array, useEffect executes after every single render and update cycle.'
            },
            {
              id: 'react_q1_2',
              question: 'Which hook should be used to preserve a mutable variable across renders without triggering a re-render?',
              options: ['useState', 'useRef', 'useMemo', 'useId'],
              correctIndex: 1,
              explanation: 'useRef returns a mutable object whose .current property persists without triggering re-renders when modified.'
            }
          ]
        }
      },
      {
        level: 2,
        title: 'Level 2 — Global State Management with Redux Toolkit',
        description: 'Configuring slices, createAsyncThunk, normalized state, and RTK Query for automated caching and optimistic updates.',
        lessons: [
          {
            id: 'react_l2_1',
            title: 'Redux Toolkit Store, Slices & Selectors',
            content: 'Redux Toolkit (RTK) simplifies state architecture using createSlice and Immer.js for safe immutable state mutations. useSelector accesses state with fine-grained subscriptions.',
            duration: '35 mins',
            keyPoints: ['createSlice reducers and action creators', 'useDispatch & useSelector hooks', 'RTK Query endpoint definitions']
          }
        ],
        assessment: {
          title: 'Redux Toolkit Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'react_q2_1',
              question: 'How does Redux Toolkit allow direct state mutation syntax like state.count += 1 inside slice reducers?',
              options: ['It modifies the global window object', 'It uses Immer library under the hood to produce a new immutable copy', 'It replaces JavaScript arrays', 'It turns off state immutability'],
              correctIndex: 1,
              explanation: 'Redux Toolkit integrates Immer to track mutations and safely generate a new immutable state draft.'
            }
          ]
        }
      },
      {
        level: 3,
        title: 'Level 3 — Next.js 14 App Router & Server Components (RSC)',
        description: 'Server vs Client Components, dynamic routing, streaming with Suspense, and Server Actions for database mutations.',
        lessons: [
          {
            id: 'react_l3_1',
            title: 'Next.js App Router & React Server Components',
            content: 'Next.js 14 App Router renders React Server Components (RSC) on the server, sending zero client JavaScript for data-fetching logic and achieving ultra-fast initial page loads.',
            duration: '35 mins',
            keyPoints: ['"use client" directive boundaries', 'Streaming SSR with React Suspense', 'Server Actions for form mutations']
          }
        ],
        assessment: {
          title: 'Next.js 14 Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'react_q3_1',
              question: 'Where do React Server Components in Next.js 14 execute?',
              options: ['Exclusively in the client browser', 'Exclusively on the server', 'Inside Web Workers', 'Inside service workers only'],
              correctIndex: 1,
              explanation: 'React Server Components render exclusively on the server and stream lightweight HTML/JSON without shipping bundle JavaScript.'
            }
          ]
        }
      },
      {
        level: 4,
        title: 'Level 4 — Full-Stack Deployment, CI/CD & Production Tuning',
        description: 'Next.js edge middleware, JWT session security, SEO metadata generation, and Vercel/Docker production deployment.',
        lessons: [
          {
            id: 'react_l4_1',
            title: 'Production Optimization, Security & Deployment',
            content: 'Implement dynamic OpenGraph metadata, Edge API rate limiting, Core Web Vitals optimization (LCP, CLS, INP), and automated continuous integration deployments.',
            duration: '40 mins',
            keyPoints: ['next/image optimization', 'Edge Middleware authentication guards', 'Docker multi-stage Next.js builds']
          }
        ],
        assessment: {
          title: 'Full-Stack React Capstone Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'react_q4_1',
              question: 'Which metric measures visual stability and unexpected layout shifting on modern web apps?',
              options: ['LCP (Largest Contentful Paint)', 'CLS (Cumulative Layout Shift)', 'TTFB (Time to First Byte)', 'FCP (First Contentful Paint)'],
              correctIndex: 1,
              explanation: 'CLS (Cumulative Layout Shift) measures unexpected visual displacement of elements during page load.'
            }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 3. PYTHON FOR DATA SCIENCE & AI / ML
  // =========================================================================
  {
    studyRole: 'data_science',
    category: 'Data Science',
    title: 'Python for Data Science & AI',
    code: 'python_data_ai',
    icon: '📊',
    description: 'From NumPy array operations and Pandas exploratory data analysis to Scikit-Learn machine learning pipelines, Deep Learning neural networks, and AI deployments.',
    difficulty: 'Intermediate',
    estimatedHours: 32,
    order: 3,
    modules: [
      {
        level: 1,
        title: 'Level 1 — Numerical Computing with NumPy & Vectorization',
        description: 'N-dimensional arrays, matrix broadcasting, linear algebra operations, and high-speed vector math.',
        lessons: [
          {
            id: 'ds_l1_1',
            title: 'NumPy Arrays, Indexing & Matrix Vectorization',
            content: 'NumPy provides C-optimized contiguous memory ndarrays. Vectorized operations run orders of magnitude faster than Python for-loops by utilizing SIMD hardware CPU acceleration.',
            duration: '30 mins',
            keyPoints: ['Broadcasting rules across differing tensor dimensions', 'Boolean masking and fancy indexing', 'np.dot, np.matmul, and eigenvalue decompositions']
          }
        ],
        assessment: {
          title: 'NumPy Foundations Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ds_q1_1',
              question: 'Why are NumPy vectorized operations significantly faster than standard Python loops?',
              options: ['They compile to interpreted bytecode', 'They execute in compiled C memory with SIMD vectorization', 'They run inside browser V8 engine', 'They use cloud servers'],
              correctIndex: 1,
              explanation: 'NumPy arrays store data in contiguous C memory blocks, allowing vector processor SIMD instructions to operate simultaneously.'
            }
          ]
        }
      },
      {
        level: 2,
        title: 'Level 2 — Data Wrangling & Analysis with Pandas',
        description: 'DataFrames, Series, handling missing data (NaN), groupby aggregations, merge/join, and Matplotlib visualizations.',
        lessons: [
          {
            id: 'ds_l2_1',
            title: 'Pandas DataFrames, Cleaning & Feature Engineering',
            content: 'Pandas is the core tool for tabular data manipulation. Master groupby operations, lambda feature transformations, outlier filtering with IQR, and one-hot encoding categorical variables.',
            duration: '35 mins',
            keyPoints: ['DataFrame loc vs iloc indexing', 'Handling missing data with dropna & fillna', 'Aggregations and pivot table reshaping']
          }
        ],
        assessment: {
          title: 'Pandas Data Wrangling Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ds_q2_1',
              question: 'Which Pandas method is used for positional integer-based indexing of rows and columns?',
              options: ['df.loc[]', 'df.iloc[]', 'df.idx[]', 'df.find[]'],
              correctIndex: 1,
              explanation: 'df.iloc[] accesses rows and columns by their integer position indices (0 to n-1).'
            }
          ]
        }
      },
      {
        level: 3,
        title: 'Level 3 — Machine Learning with Scikit-Learn',
        description: 'Supervised vs unsupervised learning: Regression, Random Forests, Gradient Boosting (XGBoost), and cross-validation.',
        lessons: [
          {
            id: 'ds_l3_1',
            title: 'Supervised Learning: Classifiers, Regressors & Model Evaluation',
            content: 'Construct end-to-end ML pipelines with Scikit-Learn. Evaluate models with Confusion Matrices, Precision, Recall, F1-Score, and ROC-AUC curves while guarding against overfitting.',
            duration: '40 mins',
            keyPoints: ['Train/Test split & K-Fold Cross Validation', 'Feature scaling with StandardScaler', 'Hyperparameter tuning with GridSearchCV']
          }
        ],
        assessment: {
          title: 'Machine Learning Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ds_q3_1',
              question: 'Which metric is best suited for evaluating model performance on imbalanced datasets (e.g. fraud detection)?',
              options: ['Raw Accuracy', 'Precision, Recall and F1-Score', 'Mean Squared Error', 'R-Squared'],
              correctIndex: 1,
              explanation: 'When positive cases are rare, F1-Score (harmonic mean of Precision & Recall) provides a reliable measure unlike raw Accuracy.'
            }
          ]
        }
      },
      {
        level: 4,
        title: 'Level 4 — Deep Learning & Neural Networks',
        description: 'Feedforward neural networks, backpropagation, PyTorch/TensorFlow, activation functions, and model deployment as REST APIs.',
        lessons: [
          {
            id: 'ds_l4_1',
            title: 'Neural Networks, Gradient Descent & Model Serving',
            content: 'Understand multilayer perceptrons (MLP), ReLU activations, backpropagation loss minimization with Adam optimizer, and exporting trained models to ONNX / FastAPI microservices.',
            duration: '45 mins',
            keyPoints: ['Loss functions (CrossEntropy, MSE)', 'Dropout and regularization to prevent overfitting', 'FastAPI model inference endpoints']
          }
        ],
        assessment: {
          title: 'Data Science & AI Capstone Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'ds_q4_1',
              question: 'What is the purpose of Dropout layers in deep neural network training?',
              options: ['To speed up hard drive reading', 'To randomly deactivate neurons and prevent co-adaptation/overfitting', 'To increase memory usage', 'To invert matrix values'],
              correctIndex: 1,
              explanation: 'Dropout randomly zeroes out a subset of neurons during training to prevent complex co-adaptations and reduce overfitting.'
            }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 4. BACKEND ENGINEERING WITH NODE.JS & MICROSERVICES
  // =========================================================================
  {
    studyRole: 'development',
    category: 'Development',
    title: 'Node.js Backend & Microservices Architecture',
    code: 'nodejs_microservices',
    icon: '⚡',
    description: 'Master backend architecture: Node.js Event Loop, Express REST APIs, JWT authentication, MongoDB & PostgreSQL optimization, Redis caching, and Docker microservices.',
    difficulty: 'Intermediate',
    estimatedHours: 30,
    order: 4,
    modules: [
      {
        level: 1,
        title: 'Level 1 — Node.js Architecture & Express API Design',
        description: 'Event Loop, Non-blocking asynchronous I/O, middleware pipelines, error handling, and routing best practices.',
        lessons: [
          {
            id: 'node_l1_1',
            title: 'Node.js Event Loop & Express Middleware Pipelines',
            content: 'Node.js runs on a single-threaded V8 engine with a libuv event loop managing Timers, I/O callbacks, Poll, and Close phases. Express middleware intercepts requests sequentially with (req, res, next).',
            duration: '30 mins',
            keyPoints: ['Call stack vs Macro/Microtask queue', 'Centralized error handling middleware', 'CORS, Helmet, and rate limiting security']
          }
        ],
        assessment: {
          title: 'Node.js Architecture Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'node_q1_1',
              question: 'Which library powers the asynchronous I/O and Event Loop in Node.js?',
              options: ['libuv', 'v8-native', 'boost', 'glibc'],
              correctIndex: 0,
              explanation: 'libuv is the multi-platform C library that handles the Event Loop, thread pool, and asynchronous file/network I/O in Node.js.'
            }
          ]
        }
      },
      {
        level: 2,
        title: 'Level 2 — Authentication, Authorization & Security',
        description: 'JWT tokens, refresh token rotation, bcrypt password hashing, Role-Based Access Control (RBAC), and sanitization.',
        lessons: [
          {
            id: 'node_l2_1',
            title: 'Secure JWT Auth, Refresh Tokens & RBAC Guards',
            content: 'Implement stateless JWT authentication with short-lived access tokens (15m) and secure httpOnly refresh tokens stored in cookies. Guard sensitive routes with role-based authorization middleware.',
            duration: '35 mins',
            keyPoints: ['Header, Payload, Signature JWT structure', 'Salted password hashing with bcrypt', 'Preventing XSS and CSRF attack vectors']
          }
        ],
        assessment: {
          title: 'Backend Security Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'node_q2_1',
              question: 'Where is the most secure place to store refresh tokens in a web browser to prevent XSS attacks?',
              options: ['localStorage', 'sessionStorage', 'httpOnly Secure Cookie', 'Global JavaScript variable'],
              correctIndex: 2,
              explanation: 'httpOnly cookies cannot be read by client-side JavaScript, shielding them from XSS token theft.'
            }
          ]
        }
      },
      {
        level: 3,
        title: 'Level 3 — Database Indexing & Redis Caching',
        description: 'Mongoose aggregation pipelines, PostgreSQL relational queries, indexing strategies, and Redis in-memory cache layers.',
        lessons: [
          {
            id: 'node_l3_1',
            title: 'High-Performance Caching with Redis & DB Indexing',
            content: 'Accelerate API response times from 200ms to 5ms by caching high-frequency database read queries in Redis. Use compound indexes in MongoDB and B-Tree indexes in PostgreSQL to avoid table scans.',
            duration: '40 mins',
            keyPoints: ['Cache-aside pattern & TTL expiration', 'Index Cardinality & Compound Indexes', 'MongoDB Aggregation ($match, $group, $lookup)']
          }
        ],
        assessment: {
          title: 'Database & Caching Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'node_q3_1',
              question: 'What is the primary benefit of the Cache-Aside pattern using Redis?',
              options: ['It replaces all relational databases', 'The application checks the cache first, falling back to database only on a cache miss', 'It encrypts all hard drives', 'It formats SQL queries automatically'],
              correctIndex: 1,
              explanation: 'In Cache-Aside, the application attempts to read from Redis first, and only queries the main database if a cache miss occurs.'
            }
          ]
        }
      },
      {
        level: 4,
        title: 'Level 4 — Microservices & Docker Deployment',
        description: 'Service decomposition, API Gateway, asynchronous message brokers (RabbitMQ/Kafka), and Docker containerization.',
        lessons: [
          {
            id: 'node_l4_1',
            title: 'Microservices Architecture & Event-Driven Message Brokers',
            content: 'Deconstruct monolithic backends into independent microservices communicating via asynchronous event buses (RabbitMQ/Kafka) and exposed through a single API Gateway.',
            duration: '45 mins',
            keyPoints: ['Publish/Subscribe message patterns', 'Docker Compose multi-container services', 'Health check monitoring and circuit breakers']
          }
        ],
        assessment: {
          title: 'Backend Engineering Capstone Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'node_q4_1',
              question: 'What design pattern prevents a failing microservice from causing cascading failures across the entire system?',
              options: ['Singleton Pattern', 'Circuit Breaker Pattern', 'Factory Pattern', 'Observer Pattern'],
              correctIndex: 1,
              explanation: 'The Circuit Breaker pattern detects failures and temporarily halts requests to unhealthy services to prevent system-wide outages.'
            }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 5. CONTENT STRATEGY & TECHNICAL WRITING
  // =========================================================================
  {
    studyRole: 'design',
    category: 'Design',
    title: 'Content Strategy & Technical Writing',
    code: 'content_strategy',
    icon: '✍️',
    description: 'Design user-centric content models, write developer API documentation with OpenAPI/Swagger, create UX microcopy, and establish content governance frameworks.',
    difficulty: 'Beginner',
    estimatedHours: 16,
    order: 5,
    modules: [
      {
        level: 1,
        title: 'Level 1 — Information Hierarchy & UX Writing',
        description: 'Writing concise, scannable interface microcopy, empty states, error messages, and onboarding tours.',
        lessons: [
          {
            id: 'cs_l1_1',
            title: 'UX Microcopy & Actionable Error Messages',
            content: 'UX writing guides users through interfaces with clarity and confidence. Good error messages state clearly what happened, why it happened, and the exact step to resolve it without technical jargon.',
            duration: '20 mins',
            keyPoints: ['Clarity over cleverness in CTA buttons', 'Constructive error handling copy', 'Voice and tone consistency']
          }
        ],
        assessment: {
          title: 'UX Writing Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'cs_q1_1',
              question: 'Which of the following is the best practice for user-facing error messages?',
              options: ['"Error 0x80040154"', '"Something went wrong. Please try again later."', '"Password must be at least 8 characters. Please enter a valid password to continue."', '"Invalid input in column 4"'],
              correctIndex: 2,
              explanation: 'The best error message explains specifically what requirement is missing and how the user can fix it.'
            }
          ]
        }
      },
      {
        level: 2,
        title: 'Level 2 — Technical API Documentation & OpenAPI Specs',
        description: 'Structuring developer documentation, code samples, interactive Swagger definitions, and quickstart guides.',
        lessons: [
          {
            id: 'cs_l2_1',
            title: 'Writing Developer-First API Reference Guides',
            content: 'Great developer documentation provides interactive request/response payload examples, authentication headers, error code tables, and copy-pasteable curl and SDK code snippets.',
            duration: '25 mins',
            keyPoints: ['OpenAPI / Swagger 3.0 specifications', 'Writing comprehensive Quickstart tutorials', 'Documenting rate limits and pagination parameters']
          }
        ],
        assessment: {
          title: 'API Documentation Assessment',
          passingScore: 60,
          questions: [
            {
              id: 'cs_q2_1',
              question: 'What standard format is widely used to define and document REST APIs in machine-readable JSON or YAML?',
              options: ['OpenAPI (Swagger) Specification', 'HTML5 spec', 'PostCSS', 'Docker Compose'],
              correctIndex: 0,
              explanation: 'The OpenAPI Specification (formerly Swagger) is the standard schema for describing RESTful APIs.'
            }
          ]
        }
      }
    ]
  }
];

export const seedEducationDatabase = async () => {
  try {
    if (inMemoryStore.isInMemory) {
      inMemoryStore.courses = [...INITIAL_EDUCATION_COURSES];
      console.log(`[Seed Success]: Loaded ${INITIAL_EDUCATION_COURSES.length} real-world industry courses into In-Memory Database.`);
      return;
    }

    // MongoDB Mode: replace existing collection with real-world tech & design courses
    await EducationCourse.deleteMany({});
    await EducationCourse.insertMany(INITIAL_EDUCATION_COURSES);
    console.log(`[Seed Success]: Seeded ${INITIAL_EDUCATION_COURSES.length} real-world industry courses into MongoDB.`);
  } catch (error) {
    console.error('[Seed Education Error]:', error);
  }
};
