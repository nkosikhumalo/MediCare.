import subprocess, json

BASE_JAVA = "http://localhost:8080"
BASE_NODE = "http://localhost:5000"

def get_java_token(subject, policy_id, role):
    resp = subprocess.check_output([
        "curl","-s","-XPOST",f"{BASE_JAVA}/api/dev/mock-token",
        "-H","Content-Type: application/json",
        "-d", json.dumps({"subject": subject, "policyId": policy_id, "requestedRole": role})
    ], text=True)
    return json.loads(resp)["token"]

PH   = get_java_token("user-policyholder-1", "POL-1001", "POLICYHOLDER")
BEN  = get_java_token("user-beneficiary-2",  "POL-2002", "BENEFICIARY")
DEAD = get_java_token("user-policyholder-2", "POL-2002", "POLICYHOLDER")  # deceased flag=true

resp = subprocess.check_output([
    "curl","-s","-XPOST",f"{BASE_NODE}/api/auth/login",
    "-H","Content-Type: application/json",
    "-d", json.dumps({"email":"testuser_kiro2@example.com","password":"Password123!"})
], text=True)
NODE_PH = json.loads(resp).get("token","")

results = []

def run(label, expected_code, args):
    cmd = ["curl","-s","-w","\nHTTP_CODE:%{http_code}"] + args
    try:
        out = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, text=True)
        lines = out.rsplit("\nHTTP_CODE:", 1)
        code = lines[1].strip() if len(lines) == 2 else "000"
        raw  = lines[0].strip()
        try:
            body = json.loads(raw)
        except:
            body = raw[:300]
        ok = (code == str(expected_code))
        results.append((ok, label, code, str(expected_code), body))
    except Exception as e:
        results.append((False, label, "ERR", str(expected_code), str(e)))

with open("fake_doc.pdf","w") as f:
    f.write("%PDF-1.4 fake death certificate doc")

WI   = json.dumps({"currentPremium":1200,"currentSumAssured":500000,"requestedSumAssured":750000,"waitingPeriodMonths":0})
WI6  = json.dumps({"currentPremium":1200,"currentSumAssured":500000,"requestedSumAssured":750000,"waitingPeriodMonths":6})
RQ   = json.dumps({"question":"What documents do I need for a death claim?","conversationId":"c1"})
CQ   = json.dumps({"question":"What is Myriad life insurance?","conversationId":"c3"})
CQBN = json.dumps({"question":"What documents are required for a death claim?","conversationId":"c4"})

# ─── WHAT-IF ─────────────────────────────────────────────────────────────────
run("What-If POLICYHOLDER",               200, ["-XPOST",f"{BASE_JAVA}/api/what-if/simulate","-H",f"Authorization: Bearer {PH}", "-H","Content-Type: application/json","-d",WI])
run("What-If BENEFICIARY blocked → 403",  403, ["-XPOST",f"{BASE_JAVA}/api/what-if/simulate","-H",f"Authorization: Bearer {BEN}","-H","Content-Type: application/json","-d",WI])
# NOTE: Spring Security 6 returns 403 (not 401) for unauthenticated requests when no custom
# AuthenticationEntryPoint is configured — this is a known Spring Security default.
run("What-If no token → 403",             403, ["-XPOST",f"{BASE_JAVA}/api/what-if/simulate","-H","Content-Type: application/json","-d",WI])
run("What-If 6m waiting period",          200, ["-XPOST",f"{BASE_JAVA}/api/what-if/simulate","-H",f"Authorization: Bearer {PH}", "-H","Content-Type: application/json","-d",WI6])

# ─── RAG ─────────────────────────────────────────────────────────────────────
run("RAG /query POLICYHOLDER",            200, ["-XPOST",f"{BASE_JAVA}/api/rag/query","-H",f"Authorization: Bearer {PH}", "-H","Content-Type: application/json","-d",RQ])
run("RAG /query BENEFICIARY allowed",     200, ["-XPOST",f"{BASE_JAVA}/api/rag/query","-H",f"Authorization: Bearer {BEN}","-H","Content-Type: application/json","-d",RQ])
run("RAG /query no token → 403",          403, ["-XPOST",f"{BASE_JAVA}/api/rag/query","-H","Content-Type: application/json","-d",RQ])
run("RAG /chat POLICYHOLDER",             200, ["-XPOST",f"{BASE_JAVA}/api/rag/chat", "-H",f"Authorization: Bearer {PH}", "-H","Content-Type: application/json","-d",CQ])
run("RAG /chat BENEFICIARY",              200, ["-XPOST",f"{BASE_JAVA}/api/rag/chat", "-H",f"Authorization: Bearer {BEN}","-H","Content-Type: application/json","-d",CQBN])

# ─── SELF-SERVICE ─────────────────────────────────────────────────────────────
run("Self-Service addr POLICYHOLDER",     200, ["-XPOST",f"{BASE_JAVA}/api/self-service/address","-H",f"Authorization: Bearer {PH}", "-F","streetAddress=12 Oak Ave","-F","city=Pretoria","-F","province=Gauteng","-F","suburb=Hatfield","-F","postalCode=0028"])
run("Self-Service addr BEN → 403",        403, ["-XPOST",f"{BASE_JAVA}/api/self-service/address","-H",f"Authorization: Bearer {BEN}","-F","streetAddress=12 Oak Ave","-F","city=Pretoria","-F","province=Gauteng"])
run("Self-Service no token → 403",        403, ["-XPOST",f"{BASE_JAVA}/api/self-service/address","-F","streetAddress=12 Oak Ave","-F","city=Pretoria","-F","province=Gauteng"])
run("Self-Service bad postal code → 400", 400, ["-XPOST",f"{BASE_JAVA}/api/self-service/address","-H",f"Authorization: Bearer {PH}", "-F","streetAddress=12 Oak Ave","-F","city=Pretoria","-F","province=Gauteng","-F","postalCode=ABCD"])
run("Self-Service province chg no doc → 400",400,["-XPOST",f"{BASE_JAVA}/api/self-service/address","-H",f"Authorization: Bearer {PH}", "-F","streetAddress=5 Beach Rd","-F","city=Cape Town","-F","province=Western Cape","-F","postalCode=8001"])

# ─── CLAIMS (Java doc validate) ────────────────────────────────────────────
# Claims validate-doc: AI runs and returns 422 when doc is invalid (fake PDF), 200 when valid
# A fake PDF will be flagged as UNKNOWN/invalid by the vision model — 422 is correct behavior
run("Claims validate-doc POLICYHOLDER",   422, ["-XPOST",f"{BASE_JAVA}/api/claims/CLAIM-001/validate-document","-H",f"Authorization: Bearer {PH}", "-F","document=@fake_doc.pdf;type=application/pdf","-F","docType=DEATH_CERTIFICATE"])
run("Claims validate-doc BENEFICIARY",    422, ["-XPOST",f"{BASE_JAVA}/api/claims/CLAIM-001/validate-document","-H",f"Authorization: Bearer {BEN}","-F","document=@fake_doc.pdf;type=application/pdf","-F","docType=DEATH_CERTIFICATE"])
# NOTE: Spring Security returns 403 (not 401) for unauthenticated when no AuthenticationEntryPoint configured
run("Claims validate-doc no token → 403", 403, ["-XPOST",f"{BASE_JAVA}/api/claims/CLAIM-001/validate-document","-F","document=@fake_doc.pdf;type=application/pdf","-F","docType=DEATH_CERTIFICATE"])

# ─── NODE BFF ─────────────────────────────────────────────────────────────────
run("Node login valid",                   200, ["-XPOST",f"{BASE_NODE}/api/auth/login","-H","Content-Type: application/json","-d",json.dumps({"email":"testuser_kiro2@example.com","password":"Password123!"})])
run("Node login wrong password → 401",    401, ["-XPOST",f"{BASE_NODE}/api/auth/login","-H","Content-Type: application/json","-d",json.dumps({"email":"testuser_kiro2@example.com","password":"WRONG"})])
run("Node RAG /query proxy",              200, ["-XPOST",f"{BASE_NODE}/api/rag/query","-H",f"Authorization: Bearer {NODE_PH}","-H","Content-Type: application/json","-d",json.dumps({"question":"What is Myriad?","conversationId":"nc1"})])
run("Node RAG /chat proxy",               200, ["-XPOST",f"{BASE_NODE}/api/rag/chat", "-H",f"Authorization: Bearer {NODE_PH}","-H","Content-Type: application/json","-d",json.dumps({"question":"What is covered?","conversationId":"nc2"})])
run("Node What-If proxy POLICYHOLDER",    200, ["-XPOST",f"{BASE_NODE}/api/what-if/simulate","-H",f"Authorization: Bearer {NODE_PH}","-H","Content-Type: application/json","-d",json.dumps({"currentPremium":1200,"currentSumAssured":500000,"requestedSumAssured":750000,"waitingPeriodMonths":0})])
run("Node Self-Service no token → 401",   401, ["-XPOST",f"{BASE_NODE}/api/self-service/address","-F","streetAddress=12 Oak","-F","city=Pretoria","-F","province=Gauteng"])
run("Node create conversation",           200, ["-XPOST",f"{BASE_NODE}/api/chat/conversations","-H",f"Authorization: Bearer {NODE_PH}","-H","Content-Type: application/json","-d",json.dumps({"user_id":7,"title":"Test chat"})])
run("Node get conversations",             200, [f"{BASE_NODE}/api/chat/conversations/7","-H",f"Authorization: Bearer {NODE_PH}"])
run("Node get messages (conv 1)",         200, [f"{BASE_NODE}/api/chat/messages/1","-H",f"Authorization: Bearer {NODE_PH}"])
run("Node claims checklist",              200, [f"{BASE_NODE}/api/claims/checklist","-H",f"Authorization: Bearer {NODE_PH}"])
run("Node create FNOL claim",             201, ["-XPOST",f"{BASE_NODE}/api/claims","-H",f"Authorization: Bearer {NODE_PH}","-H","Content-Type: application/json","-d",json.dumps({"policy_id":"POL-1001","claimant_name":"Test User","deceased_name":"John Doe","deceased_id_number":"8001015009087","date_of_death":"2026-01-15","notes":"Test claim"})])
run("Node save message",                  200, ["-XPOST",f"{BASE_NODE}/api/chat/messages","-H",f"Authorization: Bearer {NODE_PH}","-H","Content-Type: application/json","-d",json.dumps({"conversation_id":1,"sender":"user","message":"Hello"})])

# ─── DECEASED FLAG enforcement ─────────────────────────────────────────────
run("Node What-If deceased PH → 403",     403, ["-XPOST",f"{BASE_NODE}/api/what-if/simulate","-H",f"Authorization: Bearer {DEAD}","-H","Content-Type: application/json","-d",json.dumps({"currentPremium":1200,"currentSumAssured":500000,"requestedSumAssured":750000,"waitingPeriodMonths":0})])
run("Node Self-Service deceased PH → 403",403, ["-XPOST",f"{BASE_NODE}/api/self-service/address","-H",f"Authorization: Bearer {DEAD}","-F","streetAddress=12 Oak Ave","-F","city=Pretoria","-F","province=Gauteng"])
run("Node RAG deceased PH allowed",       200, ["-XPOST",f"{BASE_NODE}/api/rag/query","-H",f"Authorization: Bearer {DEAD}","-H","Content-Type: application/json","-d",json.dumps({"question":"claim documents?","conversationId":"dc1"})])

# ─── PRINT ────────────────────────────────────────────────────────────────────
passed = sum(1 for r in results if r[0])
failed = sum(1 for r in results if not r[0])

section_map = [
    ("WHAT-IF",        lambda l: "What-If" in l),
    ("RAG (Java)",     lambda l: l.startswith("RAG")),
    ("SELF-SERVICE",   lambda l: "Self-Service" in l),
    ("CLAIMS (Java)",  lambda l: l.startswith("Claims")),
    ("NODE BFF",       lambda l: l.startswith("Node") and "deceased" not in l.lower()),
    ("DECEASED FLAG",  lambda l: "deceased" in l.lower()),
]

print()
print("=" * 70)
print(f"  BACKEND TEST RESULTS  —  {passed} passed / {failed} failed / {len(results)} total")
print("=" * 70)

for section, match_fn in section_map:
    rows = [r for r in results if match_fn(r[1])]
    if not rows: continue
    print(f"\n  ── {section} ──")
    for ok, label, code, exp, body in rows:
        icon = "✅" if ok else "❌"
        detail = ""
        if isinstance(body, dict):
            for k in ["estimatedPremium","appliedFactor","status","grounded","answer","message","valid","token","id","code"]:
                if k in body:
                    v = str(body[k])
                    detail = f"   → {k}: {v[:70]}"
                    break
        if not ok:
            detail += f"  [expected {exp}, body: {str(body)[:80]}]"
        print(f"  {icon} [{code}] {label}{detail}")

print()
print("=" * 70)
print(f"  ✅ {passed} PASSED  |  ❌ {failed} FAILED")
print("=" * 70)
