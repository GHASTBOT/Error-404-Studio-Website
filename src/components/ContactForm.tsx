import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { sendDiscordNotification } from '../utils/discord';

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Submitting contact form:', formData);

      // Store in database first
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save message to database');
      }

      console.log('Message saved to database successfully');

      // Send Discord notification
      console.log('Sending Discord notification...');
      const discordSuccess = await sendDiscordNotification({
        ...formData,
        type: 'contact'
      });

      if (!discordSuccess) {
        console.warn('Discord notification failed, but form was saved to database');
        // Don't throw error here - the form submission was successful
      } else {
        console.log('Discord notification sent successfully');
      }

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      onError?.('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
          placeholder="Your name"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
          placeholder="your.email@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
          placeholder="What's this about?"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full flex-1 min-h-[200px] px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors resize-vertical"
          placeholder="Tell us what's on your mind..."
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bedrock-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}