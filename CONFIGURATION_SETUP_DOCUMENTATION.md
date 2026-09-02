<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">CONFIGURATION & SETUP - GETTING STARTED</span>

</div>

## <span style="color: #2d3748;">WHAT IS CONFIGURATION?</span>

<span style="color: #4a5568;">Configuration is like the control panel for the MediCare Companion system. It contains all the settings, secrets, and connection information needed to make everything work together. Proper configuration ensures that the frontend, backend, database, and AI services can communicate securely and efficiently.</span>

---

## <span style="color: #2d3748;">PREREQUISITES</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">REQUIRED SOFTWARE</span>

<span style="color: #4a5568;">Before setting up the system, you need:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background-color: #ebf8ff; padding: 15px; border-radius: 8px;">
<span style="color: #2b6cb0; font-weight: bold;">Node.js (18.x+)</span>
<span style="color: #4a5568; font-size: 14px;">For frontend and Node.js backend</span>
</div>

<div style="background-color: #f0fff4; padding: 15px; border-radius: 8px;">
<span style="color: #276749; font-weight: bold;">Java JDK 21</span>
<span style="color: #4a5568; font-size: 14px;">For Java Spring Boot microservice</span>
</div>

<div style="background-color: #fffaf0; padding: 15px; border-radius: 8px;">
<span style="color: #c05621; font-weight: bold;">PostgreSQL</span>
<span style="color: #4a5568; font-size: 14px;">For database storage</span>
</div>

<div style="background-color: #faf5ff; padding: 15px; border-radius: 8px;">
<span style="color: #6b46c1; font-weight: bold;">Git (Optional)</span>
<span style="color: #4a5568; font-size: 14px;">For version control</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">ENVIRONMENT VARIABLES</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">NODE.JS BACKEND CONFIGURATION</span>

<span style="color: #4a5568;">The Node.js backend uses environment variables:</span>

#### <span style="color: #553c9a;">Server Configuration</span>
<span style="color: #4a5568;">- PORT - Server port number (default 5000)</span>

#### <span style="color: #553c9a;">Database Configuration</span>
<span style="color: #4a5568;">- DATABASE_URL - PostgreSQL connection string</span>
<span style="color: #4a5568;">- DATABASE_SSL - Whether to use SSL for database connection</span>

#### <span style="color: #553c9a;">Java Service Configuration</span>
<span style="color: #4a5568;">- JAVA_SERVICE_URL - Full URL to Java backend</span>
<span style="color: #4a5568;">- JAVA_SERVICE_HOST - Java backend hostname</span>
<span style="color: #4a5568;">- JAVA_SERVICE_PORT - Java backend port</span>

#### <span style="color: #553c9a;">Security Configuration</span>
<span style="color: #4a5568;">- JWT_SECRET - Secret for JWT token signing</span>
<span style="color: #4a5568;">- MOCK_JWT_SIGNING_SECRET - Mock JWT signing secret (must match Java)</span>

#### <span style="color: #553c9a;">AI Configuration</span>
<span style="color: #4a5568;">- OPENROUTER_API_KEY - API key for OpenRouter fallback</span>
<span style="color: #4a5568;">- OPENROUTER_MODEL - Model to use with OpenRouter</span>
<span style="color: #4a5568;">- AI_GATEWAY_VIRTUAL_KEY - Virtual key for AI Gateway</span>

</div>

---

## <span style="color: #2d3748;">JAVA BACKEND CONFIGURATION</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">SPRING BOOT APPLICATION PROPERTIES</span>

<span style="color: #4a5568;">The Java backend uses application.properties:</span>

#### <span style="color: #2c5282;">Server Configuration</span>
<span style="color: #4a5568;">- server.port - Server port (default 8080)</span>
<span style="color: #4a5568;">- spring.application.name - Application name</span>

#### <span style="color: #2c5282;">JWT Configuration</span>
<span style="color: #4a5568;">- companion.jwt.signing-secret - JWT signing secret</span>
<span style="color: #4a5568;">- companion.jwt.issuer - JWT issuer identifier</span>
<span style="color: #4a5568;">- companion.jwt.audience - JWT audience identifier</span>
<span style="color: #4a5568;">- companion.jwt.expiry-seconds - Token expiration time</span>

#### <span style="color: #2c5282;">AI Gateway Configuration</span>
<span style="color: #4a5568;">- ai.gateway.base-url - AI Gateway base URL</span>
<span style="color: #4a5568;">- ai.gateway.virtual-key - Virtual key for authentication</span>
<span style="color: #4a5568;">- ai.gateway.x-git - Git identifier for requests</span>

#### <span style="color: #2c5282;">RAG Configuration</span>
<span style="color: #4a5568;">- rag.use-mock - Whether to use mock embedding client</span>
<span style="color: #4a5568;">- rag.embedding-model - Model for text embeddings</span>
<span style="color: #4a5568;">- rag.chat-model - Model for chat responses</span>
<span style="color: #4a5568;">- rag.top-k - Number of chunks to retrieve</span>
<span style="color: #4a5568;">- rag.similarity-threshold - Minimum similarity for retrieval</span>

#### <span style="color: #2c5282;">Fallback Configuration</span>
<span style="color: #4a5568;">- ai.gemini.api-key - Gemini API key (fallback)</span>
<span style="color: #4a5568;">- ai.openrouter.api-key - OpenRouter API key (fallback)</span>
<span style="color: #4a5568;">- ai.openrouter.model - OpenRouter model (fallback)</span>

</div>

---

## <span style="color: #2d3748;">SETUP STEPS</span>

<div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 15px 0;">

### <span style="color: #276749;">STEP 1: CLONE OR DOWNLOAD</span>
<span style="color: #4a5568;">Get the project files to your local machine</span>

</div>

<div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px; margin: 15px 0;">

### <span style="color: #c05621;">STEP 2: INSTALL DEPENDENCIES</span>
<span style="color: #4a5568;">Run npm install in companion-frontend and companion-backend-node</span>

</div>

<div style="background-color: #faf5ff; border-left: 4px solid #9f7aea; padding: 15px; margin: 15px 0;">

### <span style="color: #6b46c1;">STEP 3: CONFIGURE ENVIRONMENT</span>
<span style="color: #4a5568;">Create .env files with your configuration values</span>

</div>

<div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 15px 0;">

### <span style="color: #c53030;">STEP 4: SETUP DATABASE</span>
<span style="color: #4a5568;">Configure PostgreSQL and run database migrations</span>

</div>

<div style="background-color: #ebf8ff; border-left: 4px solid #4299e1; padding: 15px; margin: 15px 0;">

### <span style="color: #2b6cb0;">STEP 5: START SERVICES</span>
<span style="color: #4a5568;">Start the Java backend, Node.js backend, and React frontend</span>

</div>

---

## <span style="color: #2d3748;">STARTING THE SERVICES</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">SERVICE STARTUP ORDER</span>

<span style="color: #4a5568;">Start services in this order:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background-color: #ebf8ff; padding: 15px; border-radius: 8px;">
<span style="color: #2b6cb0; font-weight: bold;">1. Java Backend</span>
<span style="color: #4a5568; font-size: 14px;">Port 8080 - Core business logic and RAG</span>
</div>

<div style="background-color: #f0fff4; padding: 15px; border-radius: 8px;">
<span style="color: #276749; font-weight: bold;">2. Node.js Backend</span>
<span style="color: #4a5568; font-size: 14px;">Port 3001 - API gateway and authentication</span>
</div>

<div style="background-color: #fffaf0; padding: 15px; border-radius: 8px;">
<span style="color: #c05621; font-weight: bold;">3. React Frontend</span>
<span style="color: #4a5568; font-size: 14px;">Port 5173 - User interface</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">SECURITY CONFIGURATION</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">IMPORTANT SECURITY SETTINGS</span>

<span style="color: #4a5568;">Pay special attention to these security configurations:</span>

#### <span style="color: #dd6b20;">JWT Secrets</span>
<span style="color: #4a5568;">- MOCK_JWT_SIGNING_SECRET must match between Node.js and Java</span>
<span style="color: #4a5568;">- Use strong, random secrets in production</span>
<span style="color: #4a5568;">- Never commit secrets to version control</span>

#### <span style="color: #dd6b20;">Database Credentials</span>
<span style="color: #4a5568;">- Use strong database passwords</span>
<span style="color: #4a5568;">- Enable SSL for database connections in production</span>
<span style="color: #4a5568;">- Restrict database access to necessary hosts</span>

#### <span style="color: #dd6b20;">API Keys</span>
<span style="color: #4a5568;">- AI_GATEWAY_VIRTUAL_KEY must be kept secret</span>
<span style="color: #4a5568;">- Gemini and OpenRouter API keys must be protected</span>
<span style="color: #4a5568;">- Use environment variables, never hardcode keys</span>

#### <span style="color: #dd6b20;">CORS Configuration</span>
<span style="color: #4a5568;">- Configure allowed origins for frontend access</span>
<span style="color: #4a5568;">- Restrict to your frontend domain in production</span>

</div>

---

## <span style="color: #2d3748;">DEVELOPMENT VS PRODUCTION</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Development Environment</span>
<span style="color: rgba(255,255,255,0.9);">Uses mock services, local database, detailed logging, and development keys for testing and iteration</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">Production Environment</span>
<span style="color: rgba(255,255,255,0.9);">Uses real services, production database, optimized logging, and secure keys for live operation</span>

</div>

</div>

---

## <span style="color: #2d3748;">AI SERVICE CONFIGURATION</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">AI PROVIDER FALLBACK CHAIN</span>

<span style="color: #4a5568;">The system uses a fallback chain for AI services:</span>

#### <span style="color: #553c9a;">Primary: AI Gateway (Bifrost)</span>
<span style="color: #4a5568;">- Uses AI_GATEWAY_VIRTUAL_KEY for authentication</span>
<span style="color: #4a5568;">- Primary production service</span>

#### <span style="color: #553c9a;">Fallback 1: OpenRouter</span>
<span style="color: #4a5568;">- Uses OPENROUTER_API_KEY</span>
<span style="color: #4a5568;">- Configurable model via OPENROUTER_MODEL</span>

#### <span style="color: #553c9a;">Fallback 2: Gemini</span>
<span style="color: #4a5568;">- Uses GEMINI_API_KEY</span>
<span style="color: #4a5568;">- Google's AI service</span>

#### <span style="color: #553c9a;">Mock Mode</span>
<span style="color: #4a5568;">- Set rag.use-mock=true for development</span>
<span style="color: #4a5568;">- No external API calls required</span>

</div>

---

## <span style="color: #2d3748;">TROUBLESHOOTING CONFIGURATION</span>

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">COMMON ISSUES</span>

<span style="color: #4a5568;">If you encounter configuration problems:</span>

#### <span style="color: #e53e3e;">Services Won't Start</span>
<span style="color: #4a5568;">- Check that ports are not already in use</span>
<span style="color: #4a5568;">- Verify environment variables are set correctly</span>

#### <span style="color: #e53e3e;">Database Connection Errors</span>
<span style="color: #4a5568;">- Verify DATABASE_URL is correct</span>
<span style="color: #4a5568;">- Check PostgreSQL is running</span>
<span style="color: #4a5568;">- Ensure database credentials are valid</span>

#### <span style="color: #e53e3e;">JWT Token Errors</span>
<span style="color: #4a5568;">- Ensure JWT secrets match between services</span>
<span style="color: #4a5568;">- Check token expiration times</span>

#### <span style="color: #e53e3e;">AI Service Errors</span>
<span style="color: #4a5568;">- Verify API keys are valid</span>
<span style="color: #4a5568;">- Check network connectivity to AI services</span>
<span style="color: #4a5568;">- Try mock mode for development</span>

</div>

---

## <span style="color: #2d3748;">BEST PRACTICES</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Use Environment Variables</span>
<span style="color: rgba(255,255,255,0.9);">Never hardcode secrets in configuration files</span>

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Separate Environments</span>
<span style="color: rgba(255,255,255,0.9);">Use different configs for dev, staging, and production</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Document Changes</span>
<span style="color: rgba(255,255,255,0.9);">Keep records of configuration changes</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Regular Updates</span>
<span style="color: rgba(255,255,255,0.9);">Keep dependencies and configurations updated</span>

</div>

</div>

---

## <span style="color: #2d3748;">SUMMARY</span>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">WHY CONFIGURATION MATTERS</span>

<span style="color: rgba(255,255,255,0.95);">Proper configuration provides:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Secure Operation** - Proper secret management protects sensitive data</span>
<span style="color: white;">- **Service Communication** - Correct settings enable service connectivity</span>
<span style="color: white;">- **Flexibility** - Environment variables allow easy configuration changes</span>
<span style="color: white;">- **Development Support** - Mock modes enable efficient development</span>
<span style="color: white;">- **Production Readiness** - Proper configs ensure smooth deployment</span>
<span style="color: white;">- **AI Integration** - Correct API keys enable AI functionality</span>
<span style="color: white;">- **Database Access** - Proper database configuration enables data storage</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">Configuration is the foundation that makes the entire MediCare Companion system work together. By properly setting up environment variables, secrets, and service connections, you ensure that all components can communicate securely and efficiently. Good configuration practices protect sensitive information, enable smooth development workflows, and ensure reliable production operation. Taking the time to configure everything correctly upfront saves countless hours of troubleshooting later.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This documentation covers the Configuration & Setup process for the MediCare Companion application, including environment variables, service configuration, security settings, and best practices for development and production environments.</span>

</div>