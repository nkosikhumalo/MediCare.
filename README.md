
# Accessible Life Insurance AI Companion: Environment Shell

**Team:** House of Candor
**AI Companion Name:** Candor
**Challenge:** 2026 Virtual Team Challenge (Design & Architecture round)



## 📋 Overview

This repository contains the Environment Shell for our AI companion, demonstrating the **security and identity architecture** (Core Journey 1) that will power the full system.

The architecture follows the recommended reference architecture with four trust zones:
- **Host (parent) app:** Next.js application representing the Insurer Portal
- **Embedded companion (iframe):** React/Next.js widget embedded in the host
- **Companion backend:** Node.js/Express BFF with JWT generation and session management
- **AI Microservice:** Java/Spring Boot service handling AI Gateway calls and business logic



## 🏗️ Architecture

```
Host App (Next.js) → Companion (iframe) → Node.js BFF (Port 3001) → Java Microservice (Port 8081) → AI Gateway
```

The system uses two separate authentication layers:
1. **End-user identity:** Mock JWT with role-based access (POLICYHOLDER / BENEFICIARY)
2. **Machine-to-machine:** OAuth2 client-credentials for the AI Gateway (backend-only)



## 🚀 Run It

### Prerequisites
- **Node.js 18+** (for frontend and Node.js BFF)
- **JDK 21** (for Java microservice)

### 1. Backend Setup (Node.js BFF)
```bash
cd companion-backend-node
npm install
npm run dev
# Runs on http://localhost:3001
```

### 2. Backend Setup (Java Microservice)
```bash
cd companion-backend
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

### 3. Frontend Setup (Next.js)
```bash
cd companion-frontend
npm install
npm run dev
# Runs on http://localhost:3000
```



## 🧪 Test the Auth Flow

1. Open `http://localhost:3000/host`
2. Try these scenarios:

| Policy ID | Role | What-If Result |
|---|---|---|
| POL-1001 | POLICYHOLDER | ✅ 200 OK |
| POL-1001 | BENEFICIARY | ❌ 403 Forbidden |
| POL-2002 | POLICYHOLDER | ❌ 403 Forbidden (deceased → demoted to BENEFICIARY) |

The **deceased flag promotion** is enforced server-side: POL-2002 is seeded as deceased, so the backend demotes any request to BENEFICIARY regardless of the token's role claim.



## 🔒 Security Model

| Feature | Implementation |
|---|---|
| **JWT Authentication** | `MockJwtService.java` - issues and validates signed JWTs |
| **Server-side Enforcement** | `JwtAuthenticationFilter.java` - validates on EVERY request |
| **Role-based Authorization** | `SecurityConfig.java` - endpoint protection by role |
| **Deceased Flag Promotion** | `ProfileStore.java` - server-side flag overrides token claims |
| **Host-to-Companion Handoff** | iframe + `postMessage` with origin validation |



## 📁 Project Structure

```
house-of-candor/
├── companion-backend/          # Java/Spring Boot Microservice (Port 8081)
│   ├── src/main/java/com/momentum/companion/
│   │   ├── domain/             # ProfileStore, CompanionRole
│   │   ├── security/           # JwtAuthenticationFilter, MockJwtService
│   │   ├── web/                # AuthController, DemoProtectedController
│   │   └── config/             # PropertiesConfig
│   ├── src/test/               # AuthEnforcementIntegrationTest
│   └── pom.xml
├── companion-backend-node/     # Node.js/Express BFF (Port 3001)
│   ├── server.js
│   ├── package.json
│   └── .env
├── companion-frontend/         # Next.js Host + Companion (Port 3000)
│   ├── pages/
│   │   ├── index.js            # Hello World
│   │   ├── host.js             # Host app with mock login
│   │   └── companion.js        # Embedded widget with origin validation
│   ├── lib/config.js           # ALLOWED_HOST_ORIGINS
│   └── package.json
├── docs/
│   └── architecture-diagram.png
├── SUBMISSION.md               # Complete design blueprint
└── README.md                   # This file
```



## 🧪 Run the Automated Security Tests

```bash
cd companion-backend
./mvnw test
# All 5 security tests should pass ✅
```


## 📊 Submission Deliverables

| Deliverable | Status |
|---|---|
| Environment Shell | ✅ Complete |
| JWT Authentication | ✅ Complete |
| Server-side Enforcement | ✅ Complete |
| 26 Wireframe Screens | ✅ Complete |
| SUBMISSION.md | ✅ Complete |
| Architecture Diagram | ✅ Complete |

