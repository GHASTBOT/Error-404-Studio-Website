/*
  # Fix Contact Form RLS Policies

  1. Security Changes
    - Allow anonymous users to insert contact submissions
    - Keep existing policies for reading data
    - Ensure data security while enabling contact form functionality

  2. Changes Made
    - Add policy for anonymous contact form submissions
    - Maintain existing read policies for authenticated users
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Service role can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can read own submissions" ON contact_submissions;

-- Allow anonymous users to insert contact submissions (for contact form)
CREATE POLICY "Allow anonymous contact form submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role to insert contact submissions (for edge functions)
CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to read their own submissions
CREATE POLICY "Users can read own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'::text));

-- Allow service role to read all submissions (for admin purposes)
CREATE POLICY "Service role can read all submissions"
  ON contact_submissions
  FOR SELECT
  TO service_role
  USING (true);