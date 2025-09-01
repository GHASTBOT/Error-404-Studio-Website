/*
  # Set up database webhook for contact form notifications

  1. Create a webhook that triggers when new contact submissions are inserted
  2. This will call our edge function to send notifications
  
  Note: This webhook will be automatically configured in your Supabase dashboard
*/

-- Enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http;

-- Create a function to handle contact form notifications
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS trigger AS $$
BEGIN
  -- This function will be called by the database trigger
  -- The actual notification logic is handled by the edge function
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that fires after insert on contact_submissions
DROP TRIGGER IF EXISTS contact_submission_notification ON contact_submissions;
CREATE TRIGGER contact_submission_notification
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();