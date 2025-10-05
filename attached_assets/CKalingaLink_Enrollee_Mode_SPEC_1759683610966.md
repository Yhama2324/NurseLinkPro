# CKalingaLink — Enrollee Mode (Subject‑Based Learning)

This spec is paste‑ready for your Replit project. It explains onboarding, subject selection, data model, and quiz logic so the app only serves content relevant to the user’s enrolled subjects.

---

## A) Onboarding Flow (3 screens)

1) **School & Semester**
- School: dropdown (or “Not listed”)
- Term: AY 2025–2026 • Sem 1/2
- Year level: 1/2/3/4

2) **Pick Your Subjects**
Show a searchable list (from your curriculum DB + school pack mappings) with chips like:
- Fundamentals of Nursing Practice (NCM6103)
- Microbiology & Parasitology (NURS6103)
- Understanding the Self (GE6100)
- The Contemporary World (GE6102)
- Theoretical Foundations of Nursing (NCM6100)
- Anatomy & Physiology (NURS6101)
- Purposive Communication (GE6106)
- Math in the Modern World (GE6114)
- Art Appreciation (GE6115)
- Health Assessment (NCM6101)
- Biochemistry (NURS6102)
- …and more.

3) **Auto‑Plan**
- System generates: daily drill (10Q), weekly quiz (25Q), monthly mock (50–75Q) **per enrolled subject**.
- User can add/drop subjects anytime.

---

## B) Smart Relevance (How Content Is Chosen)

- Each subject → topics → subtopics (from your curriculum JSON).
- When a subject is **enrolled**, we **activate** its topic tags.
- **Daily feed** pulls only from active tags (e.g., `infection_control`, `sbar`, `vitals`, `biochem`).
- Long mocks (50/75/150) blend **only active subjects** using PNLE/NCLEX weights.

---

## C) Flexible Schools & Codes (like the screenshots)

- **Canonical taxonomy** = your master JSON.
- **School Packs** map school codes → canonical subject IDs:
  - `NCM6103 → Fundamentals of Nursing Practice → Fundamentals (canonical)`
  - `NURS6103 → Microbiology & Parasitology → Microbiology (canonical)`
- If a subject isn’t listed, user can **Create Custom Subject** → admin maps to nearest canonical set.

---

## D) “Units/Load”‑Aware Planner

- Each subject stores **units/hours**.
- Auto‑plan weights: more units ⇒ more weekly questions & minutes.
- Example targets:
  - 3‑unit subject → **120 Q/month**
  - 5‑unit subject → **200 Q/month**

---

## E) Prevent Wasted Subscriptions

- **Subject Locker**: change subjects anytime; plan updates instantly.
- **Subject‑Pass (optional)**: ₱79/subject/mo (cap at ₱149 Pro).
- **Pause per subject**: finished mid‑term? Pause it—quota shifts to others.
- **Trial**: 7‑day Enrollee Trial limited to 2 subjects.

---

## F) UI Components

- **My Semester**: cards per subject → Today’s Drill, Next Quiz, Due Assignments.
- **Add/Drop Subjects** button.
- **Subject Insights**: mastery %, last 7 days answered, weak topics.
- **CareSpace Filter**: show posts only from your subjects (#Fundamentals, #Microbio, #HealthAssessment).

---

## G) Data Model Additions (fits your current schema)

```sql
-- New
create table semesters (
  id uuid primary key default gen_random_uuid(),
  school_id text,
  ay text not null,   -- e.g., "2025-2026"
  term int not null,  -- 1 or 2
  created_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  canonical_code text not null,  -- e.g., "NUR-120"
  name text not null,
  units int not null default 3,
  active boolean not null default true
);

create table school_packs (
  id uuid primary key default gen_random_uuid(),
  school_name text not null,
  mapping jsonb not null default '{}' -- {"NCM6103":"NUR-120", "NURS6103":"SCI-141"}
);

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  semester_id uuid not null references semesters(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  school_code text,
  units int not null default 3,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, semester_id, subject_id)
);

-- Optional user settings for filtering
create table user_settings (
  user_id uuid primary key references users(id) on delete cascade,
  subject_filter_tags text[] default '{}'
);
```

---

## H) Quiz Generation Logic (pseudo‑code)

```ts
const activeSubjects = getEnrollments(userId).filter(e => e.active);
const activeTags = union(activeSubjects.map(s => getTopicTags(s.canonical_subject_id)));

// Daily drill
generateQuiz({
  length: 10,
  tags: sample(activeTags, 3-5),
  difficulty: adaptive(userId),
});

// Weekly subject quiz (per subject)
for (const s of activeSubjects) {
  generateQuiz({
    length: 25,
    tags: getTopicTags(s.canonical_subject_id),
    weightBlueprint: "PNLE",
  });
}

// Monthly mock blends only selected subjects
generateMock({
  length: 75,
  tagsBySubject: activeSubjects.map(s => getTopicTags(s.canonical_subject_id)),
  blueprint: "PNLE",
  weights: byUnits(activeSubjects), // more units → more items
});
```

---

## I) Fast Capture From the Student (OCR & Paste)

- **Photo Import**: snap a photo of the subject list; OCR extracts codes/titles; app proposes matches to canonical subjects.
- **Copy‑Paste**: paste subject lines; quick parser suggests mappings to canonical IDs.

---

## J) Monetization Guardrails

- **Pro ₱149**: all subjects, Weekly 1–100 Challenge, basic badges.
- **Elite ₱299**: adds NurseMind rationales, advanced analytics, and mocks.
- **Subject‑Pass**: ₱79/subject (auto‑cap at ₱149).
- **Scholarships**: verified ED email discounts.
