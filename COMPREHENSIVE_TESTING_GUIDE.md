<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">COMPREHENSIVE TESTING GUIDE - COMPLETE TESTING STRATEGY</span>

</div>

## <span style="color: #2d3748;">TESTING OVERVIEW</span>

<span style="color: #4a5568;">Testing is the quality control process that ensures the MediCare Companion system works correctly, securely, and reliably. This guide covers all testing aspects from unit tests to end-to-end integration tests, with specific commands for each part of the system and explanations of what each test does.</span>

---

## <span style="color: #2d3748;">TESTING PYRAMID</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">TESTING LEVELS</span>

<span style="color: #4a5568;">The system follows a testing pyramid approach:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">Unit Tests</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">Fast, isolated tests of individual functions and components</span>
</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">Integration Tests</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">Tests how components work together</span>
</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">Security Tests</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">Authentication and authorization validation</span>
</div>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; color: white;">
<span style="color: white; font-weight: bold;">End-to-End Tests</span>
<span style="color: rgba(255,255,255,0.9); font-size: 14px;">Complete user workflow testing</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">JAVA BACKEND TESTING</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">JAVA SPRING BOOT TESTS</span>

<span style="color: #4a5568;">The Java backend uses JUnit 5 for testing:</span>

#### <span style="color: #2c5282;">Test Location</span>
<span style="color: #4a5568;">```bash
companion-backend/src/test/java/com/candor/companion/
```</span>

#### <span style="color: #2c5282;">Run All Java Tests</span>
<span style="color: #4a5568;">```bash
cd companion-backend
./mvnw test
```</span>

<span style="color: #4a5568;">**What this does:** Runs all JUnit tests in the test directory using Maven wrapper. It compiles test code, executes all test methods, and generates a test report showing pass/fail status.</span>

#### <span style="color: #2c5282;">Run Specific Test Class</span>
<span style="color: #4a5568;">```bash
cd companion-backend
./mvnw test -Dtest=MockJwtServiceTest
```</span>

<span style="color: #4a5568;">**What this does:** Runs only the specified test class. Useful for focusing on a specific area of functionality during development.</span>

#### <span style="color: #2c5282;">Run Specific Test Method</span>
<span style="color: #4a5568;">```bash
cd companion-backend
./mvnw test -Dtest=MockJwtServiceTest#issuesAndValidatesATokenRoundTrip
```</span>

<span style="color: #4a5568;">**What this does:** Runs a single test method within a test class. Ideal for debugging a specific failing test.</span>

#### <span style="color: #2c5282;">Available Java Tests</span>
<span style="color: #4a5568;">- **MockJwtServiceTest** - Tests JWT token generation and validation</span>
<span style="color: #4a5568;">- **AuthEnforcementIntegrationTest** - Tests role-based access control and security enforcement</span>

</div>

---

## <span style="color: #2d3748;">JAVA TEST DETAILS</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">SPECIFIC JAVA TESTS AND THEIR PURPOSE</span>

<span style="color: #4a5568;">Detailed breakdown of existing Java tests:</span>

#### <span style="color: #22543d;">MockJwtServiceTest</span>
<span style="color: #4a5568;">**Purpose:** Tests JWT token generation and validation logic</span>

<span style="color: #4a5568;">**Test Methods:**</span>
- <span style="color: #22543d;">issuesAndValidatesATokenRoundTrip</span> - Verifies that a token can be created and successfully validated with correct claims
- <span style="color: #22543d;">rejectsATamperedToken</span> - Ensures tampered tokens are rejected (security test)
- <span style="color: #22543d;">rejectsATokenSignedWithADifferentSecret</span> - Verifies tokens signed with wrong secret are rejected (security test)

<span style="color: #4a5568;">**Why it matters:** Ensures the authentication system is secure and tokens cannot be forged or tampered with.</span>

#### <span style="color: #22543d;">AuthEnforcementIntegrationTest</span>
<span style="color: #4a5568;">**Purpose:** End-to-end security enforcement testing</span>

<span style="color: #4a5568;">**Test Methods:**</span>
- <span style="color: #22543d;">policyholderCanReachWhatIf</span> - Verifies policyholders can access what-if features
- <span style="color: #22543d;">beneficiaryIsBlockedFromWhatIf</span> - Ensures beneficiaries are blocked from what-if features
- <span style="color: #22543d;">beneficiaryCanReachQaAndClaims</span> - Confirms beneficiaries can access Q&A and claims
- <span style="color: #22543d;">deceasedPolicyholderTokenIsDemotedToBeneficiaryAndBlockedFromWhatIf</span> - Tests deceased flag demotion logic
- <span style="color: #22543d;">missingTokenIsRejected</span> - Verifies requests without tokens are rejected

<span style="color: #4a5568;">**Why it matters:** These are critical security tests that prove the role-based access control system works correctly and prevents unauthorized access.</span>

</div>

---

## <span style="color: #2d3748;">NODE.JS BACKEND TESTING</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">NODE.JS TESTING COMMANDS</span>

<span style="color: #4a5568;">Testing the Node.js backend:</span>

#### <span style="color: #dd6b20;">Install Test Dependencies</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
npm install --save-dev jest supertest
```</span>

<span style="color: #4a5568;">**What this does:** Installs Jest testing framework and Supertest for HTTP endpoint testing. Required if not already in package.json.</span>

#### <span style="color: #dd6b20;">Run All Node.js Tests</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
npm test
```</span>

<span style="color: #4a5568;">**What this does:** Runs all Jest tests in the project. Executes test files matching *.test.js or *.spec.js patterns and reports results.</span>

#### <span style="color: #dd6b20;">Run Tests in Watch Mode</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
npm test -- --watch
```</span>

<span style="color: #4a5568;">**What this does:** Runs tests in watch mode, automatically re-running tests when files change. Great for development workflow.</span>

#### <span style="color: #dd6b20;">Run Tests with Coverage</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
npm test -- --coverage
```</span>

<span style="color: #4a5568;">**What this does:** Runs tests and generates a code coverage report showing which parts of the code are tested and which are not.</span>

#### <span style="color: #dd6b20;">Run Specific Test File</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
npm test -- authController.test.js
```</span>

<span style="color: #4a5568;">**What this does:** Runs only the specified test file instead of all tests.</span>

</div>

---

## <span style="color: #2d3748;">REACT FRONTEND TESTING</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">FRONTEND TESTING COMMANDS</span>

<span style="color: #4a5568;">Testing the React frontend:</span>

#### <span style="color: #553c9a;">Install Test Dependencies</span>
<span style="color: #4a5568;">```bash
cd companion-frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```</span>

<span style="color: #4a5568;">**What this does:** Installs React Testing Library for component testing. These libraries provide utilities for testing React components in a user-centric way.</span>

#### <span style="color: #553c9a;">Run All Frontend Tests</span>
<span style="color: #4a5568;">```bash
cd companion-frontend
npm test
```</span>

<span style="color: #4a5568;">**What this does:** Runs all Jest tests for React components. Tests are executed in a headless browser environment using jsdom.</span>

#### <span style="color: #553c9a;">Run Tests in Watch Mode</span>
<span style="color: #4a5568;">```bash
cd companion-frontend
npm test -- --watch
```</span>

<span style="color: #4a5568;">**What this does:** Runs tests in interactive watch mode, re-running on file changes. Press 'a' to run all tests, 'f' to run only failed tests.</span>

#### <span style="color: #553c9a;">Run Tests with Coverage</span>
<span style="color: #4a5568;">```bash
cd companion-frontend
npm test -- --coverage --watchAll=false
```</span>

<span style="color: #4a5568;">**What this does:** Generates a coverage report showing which components and functions are tested. The --watchAll=false flag prevents it from running in watch mode.</span>

#### <span style="color: #553c9a;">Run Specific Component Test</span>
<span style="color: #4a5568;">```bash
cd companion-frontend
npm test -- Chat.test.js
```</span>

<span style="color: #4a5568;">**What this does:** Runs only the specified test file. Useful for focusing on a specific component during development.</span>

</div>

---

## <span style="color: #2d3748;">INTEGRATION TESTING</span>

<div style="background-color: #e6fffa; border: 2px solid #38b2ac; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #234e52;">END-TO-END INTEGRATION TESTS</span>

<span style="color: #4a5568;">Testing the complete system integration:</span>

#### <span style="color: #134e4a;">Start All Services</span>
<span style="color: #4a5568;">```bash
# Terminal 1: Start Java Backend
cd companion-backend
./mvnw spring-boot:run

# Terminal 2: Start Node.js Backend
cd companion-backend-node
npm start

# Terminal 3: Start React Frontend
cd companion-frontend
npm run dev
```</span>

<span style="color: #4a5568;">**What this does:** Starts all three services in their own terminals. Required for integration testing that needs all services running.</span>

#### <span style="color: #134e4a;">Manual Integration Testing</span>
<span style="color: #4a5568;">1. Open browser to http://localhost:5173</span>
<span style="color: #4a5568;">2. Register a new user account</span>
<span style="color: #4a5568;">3. Login with the credentials</span>
<span style="color: #4a5568;">4. Test each feature (chat, what-if, self-service, claims)</span>
<span style="color: #4a5568;">5. Verify role-based access controls</span>
<span style="color: #4a5568;">6. Test with demo accounts (Sipho, Lerato, Thandi)</span>

<span style="color: #4a5568;">**What this does:** Manual testing of the complete user workflow through the application.</span>

#### <span style="color: #134e4a;">API Testing with curl</span>
<span style="color: #4a5568;">```bash
# Test Node.js health endpoint
curl http://localhost:3001/

# Test Java health endpoint
curl http://localhost:8080/actuator/health

# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```</span>

<span style="color: #4a5568;">**What this does:** Tests individual API endpoints to verify they respond correctly. Useful for debugging integration issues.</span>

</div>

---

## <span style="color: #2d3748;">SECURITY TESTING</span>

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">SECURITY VALIDATION TESTS</span>

<span style="color: #4a5568;">Specific security testing procedures:</span>

#### <span style="color: #e53e3e;">Run Security Tests</span>
<span style="color: #4a5568;">```bash
cd companion-backend
./mvnw test -Dtest=AuthEnforcementIntegrationTest
```</span>

<span style="color: #4a5568;">**What this does:** Runs the comprehensive security integration tests that verify role-based access control, deceased flag handling, and authentication enforcement.</span>

#### <span style="color: #e53e3e;">Test Security Scenarios</span>
<span style="color: #4a5568;">1. **Beneficiary What-If Access** - Verify beneficiaries cannot access what-if calculator</span>
<span style="color: #4a5568;">2. **Policyholder What-If Access** - Verify policyholders can access what-if calculator</span>
<span style="color: #4a5568;">3. **Deceased Flag Demotion** - Verify deceased policyholders are demoted to beneficiary role</span>
<span style="color: #4a5568;">4. **Missing Token Rejection** - Verify requests without tokens are rejected</span>
<span style="color: #4a5568;">5. **JWT Tampering** - Verify tampered tokens are rejected</span>

<span style="color: #4a5568;">**What this does:** Manually validates that all security requirements are met by testing specific security scenarios.</span>

#### <span style="color: #e53e3e;">Token Security Testing</span>
<span style="color: #4a5568;">```bash
cd companion-backend
./mvnw test -Dtest=MockJwtServiceTest
```</span>

<span style="color: #4a5568;">**What this does:** Tests JWT token security including tamper detection and secret validation.</span>

</div>

---

## <span style="color: #2d3748;">DATABASE TESTING</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">DATABASE VALIDATION</span>

<span style="color: #4a5568;">Testing database operations:</span>

#### <span style="color: #2c5282;">Test Database Connection</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
node -e "const db = require('./database/db'); db.query('SELECT NOW()', (err, res) => console.log(err || res.rows[0]))"
```</span>

<span style="color: #4a5568;">**What this does:** Tests PostgreSQL database connection by running a simple query. Verifies database is accessible and credentials are correct.</span>

#### <span style="color: #2c5282;">Test Schema Integrity</span>
<span style="color: #4a5568;">```bash
cd companion-backend-node
psql $DATABASE_URL -f database/schema.sql
```</span>

<span style="color: #4a5568;">**What this does:** Applies the database schema to verify it's valid and can be applied without errors. Ensures table structures are correct.</span>

#### <span style="color: #2c5282;">Test User Creation</span>
<span style="color: #4a5568;">```bash
# Register a test user via API
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","username":"testuser","password":"Test123!","role":"policyholder"}'
```</span>

<span style="color: #4a5568;">**What this does:** Tests user registration flow end-to-end, verifying database operations work correctly.</span>

</div>

---

## <span style="color: #2d3748;">PERFORMANCE TESTING</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">PERFORMANCE VALIDATION</span>

<span style="color: #4a5568;">Testing system performance:</span>

#### <span style="color: #22543d;">Response Time Testing</span>
<span style="color: #4a5568;">```bash
# Test API response times
time curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```</span>

<span style="color: #4a5568;">**What this does:** Measures how long API calls take to respond. Helps identify performance bottlenecks.</span>

#### <span style="color: #22543d;">Load Testing (Optional)</span>
<span style="color: #4a5568;">```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Run load test
ab -n 100 -c 10 http://localhost:3001/
```</span>

<span style="color: #4a5568;">**What this does:** Sends 100 requests with 10 concurrent connections to test how the system handles load. Useful for identifying performance issues under stress.</span>

#### <span style="color: #22543d;">Database Query Performance</span>
<span style="color: #4a5568;">```bash
# Enable query logging in PostgreSQL
# Then test slow queries
psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';"
```</span>

<span style="color: #4a5568;">**What this does:** Analyzes database query performance to identify slow queries that need optimization.</span>

</div>

---

## <span style="color: #2d3748;">TESTING CHECKLIST</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">COMPREHENSIVE TESTING CHECKLIST</span>

<span style="color: #4a5568;">Complete testing checklist for the system:</span>

#### <span style="color: #553c9a;">Before Code Changes</span>
<span style="color: #4a5568;">- Run existing test suite to ensure baseline passes</span>
<span style="color: #4a5568;">- Check code coverage for areas being modified</span>

#### <span style="color: #553c9a;">During Development</span>
<span style="color: #4a5568;">- Write unit tests for new functions</span>
<span style="color: #4a5568;">- Run tests in watch mode for immediate feedback</span>
<span style="color: #4a5568;">- Test edge cases and error conditions</span>

#### <span style="color: #553c9a;">Before Committing</span>
<span style="color: #4a5568;">- Run full test suite</span>
<span style="color: #4a5568;">- Run security tests</span>
<span style="color: #4a5568;">- Check code coverage meets requirements</span>

#### <span style="color: #553c9a;">Integration Testing</span>
<span style="color: #4a5568;">- Start all services</span>
<span style="color: #4a5568;">- Test complete user workflows</span>
<span style="color: #4a5568;">- Test with different user roles</span>
<span style="color: #4a5568;">- Test deceased flag scenarios</span>

#### <span style="color: #553c9a;">Before Deployment</span>
<span style="color: #4a5568;">- Run all tests in production-like environment</span>
<span style="color: #4a5568;">- Test with production configuration</span>
<span style="color: #4a5568;">- Verify security measures are active</span>
<span style="color: #4a5568;">- Test database migrations</span>

</div>

---

## <span style="color: #2d3748;">INTERPRETING TEST RESULTS</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">UNDERSTANDING TEST OUTPUT</span>

<span style="color: #4a5568;">How to interpret test results:</span>

#### <span style="color: #dd6b20;">Success Indicators</span>
<span style="color: #4a5568;">- All tests show PASS or OK status</span>
<span style="color: #4a5568;">- No assertion failures</span>
<span style="color: #4a5568;">- No unexpected errors or exceptions</span>
<span style="color: #4a5568;">- Coverage report shows adequate coverage</span>

#### <span style="color: #dd6b20;">Failure Indicators</span>
<span style="color: #4a5568;">- Tests show FAIL or ERROR status</span>
<span style="color: #4a5568;">- Assertion failures with expected vs actual values</span>
<span style="color: #4a5568;">- Stack traces showing error locations</span>
<span style="color: #4a5568;">- Timeout errors for long-running tests</span>

#### <span style="color: #dd6b20;">Common Issues and Solutions</span>
<span style="color: #4a5568;">- **Port already in use** - Stop other services or change port configuration</span>
<span style="color: #4a5568;">- **Database connection failed** - Check DATABASE_URL and ensure PostgreSQL is running</span>
<span style="color: #4a5568;">- **Authentication failed** - Verify JWT secrets match between services</span>
<span style="color: #4a5568;">- **Missing dependencies** - Run npm install or mvnw clean install</span>

</div>

---

## <span style="color: #2d3748;">CONTINUOUS INTEGRATION TESTING</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Automated Testing</span>
<span style="color: rgba(255,255,255,0.9);">Configure CI/CD pipeline to run tests automatically on every commit</span>

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Build Verification</span>
<span style="color: rgba(255,255,255,0.9);">Run full test suite before allowing deployment to any environment</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Coverage Gates</span>
<span style="color: rgba(255,255,255,0.9);">Require minimum code coverage before merging code changes</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Security Scanning</span>
<span style="color: rgba(255,255,255,0.9);">Automated security tests to catch vulnerabilities early</span>

</div>

</div>

---

## <span style="color: #2d3748;">SUMMARY</span>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">WHY COMPREHENSIVE TESTING MATTERS</span>

<span style="color: rgba(255,255,255,0.95);">The testing strategy provides:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Quality Assurance** - Ensures code works as intended before users see it</span>
<span style="color: white;">- **Security Validation** - Proves security measures work correctly</span>
<span style="color: white;">- **Bug Prevention** - Catches issues early when they're cheaper to fix</span>
<span style="color: white;">- **Regression Prevention** - Ensures changes don't break existing functionality</span>
<span style="color: white;">- **Performance Monitoring** - Identifies performance issues before they affect users</span>
<span style="color: white;">- **Documentation** - Tests serve as living documentation of system behavior</span>
<span style="color: white;">- **Confidence** - Enables developers to make changes with confidence</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">Comprehensive testing is essential for maintaining a reliable, secure, and high-quality MediCare Companion system. By following this testing guide with specific commands for each part of the system, developers can ensure that every component works correctly, security measures are enforced, and the user experience remains smooth and reliable. Regular testing catches issues early, prevents regressions, and provides confidence that the system will perform as expected in production.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This comprehensive testing guide provides complete testing strategies for the MediCare Companion application, including specific commands for each component, detailed explanations of what each test does, and best practices for maintaining system quality and security.</span>

</div>