<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">SYSTEM ARCHITECTURE - THE COMPLETE DESIGN</span>

</div>

## <span style="color: #2d3748;">OVERVIEW</span>

<span style="color: #4a5568;">The MediCare Companion System is a sophisticated multi-tier application designed to provide secure, role-based access to life insurance services through AI-powered support. The architecture follows modern best practices with clear separation of concerns, security-first design, and scalable components.</span>

---

## <span style="color: #2d3748;">ARCHITECTURAL LAYERS</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">FOUR-TIER ARCHITECTURE</span>

<span style="color: #4a5568;">The system is organized into four distinct layers:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">Presentation Layer</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">React Frontend - User Interface</span>
</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">API Gateway Layer</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">Node.js BFF - Request Routing</span>
</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">Business Logic Layer</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">Java Backend - Core Services</span>
</div>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">Data Layer</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">PostgreSQL & SQLite - Data Storage</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">SYSTEM DIAGRAM</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">REQUEST FLOW ARCHITECTURE</span>

<span style="color: #4a5568;">How requests flow through the system:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                              │
│                    (React Frontend: Port 5173)                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  - User Interface Components                            │  │
│  │  - State Management (Context API)                      │  │
│  │  - API Client Services                                  │  │
│  │  - Authentication Token Storage                         │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Request + JWT Token
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NODE.JS BFF (Port 3001)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. CORS Middleware (Cross-Origin Check)                 │  │
│  │  2. Body Parser (JSON/Multipart Processing)               │  │
│  │  3. Authentication Middleware (JWT Validation)             │  │
│  │  4. Role Enforcement Middleware (requireRole.js)            │  │
│  │  5. Request Router (Route Handlers)                       │  │
│  │  6. File Upload Handler (Multer)                          │  │
│  │  7. Database Operations (PostgreSQL)                      │  │
│  │  8. Proxy Services (to Java Backend)                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Proxy Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              JAVA SPRING BOOT (Port 8080)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. JWT Authentication Filter (Server-Side Validation)      │  │
│  │  2. Role Recalculation (Deceased Flag Handling)           │  │
│  │  3. Security Configuration (Endpoint Protection)            │  │
│  │  4. RAG Service (Retrieval & Generation)                  │  │
│  │  5. Business Logic Controllers                             │  │
│  │  6. Compliance & Guardrail Services                        │  │
│  │  7. Audit Logger (Activity Logging)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│  POSTGRESQL DATABASE     │    │  AI SERVICES             │
│  (User Data, Claims)     │    │  - AI Gateway (Bifrost)  │
│  (Port 5432)             │    │  - OpenRouter (Fallback) │
│  ┌───────────────────┐   │    │  - Gemini (Fallback)      │
│  │ Users Table       │   │    └─────────────────────────┘
│  │ Conversations     │   │              │
│  │ Messages          │   │              ▼
│  │ Claims            │   │    ┌─────────────────────────┐
│  │ Claim Documents   │   │    │  SQLITE RAG DATABASE     │
│  │ Audit Log         │   │    │  (Policy Chunks)         │
│  └───────────────────┘   │    │  (Embeddings)            │
└─────────────────────────┘    └─────────────────────────┘
```

<span style="color: #6b46c1;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the complete request flow from the user's browser through all system layers. Each box represents a major component, and the numbered lists inside show the key processing steps within each component. The arrows indicate the direction of data flow, with branching showing how the Java backend communicates with both the database and AI services.</span>

</div>

---

## <span style="color: #2d3748;">DETAILED ARCHITECTURE DIAGRAMS</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">FRONTEND COMPONENT ARCHITECTURE</span>

<span style="color: #4a5568;">Detailed React frontend component structure:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Port 5173)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PAGES LAYER     │  │  COMPONENTS LAYER │  │  CONTEXT LAYER   │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Landing.jsx      │  │ ChatHeader.jsx   │  │ AuthContext      │
│ Login.jsx        │  │ ChatInput.jsx    │  │ ThemeContext     │
│ Register.jsx     │  │ MessageList.jsx  │  │ LanguageContext  │
│ Home.jsx         │  │ Sidebar.jsx      │  └──────────────────┘
│ Chat.jsx         │  │ Welcome.jsx      │
│ Quote.jsx        │  │ HelpButton.jsx   │
│ Settings.jsx     │  │ Logo.jsx         │
└──────────────────┘  └──────────────────┘
         │                     │
         └───────────────────┼───────────────────┘
                             ▼
                  ┌──────────────────────────┐
                  │      HOOKS LAYER          │
                  ├──────────────────────────┤
                  │ useChat.js              │
                  │ useTheme.js             │
                  │ useLanguage.js          │
                  └──────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────────┐
                  │     SERVICES LAYER        │
                  ├──────────────────────────┤
                  │ api.js                  │
                  │ authService.js          │
                  │ chatService.js          │
                  │ aiService.js            │
                  │ speechService.js        │
                  └──────────────────────────┘
```

<span style="color: #2b6cb0;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the internal architecture of the React frontend. The Pages Layer contains the main application screens, the Components Layer contains reusable UI elements, the Context Layer manages global state, the Hooks Layer provides reusable logic, and the Services Layer handles API communication. This layered approach keeps the frontend organized and maintainable.</span>

</div>

---

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">AUTHENTICATION FLOW ARCHITECTURE</span>

<span style="color: #4a5568;">Detailed authentication and authorization flow:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGIN PROCESS                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: FRONTEND LOGIN REQUEST                                │
│  - User enters email and password                              │
│  - Frontend sends POST /api/auth/login                         │
│  - Credentials sent in JSON body                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: NODE.JS BFF AUTHENTICATION                            │
│  - Receives login request                                      │
│  - Validates required fields                                   │
│  - Looks up user by email in PostgreSQL                         │
│  - Compares password using bcrypt                              │
│  - If valid, generates JWT token                                │
│  - Attempts to get Java-signed token                            │
│  - Falls back to Node-signed token if Java unavailable          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: TOKEN CREATION                                         │
│  - Token contains: subject, role, policyId, deceasedFlag        │
│  - Token signed with shared secret                              │
│  - Token expires in 1 hour                                      │
│  - Token returned to frontend                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: FRONTEND TOKEN STORAGE                                │
│  - Token stored in secure storage                               │
│  - Token added to Authorization header for subsequent requests  │
│  - User role and info stored in AuthContext                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: SUBSEQUENT REQUEST VALIDATION                          │
│  - Every request includes JWT token in Authorization header      │
│  - Node.js BFF validates token signature and expiry              │
│  - Role middleware checks user permissions                      │
│  - Request proxied to Java backend with token                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: JAVA BACKEND SERVER-SIDE VALIDATION                    │
│  - JWT Authentication Filter validates token again              │
│  - Compares token claims with ProfileStore (server-side data)    │
│  - Recalculates effective role based on deceased flag            │
│  - Sets security context with verified user info                │
│  - Request proceeds to business logic                           │
└─────────────────────────────────────────────────────────────────┘
```

<span style="color: #276749;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the complete authentication flow from initial login through to ongoing request validation. The process starts with user credentials, moves through token generation and storage, and then shows how every subsequent request is validated at multiple layers (Node.js BFF and Java backend) for maximum security. The key security feature is the server-side validation that compares token claims with actual server data.</span>

</div>

---

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">RAG SYSTEM ARCHITECTURE</span>

<span style="color: #4a5568;">Detailed Retrieval-Augmented Generation system architecture:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAG SYSTEM OVERVIEW                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   INGESTION      │  │   RETRIEVAL      │  │   GENERATION     │
│   PHASE          │  │   PHASE          │  │   PHASE          │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Startup Loader   │  │ User Question    │  │ Retrieved Chunks │
│ Policy Chunker    │  │ Embedding Client │  │ Prompt Builder   │
│ Embedding Client  │  │ Similarity Search │  │ LLM Service      │
│ SQLite Storage    │  │ Top-K Selection  │  │ Guardrail Check  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                     │                     │
         └───────────────────┼───────────────────┘
                             ▼
                  ┌──────────────────────────┐
                  │    DATA STORAGE         │
                  ├──────────────────────────┤
                  │ SQLite RAG Database     │
                  │ - Chunks Table          │
                  │ - Embeddings Table     │
                  │ - Metadata              │
                  └──────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────────┐
                  │    SOURCE DOCUMENT       │
                  ├──────────────────────────┤
                  │ Myriad_Technical_Guide.md│
                  │ (MediCare Policy Doc)   │
                  └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  DETAILED RAG PROCESS FLOW                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  INGESTION PHASE (Application Startup)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. RagStartupLoader reads Myriad_Technical_Guide.md        │  │
│  │ 2. Checks if document version already exists in database   │  │
│  │ 3. If new version:                                        │  │
│  │    a. PolicyChunker splits document into chunks            │  │
│  │    b. EmbeddingClient converts chunks to vectors            │  │
│  │    c. Chunks and vectors stored in SQLite                  │  │
│  │ 4. Metadata added (sections, categories, etc.)              │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  RETRIEVAL PHASE (User Question)                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. User asks question via chat interface                   │  │
│  │ 2. IntentGuardService checks if question is allowed       │  │
│  │ 3. EmbeddingClient converts question to vector             │  │
│  │ 4. RagRetrievalService searches for similar chunks          │  │
│  │ 5. Cosine similarity calculation                             │  │
│  │ 6. Top-K most similar chunks selected                       │  │
│  │ 7. Chunks below similarity threshold filtered out          │  │
│  │ 8. Retrieved chunks organized with context                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GENERATION PHASE (AI Response)                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. CompliancePromptBuilder constructs system prompt        │  │
│  │    - Empathy and mode instructions                          │  │
│  │    - Claims Mode directive (if deceased flag active)        │  │
│  │    - Retrieved policy context                              │  │
│  │ 2. LLM service called with prompt (temperature 0.0)        │  │
│  │ 3. AI Gateway tried first (virtual key auth)               │  │
│  │ 4. Falls back to OpenRouter if Gateway unavailable         │  │
│  │ 5. Falls back to Gemini if both unavailable                │  │
│  │ 6. ComplianceGuardrailService checks response               │  │
│  │    - Detects guarantee language                            │  │
│  │    - Detects exact payment promises                         │  │
│  │    - Detects unsupported financial certainty                │  │
│  │ 7. If unsafe, returns safe redirect instead                 │  │
│  │ 8. Conversation memory updated                              │  │
│  │ 9. Audit logger records the interaction                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

<span style="color: #c05621;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the complete RAG system architecture divided into three main phases: Ingestion, Retrieval, and Generation. The Ingestion phase happens at application startup and processes the policy document into searchable chunks. The Retrieval phase handles user questions by finding relevant information. The Generation phase uses AI to create responses while ensuring compliance through guardrails. The detailed flow shows each step in the process with specific component names and their functions.</span>

</div>

---

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">DATABASE ARCHITECTURE DIAGRAM</span>

<span style="color: #4a5568;">Detailed database structure and relationships:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE SCHEMA                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   USERS TABLE     │  │  CONVERSATIONS    │  │    CLAIMS        │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │  │ id (PK)          │
│ first_name       │  │ user_id (FK)     │  │ user_id (FK)     │
│ last_name        │  │ title            │  │ policy_id        │
│ email (UNIQUE)    │  │ preview          │  │ claimant_name    │
│ username (UNIQUE)│  │ created_at       │  │ deceased_name    │
│ password         │  │ updated_at       │  │ date_of_death    │
│ phone            │  └──────────────────┘  │ status           │
│ date_of_birth    │           │              │ documents_validated│
│ id_number        │           │              │ notes            │
│ passport_number  │           │              │ created_at       │
│ country_of_issue  │           │              │ updated_at       │
│ role             │           │              └──────────────────┘
│ policy_id        │           │                      │
│ deceased_flag     │           │                      ▼
│ created_at       │           │           ┌──────────────────┐
└──────────────────┘           │           │ CLAIM_DOCUMENTS   │
         │                    │           ├──────────────────┤
         │                    │           │ id (PK)          │
         ▼                    │           │ claim_id (FK)    │
┌──────────────────┐           │           │ doc_type         │
│   MESSAGES       │           │           │ file_name        │
├──────────────────┤           │           │ mime_type        │
│ id (PK)          │           │           │ is_valid         │
│ conversation_id  │           │           │ validation_notes │
│ (FK)             │           │           │ created_at       │
│ sender           │           │           └──────────────────┘
│ message          │           │
│ created_at       │           │
└──────────────────┘           │
         │                    │
         └───────────────────┼───────────────────┐
                             ▼                   ▼
                  ┌──────────────────┐  ┌──────────────────┐
                  │   AUDIT_LOG      │  │  SQLITE RAG DB   │
                  ├──────────────────┤  ├──────────────────┐
                  │ id (PK)          │  │ CHUNKS TABLE    │
                  │ timestamp        │  ├──────────────────┤
                  │ user_id          │  │ id              │
                  │ policy_id        │  │ chunk_text      │
                  │ role             │  │ embedding       │
                  │ action           │  │ chunk_type      │
                  │ details (JSONB)  │  │ section         │
                  │ escalation_trig  │  │ subsection      │
                  │ status           │  │ category        │
                  └──────────────────┘  └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              DATABASE RELATIONSHIPS AND CONSTRAINTS               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY KEY RELATIONSHIPS (One-to-Many)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Users (1) ────────────────> Conversations (N)               │  │
│  │ Users (1) ────────────────> Claims (N)                      │  │
│  │ Conversations (1) ─────────> Messages (N)                   │  │
│  │ Claims (1) ────────────────> Claim_Documents (N)            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  CASCADE DELETE BEHAVIOR                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ When a User is deleted:                                     │  │
│  │   → All their Conversations are deleted                    │  │
│  │   → All their Claims are deleted                           │  │
│  │   → All Messages in those Conversations are deleted        │  │
│  │   → All Claim Documents are deleted                         │  │
│  │ Audit Log survives (user_id is string, not FK)             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

<span style="color: #6b46c1;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the complete database architecture including both PostgreSQL and SQLite databases. The PostgreSQL database contains user data, conversations, messages, claims, and audit logs. The SQLite database is dedicated to the RAG system with chunks and embeddings. The relationships section shows how tables are connected through foreign keys and explains the cascade delete behavior that maintains data consistency when users are deleted.</span>

</div>

---

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">SECURITY ARCHITECTURE DIAGRAM</span>

<span style="color: #4a5568;">Detailed security layers and protection mechanisms:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│              DEFENSE IN DEPTH SECURITY ARCHITECTURE                │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  LAYER 1:        │  │  LAYER 2:        │  │  LAYER 3:        │
│  FRONTEND        │  │  NODE.JS BFF     │  │  JAVA BACKEND    │
│  SECURITY        │  │  SECURITY        │  │  SECURITY        │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Input Validation │  │ JWT Validation   │  │ Server-Side JWT  │
│ Token Storage    │  │ Role Enforcement  │  │ Validation       │
│ Role-Based UI    │  │ Deceased Flag    │  │ Role Recalc      │
│ HTTPS (Prod)     │  │ Request Blocking  │  │ Intent Guard     │
│                 │  │ CORS Config      │  │ Compliance Guard │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                    │
         └───────────────────┼───────────────────┘
                             ▼
                  ┌──────────────────────────┐
                  │  LAYER 4: DATA SECURITY   │
                  ├──────────────────────────┤
                  │ Password Encryption      │
                  │ (bcrypt)                │
                  │ Secure DB Connections    │
                  │ Audit Logging            │
                  └──────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────────┐
                  │  LAYER 5: NETWORK SEC   │
                  ├──────────────────────────┤
                  │ HTTPS Encryption        │
                  │ CORS Configuration      │
                  │ API Rate Limiting       │
                  └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              ROLE-BASED ACCESS CONTROL FLOW                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  USER REQUEST ARRIVES AT NODE.JS BFF                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Authentication Middleware validates JWT token           │  │
│  │ 2. Token contains: role (POLICYHOLDER/BENEFICIARY)          │  │
│  │ 3. Role Middleware checks if role can access endpoint       │  │
│  │ 4. If beneficiary trying to access what-if: REJECT          │  │
│  │ 5. If deceased flag true and mutation endpoint: REJECT     │  │
│  │ 6. If role valid: ALLOW request to proceed                │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  REQUEST ARRIVES AT JAVA BACKEND                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. JWT Authentication Filter validates token again        │  │
│  │ 2. Extracts: subject, policyId, requestedRole, tokenFlag    │  │
│  │ 3. Looks up policy in ProfileStore                          │  │
│  │ 4. Compares token deceased flag with server deceased flag    │  │
│  │ 5. If mismatch: logs security warning                        │  │
│  │ 6. Recalculates effective role:                              │  │
│  │    - If deceased flag true: demote to BENEFICIARY            │  │
│  │    - If deceased flag false: keep requested role             │  │
│  │ 7. IntentGuardService checks beneficiary restrictions          │  │
│  │ 8. Security context set with effective role                 │  │
│  │ 9. Request proceeds to business logic                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              DECEASED FLAG IMPACT FLOW                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  POLICYHOLDER ACCOUNT (deceased_flag = true)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. User requests access as POLICYHOLDER                    │  │
│  │ 2. Token created with role = POLICYHOLDER                   │  │
│  │ 3. Node.js BFF allows (role looks valid)                    │  │
│  │ 4. Java backend checks ProfileStore                         │  │
│  │ 5. Server deceased flag = true (conflicts with token)        │  │
│  │ 6. Effective role recalculated to BENEFICIARY                │  │
│  │ 7. What-if and self-service endpoints blocked               │  │
│  │ 8. Chat switches to Empathetic Claims Mode                  │  │
│  │ 9. All responses use claims-focused prompts                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

<span style="color: #c53030;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the comprehensive security architecture with five distinct layers of protection. The Role-Based Access Control flow demonstrates how security checks happen at both the Node.js BFF and Java backend levels. The Deceased Flag Impact Flow shows how the system automatically adjusts user permissions when someone passes away, demoting policyholders to beneficiary-like access and switching the chat system to empathetic claims mode.</span>

</div>

---

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">API COMMUNICATION ARCHITECTURE</span>

<span style="color: #4a5568;">Detailed API communication patterns between services:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│              API ENDPOINT ARCHITECTURE                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   FRONTEND       │  │   NODE.JS BFF    │  │   JAVA BACKEND  │
│   API CALLS      │  │   ROUTES         │  │   CONTROLLERS   │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ POST /api/auth/  │  │ POST /api/auth   │  │ POST /api/dev/  │
│   login          │  │   /login         │  │   mock-token    │
│ POST /api/auth/  │  │ POST /api/auth   │  │ GET /api/what-  │
│   register       │  │   /register      │  │   if/ping        │
│ POST /api/chat   │  │ POST /api/chat   │  │ POST /api/what- │
│                 │  │                 │  │   if/simulate    │
│ POST /api/what-  │  │ POST /api/what-  │  │ POST /api/self- │
│   if/simulate    │  │   if/simulate    │  │   service/address│
│ POST /api/self-  │  │ POST /api/self-  │  │ GET /api/claims/ │
│   service/address│  │   service/address│  │   ping           │
│ POST /api/claims │  │ POST /api/claims │  │ POST /api/rag/  │
│                 │  │                 │  │   chat           │
│ POST /api/rag/  │  │ POST /api/rag   │  │   query          │
│   chat           │  │   /chat         │  │                  │
│ GET /api/rag/    │  │ POST /api/rag   │  │                  │
│   query          │  │   /query        │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                             ▼
                  ┌──────────────────────────┐
                  │   HTTP COMMUNICATION     │
                  ├──────────────────────────┤
                  │ Method: POST/GET         │
                  │ Headers: Authorization   │
                  │ Body: JSON/Multipart     │
                  │ Response: JSON           │
                  └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              REQUEST/RESPONSE FLOW DETAIL                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND → NODE.JS BFF (Example: Chat Request)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Request:                                                  │  │
│  │ POST /api/chat                                             │  │
│  │ Headers:                                                  │  │
│  │   Authorization: Bearer <jwt_token>                        │  │
│  │   Content-Type: application/json                           │  │
│  │ Body:                                                     │  │
│  │   {                                                       │  │
│  │     "message": "What is my coverage amount?",               │  │
│  │     "conversationId": "123"                                 │  │
│  │   }                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  Response:                                                  │
│  {                                                           │
│    "answer": "Your current coverage is R500,000...",        │
│    "conversationId": "123",                                   │
│    "timestamp": "2024-01-15T10:30:00Z"                        │
│  }                                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  NODE.JS BFF → JAVA BACKEND (Proxy Request)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Request:                                                  │  │
│  │ POST http://localhost:8080/api/rag/chat                    │  │
│  │ Headers:                                                  │  │
│  │   Authorization: Bearer <jwt_token>                        │  │
│  │   Content-Type: application/json                           │
│  │ Body:                                                     │  │
│  │   {                                                       │  │
│  │     "message": "What is my coverage amount?",               │  │
│  │     "conversationId": "123",                                 │  │
│  │     "deceasedFlag": false                                   │  │
│  │   }                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  Response:                                                  │
│  {                                                           │
│    "answer": "Your current coverage is R500,000...",        │
│    "conversationId": "123",                                   │
│    "grounded": true                                           │
│  }                                                           │
└─────────────────────────────────────────────────────────────────┘
```

<span style="color: #2b6cb0;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the complete API communication architecture with all endpoints across the three main services. The Endpoint Architecture section lists every API endpoint in the system. The Request/Response Flow Detail shows a specific example of how a chat request flows from the frontend through the Node.js BFF to the Java backend, including the exact HTTP headers, body structure, and response format. This helps developers understand the exact data formats and communication patterns used throughout the system.</span>

</div>

---

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">DEPLOYMENT ARCHITECTURE DIAGRAM</span>

<span style="color: #4a5568;">Detailed deployment architecture for different environments:</span>

```
┌─────────────────────────────────────────────────────────────────┐
│              DEVELOPMENT ENVIRONMENT ARCHITECTURE                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│  DEVELOPER WORKSTATION (Local Machine)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Terminal 1: Java Backend (Port 8080)                       │  │
│  │   ./mvnw spring-boot:run                                   │  │
│  │   - Mock RAG mode enabled                                  │  │
│  │   - Detailed logging                                      │  │
│  │   - Hot reload enabled                                      │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ Terminal 2: Node.js BFF (Port 3001)                        │  │
│  │   npm start                                                 │  │
│  │   - Local PostgreSQL                                        │  │
│  │   - Development environment variables                       │  │
│  │   - Error stack traces                                      │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ Terminal 3: React Frontend (Port 5173)                     │  │
│  │   npm run dev                                               │  │
│  │   - Hot module replacement                                  │  │
│  │   - Source maps enabled                                    │  │
│  │   - Development mode build                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              PRODUCTION ENVIRONMENT ARCHITECTURE                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PRODUCTION INFRASTRUCTURE                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    LOAD BALANCER                             │  │
│  │              (SSL Termination, DDoS Protection)              │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│    ┌──────────────────┴──────────────────┐                   │
│    ▼                                       ▼                   │
│ ┌──────────────┐                   ┌──────────────┐               │
│ │  FRONTEND    │                   │  FRONTEND    │               │
│ │  (CDN)        │                   │  (CDN)        │               │
│ │  Static Files│                   │  Static Files│               │
│ └──────────────┘                   └──────────────┘               │
│                                                       │             │
│            ┌──────────────────────────────────────┘             │
│            ▼                                                 │
│  ┌───────────────────────────────────────────────────┐         │
│  │        NODE.JS BFF CLUSTER (Port 3001)           │         │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐         │         │
│  │  │ Instance│  │ Instance│  │ Instance│         │         │
│  │  │   1     │  │   2     │  │   3     │         │         │
│  │  └─────────┘  └─────────┘  └─────────┘         │         │
│  └───────────────────────────────────────────────────┘         │
│                       │                                          │
│            ┌──────────────────────────────────────┐             │
│            ▼                                                 │
│  ┌───────────────────────────────────────────────────┐         │
│  │     JAVA BACKEND CLUSTER (Port 8080)             │         │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐         │         │
│  │  │ Instance│  │ Instance│  │ Instance│         │         │
│  │  │   1     │  │   2     │  │   3     │         │         │
│  │  └─────────┘  └─────────┘  └─────────┘         │         │
│  └───────────────────────────────────────────────────┘         │
│                       │                                          │
│    ┌──────────────────┴──────────────────┐                   │
│    ▼                                       ▼                   │
│ ┌──────────────┐                   ┌──────────────┐               │
│ │ POSTGRESQL   │                   │ POSTGRESQL   │               │
│ │ PRIMARY      │                   │ READ REPLICA │               │
│ │ (Master)     │                   │ (Slaves)     │               │
│ └──────────────┘                   └──────────────┘               │
│                                                       │             │
│            ┌──────────────────────────────────────┘             │
│            ▼                                                 │
│  ┌───────────────────────────────────────────────────┐         │
│  │              AI SERVICES (External)                  │         │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │         │
│  │  │ AI Gateway│  │OpenRouter│  │  Gemini  │         │         │
│  │  └──────────┘  └──────────┘  └──────────┘         │         │
│  └───────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

<span style="color: #276749;">**Diagram Explanation:**</span>
<span style="color: #4a5568;">This diagram shows the deployment architecture for both development and production environments. The Development Environment shows how all three services run locally on a developer's machine with specific terminal configurations and development features enabled. The Production Environment shows a scaled infrastructure with load balancers, CDN for static files, clustered instances of Node.js and Java backends, database replication for performance, and external AI services. This demonstrates how the architecture scales from local development to production deployment.</span>

</div>

---

## <span style="color: #2d3748;">COMPONENT ARCHITECTURE</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">REACT FRONTEND ARCHITECTURE</span>

<span style="color: #4a5568;">Frontend component structure:</span>

#### <span style="color: #2c5282;">Core Components</span>
<span style="color: #4a5568;">- Pages: Landing, Login, Register, Home, Chat, Quote, Settings</span>
<span style="color: #4a5568;">- UI Components: ChatHeader, ChatInput, MessageList, Sidebar, Welcome</span>
<span style="color: #4a5568;">- Context Providers: AuthContext, ThemeContext, LanguageContext</span>

#### <span style="color: #2c5282;">State Management</span>
<span style="color: #4a5568;">- React Context for global state</span>
<span style="color: #4a5568;">- Custom hooks for reusable logic (useChat, useTheme, useLanguage)</span>
<span style="color: #4a5568;">- Local component state for UI-specific data</span>

#### <span style="color: #2c5282;">Service Layer</span>
<span style="color: #4a5568;">- API client for backend communication</span>
<span style="color: #4a5568;">- Auth service for login/logout</span>
<span style="color: #4a5568;">- Chat service for RAG integration</span>

</div>

---

## <span style="color: #2d3748;">NODE.JS BFF ARCHITECTURE</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">BACKEND FOR FRONTEND DESIGN</span>

<span style="color: #4a5568;">Node.js backend architecture:</span>

#### <span style="color: #22543d;">Middleware Stack</span>
<span style="color: #4a5568;">- CORS middleware for cross-origin requests</span>
<span style="color: #4a5568;">- Body parser for JSON and multipart data</span>
<span style="color: #4a5568;">- Authentication middleware (JWT validation)</span>
<span style="color: #4a5568;">- Role enforcement middleware (requireRole)</span>

#### <span style="color: #22543d;">Route Handlers</span>
<span style="color: #4a5568;">- Auth routes: /api/auth (login, register)</span>
<span style="color: #4a5568;">- Chat routes: /api/chat (RAG integration)</span>
<span style="color: #4a5568;">- What-If routes: /api/what-if (premium calculator)</span>
<span style="color: #4a5568;">- Self-Service routes: /api/self-service (address updates)</span>
<span style="color: #4a5568;">- RAG routes: /api/rag (query and chat)</span>
<span style="color: #4a5568;">- Claims routes: /api/claims (claims processing)</span>

#### <span style="color: #22543d;">Proxy Services</span>
<span style="color: #4a5568;">- HTTP proxy to Java backend</span>
<span style="color: #4a5568;">- Multipart proxy for file uploads</span>
<span style="color: #4a5568;">- Error handling and retry logic</span>

#### <span style="color: #22543d;">Database Integration</span>
<span style="color: #4a5568;">- PostgreSQL connection pooling</span>
<span style="color: #4a5568;">- User model and authentication</span>
<span style="color: #4a5568;">- Claims and document storage</span>

</div>

---

## <span style="color: #2d3748;">JAVA BACKEND ARCHITECTURE</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">SPRING BOOT MICROSERVICE</span>

<span style="color: #4a5568;">Java backend architecture:</span>

#### <span style="color: #dd6b20;">Security Layer</span>
<span style="color: #4a5568;">- JWT Authentication Filter (request validation)</span>
<span style="color: #4a5568;">- Security Configuration (endpoint protection)</span>
<span style="color: #4a5568;">- Role-based authorization (method-level security)</span>
<span style="color: #4a5568;">- Mock JWT Service (token generation and validation)</span>

#### <span style="color: #dd6b20;">RAG System</span>
<span style="color: #4a5568;">- Startup Loader (document ingestion)</span>
<span style="color: #4a5568;">- Policy Chunker (text segmentation)</span>
<span style="color: #4a5568;">- Embedding Client (text-to-vector conversion)</span>
<span style="color: #4a5568;">- Retrieval Service (similarity search)</span>
<span style="color: #4a5568;">- Grounded Chat Service (response generation)</span>
<span style="color: #4a5568;">- Compliance Prompt Builder (prompt construction)</span>
<span style="color: #4a5568;">- Guardrail Services (intent and compliance checks)</span>

#### <span style="color: #dd6b20;">Business Services</span>
<span style="color: #4a5568;">- What-If Calculation Service (premium calculator)</span>
<span style="color: #4a5568;">- Self-Service Controller (address updates)</span>
<span style="color: #4a5568;">- Claims Controller (claims processing)</span>
<span style="color: #4a5568;">- Proof of Residence Verifier (document validation)</span>

#### <span style="color: #dd6b20;">Data Layer</span>
<span style="color: #4a5568;">- SQLite for RAG system (policy chunks and vectors)</span>
<span style="color: #4a5568;">- Profile Store (mock policy profiles)</span>
<span style="color: #4a5568;">- Audit Logger (system activity logging)</span>

</div>

---

## <span style="color: #2d3748;">DATABASE ARCHITECTURE</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">DUAL DATABASE DESIGN</span>

<span style="color: #4a5568;">The system uses two different databases:</span>

#### <span style="color: #553c9a;">PostgreSQL (Application Data)</span>
<span style="color: #4a5568;">- Users table (authentication and profiles)</span>
<span style="color: #4a5568;">- Conversations table (chat sessions)</span>
<span style="color: #4a5568;">- Messages table (chat history)</span>
<span style="color: #4a5568;">- Claims table (death claim tickets)</span>
<span style="color: #4a5568;">- Claim Documents table (uploaded files)</span>
<span style="color: #4a5568;">- Audit Log table (system activity trail)</span>

#### <span style="color: #553c9a;">SQLite (RAG System)</span>
<span style="color: #4a5568;">- Chunks table (document segments)</span>
<span style="color: #4a5568;">- Embeddings table (vector representations)</span>
<span style="color: #4a5568;">- Metadata storage (chunk categories and sections)</span>

#### <span style="color: #553c9a;">Database Relationships</span>
<span style="color: #4a5568;">- Cascade deletes for data consistency</span>
<span style="color: #4a5568;">- Foreign key constraints for referential integrity</span>
<span style="color: #4a5568;">- Unique constraints for data validation</span>

</div>

---

## <span style="color: #2d3748;">SECURITY ARCHITECTURE</span>

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">DEFENSE IN DEPTH APPROACH</span>

<span style="color: #4a5568;">Multiple security layers protect the system:</span>

#### <span style="color: #e53e3e;">Layer 1: Frontend Security</span>
<span style="color: #4a5568;">- Input validation before API calls</span>
<span style="color: #4a5568;">- Secure token storage</span>
<span style="color: #4a5568;">- Role-based UI hiding</span>

#### <span style="color: #e53e3e;">Layer 2: Node.js BFF Security</span>
<span style="color: #4a5568;">- JWT token validation</span>
<span style="color: #4a5568;">- Role enforcement middleware</span>
<span style="color: #4a5568;">- Deceased flag checking</span>
<span style="color: #4a5568;">- Request blocking before proxy</span>

#### <span style="color: #e53e3e;">Layer 3: Java Backend Security</span>
<span style="color: #4a5568;">- Server-side JWT validation</span>
<span style="color: #4a5568;">- Role recalculation with deceased flag</span>
<span style="color: #4a5568;">- Intent guard for beneficiaries</span>
<span style="color: #4a5568;">- Compliance guardrail for responses</span>

#### <span style="color: #e53e3e;">Layer 4: Data Security</span>
<span style="color: #4a5568;">- Encrypted passwords (bcrypt)</span>
<span style="color: #4a5568;">- Secure database connections</span>
<span style="color: #4a5568;">- Audit logging for compliance</span>

#### <span style="color: #e53e3e;">Layer 5: Network Security</span>
<span style="color: #4a5568;">- HTTPS encryption in production</span>
<span style="color: #4a5568;">- CORS configuration</span>
<span style="color: #4a5568;">- API rate limiting (if implemented)</span>

</div>

---

## <span style="color: #2d3748;">AI INTEGRATION ARCHITECTURE</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">MULTI-PROVIDER FALLBACK CHAIN</span>

<span style="color: #4a5568;">AI services with fallback architecture:</span>

#### <span style="color: #2c5282;">Primary: AI Gateway (Bifrost)</span>
<span style="color: #4a5568;">- Virtual key authentication</span>
<span style="color: #4a5568;">- Enterprise-grade service</span>
<span style="color: #4a5568;">- Production default</span>

#### <span style="color: #2c5282;">Fallback 1: OpenRouter</span>
<span style="color: #4a5568;">- API key authentication</span>
<span style="color: #4a5568;">- Configurable model selection</span>
<span style="color: #4a5568;">- Secondary option</span>

#### <span style="color: #2c5282;">Fallback 2: Gemini</span>
<span style="color: #4a5568;">- Google API key authentication</span>
<span style="color: #4a5568;">- Third option</span>

#### <span style="color: #2c5282;">Mock Mode</span>
<span style="color: #4a5568;">- No external API calls</span>
<span style="color: #4a5568;">- Development and testing</span>
<span style="color: #4a5568;">- Keyword-based retrieval</span>

#### <span style="color: #2c5282;">Embedding Services</span>
<span style="color: #4a5568;">- Gateway embeddings (live mode)</span>
<span style="color: #4a5568;">- Mock embeddings (development mode)</span>

</div>

---

## <span style="color: #2d3748;">COMMUNICATION PATTERNS</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">SERVICE COMMUNICATION</span>

<span style="color: #4a5568;">How services communicate:</span>

#### <span style="color: #22543d;">Frontend to Node.js</span>
<span style="color: #4a5568;">- REST API calls via HTTP</span>
<span style="color: #4a5568;">- JWT token in Authorization header</span>
<span style="color: #4a5568;">- JSON request/response format</span>

#### <span style="color: #22543d;">Node.js to Java</span>
<span style="color: #4a5568;">- HTTP proxy requests</span>
<span style="color: #4a5568;">- Forwarded JWT tokens</span>
<span style="color: #4a5568;">- Multipart for file uploads</span>

#### <span style="color: #22543d;">Java to AI Services</span>
<span style="color: #4a5568;">- HTTP client calls</span>
<span style="color: #4a5568;">- API key or virtual key authentication</span>
<span style="color: #4a5568;">- JSON payload with prompts and context</span>

#### <span style="color: #22543d;">Database Access</span>
<span style="color: #4a5568;">- Connection pooling for efficiency</span>
<span style="color: #4a5568;">- Prepared statements for security</span>
<span style="color: #4a5568;">- Transaction management for data consistency</span>

</div>

---

## <span style="color: #2d3748;">DEPLOYMENT ARCHITECTURE</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Development Environment</span>
<span style="color: rgba(255,255,255,0.9);">Local development with mock services, detailed logging, and hot-reload for rapid iteration</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Staging Environment</span>
<span style="color: rgba(255,255,255,0.9);">Pre-production testing with real services but isolated data for validation</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Production Environment</span>
<span style="color: rgba(255,255,255,0.9);">Live deployment with optimized configuration, real services, and production databases</span>

</div>

</div>

---

## <span style="color: #2d3748;">SCALABILITY CONSIDERATIONS</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">ARCHITECTURAL SCALABILITY</span>

<span style="color: #4a5568;">Design considerations for scaling:</span>

#### <span style="color: #553c9a;">Horizontal Scaling</span>
<span style="color: #4a5568;">- Node.js BFF can be scaled horizontally behind load balancer</span>
<span style="color: #4a5568;">- Java backend can be scaled with multiple instances</span>
<span style="color: #4a5568;">- Frontend is static content (CDN-friendly)</span>

#### <span style="color: #553c9a;">Database Scaling</span>
<span style="color: #4a5568;">- PostgreSQL can be scaled with read replicas</span>
<span style="color: #4a5568;">- Connection pooling reduces database load</span>
<span style="color: #4a5568;">- SQLite RAG database can be replicated or moved to PostgreSQL</span>

#### <span style="color: #553c9a;">Caching Strategy</span>
<span style="color: #4a5568;">- Response caching for repeated queries</span>
<span style="color: #4a5568;">- Token caching for reduced validation overhead</span>
<span style="color: #4a5568;">- Embedding caching for RAG system</span>

#### <span style="color: #553c9a;">Performance Optimization</span>
<span style="color: #4a5568;">- Code splitting for frontend</span>
<span style="color: #4a5568;">- Lazy loading for components</span>
<span style="color: #4a5568;">- Database query optimization</span>

</div>

---

## <span style="color: #2d3748;">MONITORING AND OBSERVABILITY</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">SYSTEM MONITORING</span>

<span style="color: #4a5568;">Monitoring capabilities:</span>

#### <span style="color: #2c5282;">Application Logging</span>
<span style="color: #4a5568;">- Structured logging across all services</span>
<span style="color: #4a5568;">- Log levels (DEBUG, INFO, WARN, ERROR)</span>
<span style="color: #4a5568;">- Centralized log aggregation (if implemented)</span>

#### <span style="color: #2c5282;">Audit Trail</span>
<span style="color: #4a5568;">- Complete audit log in PostgreSQL</span>
<span style="color: #4a5568;">- User actions and access attempts</span>
<span style="color: #4a5568;">- Security event tracking</span>

#### <span style="color: #2c5282;">Health Checks</span>
<span style="color: #4a5568;">- Spring Boot health endpoints</span>
<span style="color: #4a5568;">- Database connectivity checks</span>
<span style="color: #4a5568;">- Service availability monitoring</span>

#### <span style="color: #2c5282;">Performance Metrics</span>
<span style="color: #4a5568;">- Response time tracking</span>
<span style="color: #4a5568;">- Error rate monitoring</span>
<span style="color: #4a5568;">- Resource utilization (if implemented)</span>

</div>

---

## <span style="color: #2d3748;">SUMMARY</span>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">ARCHITECTURAL PRINCIPLES</span>

<span style="color: rgba(255,255,255,0.95);">The system architecture demonstrates:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Separation of Concerns** - Each layer has distinct responsibilities</span>
<span style="color: white;">- **Security First** - Multiple security layers protect the system</span>
<span style="color: white;">- **Scalability** - Designed to handle growth and increased load</span>
<span style="color: white;">- **Resilience** - Fallback chains ensure service availability</span>
<span style="color: white;">- **Maintainability** - Clear structure makes the system easy to understand and modify</span>
<span style="color: white;">- **Observability** - Comprehensive logging and monitoring support operations</span>
<span style="color: white;">- **Flexibility** - Modular design allows for easy feature additions</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">The MediCare Companion system architecture represents a modern, enterprise-grade approach to building secure, scalable AI-powered applications. By separating concerns across distinct layers, implementing defense-in-depth security, and designing for scalability and resilience, the architecture provides a solid foundation for delivering reliable insurance services while maintaining the flexibility to evolve with changing requirements and technologies.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This documentation provides a comprehensive architectural overview of the MediCare Companion system, covering all layers, components, security measures, communication patterns, and design principles that make up the complete application architecture.</span>

</div>