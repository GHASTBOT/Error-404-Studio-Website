/*
  # Simple Contact Form System

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `contact_submissions` table
    - Allow anyone to insert contact submissions
    - Allow service role to read all submissions
*/

-- Drop the existing table and start fresh
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Create a simple contact submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Simple policy: anyone can insert, service role can read all
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read all"
  ON contact_submissions
  FOR SELECT
  TO service_role
  USING (true);