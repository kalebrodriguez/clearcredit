from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ClearCredit API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", "https://clearcredit.vercel.app"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

class Course(BaseModel):
    course: str
    credits: int = 3
    grade: Optional[str] = None

class APScore(BaseModel):
    exam: str
    score: int

class AuditRequest(BaseModel):
    program_id: str
    hcc_courses: list[Course] = []
    usf_courses: list[Course] = []
    ap_scores: list[APScore] = []

class SaveProfileRequest(BaseModel):
    user_id: str
    program_id: str
    hcc_courses: list[Course] = []
    usf_courses: list[Course] = []
    ap_scores: list[APScore] = []

# ---------------------------------------------------------------------------
# AP credit mapping (Florida SBE Rule 6A-10.0315)
# ---------------------------------------------------------------------------

AP_CREDIT_MAP = {
    "Art History": {3: [("ARH 1000", 3)], 4: [("ARH 1000", 3)], 5: [("ARH 1000", 3)]},
    "Biology": {3: [("BSC 1010C", 3)], 4: [("BSC 1010C", 4)], 5: [("BSC 1010C", 4), ("BSC 1011C", 4)]},
    "Calculus AB": {3: [("MAC 2311", 4)], 4: [("MAC 2311", 4)], 5: [("MAC 2311", 4)]},
    "Calculus BC": {3: [("MAC 2311", 4)], 4: [("MAC 2311", 4), ("MAC 2312", 4)], 5: [("MAC 2311", 4), ("MAC 2312", 4)]},
    "Chemistry": {3: [("CHM 1045C", 3)], 4: [("CHM 1045C", 4)], 5: [("CHM 1045C", 4), ("CHM 1046C", 4)]},
    "Computer Science A": {3: [("COP 2250", 3)], 4: [("COP 2250", 3)], 5: [("COP 2250", 3)]},
    "Computer Science Principles": {3: [("COP 1000", 3)], 4: [("COP 1000", 3)], 5: [("COP 1000", 3)]},
    "English Language and Composition": {3: [("ENC 1101", 3)], 4: [("ENC 1101", 3)], 5: [("ENC 1101", 3), ("ENC 1102", 3)]},
    "English Literature and Composition": {3: [("ENC 1101", 3)], 4: [("ENC 1101", 3)], 5: [("ENC 1101", 3), ("ENC 1102", 3)]},
    "Environmental Science": {3: [("EVR 1001", 3)], 4: [("EVR 1001", 3)], 5: [("EVR 1001", 3)]},
    "European History": {3: [("EUH 1000", 3)], 4: [("EUH 1000", 3)], 5: [("EUH 1000", 3), ("EUH 1001", 3)]},
    "Human Geography": {3: [("GEO 2420", 3)], 4: [("GEO 2420", 3)], 5: [("GEO 2420", 3)]},
    "Macroeconomics": {3: [("ECO 2013", 3)], 4: [("ECO 2013", 3)], 5: [("ECO 2013", 3)]},
    "Microeconomics": {3: [("ECO 2023", 3)], 4: [("ECO 2023", 3)], 5: [("ECO 2023", 3)]},
    "Music Theory": {3: [("MUT 1001", 3)], 4: [("MUT 1001", 3)], 5: [("MUT 1001", 3)]},
    "Physics 1": {3: [("PHY 2053C", 4)], 4: [("PHY 2053C", 4)], 5: [("PHY 2053C", 4)]},
    "Physics 2": {3: [("PHY 2054C", 4)], 4: [("PHY 2054C", 4)], 5: [("PHY 2054C", 4)]},
    "Physics C: Electricity and Magnetism": {3: [("PHY 2049C", 4)], 4: [("PHY 2049C", 4)], 5: [("PHY 2049C", 4)]},
    "Physics C: Mechanics": {3: [("PHY 2048C", 4)], 4: [("PHY 2048C", 4)], 5: [("PHY 2048C", 4)]},
    "Psychology": {3: [("PSY 2012", 3)], 4: [("PSY 2012", 3)], 5: [("PSY 2012", 3)]},
    "Spanish Language and Culture": {3: [("SPN 1120", 3)], 4: [("SPN 1120", 3)], 5: [("SPN 1120", 3), ("SPN 2200", 3)]},
    "Statistics": {3: [("STA 2023", 3)], 4: [("STA 2023", 3)], 5: [("STA 2023", 3)]},
    "United States Government and Politics": {3: [("POS 2041", 3)], 4: [("POS 2041", 3)], 5: [("POS 2041", 3)]},
    "United States History": {3: [("AMH 2010", 3)], 4: [("AMH 2010", 3)], 5: [("AMH 2010", 3), ("AMH 2020", 3)]},
    "World History: Modern": {3: [("WOH 1012", 3)], 4: [("WOH 1012", 3)], 5: [("WOH 1012", 3), ("WOH 1022", 3)]},
}

# ---------------------------------------------------------------------------
# Program requirements
# ---------------------------------------------------------------------------

PROGRAMS = {
    "as-computer-science": {
        "name": "AS Computer Science",
        "totalCredits": 60,
        "requirements": [
            {"id": "gen-comm", "category": "General Education — Communication", "creditsRequired": 6, "courses": ["ENC 1101", "ENC 1102"], "allRequired": True, "notes": "Both required"},
            {"id": "gen-math", "category": "General Education — Mathematics", "creditsRequired": 3, "courses": ["MAC 2311", "MAC 2312", "STA 2023", "MAC 1105"], "allRequired": False, "notes": "Choose one"},
            {"id": "gen-science", "category": "General Education — Natural Science", "creditsRequired": 3, "courses": ["BSC 1005", "BSC 1010C", "CHM 1025", "PHY 2048C", "PHY 2049C", "AST 1002"], "allRequired": False, "notes": "Choose one"},
            {"id": "gen-social", "category": "General Education — Social/Behavioral Sciences", "creditsRequired": 3, "courses": ["AMH 2010", "AMH 2020", "POS 2041", "ECO 2013", "ECO 2023", "PSY 2012", "SYG 2000"], "allRequired": False, "notes": "Choose one"},
            {"id": "gen-humanities", "category": "General Education — Humanities", "creditsRequired": 3, "courses": ["AML 2010", "ENL 2012", "PHI 2010", "ARH 1000", "MUL 2010", "THE 2000"], "allRequired": False, "notes": "Choose one"},
            {"id": "core-prog1", "category": "Program Core — Programming Fundamentals", "creditsRequired": 3, "courses": ["COP 1000", "COP 2210"], "allRequired": False, "notes": "Intro programming"},
            {"id": "core-prog2", "category": "Program Core — Object-Oriented Programming", "creditsRequired": 3, "courses": ["COP 2250", "COP 2334"], "allRequired": False, "notes": "Java or C++"},
            {"id": "core-ds", "category": "Program Core — Data Structures", "creditsRequired": 3, "courses": ["COP 3530", "CDA 3101"], "allRequired": False, "notes": "Choose one"},
            {"id": "core-db", "category": "Program Core — Database Concepts", "creditsRequired": 3, "courses": ["CIS 2321", "CGS 2820"], "allRequired": False, "notes": "Database design"},
            {"id": "core-web", "category": "Program Core — Web Development", "creditsRequired": 3, "courses": ["CIS 2350", "CGS 2820", "CIS 3949"], "allRequired": False, "notes": "Web tech"},
            {"id": "core-os", "category": "Program Core — Operating Systems / Networking", "creditsRequired": 3, "courses": ["CTS 1305", "COP 3402", "CNT 1000"], "allRequired": False, "notes": "OS or networking"},
            {"id": "core-discrete", "category": "Program Core — Discrete Mathematics", "creditsRequired": 3, "courses": ["MAD 2104", "COP 2300"], "allRequired": False, "notes": "Discrete math"},
            {"id": "elective", "category": "Technical Electives", "creditsRequired": 12, "courses": ["COP 2701", "COP 3003", "CIS 2910", "CNT 2106", "CIS 3362", "CGS 1100", "COP 3337"], "allRequired": False, "notes": "12 credits"},
        ],
    },
    "aa-general-studies": {
        "name": "AA General Studies",
        "totalCredits": 60,
        "requirements": [
            {"id": "comm1", "category": "Communication — English Composition I", "creditsRequired": 3, "courses": ["ENC 1101"], "allRequired": True, "notes": "Required"},
            {"id": "comm2", "category": "Communication — English Composition II", "creditsRequired": 3, "courses": ["ENC 1102"], "allRequired": True, "notes": "Required"},
            {"id": "math-aa", "category": "Mathematics", "creditsRequired": 3, "courses": ["MAC 1105", "MAC 1140", "MAC 2311", "STA 2023", "MGF 1106"], "allRequired": False, "notes": "College algebra or higher"},
            {"id": "science-aa", "category": "Natural Sciences", "creditsRequired": 6, "courses": ["BSC 1010C", "BSC 1011C", "CHM 1045C", "PHY 2048C", "PHY 2049C"], "allRequired": False, "notes": "6 credits"},
            {"id": "social-aa", "category": "Social/Behavioral Sciences", "creditsRequired": 6, "courses": ["AMH 2010", "AMH 2020", "POS 2041", "ECO 2013", "ECO 2023", "PSY 2012", "SYG 2000"], "allRequired": False, "notes": "6 credits"},
            {"id": "humanities-aa", "category": "Humanities", "creditsRequired": 6, "courses": ["AML 2010", "AML 2020", "ENL 2012", "PHI 2010", "ARH 1000", "MUL 2010", "HUM 1020"], "allRequired": False, "notes": "6 credits"},
            {"id": "elective-aa", "category": "General Electives", "creditsRequired": 33, "courses": [], "allRequired": False, "notes": "Any college-credit courses"},
        ],
    },
    "as-business": {
        "name": "AS Business Administration",
        "totalCredits": 60,
        "requirements": [
            {"id": "biz-comm", "category": "General Education — Communication", "creditsRequired": 6, "courses": ["ENC 1101", "ENC 1102"], "allRequired": True, "notes": "Both required"},
            {"id": "biz-math", "category": "General Education — Mathematics", "creditsRequired": 3, "courses": ["MAC 1105", "STA 2023", "MAC 2311"], "allRequired": False, "notes": "College algebra or higher"},
            {"id": "biz-science", "category": "General Education — Natural Science", "creditsRequired": 3, "courses": ["BSC 1005", "BSC 1010C", "CHM 1025"], "allRequired": False, "notes": "Choose one"},
            {"id": "biz-social", "category": "General Education — Social Sciences", "creditsRequired": 3, "courses": ["ECO 2013", "ECO 2023", "POS 2041", "PSY 2012"], "allRequired": False, "notes": "Choose one"},
            {"id": "biz-acct1", "category": "Program Core — Accounting I", "creditsRequired": 3, "courses": ["ACG 2001"], "allRequired": True, "notes": "Required"},
            {"id": "biz-acct2", "category": "Program Core — Accounting II", "creditsRequired": 3, "courses": ["ACG 2011"], "allRequired": True, "notes": "Required"},
            {"id": "biz-mgmt", "category": "Program Core — Management", "creditsRequired": 3, "courses": ["MAN 2021"], "allRequired": True, "notes": "Required"},
            {"id": "biz-mktg", "category": "Program Core — Marketing", "creditsRequired": 3, "courses": ["MAR 2011"], "allRequired": True, "notes": "Required"},
            {"id": "biz-law", "category": "Program Core — Business Law", "creditsRequired": 3, "courses": ["BUL 2241"], "allRequired": True, "notes": "Required"},
            {"id": "biz-fin", "category": "Program Core — Finance", "creditsRequired": 3, "courses": ["FIN 2001"], "allRequired": True, "notes": "Required"},
            {"id": "biz-elec", "category": "Business Electives", "creditsRequired": 12, "courses": ["GEB 2430", "CGS 1100", "MAN 2300", "ECO 2013", "ECO 2023"], "allRequired": False, "notes": "Approved business electives"},
        ],
    },
}

# ---------------------------------------------------------------------------
# Audit logic
# ---------------------------------------------------------------------------

FAILING_GRADES = {"F", "W", "WF", "I", "X"}

def build_credit_pool(hcc_courses, usf_courses, ap_scores):
    pool = []
    for c in hcc_courses:
        grade = (c.grade or "").upper()
        if grade not in FAILING_GRADES:
            pool.append({"course": c.course.upper(), "credits": c.credits, "source": "HCC", "grade": c.grade})
    for c in usf_courses:
        grade = (c.grade or "").upper()
        if grade not in FAILING_GRADES:
            pool.append({"course": c.course.upper(), "credits": c.credits, "source": "USF", "grade": c.grade})
    for ap in ap_scores:
        if ap.score < 3:
            continue
        entries = AP_CREDIT_MAP.get(ap.exam, {}).get(ap.score, [])
        for course, credits in entries:
            pool.append({"course": course.upper(), "credits": credits, "source": "AP", "exam": ap.exam, "score": ap.score})
    return pool


def run_audit(program_id, hcc_courses, usf_courses, ap_scores):
    program = PROGRAMS.get(program_id)
    if not program:
        return None

    pool = build_credit_pool(hcc_courses, usf_courses, ap_scores)
    used = set()
    results = []

    for req in program["requirements"]:
        if req["allRequired"]:
            satisfied = []
            missing = []
            for needed in req["courses"]:
                key = None
                for c in pool:
                    k = c["course"] + c["source"]
                    if c["course"] == needed and k not in used:
                        used.add(k)
                        satisfied.append(c)
                        key = k
                        break
                if key is None:
                    missing.append(needed)
            credits_earned = sum(c["credits"] for c in satisfied)
            status = "satisfied" if not missing else ("partial" if credits_earned > 0 else "missing")
            results.append({**req, "satisfied": satisfied, "missing": missing, "creditsEarned": credits_earned, "status": status})
        else:
            satisfied = []
            credits_earned = 0
            candidates = [c for c in pool if (not req["courses"] or c["course"] in req["courses"]) and c["course"] + c["source"] not in used]
            for c in candidates:
                if credits_earned >= req["creditsRequired"]:
                    break
                used.add(c["course"] + c["source"])
                satisfied.append(c)
                credits_earned += c["credits"]
            missing = req["courses"][:1] if credits_earned < req["creditsRequired"] and req["courses"] else []
            status = "satisfied" if credits_earned >= req["creditsRequired"] else ("partial" if credits_earned > 0 else "missing")
            results.append({**req, "satisfied": satisfied, "missing": missing, "creditsEarned": credits_earned, "status": status})

    total_earned = sum(r["creditsEarned"] for r in results)
    total_required = program["totalCredits"]
    pct = min(100, round(total_earned / total_required * 100))

    still_needed = [r["category"].split("— ")[-1] for r in results if r["status"] != "satisfied"][:3]
    if pct == 100:
        summary = f"Congratulations! You've satisfied all requirements for the {program['name']}."
    elif still_needed:
        needs = ", ".join(still_needed[:-1]) + (" and " + still_needed[-1] if len(still_needed) > 1 else still_needed[0])
        summary = f"You're {pct}% through the {program['name']}. You still need {needs}."
    else:
        summary = f"You're {pct}% through the {program['name']}."

    return {
        "program": {"id": program_id, "name": program["name"], "totalCredits": total_required},
        "requirements": results,
        "totalCreditsEarned": total_earned,
        "totalCreditsRequired": total_required,
        "completionPct": pct,
        "summary": summary,
        "pool": pool,
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"status": "ok", "service": "ClearCredit API"}


@app.get("/api/programs")
def list_programs():
    return [{"id": k, "name": v["name"], "totalCredits": v["totalCredits"]} for k, v in PROGRAMS.items()]


@app.post("/api/audit")
def audit(req: AuditRequest):
    result = run_audit(req.program_id, req.hcc_courses, req.usf_courses, req.ap_scores)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Program '{req.program_id}' not found")
    return result


@app.post("/api/detect-program")
def detect_program(req: AuditRequest):
    best_id = None
    best_pct = -1
    for prog_id in PROGRAMS:
        result = run_audit(prog_id, req.hcc_courses, req.usf_courses, req.ap_scores)
        if result and result["completionPct"] > best_pct:
            best_pct = result["completionPct"]
            best_id = prog_id
    return {"programId": best_id, "completionPct": best_pct}
