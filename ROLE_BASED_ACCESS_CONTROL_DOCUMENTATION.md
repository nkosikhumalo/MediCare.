<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">ROLE-BASED ACCESS CONTROL - WHO CAN DO WHAT</span>

</div>

## <span style="color: #2d3748;">WHAT IS ROLE-BASED ACCESS CONTROL?</span>

<span style="color: #4a5568;">Role-Based Access Control (RBAC) is like having different keys for different doors in a building. Some people have keys that open many doors, while others have keys that only open a few. This system makes sure that each person can only access the features they're allowed to use based on their role in the MediCare system.</span>

---

## <span style="color: #2d3748;">THE TWO MAIN ROLES</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">POLICYHOLDER</span>

<span style="color: rgba(255,255,255,0.9);">The main owner of the insurance policy. This person has full access to all features and can make changes to their policy.</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">**Full Access To:**</span>
<span style="color: rgba(255,255,255,0.9);">- Chat support and policy questions</span>
<span style="color: rgba(255,255,255,0.9);">- What-if premium calculations</span>
<span style="color: rgba(255,255,255,0.9);">- Self-service address updates</span>
<span style="color: rgba(255,255,255,0.9);">- Claims support and tracking</span>
<span style="color: rgba(255,255,255,0.9);">- All policy information</span>

</div>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 15px; color: white;">

### <span style="color: white;">BENEFICIARY</span>

<span style="color: rgba(255,255,255,0.9);">Someone named to receive benefits from the policy. This person has limited access focused on claims and basic information.</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">**Limited Access To:**</span>
<span style="color: rgba(255,255,255,0.9);">- Chat support and policy questions</span>
<span style="color: rgba(255,255,255,0.9);">- Claims support and tracking</span>
<span style="color: rgba(255,255,255,0.9);">- Basic policy information</span>

<span style="color: rgba(255,255,255,0.9);">**Cannot Access:**</span>
<span style="color: rgba(255,255,255,0.9);">- What-if premium calculations</span>
<span style="color: rgba(255,255,255,0.9);">- Self-service updates</span>

</div>

</div>

</div>

---

## <span style="color: #2d3748;">PERMISSIONS MATRIX - THE COMPLETE PICTURE</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">FEATURE ACCESS BREAKDOWN</span>

<span style="color: #4a5568;">Here's exactly what each role can and cannot do:</span>

<div style="overflow-x: auto; margin: 20px 0;">

<table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden;">

<thead>
<tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
<th style="padding: 15px; text-align: left; border: none;">Feature</th>
<th style="padding: 15px; text-align: center; border: none;">Policyholder</th>
<th style="padding: 15px; text-align: center; border: none;">Beneficiary</th>
</tr>
</thead>

<tbody>
<tr style="border-bottom: 1px solid #e2e8f0;">
<td style="padding: 15px; border: none;">
<div style="font-weight: bold; color: #2d3748;">Chat Support</div>
<div style="font-size: 12px; color: #718096;">Ask questions about policy</div>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
</tr>

<tr style="border-bottom: 1px solid #e2e8f0; background-color: #f7fafc;">
<td style="padding: 15px; border: none;">
<div style="font-weight: bold; color: #2d3748;">What-If Premium Calculator</div>
<div style="font-size: 12px; color: #718096;">Calculate premium changes</div>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #f56565; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">NO</span>
</td>
</tr>

<tr style="border-bottom: 1px solid #e2e8f0;">
<td style="padding: 15px; border: none;">
<div style="font-weight: bold; color: #2d3748;">Self-Service Updates</div>
<div style="font-size: 12px; color: #718096;">Update address and contact info</div>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #f56565; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">NO</span>
</td>
</tr>

<tr style="border-bottom: 1px solid #e2e8f0; background-color: #f7fafc;">
<td style="padding: 15px; border: none;">
<div style="font-weight: bold; color: #2d3748;">Claims Support</div>
<div style="font-size: 12px; color: #718096;">Submit and track claims</div>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
</tr>

<tr style="background-color: #f7fafc;">
<td style="padding: 15px; border: none;">
<div style="font-weight: bold; color: #2d3748;">Policy Information</div>
<div style="font-size: 12px; color: #718096;">View policy details</div>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
<td style="padding: 15px; text-align: center; border: none;">
<span style="background-color: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">YES</span>
</td>
</tr>

</tbody>

</table>

</div>

</div>

---

## <span style="color: #2d3748;">HOW IT WORKS - THE SECURITY CHECKS</span>

<div style="background-color: #ebf8ff; border-left: 4px solid #4299e1; padding: 15px; margin: 15px 0;">

### <span style="color: #2b6cb0;">STEP 1: LOGIN AND ROLE ASSIGNMENT</span>
<span style="color: #4a5568;">When you log in, the system checks who you are and assigns you the correct role (Policyholder or Beneficiary) based on your relationship to the policy.</span>

</div>

<div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 15px 0;">

### <span style="color: #276749;">STEP 2: REQUEST VALIDATION</span>
<span style="color: #4a5568;">Every time you try to use a feature, the system checks if your role has permission to access that specific feature.</span>

</div>

<div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px; margin: 15px 0;">

### <span style="color: #c05621;">STEP 3: SPECIAL CONDITION CHECKS</span>
<span style="color: #4a5568;">The system also checks for special conditions like the deceased flag, which can temporarily freeze certain features even for policyholders.</span>

</div>

<div style="background-color: #faf5ff; border-left: 4px solid #9f7aea; padding: 15px; margin: 15px 0;">

### <span style="color: #6b46c1;">STEP 4: ALLOW OR BLOCK</span>
<span style="color: #4a5568;">Based on your role and conditions, the system either allows you to proceed or blocks access with a clear explanation.</span>

</div>

---

## <span style="color: #2d3748;">THE DECEASED FLAG - SPECIAL FREEZE MODE</span>

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">WHAT HAPPENS WHEN SOMEONE PASSES AWAY</span>

<span style="color: #4a5568;">When the insured person passes away, the system activates a special "deceased flag" that changes how things work:</span>

#### <span style="color: #e53e3e;">What Gets Frozen</span>
<span style="color: #4a5568;">- Self-service updates (address changes, contact info)</span>
<span style="color: #4a5568;">- What-if premium calculations</span>
<span style="color: #4a5568;">- Any policy modification features</span>

#### <span style="color: #e53e3e;">What Still Works</span>
<span style="color: #4a5568;">- Chat support (switches to empathetic claims mode)</span>
<span style="color: #4a5568;">- Claims support and document uploads</span>
<span style="color: #4a5568;">- Policy information viewing</span>
<span style="color: #4a5568;">- Beneficiary access to claims features</span>

#### <span style="color: #e53e3e;">Why This Matters</span>
<span style="color: #4a5568;">This prevents accidental changes to a policy when someone has passed away and ensures the focus remains on claims processing rather than policy modifications.</span>

</div>

---

## <span style="color: #2d3748;">FEATURE DETAILS - WHAT EACH ONE DOES</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background-color: #ebf8ff; padding: 20px; border-radius: 10px; border: 2px solid #4299e1;">

### <span style="color: #2b6cb0;">Chat Support</span>
<span style="color: #4a5568;">The AI-powered question answering system that helps users understand their policy, get information about benefits, and receive guidance on various topics.</span>

<div style="margin-top: 10px; padding: 10px; background-color: rgba(66, 153, 225, 0.1); border-radius: 5px;">
<span style="color: #2c5282; font-size: 12px;">**Access:** Both Policyholder and Beneficiary</span>
</div>

</div>

<div style="background-color: #f0fff4; padding: 20px; border-radius: 10px; border: 2px solid #48bb78;">

### <span style="color: #276749;">What-If Premium Calculator</span>
<span style="color: #4a5568;">A tool that lets policyholders see how changing their coverage amount would affect their premium payments before making any actual changes.</span>

<div style="margin-top: 10px; padding: 10px; background-color: rgba(72, 187, 120, 0.1); border-radius: 5px;">
<span style="color: #22543d; font-size: 12px;">**Access:** Policyholder Only</span>
</div>

</div>

<div style="background-color: #fffaf0; padding: 20px; border-radius: 10px; border: 2px solid #ed8936;">

### <span style="color: #c05621;">Self-Service Updates</span>
<span style="color: #4a5568;">Features that allow policyholders to update their personal information like address, contact details, and other policy-related information without calling customer service.</span>

<div style="margin-top: 10px; padding: 10px; background-color: rgba(237, 137, 54, 0.1); border-radius: 5px;">
<span style="color: #7c2d12; font-size: 12px;">**Access:** Policyholder Only</span>
</div>

</div>

<div style="background-color: #faf5ff; padding: 20px; border-radius: 10px; border: 2px solid #9f7aea;">

### <span style="color: #6b46c1;">Claims Support</span>
<span style="color: #4a5568;">The claims processing system that lets users submit death claims, upload required documents, track claim status, and get guidance through the claims process.</span>

<div style="margin-top: 10px; padding: 10px; background-color: rgba(159, 122, 234, 0.1); border-radius: 5px;">
<span style="color: #44337a; font-size: 12px;">**Access:** Both Policyholder and Beneficiary</span>
</div>

</div>

<div style="background-color: #e6fffa; padding: 20px; border-radius: 10px; border: 2px solid #38b2ac;">

### <span style="color: #234e52;">Policy Information</span>
<span style="color: #4a5568;">Access to view policy details, coverage information, beneficiaries, premium amounts, and other static policy information.</span>

<div style="margin-top: 10px; padding: 10px; background-color: rgba(56, 178, 172, 0.1); border-radius: 5px;">
<span style="color: #134e4a; font-size: 12px;">**Access:** Both Policyholder and Beneficiary</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">TECHNICAL PROTECTION - HOW IT'S ENFORCED</span>

<div style="background-color: #edf2f7; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">MULTIPLE LAYERS OF SECURITY</span>

<span style="color: #4a5568;">The system uses several security layers to make sure the right people access the right features:</span>

#### <span style="color: #4a5568;">Layer 1: Authentication</span>
<span style="color: #4a5568;">Users must log in with valid credentials before accessing any features. This uses JWT tokens to prove identity.</span>

#### <span style="color: #4a5568;">Layer 2: Role Middleware</span>
<span style="color: #4a5568;">The Node.js backend checks roles before requests even reach the Java backend. This is the first line of defense.</span>

#### <span style="color: #4a5568;">Layer 3: Intent Guard</span>
<span style="color: #4a5568;">The RAG system has additional protection that checks the intent of questions and blocks beneficiaries from asking about restricted topics.</span>

#### <span style="color: #4a5568;">Layer 4: Java Security</span>
<span style="color: #4a5568;">The Java backend has its own security configuration that double-checks permissions at the application level.</span>

#### <span style="color: #4a5568;">Layer 5: Audit Logging</span>
<span style="color: #4a5568;">Every access attempt is logged, creating a complete record of who tried to access what and whether it was allowed.</span>

</div>

---

## <span style="color: #2d3748;">WHY BENEFICIARIES HAVE LIMITED ACCESS</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">THE SECURITY REASONING</span>

<span style="color: #4a5568;">Beneficiaries have limited access for important security and legal reasons:</span>

#### <span style="color: #dd6b20;">Financial Protection</span>
<span style="color: #4a5568;">Prevents beneficiaries from making changes that could affect the policy value or premiums that they don't have legal authority to change.</span>

#### <span style="color: #dd6b20;">Legal Compliance</span>
<span style="color: #4a5568;">Insurance laws and regulations specify that only policyholders can make certain types of changes to their policies.</span>

#### <span style="color: #dd6b20;">Fraud Prevention</span>
<span style="color: #4a5568;">Reduces the risk of unauthorized changes by limiting who can modify policy terms and financial details.</span>

#### <span style="color: #dd6b20;">Claims Focus</span>
<span style="color: #4a5568;">When beneficiaries need access, it's typically for claims-related purposes, so their access is focused on those specific needs.</span>

</div>

---

## <span style="color: #2d3748;">ERROR MESSAGES - WHAT HAPPENS WHEN ACCESS IS DENIED</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">CLEAR COMMUNICATION</span>

<span style="color: #4a5568;">When access is denied, the system provides clear, helpful error messages:</span>

#### <span style="color: #4a5568;">Role-Based Denial</span>
<span style="color: #4a5568;">"Access denied. This feature requires Policyholder access. Your current role: Beneficiary."</span>

#### <span style="color: #4a5568;">Deceased Flag Freeze</span>
<span style="color: #4a5568;">"This account is in Claims Support mode. Self-service operations are suspended. Please contact us to proceed with a death claim."</span>

#### <span style="color: #4a5568;">Authentication Required</span>
<span style="color: #4a5568;">"You need to log in to access this feature. Please authenticate and try again."</span>

</div>

---

## <span style="color: #2d3748;">AUDIT TRAIL - KEEPING TRACK OF ACCESS</span>

<div style="background-color: #e6fffa; border: 2px solid #38b2ac; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #234e52;">COMPLETE RECORDS</span>

<span style="color: #4a5568;">The system maintains detailed logs of all access attempts:</span>

<div style="background-color: rgba(56, 178, 172, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #134e4a;">**User Identity**</span> - Who made the request
- <span style="color: #134e4a;">**Role Information**</span> - What role they had
- <span style="color: #134e4a;">**Requested Feature**</span> - What they tried to access
- <span style="color: #134e4a;">**Access Decision**</span> - Whether it was allowed or denied
- <span style="color: #134e4a;">**Timestamp**</span> - When the attempt occurred
- <span style="color: #134e4a;">**Special Conditions**</span> - Things like deceased flag status

</div>

<span style="color: #4a5568;">This audit trail helps with security monitoring, compliance requirements, and investigating any access issues.</span>

</div>

---

## <span style="color: #2d3748;">BEST PRACTICES - HOW TO USE THE SYSTEM SAFELY</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">SECURITY TIPS FOR USERS</span>

<span style="color: #4a5568;">To keep your account and policy information secure:</span>

#### <span style="color: #553c9a;">Protect Your Login</span>
<span style="color: #4a5568;">Never share your login credentials with anyone, even family members. Each person should have their own access if they're authorized.</span>

#### <span style="color: #553c9a;">Understand Your Role</span>
<span style="color: #4a5568;">Know what features you can access based on your role. If you need different access, contact MediCare customer service.</span>

#### <span style="color: #553c9a;">Report Issues</span>
<span style="color: #4a5568;">If you see features you shouldn't have access to, or can't access features you need, report it immediately.</span>

#### <span style="color: #553c9a;">Keep Contact Info Updated</span>
<span style="color: #4a5568;">Make sure your contact information is current so you can be reached about any important policy changes or security concerns.</span>

</div>

---

## <span style="color: #2d3748;">SUMMARY - THE BIG PICTURE</span>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">WHAT RBAC MEANS FOR YOU</span>

<span style="color: rgba(255,255,255,0.95);">The Role-Based Access Control system ensures that:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Right People, Right Access** - Each person gets exactly the access they need</span>
<span style="color: white;">- **Security First** - Multiple layers protect against unauthorized access</span>
<span style="color: white;">- **Clear Boundaries** - Everyone knows what they can and cannot do</span>
<span style="color: white;">- **Smart Adaptation** - The system adapts to special situations like deceased flags</span>
<span style="color: white;">- **Complete Records** - All access is tracked for security and compliance</span>
<span style="color: white;">- **User-Friendly** - Clear error messages explain why access is denied</span>
<span style="color: white;">- **Legal Compliance** - Follows insurance regulations and requirements</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">This system protects both MediCare and customers by ensuring that only authorized people can make changes to policies, while still providing easy access to information and support for everyone who needs it. It's like having a smart security guard that knows exactly who should be allowed into each room of the building.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This documentation covers the complete Role-Based Access Control system that protects the MediCare Companion application while providing appropriate access to all authorized users.</span>

</div>