<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">AUTHENTICATION SYSTEM - SECURE ACCESS CONTROL</span>

</div>

## <span style="color: #2d3748;">WHAT IS AUTHENTICATION?</span>

<span style="color: #4a5568;">Authentication is like having a digital ID card that proves who you are before you can access the MediCare Companion system. It ensures that only authorized people can use the application and that each person sees only what they're allowed to see based on their role.</span>

---

## <span style="color: #2d3748;">HOW AUTHENTICATION WORKS</span>

<div style="background-color: #ebf8ff; border-left: 4px solid #4299e1; padding: 15px; margin: 15px 0;">

### <span style="color: #2b6cb0;">STEP 1: REGISTRATION</span>
<span style="color: #4a5568;">New users create an account with their personal information and choose their role (Policyholder or Beneficiary)</span>

</div>

<div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 15px 0;">

### <span style="color: #276749;">STEP 2: LOGIN</span>
<span style="color: #4a5568;">Users log in with their email and password to prove their identity</span>

</div>

<div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px; margin: 15px 0;">

### <span style="color: #c05621;">STEP 3: TOKEN CREATION</span>
<span style="color: #4a5568;">The system creates a special digital token that contains your identity and role information</span>

</div>

<div style="background-color: #faf5ff; border-left: 4px solid #9f7aea; padding: 15px; margin: 15px 0;">

### <span style="color: #6b46c1;">STEP 4: TOKEN VALIDATION</span>
<span style="color: #4a5568;">Every time you access a feature, the system checks your token to ensure it's still valid</span>

</div>

<div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 15px 0;">

### <span style="color: #c53030;">STEP 5: ACCESS GRANTED</span>
<span style="color: #4a5568;">If everything checks out, you can access the features allowed for your role</span>

</div>

---

## <span style="color: #2d3748;">JWT TOKENS - THE DIGITAL ID CARDS</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">WHAT'S IN YOUR TOKEN</span>

<span style="color: #4a5568;">Your JWT (JSON Web Token) contains important information about you:</span>

<div style="background-color: rgba(113, 128, 150, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #4a5568;">**Subject**</span> - Your unique user identifier
- <span style="color: #4a5568;">**Role**</span> - Whether you're a Policyholder or Beneficiary
- <span style="color: #4a5568;">**Policy ID**</span> - Which policy you're associated with
- <span style="color: #4a5568;">**Deceased Flag**</span> - Whether the policy is in claims mode
- <span style="color: #4a5568;">**Expiry Time**</span> - When the token stops being valid
- <span style="color: #4a5568;">**Digital Signature**</span> - Proves the token is authentic</span>

</div>

</div>

---

## <span style="color: #2d3748;">SECURITY LAYERS</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Password Hashing</span>
<span style="color: rgba(255,255,255,0.9);">Passwords are encrypted before storage - never stored as plain text</span>

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Token Signing</span>
<span style="color: rgba(255,255,255,0.9);">Tokens are digitally signed to prevent tampering</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Token Expiry</span>
<span style="color: rgba(255,255,255,0.9);">Tokens expire after 1 hour for added security</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Request Validation</span>
<span style="color: rgba(255,255,255,0.9);">Every request is validated against the current policy status</span>

</div>

</div>

---

## <span style="color: #2d3748;">ROLE ASSIGNMENT AT LOGIN</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">HOW ROLES ARE DETERMINED</span>

<span style="color: #4a5568;">Your role is assigned when you register and can be adjusted dynamically:</span>

#### <span style="color: #553c9a;">Registration Role</span>
<span style="color: #4a5568;">You choose your role when creating your account (Policyholder or Beneficiary)</span>

#### <span style="color: #553c9a;">Dynamic Adjustment</span>
<span style="color: #4a5568;">The system can adjust your effective role based on policy status (like deceased flag)</span>

#### <span style="color: #553c9a;">Server-Side Verification</span>
<span style="color: #4a5568;">Your role is re-validated on every request against the current policy status</span>

#### <span style="color: #553c9a;">Role Narrowing</span>
<span style="color: #4a5568;">The system can only reduce access (never increase it) based on security conditions</span>

</div>

---

## <span style="color: #2d3748;">DECEASED FLAG IMPACT</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">HOW AUTHENTICATION ADAPTS TO CLAIMS</span>

<span style="color: #4a5568;">When the deceased flag is active, authentication changes:</span>

#### <span style="color: #dd6b20;">Automatic Role Demotion</span>
<span style="color: #4a5568;">Policyholders are automatically treated as beneficiaries for access control</span>

#### <span style="color: #dd6b20;">Feature Freezing</span>
<span style="color: #4a5568;">Self-service and what-if features become inaccessible</span>

#### <span style="color: #dd6b20;">Claims Mode Activation</span>
<span style="color: #4a5568;">The system switches to empathetic claims support mode</span>

#### <span style="color: #dd6b20;">Token Mismatch Detection</span>
<span style="color: #4a5568;">The system logs if your token claims don't match the current policy status</span>

</div>

---

## <span style="color: #2d3748;">USER REGISTRATION PROCESS</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">CREATING YOUR ACCOUNT</span>

<span style="color: #4a5568;">When you register, the system collects:</span>

<div style="background-color: rgba(66, 153, 225, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #2c5282;">**Personal Information**</span> - Name, email, phone, date of birth
- <span style="color: #2c5282;">**Identification**</span> - ID number or passport details
- <span style="color: #2c5282;">**Login Credentials**</span> - Username and password
- <span style="color: #2c5282;">**Role Selection**</span> - Policyholder or Beneficiary
- <span style="color: #2c5282;">**Policy Association**</span> - Policy ID (auto-generated or provided)

</div>

#### <span style="color: #2c5282;">Security Checks</span>
<span style="color: #4a5568;">- Email uniqueness verification</span>
<span style="color: #4a5568;">- Username uniqueness verification</span>
<span style="color: #4a5568;">- Password encryption before storage</span>
<span style="color: #4a5568;">- Role normalization to standard format</span>

</div>

---

## <span style="color: #2d3748;">LOGIN PROCESS</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">SIGNING IN SECURELY</span>

<span style="color: #4a5568;">The login process ensures security:</span>

#### <span style="color: #22543d;">Credential Verification</span>
<span style="color: #4a5568;">- Email and password are required</span>
<span style="color: #4a5568;">- User lookup by email</span>
<span style="color: #4a5568;">- Password comparison using secure hashing</span>

#### <span style="color: #22543d;">Token Generation</span>
<span style="color: #4a5568;">- Attempts to get Java-signed token for enhanced security</span>
<span style="color: #4a5568;">- Falls back to Node-signed token if Java unavailable</span>
<span style="color: #4a5568;">- Includes all necessary claims in the token</span>

#### <span style="color: #22543d;">Response</span>
<span style="color: #4a5568;">- Returns token and user information</span>
<span style="color: #4a5568;">- Includes current role and deceased flag status</span>
<span style="color: #4a5568;">- Token valid for 1 hour</span>

</div>

---

## <span style="color: #2d3748;">DEMO USERS</span>

<div style="background-color: #e6fffa; border: 2px solid #38b2ac; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #234e52;">SPECIAL TEST ACCOUNTS</span>

<span style="color: #4a5568;">The system includes demo users for testing different scenarios:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background-color: rgba(56, 178, 172, 0.1); padding: 15px; border-radius: 8px;">
<span style="color: #134e4a; font-weight: bold;">Sipho</span>
<span style="color: #4a5568; font-size: 14px;">Active Policyholder - full access to all features</span>
</div>

<div style="background-color: rgba(56, 178, 172, 0.1); padding: 15px; border-radius: 8px;">
<span style="color: #134e4a; font-weight: bold;">Lerato</span>
<span style="color: #4a5568; font-size: 14px;">Active Beneficiary - claims and Q&A access only</span>
</div>

<div style="background-color: rgba(56, 178, 172, 0.1); padding: 15px; border-radius: 8px;">
<span style="color: #134e4a; font-weight: bold;">Thandi</span>
<span style="color: #4a5568; font-size: 14px;">Deceased Policyholder - empathetic claims mode</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">REQUEST VALIDATION FILTER</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">EVERY REQUEST IS CHECKED</span>

<span style="color: #4a5568;">The JWT Authentication Filter validates every request:</span>

#### <span style="color: #553c9a;">Token Validation</span>
<span style="color: #4a5568;">- Checks for valid Authorization header</span>
<span style="color: #4a5568;">- Verifies token signature and format</span>
<span style="color: #4a5568;">- Confirms token hasn't expired</span>

#### <span style="color: #553c9a;">Claims Extraction</span>
<span style="color: #4a5568;">- Extracts user identity and role from token</span>
<span style="color: #4a5568;">- Gets policy ID and deceased flag</span>
<span style="color: #4a5568;">- Verifies policy exists in system</span>

#### <span style="color: #553c9a;">Role Recalculation</span>
<span style="color: #4a5568;">- Compares token claims with current policy status</span>
<span style="color: #4a5568;">- Adjusts effective role if deceased flag is active</span>
<span style="color: #4a5568;">- Logs any mismatches for security monitoring</span>

#### <span style="color: #553c9a;">Security Context</span>
<span style="color: #4a5568;">- Sets authentication context for the request</span>
<span style="color: #4a5568;">- Makes user information available to application</span>
<span style="color: #4a5568;">- Fails securely if any validation fails</span>

</div>

---

## <span style="color: #2d3748;">SECURITY BEST PRACTICES</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Never Share Passwords</span>
<span style="color: rgba(255,255,255,0.9);">Keep your login credentials private and secure</span>

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Use Strong Passwords</span>
<span style="color: rgba(255,255,255,0.9);">Create complex passwords with letters, numbers, and symbols</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Log Out When Done</span>
<span style="color: rgba(255,255,255,0.9);">Always log out when you're finished using the system</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Report Issues</span>
<span style="color: rgba(255,255,255,0.9);">Contact support if you notice any unusual account activity</span>

</div>

</div>

---

## <span style="color: #2d3748;">TROUBLESHOOTING AUTHENTICATION</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">COMMON LOGIN ISSUES</span>

<span style="color: #4a5568;">If you have trouble logging in:</span>

#### <span style="color: #dd6b20;">Invalid Credentials</span>
<span style="color: #4a5568;">Check that you're using the correct email and password</span>

#### <span style="color: #dd6b20;">Token Expired</span>
<span style="color: #4a5568;">Log in again - tokens expire after 1 hour for security</span>

#### <span style="color: #dd6b20;">Access Denied</span>
<span style="color: #4a5568;">Your role may not have access to the requested feature</span>

#### <span style="color: #dd6b20;">Account Locked</span>
<span style="color: #4a5568;">Contact support if your account has been locked for security reasons</span>

</div>

---

## <span style="color: #2d3748;">SUMMARY</span>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">WHY AUTHENTICATION MATTERS</span>

<span style="color: rgba(255,255,255,0.95);">The Authentication System provides:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Secure Access** - Only authorized users can access the system</span>
<span style="color: white;">- **Role-Based Control** - Each person sees only what they're allowed to see</span>
<span style="color: white;">- **Dynamic Adaptation** - Access adjusts based on policy status changes</span>
<span style="color: white;">- **Token Security** - Digital tokens prevent unauthorized access</span>
<span style="color: white;">- **Request Validation** - Every action is checked for authenticity</span>
<span style="color: white;">- **Claims Mode Support** - Automatically adapts when someone passes away</span>
<span style="color: white;">- **Audit Trail** - All authentication attempts are logged for security</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">The Authentication System is the foundation of security for the MediCare Companion application. It ensures that only the right people can access the system while dynamically adapting to changing circumstances like claims processing. By using modern security practices like JWT tokens, password hashing, and request validation, it protects both your personal information and MediCare's policy data while providing a smooth, secure user experience.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This documentation covers the Authentication System that secures access to the MediCare Companion application through JWT tokens, role-based access control, and dynamic adaptation to policy status changes.</span>

</div>