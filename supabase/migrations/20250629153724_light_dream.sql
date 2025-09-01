/*
  # Fix Contact Submissions RLS Policy

  1. Security Updates
    - Drop existing problematic policies
    - Create new simplified policies for anonymous and authenticated users
    - Ensure proper INSERT permissions for contact form submissions
    
  2. Policy Changes
    - Allow anonymous users to insert contact submissions
    - Allow authenticated users to insert contact submissions
    - Allow users to read their own submissions based on email
    - Allow service role to manage all submissions
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated contact form submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can read own submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Service role can manage all submissions" ON contact_submissions;

-- Create new policies with proper permissions
CREATE POLICY "Enable anonymous insert for contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable authenticated insert for contact submissions"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable users to read own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Enable service role full access"
  ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;