/*
  # Add Application Status Tracking

  1. Schema Updates
    - Add status column to contact_submissions table
    - Add reviewed_by column to track who processed the application
    - Add reviewed_at timestamp for when it was processed
    - Add application_type column to distinguish between contact and applications

  2. Status Values
    - 'pending' (default)
    - 'approved'
    - 'denied' 
    - 'interview_requested'
    - 'more_info_requested'
    - 'read' (for contact messages)

  3. Indexes
    - Add index on status for faster filtering
    - Add index on application_type for better queries
*/

-- Add new columns to contact_submissions table
DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'status'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN status text DEFAULT 'pending';
  END IF;

  -- Add reviewed_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN reviewed_by text;
  END IF;

  -- Add reviewed_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN reviewed_at timestamptz;
  END IF;

  -- Add application_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'application_type'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN application_type text DEFAULT 'contact';
  END IF;

  -- Add discord_message_id column to track Discord messages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'discord_message_id'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN discord_message_id text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_type ON contact_submissions(application_type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reviewed_at ON contact_submissions(reviewed_at);

-- Add check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'contact_submissions_status_check'
  ) THEN
    ALTER TABLE contact_submissions 
    ADD CONSTRAINT contact_submissions_status_check 
    CHECK (status IN ('pending', 'approved', 'denied', 'interview_requested', 'more_info_requested', 'read'));
  END IF;
END $$;

-- Add check constraint for valid application types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'contact_submissions_type_check'
  ) THEN
    ALTER TABLE contact_submissions 
    ADD CONSTRAINT contact_submissions_type_check 
    CHECK (application_type IN ('contact', 'application', 'feedback', 'bug_report'));
  END IF;
END $$;

-- Update existing records to set application_type based on subject
UPDATE contact_submissions 
SET application_type = 'application' 
WHERE subject LIKE '%Team Application%' OR subject LIKE '%Application%'
AND application_type = 'contact';

-- Create a view for easy application management
CREATE OR REPLACE VIEW application_dashboard AS
SELECT 
  id,
  name,
  email,
  subject,
  message,
  status,
  application_type,
  reviewed_by,
  reviewed_at,
  created_at,
  discord_message_id,
  CASE 
    WHEN status = 'pending' THEN '🟡 Pending Review'
    WHEN status = 'approved' THEN '✅ Approved'
    WHEN status = 'denied' THEN '❌ Denied'
    WHEN status = 'interview_requested' THEN '🎤 Interview Requested'
    WHEN status = 'more_info_requested' THEN '❓ More Info Requested'
    WHEN status = 'read' THEN '👁️ Read'
    ELSE '❓ Unknown'
  END as status_display,
  CASE 
    WHEN application_type = 'application' THEN '🎯 Team Application'
    WHEN application_type = 'contact' THEN '📧 Contact Message'
    WHEN application_type = 'feedback' THEN '💭 Feedback'
    WHEN application_type = 'bug_report' THEN '🐛 Bug Report'
    ELSE '❓ Unknown'
  END as type_display
FROM contact_submissions
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON application_dashboard TO service_role;
GRANT SELECT ON application_dashboard TO authenticated;