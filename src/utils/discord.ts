interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields: DiscordEmbedField[];
  footer: {
    text: string;
    icon_url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    icon_url: string;
  };
  timestamp: string;
}

interface DiscordWebhookPayload {
  content?: string;
  embeds: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1388919175229214811/eMqZkp-V3QofJ04rpIukR5RD8tTWWnsn_-Sc6tKTpJTLAgUOzEYrFXqmak05aaZcq8Re';
const ERROR_404_LOGO = 'https://raw.githubusercontent.com/GHASTBOT/error404/ffa8272237e8bc25590864e0d983b9fc5365df21/error404logo.png';
const WEBSITE_COLOR = 0x1f0e1c; // #1f0e1c from meta theme-color

export async function sendDiscordNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: 'contact' | 'application';
}): Promise<boolean> {
  try {
    // Check if this is a staff application
    const isApplication = data.subject.includes('Team Application') || 
                         data.message.includes('Role:') || 
                         data.type === 'application';
    
    // Create enhanced embed with branding and custom emojis
    const embed: DiscordEmbed = {
      title: isApplication ? '<:icons_pin:859388130598715392> New Team Application Received!' : '<:icons_envelope:866599434100015115> New Contact Form Submission',
      description: isApplication 
        ? 'Someone wants to join the Error 404 team! Check out their application details below and consider reaching out to them.' 
        : 'Someone is trying to get in touch with the team.',
      color: WEBSITE_COLOR,
      fields: [
        { 
          name: '<:icons_friends:861852632767528970> **Applicant Name**' + (isApplication ? '' : ' **Contact Name**'), 
          value: `\`${data.name}\``, 
          inline: true 
        },
        { 
          name: '<:icons_envelope:866599434100015115> **Email Address**', 
          value: `\`${data.email}\``, 
          inline: true 
        },
        { 
          name: '<:icons_creditcard:882595243793473566> **Submission ID**', 
          value: `\`${Date.now().toString(36).toUpperCase()}\``, 
          inline: true 
        },
        { 
          name: isApplication ? '<:icons_pin:859388130598715392> **Position Applied For**' : '<:icons_menu:861852633617661983> **Subject**', 
          value: `**${data.subject}**`, 
          inline: false 
        },
        { 
          name: isApplication ? '<:icons_list:860123643710537789> **Application Details**' : '<:icons_richpresence:860133546173923388> **Message Content**', 
          value: data.message.length > 1000 
            ? `${data.message.substring(0, 1000)}...\n\n*[Message truncated - full message available in database]*` 
            : data.message, 
          inline: false 
        },
        {
          name: '<:icons_reminder:859388128364199946> **Submitted At**',
          value: `<t:${Math.floor(Date.now() / 1000)}:F>\n<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true
        },
        {
          name: '<:icons_globe:859424401971609600> **Source**',
          value: '[Error 404 Website](https://teamerror404.netlify.app)',
          inline: true
        },
        {
          name: isApplication ? '<:icons_growth:866605190396510238> **Next Steps**' : '<:icons_notify:860123644621226004> **Action Required**',
          value: isApplication 
            ? '• Review application details\n• Check portfolio/examples\n• Schedule interview if interested\n• Respond within 48 hours' 
            : '• Read the message carefully\n• Respond to their inquiry\n• Follow up if needed',
          inline: false
        }
      ],
      thumbnail: {
        url: ERROR_404_LOGO
      },
      author: {
        name: 'Error 404 Notification System',
        icon_url: ERROR_404_LOGO
      },
      footer: {
        text: isApplication ? 'Error 404 Team' : 'Error 404 Team',
        icon_url: ERROR_404_LOGO
      },
      timestamp: new Date().toISOString()
    };

    // Enhanced payload with custom webhook appearance
    const payload: DiscordWebhookPayload = {
      content: isApplication 
        ? '@here' 
        : '@here',
      embeds: [embed],
      username: 'Error 404 Bot',
      avatar_url: ERROR_404_LOGO
    };

    console.log('Sending enhanced Discord notification:', JSON.stringify(payload, null, 2));

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook failed:', response.status, response.statusText, errorText);
      return false;
    }

    console.log('Enhanced Discord notification sent successfully');

    // Add reactions to the message (requires additional API calls)
    try {
      // Get the message ID from the response if available
      const messageData = await response.json().catch(() => null);
      if (messageData && messageData.id) {
        await addReactionsToMessage(messageData.id, isApplication);
      }
    } catch (reactionError) {
      console.warn('Failed to add reactions, but notification was sent:', reactionError);
    }

    return true;
  } catch (error) {
    console.error('Error sending enhanced Discord notification:', error);
    return false;
  }
}

// Helper function to add reactions (requires bot token, so this is optional)
async function addReactionsToMessage(messageId: string, isApplication: boolean): Promise<void> {
  // Note: This would require a bot token and proper Discord bot setup
  // For now, we'll just log what reactions we would add
  const reactions = isApplication 
    ? ['<:icons_pin:859388130598715392>', '<:icons_growth:866605190396510238>', '<:icons_friends:861852632767528970>', '<:icons_list:860123643710537789>', '<:icons_file:859424401899651072>'] 
    : ['<:icons_envelope:866599434100015115>', '<:icons_richpresence:860133546173923388>', '<:icons_notify:860123644621226004>', '<:icons_globe:859424401971609600>'];
  
  console.log(`Would add reactions to message ${messageId}:`, reactions.join(' '));
  
  // If you have a bot token, you could implement actual reactions here:
  /*
  const BOT_TOKEN = 'your_bot_token_here';
  const CHANNEL_ID = 'your_channel_id_here';
  
  for (const reaction of reactions) {
    try {
      await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages/${messageId}/reactions/${encodeURIComponent(reaction)}/@me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      await new Promise(resolve => setTimeout(resolve, 250)); // Rate limit protection
    } catch (error) {
      console.error(`Failed to add reaction ${reaction}:`, error);
    }
  }
  */
}

// Enhanced notification for different types of submissions
export async function sendEnhancedNotification(data: {
  type: 'contact' | 'application' | 'feedback' | 'bug_report';
  name: string;
  email: string;
  subject: string;
  message: string;
  metadata?: Record<string, any>;
}): Promise<boolean> {
  const typeConfig = {
    contact: {
      emoji: '<:icons_envelope:866599434100015115>',
      title: 'New Contact Message',
      color: WEBSITE_COLOR,
      description: 'Someone reached out through the website contact form.'
    },
    application: {
      emoji: '<:icons_pin:859388130598715392>',
      title: 'New Team Application',
      color: 0x00ff00, // Green for applications
      description: 'A new candidate wants to join Error 404!'
    },
    feedback: {
      emoji: '<:icons_richpresence:860133546173923388>',
      title: 'New Feedback Received',
      color: 0x0099ff, // Blue for feedback
      description: 'User feedback about our maps or website.'
    },
    bug_report: {
      emoji: '<:icons_notify:860123644621226004>',
      title: 'Bug Report Submitted',
      color: 0xff4444, // Red for bugs
      description: 'Someone reported an issue that needs attention.'
    }
  };

  const config = typeConfig[data.type];
  
  return sendDiscordNotification({
    name: data.name,
    email: data.email,
    subject: `${config.emoji} ${config.title}: ${data.subject}`,
    message: data.message,
    type: data.type === 'application' ? 'application' : 'contact'
  });
}