/*
  # Create Contact Form System

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `submitted_at` (timestamptz, required)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert contact submissions
    - Add policy for service role to read all submissions
    - Add policy for authenticated users to read their own submissions

  3. Triggers
    - Create trigger function for notifications
    - Create trigger to fire after insert
*/

-- Create contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Service role can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can read own submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Service role can read all submissions" ON contact_submissions;

-- Create policies
CREATE POLICY "Allow anonymous contact form submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can read own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'::text));

CREATE POLICY "Service role can read all submissions"
  ON contact_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- Create notification function
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS trigger AS $$
DECLARE
  webhook_url text;
  payload json;
  result text;
BEGIN
  -- Get webhook URL from environment (you'll need to set this in Supabase dashboard)
  webhook_url := current_setting('app.discord_webhook_url', true);
  
  -- Only proceed if webhook URL is configured
  IF webhook_url IS NOT NULL AND webhook_url != '' THEN
    -- Create Discord webhook payload
    payload := json_build_object(
      'embeds', json_build_array(
        json_build_object(
          'title', '🔔 New Contact Form Submission',
          'description', 'Someone has submitted a message through the Error 404 website!',
          'color', 4129876,
          'fields', json_build_array(
            json_build_object('name', '👤 Name', 'value', NEW.name, 'inline', true),
            json_build_object('name', '📧 Email', 'value', NEW.email, 'inline', true),
            json_build_object('name', '📝 Subject', 'value', NEW.subject, 'inline', false),
            json_build_object('name', '💬 Message', 'value', 
              CASE 
                WHEN length(NEW.message) > 1000 THEN substring(NEW.message from 1 for 1000) || '...'
                ELSE NEW.message
              END, 'inline', false),
            json_build_object('name', '🕒 Submitted At', 'value', to_char(NEW.submitted_at, 'YYYY-MM-DD HH24:MI:SS UTC'), 'inline', true)
          ),
          'footer', json_build_object(
            'text', 'Error 404 Contact System',
            'icon_url', 'https://raw.githubusercontent.com/GHASTBOT/error404/ffa8272237e8bc25590864e0d983b9fc5365df21/error404logo.png'
          ),
          'timestamp', to_char(NEW.submitted_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
        )
      )
    );

    -- Send webhook (this requires the http extension)
    BEGIN
      SELECT content INTO result
      FROM http_post(
        webhook_url,
        payload::text,
        'application/json'
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the insert
      RAISE WARNING 'Failed to send Discord notification: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS contact_submission_notification ON contact_submissions;

-- Create trigger
CREATE TRIGGER contact_submission_notification
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();