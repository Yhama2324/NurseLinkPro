-- Migration: subject_topics & subject_outcomes (neutral, no school names)
-- Ensure unique subject_code so we can reference it
alter table if exists bsn_subjects
  add constraint if not exists bsn_subjects_subject_code_key unique (subject_code);

-- Outcomes (one row per outcome string)
create table if not exists subject_outcomes (
  id uuid primary key default gen_random_uuid(),
  subject_code text not null references bsn_subjects(subject_code) on delete cascade,
  outcome text not null,
  created_at timestamptz not null default now(),
  unique (subject_code, outcome)
);

-- Topics (one row per topic block; subtopics is jsonb; tags is text[])
create table if not exists subject_topics (
  id uuid primary key default gen_random_uuid(),
  subject_code text not null references bsn_subjects(subject_code) on delete cascade,
  topic_name text not null,
  subtopics jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (subject_code, topic_name)
);

-- Helpful indexes
create index if not exists subject_topics_subject_code_idx on subject_topics(subject_code);
create index if not exists subject_topics_tags_gin on subject_topics using gin(tags);
