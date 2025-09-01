/*
  # Fix contact submissions schema and RLS policies

  1. Schema Updates
    - Set default value for `submitted_at` column to `now()`
    - Ensure proper column constraints

  2. Security
    - Verify RLS policies for anonymous insertions
    - Ensure proper permissions for contact form submissions
*/

-- Update the submitted_at column to have a default value
ALTER TABLE contact_submissions 
ALTER COLUMN submitted_at SET DEFAULT now();

-- Ensure the table has RLS enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Service role can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Service role can read all submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can read own submissions" ON contact_submissions;

-- Create comprehensive RLS policies
CREATE POLICY "Allow anonymous contact form submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated contact form submissions"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can manage all submissions"
  ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'::text));