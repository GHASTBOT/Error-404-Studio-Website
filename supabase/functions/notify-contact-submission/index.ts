import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Get the webhook payload
    const payload = await req.json();
    const { record } = payload;

    if (!record) {
      return new Response(
        JSON.stringify({ error: "No record provided" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const submission: ContactSubmission = record;

    // Send notification via Discord webhook (you can replace this with email service)
    const discordWebhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    
    if (discordWebhookUrl) {
      const discordPayload = {
        embeds: [{
          title: "🔔 New Contact Form Submission",
          description: "Someone has submitted a message through the Error 404 website!",
          color: 0x3F1414, // Error 404 theme color
          fields: [
            { 
              name: "👤 Name", 
              value: submission.name, 
              inline: true 
            },
            { 
              name: "📧 Email", 
              value: submission.email, 
              inline: true 
            },
            { 
              name: "📝 Subject", 
              value: submission.subject, 
              inline: false 
            },
            { 
              name: "💬 Message", 
              value: submission.message.length > 1000 
                ? submission.message.substring(0, 1000) + "..." 
                : submission.message, 
              inline: false 
            },
            {
              name: "🕒 Submitted At",
              value: new Date(submission.submitted_at).toLocaleString(),
              inline: true
            }
          ],
          footer: {
            text: "Error 404 Contact System",
            icon_url: "https://raw.githubusercontent.com/GHASTBOT/error404/ffa8272237e8bc25590864e0d983b9fc5365df21/error404logo.png"
          },
          timestamp: submission.submitted_at
        }]
      };

      try {
        const discordResponse = await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload)
        });

        if (!discordResponse.ok) {
          console.error('Discord webhook failed:', await discordResponse.text());
        }
      } catch (webhookError) {
        console.error('Discord webhook error:', webhookError);
      }
    }

    // You can also add email notification here using services like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Mailgun
    // - AWS SES
    
    // Example with Resend (uncomment and configure if you want email notifications):
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');
    
    if (resendApiKey && notificationEmail) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Error 404 <noreply@yourdomain.com>',
            to: [notificationEmail],
            subject: `New Contact Form: ${submission.subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> ${submission.email}</p>
              <p><strong>Subject:</strong> ${submission.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${submission.message.replace(/\n/g, '<br>')}</p>
              <p><strong>Submitted:</strong> ${new Date(submission.submitted_at).toLocaleString()}</p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email notification failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error("Error processing notification:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process notification" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});