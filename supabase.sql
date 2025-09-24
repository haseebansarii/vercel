-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.entities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['company'::text, 'individual'::text])),
  description text,
  location text,
  verified boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  category text,
  reportType text,
  CONSTRAINT entities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.evidence (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  report_id uuid,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT evidence_pkey PRIMARY KEY (id),
  CONSTRAINT evidence_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id)
);
CREATE TABLE public.moderations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  report_id uuid,
  moderator_id uuid,
  action text NOT NULL CHECK (action = ANY (ARRAY['approve'::text, 'reject'::text, 'flag'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT moderations_pkey PRIMARY KEY (id),
  CONSTRAINT moderations_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT moderations_moderator_id_fkey FOREIGN KEY (moderator_id) REFERENCES auth.users(id)
);
CREATE TABLE public.replies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  report_id uuid,
  entity_id uuid,
  content text NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT replies_pkey PRIMARY KEY (id),
  CONSTRAINT replies_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT replies_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entities(id)
);
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entity_id uuid,
  reporter_id uuid,
  type text NOT NULL CHECK (type = ANY (ARRAY['positive'::text, 'negative'::text])),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  original_description text NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  is_anonymous boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entities(id),
  CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES auth.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);