/*
  # TrustNTrust Ghana Initial Schema

  1. New Tables
    - `entities`
      - `id` (uuid, primary key)  
      - `name` (text, required)
      - `type` (text, company/individual)
      - `description` (text, optional)
      - `location` (text, optional) 
      - `verified` (boolean, default false)
      - `created_at` (timestamp)

    - `reports`
      - `id` (uuid, primary key)
      - `entity_id` (uuid, foreign key)
      - `reporter_id` (uuid, foreign key) 
      - `type` (text, positive/negative)
      - `category` (text, fraud/service/etc)
      - `title` (text, required)
      - `description` (text, required)
      - `original_description` (text, unredacted version)
      - `status` (text, pending/approved/rejected)
      - `is_anonymous` (boolean, default false)
      - `created_at` (timestamp)

    - `evidence`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key)
      - `file_path` (text, required)
      - `file_name` (text, required) 
      - `file_type` (text, required)
      - `created_at` (timestamp)

    - `replies`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key)
      - `entity_id` (uuid, foreign key)
      - `content` (text, required)
      - `status` (text, pending/approved)
      - `created_at` (timestamp)

    - `moderations`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key)
      - `moderator_id` (uuid, foreign key)
      - `action` (text, approve/reject/flag)
      - `notes` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies for moderation
*/

-- Create entities table
CREATE TABLE IF NOT EXISTS entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('company', 'individual')),
  description text,
  location text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reports table  
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid REFERENCES entities(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('positive', 'negative')),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  original_description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES entities(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at timestamptz DEFAULT now()
);

-- Create moderations table
CREATE TABLE IF NOT EXISTS moderations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  moderator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('approve', 'reject', 'flag')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderations ENABLE ROW LEVEL SECURITY;

-- Entities policies
CREATE POLICY "Entities are publicly readable"
  ON entities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create entities"
  ON entities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Reports policies
CREATE POLICY "Approved reports are publicly readable"
  ON reports
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Users can read their own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Authenticated users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can update their own pending reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (reporter_id = auth.uid() AND status = 'pending');

-- Evidence policies
CREATE POLICY "Evidence readable for approved reports"
  ON evidence
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = evidence.report_id 
      AND reports.status = 'approved'
    )
  );

CREATE POLICY "Users can read evidence for their own reports"
  ON evidence
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = evidence.report_id 
      AND reports.reporter_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can upload evidence"
  ON evidence
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = evidence.report_id 
      AND reports.reporter_id = auth.uid()
    )
  );

-- Replies policies
CREATE POLICY "Approved replies are publicly readable"
  ON replies
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Authenticated users can create replies"
  ON replies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Moderations policies (admin only)
CREATE POLICY "Only admins can access moderations"
  ON moderations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@trustntrust.gh'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_entity_id ON reports(entity_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_evidence_report_id ON evidence(report_id);
CREATE INDEX IF NOT EXISTS idx_replies_report_id ON replies(report_id);
CREATE INDEX IF NOT EXISTS idx_moderations_report_id ON moderations(report_id);