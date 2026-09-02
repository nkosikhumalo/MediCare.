<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

# <span style="color: white;">DATABASE SCHEMA - THE DATA FOUNDATION</span>

</div>

## <span style="color: #2d3748;">WHAT IS THE DATABASE SCHEMA?</span>

<span style="color: #4a5568;">The Database Schema is like the blueprint for how all the information in the MediCare Companion system is organized and stored. Using PostgreSQL, it defines the structure for user accounts, conversations, claims, documents, and audit logs - everything the system needs to function properly and securely.</span>

---

## <span style="color: #2d3748;">MAIN DATABASE TABLES</span>

<div style="background-color: #f7fafc; border: 2px solid #718096; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2d3748;">DATA STORAGE STRUCTURE</span>

<span style="color: #4a5568;">The database consists of several key tables:</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin: 15px 0;">

<div style="background-color: #ebf8ff; padding: 15px; border-radius: 8px;">
<span style="color: #2b6cb0; font-weight: bold;">users</span>
<span style="color: #4a5568; font-size: 14px;">User accounts and authentication data</span>
</div>

<div style="background-color: #f0fff4; padding: 15px; border-radius: 8px;">
<span style="color: #276749; font-weight: bold;">conversations</span>
<span style="color: #4a5568; font-size: 14px;">Chat conversation sessions</span>
</div>

<div style="background-color: #fffaf0; padding: 15px; border-radius: 8px;">
<span style="color: #c05621; font-weight: bold;">messages</span>
<span style="color: #4a5568; font-size: 14px;">Individual chat messages</span>
</div>

<div style="background-color: #faf5ff; padding: 15px; border-radius: 8px;">
<span style="color: #6b46c1; font-weight: bold;">claims</span>
<span style="color: #4a5568; font-size: 14px;">Death claim tickets and status</span>
</div>

<div style="background-color: #e6fffa; padding: 15px; border-radius: 8px;">
<span style="color: #234e52; font-weight: bold;">claim_documents</span>
<span style="color: #4a5568; font-size: 14px;">Documents uploaded for claims</span>
</div>

<div style="background-color: #fff5f5; padding: 15px; border-radius: 8px;">
<span style="color: #c53030; font-weight: bold;">audit_log</span>
<span style="color: #4a5568; font-size: 14px;">Complete audit trail of all actions</span>
</div>

</div>

</div>

---

## <span style="color: #2d3748;">USERS TABLE</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">USER ACCOUNT INFORMATION</span>

<span style="color: #4a5568;">Stores all user account details and authentication information:</span>

<div style="background-color: rgba(66, 153, 225, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #2c5282;">**id**</span> - Unique user identifier (auto-incrementing)</span>
- <span style="color: #2c5282;">**first_name, last_name**</span> - User's full name</span>
- <span style="color: #2c5282;">**email**</span> - Unique email address for login</span>
- <span style="color: #2c5282;">**username**</span> - Unique username for login</span>
- <span style="color: #2c5282;">**password**</span> - Encrypted password (never stored as plain text)</span>
- <span style="color: #2c5282;">**phone**</span> - Contact phone number</span>
- <span style="color: #2c5282;">**date_of_birth**</span> - User's date of birth</span>
- <span style="color: #2c5282;">**id_number, passport_number**</span> - Identification details</span>
- <span style="color: #2c5282;">**country_of_issue**</span> - Country where ID was issued</span>
- <span style="color: #2c5282;">**role**</span> - User role (ROLE_POLICYHOLDER or ROLE_BENEFICIARY)</span>
- <span style="color: #2c5282;">**policy_id**</span> - Associated policy identifier</span>
- <span style="color: #2c5282;">**deceased_flag**</span> - Whether policy is in claims mode</span>
- <span style="color: #2c5282;">**created_at**</span> - When the account was created</span>

</div>

#### <span style="color: #2c5282;">Key Features</span>
<span style="color: #4a5568;">- Email and username must be unique</span>
<span style="color: #4a5568;">- Password is encrypted using bcrypt</span>
<span style="color: #4a5568;">- Role determines feature access</span>
<span style="color: #4a5568;">- Deceased flag triggers special claims mode</span>

</div>

---

## <span style="color: #2d3748;">CONVERSATIONS TABLE</span>

<div style="background-color: #f0fff4; border: 2px solid #48bb78; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #276749;">CHAT SESSION MANAGEMENT</span>

<span style="color: #4a5568;">Manages chat conversation sessions:</span>

<div style="background-color: rgba(72, 187, 120, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #22543d;">**id**</span> - Unique conversation identifier</span>
- <span style="color: #22543d;">**user_id**</span> - Reference to the user who owns the conversation</span>
- <span style="color: #22543d;">**title**</span> - Conversation title (defaults to "New Conversation")</span>
- <span style="color: #22543d;">**preview**</span> - Preview text of the conversation</span>
- <span style="color: #22543d;">**created_at**</span> - When the conversation started</span>
- <span style="color: #22543d;">**updated_at**</span> - When the conversation was last updated</span>

</div>

#### <span style="color: #22543d;">Key Features</span>
<span style="color: #4a5568;">- Each user can have multiple conversations</span>
<span style="color: #4a5568;">- Conversations are deleted when user is deleted (cascade)</span>
<span style="color: #4a5568;">- Supports conversation history and organization</span>

</div>

---

## <span style="color: #2d3748;">MESSAGES TABLE</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">CHAT MESSAGE STORAGE</span>

<span style="color: #4a5568;">Stores individual chat messages within conversations:</span>

<div style="background-color: rgba(237, 137, 54, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #dd6b20;">**id**</span> - Unique message identifier</span>
- <span style="color: #dd6b20;">**conversation_id**</span> - Reference to the conversation</span>
- <span style="color: #dd6b20;">**sender**</span> - Who sent the message (user or system)</span>
- <span style="color: #dd6b20;">**message**</span> - The actual message text</span>
- <span style="color: #dd6b20;">**created_at**</span> - When the message was sent</span>

</div>

#### <span style="color: #dd6b20;">Key Features</span>
<span style="color: #4a5568;">- Messages are tied to specific conversations</span>
<span style="color: #4a5568;">- Messages are deleted when conversation is deleted (cascade)</span>
<span style="color: #4a5568;">- Maintains chronological order of conversations</span>

</div>

---

## <span style="color: #2d3748;">CLAIMS TABLE</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">DEATH CLAIM MANAGEMENT</span>

<span style="color: #4a5568;">Manages FNOL (First Notice of Loss) death claim tickets:</span>

<div style="background-color: rgba(159, 122, 234, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #553c9a;">**id**</span> - Unique claim identifier</span>
- <span style="color: #553c9a;">**user_id**</span> - Reference to the user who submitted the claim</span>
- <span style="color: #553c9a;">**policy_id**</span> - Associated policy identifier</span>
- <span style="color: #553c9a;">**claimant_name**</span> - Name of the person submitting the claim</span>
- <span style="color: #553c9a;">**deceased_name**</span> - Name of the deceased person</span>
- <span style="color: #553c9a;">**deceased_id_number**</span> - ID number of the deceased</span>
- <span style="color: #553c9a;">**date_of_death**</span> - Date when the person passed away</span>
- <span style="color: #553c9a;">**status**</span> - Claim status (CLAIM_SUBMITTED_PENDING_REVIEW, UNDER_REVIEW, APPROVED, REJECTED)</span>
- <span style="color: #553c9a;">**documents_validated**</span> - Whether required documents have been validated</span>
- <span style="color: #553c9a;">**notes**</span> - Additional notes about the claim</span>
- <span style="color: #553c9a;">**created_at**</span> - When the claim was submitted</span>
- <span style="color: #553c9a;">**updated_at**</span> - When the claim was last updated</span>

</div>

#### <span style="color: #553c9a;">Key Features</span>
<span style="color: #4a5568;">- Status lifecycle tracks claim progress</span>
<span style="color: #4a5568;">- Claims are deleted when user is deleted (cascade)</span>
<span style="color: #4a5568;">- Supports complete claims workflow management</span>

</div>

---

## <span style="color: #2d3748;">CLAIM_DOCUMENTS TABLE</span>

<div style="background-color: #e6fffa; border: 2px solid #38b2ac; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #234e52;">DOCUMENT MANAGEMENT</span>

<span style="color: #4a5568;">Stores documents uploaded for claims processing:</span>

<div style="background-color: rgba(56, 178, 172, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #134e4a;">**id**</span> - Unique document identifier</span>
- <span style="color: #134e4a;">**claim_id**</span> - Reference to the associated claim</span>
- <span style="color: #134e4a;">**doc_type**</span> - Type of document (DEATH_CERTIFICATE, ID_DOCUMENT, BANK_STATEMENT, DHA_1663, OTHER)</span>
- <span style="color: #134e4a;">**file_name**</span> - Name of the uploaded file</span>
- <span style="color: #134e4a;">**mime_type**</span> - File type (JPEG, PNG, PDF, etc.)</span>
- <span style="color: #134e4a;">**is_valid**</span> - Result of AI validation scan</span>
- <span style="color: #134e4a;">**validation_notes**</span> - AI feedback on document quality or issues</span>
- <span style="color: #134e4a;">**created_at**</span> - When the document was uploaded</span>

</div>

#### <span style="color: #134e4a;">Key Features</span>
<span style="color: #4a5568;">- Each claim can have multiple documents</span>
<span style="color: #4a5568;">- Documents are deleted when claim is deleted (cascade)</span>
<span style="color: #4a5568;">- AI validation results are stored for each document</span>
<span style="color: #4a5568;">- Supports various document types required for claims</span>

</div>

---

## <span style="color: #2d3748;">AUDIT_LOG TABLE</span>

<div style="background-color: #fff5f5; border: 2px solid #f56565; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c53030;">COMPLETE AUDIT TRAIL</span>

<span style="color: #4a5568;">Append-only audit log of all system actions:</span>

<div style="background-color: rgba(245, 101, 101, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

- <span style="color: #e53e3e;">**id**</span> - Unique audit entry identifier</span>
- <span style="color: #e53e3e;">**timestamp**</span> - When the action occurred (with timezone)</span>
- <span style="color: #e53e3e;">**user_id**</span> - User identifier from JWT (string, not foreign key)</span>
- <span style="color: #e53e3e;">**policy_id**</span> - Associated policy identifier</span>
- <span style="color: #e53e3e;">**role**</span> - User role at time of action</span>
- <span style="color: #e53e3e;">**action**</span> - Type of action performed</span>
- <span style="color: #e53e3e;">**details**</span> - Additional context as JSON data</span>
- <span style="color: #e53e3e;">**escalation_triggered**</span> - Whether this action triggered security escalation</span>
- <span style="color: #e53e3e;">**status**</span> - Status of the action (APPROVED, etc.)</span>

</div>

#### <span style="color: #e53e3e;">Key Features</span>
<span style="color: #4a5568;">- Append-only table (no UPDATE or DELETE ever)</span>
<span style="color: #4a5568;">- Written by both Java and Node.js systems</span>
<span style="color: #4a5568;">- Survives user deletions (user_id is string, not foreign key)</span>
<span style="color: #4a5568;">- Provides complete security and compliance trail</span>

</div>

---

## <span style="color: #2d3748;">DATABASE RELATIONSHIPS</span>

<div style="background-color: #faf5ff; border: 2px solid #9f7aea; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #6b46c1;">HOW TABLES CONNECT</span>

<span style="color: #4a5568;">The database tables are connected through relationships:</span>

#### <span style="color: #553c9a;">User to Conversations</span>
<span style="color: #4a5568;">- One user can have many conversations</span>
<span style="color: #4a5568;">- Deleting a user deletes all their conversations (cascade)</span>

#### <span style="color: #553c9a;">Conversations to Messages</span>
<span style="color: #4a5568;">- One conversation can have many messages</span>
<span style="color: #4a5568;">- Deleting a conversation deletes all its messages (cascade)</span>

#### <span style="color: #553c9a;">User to Claims</span>
<span style="color: #4a5568;">- One user can have many claims</span>
<span style="color: #4a5568;">- Deleting a user deletes all their claims (cascade)</span>

#### <span style="color: #553c9a;">Claims to Documents</span>
<span style="color: #4a5568;">- One claim can have many documents</span>
<span style="color: #4a5568;">- Deleting a claim deletes all its documents (cascade)</span>

#### <span style="color: #553c9a;">Audit Log Independence</span>
<span style="color: #4a5568;">- Audit log is not connected to other tables via foreign keys</span>
<span style="color: #4a5568;">- Ensures audit trail survives even if users are deleted</span>

</div>

---

## <span style="color: #2d3748;">DATA INTEGRITY</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Unique Constraints</span>
<span style="color: rgba(255,255,255,0.9);">Email and username must be unique to prevent duplicate accounts</span>

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Foreign Keys</span>
<span style="color: rgba(255,255,255,0.9);">Relationships ensure data consistency across tables</span>

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Cascade Deletes</span>
<span style="color: rgba(255,255,255,0.9);">Automatically cleans up related data when records are deleted</span>

</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">

### <span style="color: white;">Default Values</span>
<span style="color: rgba(255,255,255,0.9);">Sensible defaults for status flags and timestamps</span>

</div>

</div>

---

## <span style="color: #2d3748;">SECURITY CONSIDERATIONS</span>

<div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #c05621;">DATA PROTECTION</span>

<span style="color: #4a5568;">The database schema includes security features:</span>

#### <span style="color: #dd6b20;">Password Encryption</span>
<span style="color: #4a5568;">- Passwords are never stored as plain text</span>
<span style="color: #4a5568;">- Encrypted using bcrypt before storage</span>

#### <span style="color: #dd6b20;">Audit Trail</span>
<span style="color: #4a5568;">- Complete record of all system actions</span>
<span style="color: #4a5568;">- Append-only to prevent tampering</span>

#### <span style="color: #dd6b20;">Role Separation</span>
<span style="color: #4a5568;">- User roles are stored and enforced</span>
<span style="color: #4a5568;">- Prevents unauthorized access</span>

#### <span style="color: #dd6b20;">Document Validation</span>
<span style="color: #4a5568;">- AI validation results are stored</span>
<span style="color: #4a5568;">- Tracks document quality and authenticity</span>

</div>

---

## <span style="color: #2d3748;">PERFORMANCE OPTIMIZATION</span>

<div style="background-color: #ebf8ff; border: 2px solid #4299e1; padding: 20px; border-radius: 10px; margin: 20px 0;">

### <span style="color: #2b6cb0;">EFFICIENT DATA ACCESS</span>

<span style="color: #4a5568;">The schema is designed for performance:</span>

#### <span style="color: #2c5282;">Indexes</span>
<span style="color: #4a5568;">- Primary keys on all tables for fast lookups</span>
<span style="color: #4a5568;">- Unique constraints on email and username</span>

#### <span style="color: #2c5282;">Data Types</span>
<span style="color: #4a5568;">- Appropriate data types for each field</span>
<span style="color: #4a5568;">- JSONB for flexible audit log details</span>

#### <span style="color: #2c5282;">Normalization</span>
<span style="color: #4a5568;">- Organized to minimize data redundancy</span>
<span style="color: #4a5568;">- Proper relationships between tables</span>

#### <span style="color: #2c5282;">Timestamps</span>
<span style="color: #4a5568;">- Automatic timestamp management</span>
<span style="color: #4a5568;">- Helps with data lifecycle management</span>

</div>

---

## <span style="color: #2d3748;">SUMMARY</span>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 15px; margin: 20px 0;">

### <span style="color: white;">WHY THE DATABASE SCHEMA MATTERS</span>

<span style="color: rgba(255,255,255,0.95);">The Database Schema provides:</span>

<div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">

<span style="color: white;">- **Structured Storage** - Organized way to store all system data</span>
<span style="color: white;">- **Data Integrity** - Rules to ensure data consistency and accuracy</span>
<span style="color: white;">- **Security** - Protected storage for sensitive information</span>
<span style="color: white;">- **Audit Trail** - Complete record of all system actions</span>
<span style="color: white;">- **Relationships** - Connected data for complex operations</span>
<span style="color: white;">- **Performance** - Optimized for fast data access</span>
<span style="color: white;">- **Scalability** - Designed to grow with the system</span>

</div>

### <span style="color: white;">THE BOTTOM LINE</span>

<span style="color: rgba(255,255,255,0.95);">The Database Schema is the foundation that stores and organizes all the information the MediCare Companion system needs to function. From user accounts to chat conversations, from claims to audit logs, every piece of data has its proper place. By using PostgreSQL with well-designed tables, relationships, and security features, the database ensures that data is stored safely, accessed efficiently, and maintains integrity throughout the system's lifecycle.</span>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px;">

<span style="color: #4a5568; font-style: italic;">This documentation covers the PostgreSQL Database Schema that provides the structured data foundation for the MediCare Companion application, including user management, chat functionality, claims processing, and comprehensive audit logging.</span>

</div>