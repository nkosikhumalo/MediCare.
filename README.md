
# <span style="color: #E4032B;">MediCare</span> AI Companion

> Accessible Life Insurance AI Companion - Environment Shell

---

## <span style="color: #E4032B;">Overview</span>

The MediCare AI Companion is a secure, role-based insurance platform demonstrating enterprise-grade **security and identity architecture**. The system uses a multi-layered approach with separate authentication layers for end-users and machine-to-machine communication.

### <span style="color: #9CA3AF;">Core Components</span>

| Component | Technology | Purpose |
| ----------- | ----------- | --------- |
| Host Application | Next.js | Insurer Portal |
| Companion Widget | React | Embedded iframe in host |
| API Backend | Node.js/Express | BFF with JWT & session management |
| Microservice | Java/Spring Boot | AI Gateway & business logic |

---

## <span style="color: #E4032B;">System Architecture</span>

```
Host App (Next.js 3000) 
    ↓
Companion Widget (iframe)
    ↓
Node.js BFF (3001)
    ↓
Java Microservice (8081)
    ↓
AI Gateway
```

**Authentication Model:**

- **End-User:** Mock JWT with role-based access (POLICYHOLDER / BENEFICIARY)
- **Machine-to-Machine:** OAuth2 client-credentials for AI Gateway

---

## <span style="color: #E4032B;">Prerequisites & Installation</span>

### <span style="color: #9CA3AF;">Step 1: Install Required Software (Windows)</span>

#### <span style="color: #E4032B;">Node.js</span> (for Frontend & Node.js Backend)

1. Visit: <https://nodejs.org>
2. Download **LTS version** (18.x or higher)
3. Run the installer and follow the prompts
4. Check installation in PowerShell or Command Prompt:

   ```cmd
   node --version
   npm --version
   ```

#### <span style="color: #E4032B;">Java Development Kit 21</span> (for Java Microservice)

1. Visit: <https://www.oracle.com/java/technologies/downloads/>
2. Download **JDK 21 for Windows**
3. Run the installer with default settings
4. Verify installation:

   ```cmd
   java -version
   javac -version
   ```

#### <span style="color: #E4032B;">Git</span> (Optional, for version control)

1. Visit: <https://git-scm.com>
2. Download the Windows installer
3. Run installer with default settings

#### <span style="color: #E4032B;">Database</span> (PostgreSQL - Optional for advanced features)

1. Visit: <https://www.postgresql.org/download/windows/>
2. Download the latest version
3. Run installer and note the password you set

---

## <span style="color: #E4032B;">Running the Application</span>

### <span style="color: #9CA3AF;">Setup Steps</span>

#### 1. Open the Project Folder

Navigate to your project directory in Command Prompt or PowerShell:

```cmd
cd C:\path\to\Candor
```

#### 2. Start the Node.js Backend (Port 3001)

Open a **new Command Prompt/PowerShell window**:

```cmd
cd companion-backend-node
npm install
npm run dev
```

You should see: `Server running on http://localhost:3001`

#### 3. Start the Java Microservice (Port 8081)

Open a **second Command Prompt/PowerShell window**:

```cmd
cd companion-backend
mvnw spring-boot:run
```

You should see: `Started CompanionBackendApplication`

#### 4. Start the Frontend (Port 3000)

Open a **third Command Prompt/PowerShell window**:

```cmd
cd companion-frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000`

---

### <span style="color: #9CA3AF;">Access the Application</span>

Once all three services are running, open your browser and visit:

```
http://localhost:3000
```

The system uses three separate terminal windows:

- **Terminal 1:** Node.js Backend (companion-backend-node)
- **Terminal 2:** Java Service (companion-backend)
- **Terminal 3:** Frontend (companion-frontend)

---

## <span style="color: #E4032B;">Testing the Application</span>

### <span style="color: #9CA3AF;">Accessing the Application</span>

Once all three services are running, open your browser and visit:

```
http://localhost:3000
```

### <span style="color: #9CA3AF;">Testing Role-Based Access</span>

The system enforces role-based restrictions:

| Feature | Policyholder | Beneficiary |
| --------- | ------------- | ------------ |
| Chat Support | YES | YES |
| What-If Premium Calculator | YES | NO |
| Self-Service Updates | YES | NO |
| Claims Support | YES | YES |
| Policy Information | YES | YES |

### <span style="color: #9CA3AF;">Running Automated Tests</span>

To verify the security model is working correctly, run the automated tests:

**Windows Command Prompt/PowerShell (in companion-backend directory):**

```cmd
mvnw test
```

All 5 security tests should pass, confirming:

- Policyholder access to What-If features
- Beneficiary blocked from What-If
- Deceased policy holder demotion to beneficiary
- Invalid token rejection
- Missing token rejection

---

## <span style="color: #E4032B;">Project Structure</span>

```
Candor/
├── companion-backend/                 Java/Spring Boot Service (Port 8081)
│   ├── src/main/java/com/candor/
│   │   ├── domain/                   Configuration & data models
│   │   ├── security/                 JWT & authentication
│   │   ├── web/                      API controllers
│   │   ├── rag/                      RAG & AI integration
│   │   └── whatif/                   Premium calculation
│   ├── src/test/java/                Security tests
│   ├── pom.xml                       Maven dependencies
│   └── .env                          Environment variables
│
├── companion-backend-node/            Node.js/Express BFF (Port 3001)
│   ├── server.js                     Main server file
│   ├── routes/                       API routes
│   ├── controllers/                  Request handlers
│   ├── middleware/                   Auth & role middleware
│   ├── services/                     Business logic
│   ├── database/                     PostgreSQL setup
│   ├── models/                       Data models
│   ├── package.json                  Dependencies
│   └── .env                          Environment variables
│
├── companion-frontend/                React/Next.js Frontend (Port 3000)
│   ├── src/pages/                    Page components
│   ├── src/components/               Reusable components
│   ├── src/services/                 API services
│   ├── src/styles/                   CSS styles
│   ├── src/context/                  State management
│   ├── package.json                  Dependencies
│   ├── vite.config.js                Build configuration
│   └── .env                          Environment variables
│
├── README.md                          This file
└── .gitignore                         Git ignore rules
```

---

## <span style="color: #E4032B;">Security Features</span>

The MediCare system implements enterprise-grade security controls:

### <span style="color: #9CA3AF;">Authentication</span>

- JSON Web Tokens (JWT) with cryptographic signing
- Role-based access control (RBAC)
- Per-request validation on all endpoints
- Token expiration management

### <span style="color: #9CA3AF;">Authorization</span>

- Endpoint-level role enforcement
- Deceased flag server-side validation
- Policy holder vs. beneficiary restrictions
- Session management and logout

### <span style="color: #9CA3AF;">Protected Endpoints</span>

| Endpoint | Policyholder | Beneficiary | Description |
| ---------- | ------------- | ------------ | ------------- |
| /api/what-if/* | ALLOWED | BLOCKED | Premium simulation |
| /api/self-service/* | ALLOWED | BLOCKED | Policy updates |
| /api/qa/* | ALLOWED | ALLOWED | Chat support |
| /api/claims/* | ALLOWED | ALLOWED | Claims submission |
| /api/rag/* | ALLOWED | ALLOWED | Document search |

---

## <span style="color: #E4032B;">Environment Variables</span>

### <span style="color: #9CA3AF;">Node.js Backend</span> (.env in companion-backend-node)

```
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=candor_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_api_key
```

### <span style="color: #9CA3AF;">Java Backend</span> (.env in companion-backend)

```
MOCK_JWT_SIGNING_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
AI_GATEWAY_VIRTUAL_KEY=optional_gateway_key
```

### <span style="color: #9CA3AF;">Frontend</span> (.env in companion-frontend)

```
VITE_API_BASE=http://localhost:3001
```

---

## <span style="color: #E4032B;">Troubleshooting</span>

### <span style="color: #9CA3AF;">Issue: Port Already in Use</span>

If you see "Port 3000/3001/8081 is already in use":

**Windows PowerShell:**

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

Or simply change the port in the respective `.env` file.

### <span style="color: #9CA3AF;">Issue: Node Modules Not Found</span>

Make sure you ran `npm install` in each directory:

```cmd
cd companion-backend-node
npm install

cd ../companion-frontend
npm install
```

### <span style="color: #9CA3AF;">Issue: Java Service Won't Start</span>

Ensure JDK 21 is installed and JAVA_HOME is set:

```cmd
java -version
```

Should show version 21.x or higher.

### <span style="color: #9CA3AF;">Issue: Database Connection Error</span>

Verify PostgreSQL is running (if using advanced features):

```cmd
psql --version
```

---

## <span style="color: #E4032B;">Technologies Used</span>

| Layer | Technology | Version |
| ------- | ----------- | --------- |
| Frontend | React | 18+ |
| Build Tool | Vite | Latest |
| Backend (Node) | Express.js | 4.x |
| Backend (Java) | Spring Boot | 3.3 |
| Database | PostgreSQL | 14+ |
| Authentication | JWT | Custom implementation |
| UI Framework | React Components | Custom |

---

## <span style="color: #E4032B;">Support</span>

For issues or questions regarding setup and deployment:

1. Review the code comments in security-related files
2. Run the automated tests to verify your setup
3. Check Windows-specific instructions above
