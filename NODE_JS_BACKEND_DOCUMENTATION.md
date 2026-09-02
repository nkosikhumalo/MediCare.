<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">NODE.JS BACKEND - THE GATEWAY TO SERVICES</span>

</div>

## <span style="color: #2d3748;">WHAT IS THE NODE.JS BACKEND?</span>

<span style="color: #4a5568;">The Node.js Backend is like a smart traffic controller that sits between the user interface and the core business services. It handles requests from the frontend, checks permissions, and routes them to the right places. It's also known as a Backend for Frontend (BFF) because it serves as a specialized backend just for the frontend application.</span>

---

## <span style="color: #2d3748;">HOW IT WORKS</span>

<div style="background-color: #ebf8ff; border-left: 4px solid #4299e1; padding: 15px; margin: 15px 0;">

### <span style="color: #2b6cb0;">STEP 1: RECEIVE REQUEST</span>
<span style="color: #4a5568;">The backend receives requests from the React frontend</span>

</div>

<div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 15px 0;">

### <span style="color: #276749;">STEP 2: AUTHENTICATION CHECK</span>
<span style="color: #4a5568;">Validates JWT tokens and user identity before proceeding</span>

</div>

<div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px; margin: 15px 0;">

### <span style="color: #c05621;">STEP 3: ROLE VALIDATION</span>
<span style="color: #4a5568;">Checks if the user's role allows access to the requested feature</span>

</div>

<div style="background-color: #faf5ff; border-left: 4px solid #9f7aea; padding: 15px; margin: 15px 0;">

### <span style="color: #6b46c1;">STEP 4: PROXY TO JAVA</span>
<span style="color: #4a5568;">Forwards allowed requests to the Java backend for processing</span>

</div>

<div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 15px 0;">

### <span style="color: #c53030;">STEP 5: RETURN RESPONSE</span>
<span style="color: #4a5568;">Sends the response back to the frontend for display</span>

</div>

---

## <span style="color: #2d3748;">MAIN ROUTES AND ENDPOINTS</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; middleware: 20px 0;">

### <span style="color: #2d3748;">API ROUTES</span>

<span style="color: #4a5568;">The backend manages several route groups:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background-color: #ebf8ff; padding: 15px; border-radius: 8px;">
<span style="color: #2b6cb0; font-weight: bold;">/api/auth</span>
<span style="color: #4a5568; font-size: 14px;">Public authentication endpoints (login, register)</span>
</div>

<div style="background-color: #f0fff4; padding: 15px; border-radius: 8px;">
<span style="color: #276749; font-weight: bold;">/api/chat</span>
<span style="color: #4a5568; font-size: 14px;">Chat interface with RAG system</span>
</div>

<div style="background-color: #fffaf0; padding: 15px; border-radius: 8px;">
<span style="color: #c05621; font-weight: bold;">/api/what-if</span>
<span style="color: #4a5568; font-size: 14px;">Premium calculator access</span>
</div>

<div style="background-color: #faf5ff; padding: 15px; border-radius: 8px;">
<span style="color: #6b46c1; font-weight: bold;">/api/self-service</span>
<span style="color: #4a5568; font-size: 14px;">Self-service updates</span>
</div>

<div style="background-color: #e6fffa; padding: 15px; border-radius: 8px;">
<span style="color: #234e52; font-weight: bold;">/api/rag</span>
<span style="color: #4a5568; font-size: 14px;">RAG system endpoints</span>
</div>

<div style="background-color: #fff5f5; padding: 15px; border-radius: 8px;">
<span style="color: #c53030; font-weight: bold;">/api/claims</span>
<span style="color: #4a5568; font-size: 14px;">Claims processing endpoints</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">MIDDLEWARE LAYERS</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">SECURITY CHECKS</span>

<span style="color: #4a5568;">The backend uses middleware for security:</span>

#### <span style="color: #553c9a;">Authentication Middleware</span>
<span style="color: #4a5568;">- Validates JWT tokens on every request</span>
<span style="color: #4a5568;">- Checks token expiry and validity</span>
<span style="color: #4a5568;">- Extracts user information from tokens</span>

#### <span style="color: #553c9a;">Role Middleware</span>
<span style="color: #4a5568;">- Enforces role-based access control</span>
<span style="color: #4a5568;">- Blocks requests from unauthorized roles</span>
<span style="color: #4a5568;">- Applies deceased flag restrictions</span>

#### <span style="color: #553c9a;">CORS Middleware</span>
<span style="color: #4a5568;">- Enables cross-origin requests from frontend</span>
<span>
<span style="color: #4a5568;">- Configures allowed origins and methods</span>

#### <span style="color: #553c9a;">Body Parser</span>
<span style="color: #4a5568;">- Parses JSON request bodies</span>
<span style="color: #4a5568;">- Handles multipart form data for file uploads</span>

</div>

---

## <span style="color: #2d3748;">DATABASE INTEGRATION</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin:  20px 0;">

### <span style="color: #2b6cb0;">POSTGRESQL CONNECTION</span>

<span style="color: #4a5568;">The backend connects to PostgreSQL for data storage:</span>

#### <span style="color: #2c5282;">User Management</span>
<span style="color: #4a5568;">- Stores user accounts and credentials</span>
<span style="color: #4a5568;">- Manages user roles and permissions</span>

#### <span style="color: #2c5282;">Claims Data</span>
<span style="color: #4a5568;">- Stores claim information and status</span>
<span style="color: #4a5568;">- Manages document uploads and references</span>

#### <span style="color: #2c5282;">Audit Logging</span>
<span style="color: #4a5568;">- Records all system access and actions</span>
<span style="color: #4a5568;">- Maintains security compliance records</span>

</div>

---

## <span style="color: #2d3748;">PROXY SERVICES</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;>

### <span style="color: #276749;">JAVA BACKEND COMMUNICATION</span>

<span style="color: #4a5568;">The backend proxies requests to the Java Spring Boot service:</span>

#### <span style="color: #22543d;">HTTP Proxying</span>
<span style="color: #4a5568;">- Forwards HTTP requests to Java backend</span>
<span style="color: #4a5568;">- Handles response formatting and error cases</span>

#### <span style="color: #22543d;">Multipart Proxying</span>
<span style="color: #4a5568;">- Handles file uploads with multipart form data</span>
<span style="color: #4a5568;">- Forwards documents to Java for AI processing</span>

#### <span style="color: #22543d;">Service Discovery</span>
<span style="color: #4a5568;">- Connects to Java backend via environment configuration</span>
<span style="color: #4a5568;">- Handles connection errors gracefully</span>

</div>

---

## <span style="color: #2d3748;">FILE UPLOAD HANDLING</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">DOCUMENT PROCESSING</span>

<span style="color: #4a5568;">The backend handles file uploads for various features:</span>

#### <span style="color: #dd6b20;">Multer Middleware</span>
<span style="color: #4a5568;">- Processes multipart form data uploads</span>
<span style="color: #4a5568;">- Validates file types and sizes</span>
<span style="color: #4a5568;">- Limits files to 10MB maximum</span>

#### <span style="color: #dd6b20;">Accepted File Types</span>
<span style="color: #4a5568;">- Images: JPEG, PNG, WebP</span>
<span style="color: #4a5568;">- Documents: PDF</span>
<span style="color: #4a5568;">- Validated for security</span>

#### <span style="color: #dd6b20;">Use Cases</span>
<span style="color: #4a5568;">- Proof of residence documents for address updates</span>
<span style="color: #4a5568;">- Claim documents for claims processing</span>
<span style="color: #4a5568;">- ID documents for verification</span>

</div>

---

## <span style="color: #2d3748;">ENVIRONMENT CONFIGURATION</span>

<div style="background-color: #e6fffa; border: 2px solid #38b2ac; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #234e52;">SETTINGS AND SECRETS</span>

<span style="color: #4a5568;">The backend uses environment variables for configuration:</span>

#### <span style="color: #134e4a;">Database Configuration</span>
<span style="color: #4a5568;">- PostgreSQL connection string</span>
<span style="color: #4a5568;">- Database credentials</span>

#### <span style="color: #134e4a;">Java Backend Configuration</span>
<span style="color: #4a5568;">- Java service host and port</span>
<span style="color: #4a5568;">- Service discovery settings</span>

#### <span style="color: #134e4a;">Security Configuration</span>
<span style="color: #4a5568;">- JWT signing secrets</span>
<span style="color: #4a5568;">- Encryption keys</span>

#### <span style="color: #134e4a;">Server Configuration</span>
<span style="color: #4a5568;">- Port number (default 3001)</span>
<span style="color: #4a5568;">- CORS settings</span>

</div>

---

## <span style="color: #2d3748;">ERROR HANDLING</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Graceful Degradation</span>
<span style="color: rgba(255,255,255,0.9);">Handles errors without exposing sensitive information</span>

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Logging</span>
<span style="color: rgba(255,255,255,0.9);">Comprehensive error logging for debugging</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">User-Friendly Messages</span>
<span style="color: rgba(255,255,255,0.9);">Clear error messages for frontend display</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Retry Logic</span>
<span style="color: rgba(255,255,255,0.9);">Automatic retry for transient failures</span>

</div>

</div>

---

## <span style="color: #2d3748;">SECURITY ENFORCEMENT</span>

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">PROTECTION LAYERS</span>

<span style="color: #4a5568;">The backend enforces security at multiple points:</span>

#### <span style="color: #e53e3e;">Request Blocking</span>
<span style="color: #4a5568;">- Blocks unauthorized requests before they reach Java</span>
<span style="color: #4a5568;">- Prevents unnecessary load on backend services</span>

#### <span style="color: #e53e3e;">Role Enforcement</span>
<span style="color: #4a5568;">- Strict role checking on every protected endpoint</span>
<span style="color: #4a5568;">- Immediate rejection of unauthorized access attempts</span>

#### <span style="color: #e53e3e;">Deceased Flag Handling</span>
<span style="color: #4a5568;">- Blocks mutation endpoints when deceased flag is active</span>
<span style="color: #4a5568;">- Prevents policy changes during claims processing</span>

#### <span style="color: #e53e3e;">Audit Logging</span>
<span style="color: #4a5568;">- Logs all access attempts and decisions</span>
<span style="color: #4a5568;">- Creates security trail for compliance</span>

</div>

---

## <span style="color: #2d3748;">PERFORMANCE CONSIDERATIONS</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">OPTIMIZATION STRATEGIES</span>

<span style="color: #4a5568;">The backend is optimized for performance:</span>

#### <span style="color: #553c9a;">Connection Pooling</span>
<span style="color: #4a5568;">- Reuses database connections for efficiency</span>
<span style="color: #4a5568;">- Reduces connection overhead</span>

#### <span style="color: #553c9a;">Async Processing</span>
span style="color: #4a5568;">- Handles concurrent requests efficiently</span>
<span style="color: #4a5568;">- Non-blocking I/O operations</span>

#### <span style="color: #553c9a;">Request Validation</span>
<span style="color: #4a5568;">- Early rejection of invalid requests</span>
<span style="color: #4a5568;">- Reduces unnecessary backend load</span>

#### <span style="color: #553c9a;">Caching</span>
span style="color: #4a5568;">- Caches frequently accessed data</span>
<span style="color: #4a5568;">- Reduces database queries</span>

</div>

---

## <span style="color: #2d3748;">DEVELOPMENT VS PRODUCTION</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Development Mode</span>
<span style="color: rgba(255,255,255,0.9);">Uses local development database, detailed error logging, and mock services for testing</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Production Mode</span>
<span style="color: rgba(255,255,255, 0.9);">Uses production database, optimized logging, and real services for live operation</span>

</div>

</div>

---

## <span style="color: #2d3748;">SUMMARY</span>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">WHY THE NODE.JS BACKEND MATTERS</span>

<span style="color: rgba(255,255,255,0.95);">The Node.js Backend provides:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Security Gateway** - First line of defense for access control</span>
<span style="color: white;">- **Request Routing** - Intelligent routing to appropriate services</span>
<span style="color: white;">- **Data Proxying** - Seamless communication with Java backend</span>
<span style="color: white;">- **File Handling** - Secure document upload and processing</span>
<span style="color: white;">- **Database Access** - PostgreSQL integration for data persistence</span>
<span style="color: white;">- **Error Handling** - Graceful error management and user feedback</span>
<span style="color: white;">- **Performance** - Optimized for speed and efficiency</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">The Node.js Backend is the crucial intermediary that makes the complex backend systems accessible through a clean, secure API. It handles all the security checks, routing decisions, and data transformation so the frontend can focus on providing a great user experience. By enforcing security at this layer, it protects the core business systems while ensuring that only authorized, properly authenticated requests ever reach sensitive operations.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This documentation covers the Node.js Backend that serves as the Backend for Frontend (BFF), handling authentication, routing, proxying, and security enforcement for the MediCare Companion application.</span>

</div>