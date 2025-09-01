import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
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

    const { name, email, subject, message }: ContactFormData = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store the contact form submission in the database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          subject,
          message,
          submitted_at: new Date().toISOString(),
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store message" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Send email notification using a third-party service
    // For now, we'll use a webhook to Discord or similar service
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    
    if (webhookUrl) {
      const discordPayload = {
        embeds: [{
          title: "New Contact Form Submission",
          color: 0x3F1414, // Error 404 theme color
          fields: [
            { name: "Name", value: name, inline: true },
            { name: "Email", value: email, inline: true },
            { name: "Subject", value: subject, inline: false },
            { name: "Message", value: message, inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload)
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message sent successfully! We'll get back to you soon." 
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
    console.error("Error processing contact form:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message. Please try again later." 
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