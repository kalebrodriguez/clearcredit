# ClearCredit

> Dual enrollment degree audit tool for Florida HCC students

ClearCredit helps dual enrollment high school students in Florida see exactly where they stand toward completing their HCC degree — by combining credits from HCC, USF, and AP exams into one unified dashboard.

## The Problem

Dual enrollment students take credits across HCC, USF, and AP exams simultaneously, but no single tool shows how it all fits together toward their HCC program requirements. Counselors are the only resource and they're slow and inconsistent. Students routinely find out credits "didn't count" after the fact.

## Features

- **Unified credit view** — Enter HCC courses, USF transfers, and AP exam scores in one place
- **Degree audit dashboard** — See exactly which requirements are satisfied, in progress, or missing
- **Auto-matching** — Florida's Common Course Numbering System means USF credits transfer 1:1
- **AP equivalencies** — Per Florida SBE Rule 6A-10.0315 (the official statewide policy)
- **Next steps** — Specific list of remaining courses and which AP exams could knock them out
- **Saves across sessions** — Google OAuth via Supabase

## Supported Programs

- AS Computer Science
- AA General Studies
- AS Business Administration
- AS Engineering Technology

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Auth + DB | Supabase (Google OAuth + Postgres) |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Local Development

### Frontend

```bash
cd frontend
cp .env.example .env        # fill in Supabase keys
npm install
npm run dev                 # http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in keys
uvicorn main:app --reload   # http://localhost:8000
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable Google OAuth in Authentication → Providers
3. Run this SQL in the SQL editor:

```sql
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  program_id text,
  hcc_courses jsonb default '[]',
  usf_courses jsonb default '[]',
  ap_scores jsonb default '[]',
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can manage own profile"
  on profiles for all
  using (auth.uid() = user_id);
```

## Florida-Specific Notes

- Florida uses a **Common Course Numbering System (CCNS)** — course numbers like `MAC 2311` mean the same thing at every FL state school, so USF credits transfer 1:1 to HCC
- AP credit policy follows **Florida SBE Rule 6A-10.0315**
- HCC's AA degree guarantees transfer to any FL state university under Florida's Statewide Articulation Agreement

---

Built by a Middleton High School CS/IT Magnet junior who is personally dual enrolled at HCC and USF. Initial target: Hillsborough County dual enrollment students.

*Not affiliated with Hillsborough Community College or the University of South Florida.*
