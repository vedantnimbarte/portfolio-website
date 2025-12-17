import React, { useState } from 'react';
import { FadeIn } from './ui/FadeIn';
import { Send, CheckCircle, Mail, MapPin } from 'lucide-react';
import { HERO_DATA } from '../constants';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden snap-start max-w-7xl mx-auto px-6 lg:px-12">
       {/* Background Glow */}
       <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="relative grid lg:grid-cols-2 gap-16">
        <FadeIn>
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Let's build something scalable.</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-md">
              Whether you need to modernize your stack, integrate AI, or scale your team—I'm ready to help.
            </p>
            
            <div className="space-y-6">
              <div className="group flex items-center gap-4 text-zinc-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-zinc-900 transition-all duration-300 shadow-[0_0_0_rgba(251,191,36,0)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">Email</div>
                  <a 
                    href={`mailto:${HERO_DATA.email}`} 
                    className="hover:text-accent transition-colors duration-300 border-b border-transparent hover:border-accent/50 pb-0.5"
                  >
                    {HERO_DATA.email}
                  </a>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-zinc-900 transition-all duration-300 shadow-[0_0_0_rgba(251,191,36,0)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">Location</div>
                  <div className="group-hover:text-white transition-colors">{HERO_DATA.location}</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-surface border border-zinc-800 p-8 rounded-2xl relative shadow-xl hover:shadow-2xl hover:border-zinc-700/50 transition-all duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-zinc-800/20 rounded-2xl blur opacity-50 -z-10" />
            
            {formState === 'success' ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
                <CheckCircle size={48} className="text-green-500 mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-zinc-400">Thanks for reaching out. I'll get back to you shortly.</p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="mt-6 text-accent hover:text-white text-sm font-medium transition-colors hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-background border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-background border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium text-zinc-400">Inquiry Type</label>
                  <select 
                    id="type"
                    className="w-full bg-background border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] appearance-none"
                  >
                    <option>Project Inquiry</option>
                    <option>Hiring / Full-time</option>
                    <option>Consultation</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                  <textarea 
                    id="message" 
                    required
                    rows={4}
                    className="w-full bg-background border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] resize-none"
                    placeholder="Tell me about your project needs..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={formState === 'submitting'}
                  className="w-full bg-accent text-background font-bold py-4 rounded-lg hover:bg-[#fcd34d] transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4"
                >
                  {formState === 'submitting' ? 'Sending...' : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
      
      <div className="mt-24 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Vedant Nimbarte. All rights reserved.</p>
      </div>
    </section>
  );
};