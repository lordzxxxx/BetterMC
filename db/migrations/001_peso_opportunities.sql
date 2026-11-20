-- BetterMC PESO & Office Opportunities Schema (PostgreSQL / Neon / Vercel Postgres compatible)
-- Run via your database migration runner when upgrading from static/KV storage to relational Postgres.

CREATE TABLE IF NOT EXISTS peso_opportunities (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  opportunity_type TEXT NOT NULL CHECK (
    opportunity_type IN (
      'job-vacancy',
      'livelihood-program',
      'job-fair',
      'skills-training',
      'recruitment-event'
    )
  ),
  employer TEXT NOT NULL,
  location TEXT NOT NULL,
  vacancies_count INTEGER CHECK (vacancies_count IS NULL OR vacancies_count > 0),
  employment_type TEXT NOT NULL DEFAULT 'Not specified',
  salary_grade_or_comp TEXT,
  description TEXT NOT NULL,
  qualifications_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  application_process_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  contact_details_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_date DATE NOT NULL,
  deadline_date DATE,
  is_recurring_program BOOLEAN NOT NULL DEFAULT FALSE,
  publication_status TEXT NOT NULL DEFAULT 'published' CHECK (
    publication_status IN ('published', 'draft', 'archived')
  ),
  source_label TEXT NOT NULL,
  source_url TEXT NOT NULL,
  application_url TEXT,
  poster_url TEXT,
  notes TEXT,
  created_by TEXT NOT NULL DEFAULT 'peso-admin',
  seed_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_peso_opportunities_status_deadline
  ON peso_opportunities (publication_status, deadline_date);

CREATE INDEX IF NOT EXISTS idx_peso_opportunities_type_published
  ON peso_opportunities (opportunity_type, published_date DESC);

CREATE TABLE IF NOT EXISTS peso_admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'publish', 'unpublish', 'archive', 'delete')),
  opportunity_slug TEXT NOT NULL,
  actor TEXT NOT NULL,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Derived lifecycle view automatically classifies expired postings by Asia/Manila calendar date
CREATE OR REPLACE VIEW peso_opportunities_with_status AS
SELECT
  *,
  CASE
    WHEN publication_status = 'draft' THEN 'draft'
    WHEN publication_status = 'archived' THEN 'archived'
    WHEN deadline_date IS NOT NULL
      AND deadline_date < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date THEN 'expired'
    WHEN deadline_date IS NOT NULL
      AND deadline_date <= ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date + INTERVAL '7 days')::date THEN 'closing-soon'
    WHEN is_recurring_program THEN 'recurring-program'
    ELSE 'active'
  END AS derived_display_status
FROM peso_opportunities;
