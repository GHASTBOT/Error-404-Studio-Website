import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { sendDiscordNotification } from '../utils/discord';

interface JoinFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

export function JoinForm({ onSuccess, onError, onClose }: JoinFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    portfolio: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.log('Submitting team application:', formData);

      const submissionData = {
        name: formData.name,
        email: formData.email,
        subject: `Team Application - ${formData.role}`,
        message: `

> <:icons_friends:861852632767528970> Applicant - ${formData.name}

> <:icons_envelope:866599434100015115> Email - ${formData.email}

> <:icons_pin:859388130598715392> Role Applied For - ${formData.role}

> <:icons_growth:866605190396510238> Experience Level - ${formData.experience}

> <:icons_file:859424401899651072> Portfolio/Examples - ${formData.portfolio || 'Not provided'}

> <:icons_richpresence:860133546173923388> Why they want to join Error 404 - ${formData.message}`
      };

      // Store in database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save application to database');
      }

      console.log('Application saved to database successfully');

      // Send Discord notification with application type
      console.log('Sending Discord notification for team application...');
      const discordSuccess = await sendDiscordNotification({
        name: formData.name,
        email: formData.email,
        subject: submissionData.subject,
        message: submissionData.message,
        type: 'application'
      });

      if (!discordSuccess) {
        console.warn('Discord notification failed, but application was saved to database');
        // Don't throw error here - the application submission was successful
      } else {
        console.log('Discord notification sent successfully for team application');
      }

      // Reset form
      setFormData({ name: '', email: '', role: '', experience: '', portfolio: '', message: '' });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error submitting application:', error);
      onError?.('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl">Join Error 404</h3>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="join-name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="join-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="join-email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="join-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="join-role" className="block text-sm font-medium text-zinc-300 mb-2">
                Role You're Interested In
              </label>
              <select
                id="join-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
              >
                <option value="">Select a role</option>
                <option value="Commands Expert">Commands Expert</option>
                <option value="Blockbench Expert">Blockbench Expert</option>
                <option value="Building Expert">Building Expert</option>
                <option value="Creative Expert">Creative Expert</option>
                <option value="Design Expert">Design Expert</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="join-experience" className="block text-sm font-medium text-zinc-300 mb-2">
                Experience Level
              </label>
              <select
                id="join-experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
              >
                <option value="">Select experience level</option>
                <option value="Beginner">Beginner (0-1 years)</option>
                <option value="Intermediate">Intermediate (1-3 years)</option>
                <option value="Advanced">Advanced (3-5 years)</option>
                <option value="Expert">Expert (5+ years)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="join-portfolio" className="block text-sm font-medium text-zinc-300 mb-2">
                Portfolio/Examples (Optional)
              </label>
              <input
                type="url"
                id="join-portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="https://your-portfolio.com or link to your work"
              />
            </div>
            
            <div>
              <label htmlFor="join-message" className="block text-sm font-medium text-zinc-300 mb-2">
                Why do you want to join Error 404?
              </label>
              <textarea
                id="join-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors resize-vertical"
                placeholder="Tell us about yourself, your skills, and why you'd like to be part of our team..."
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bedrock-button flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bedrock-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}