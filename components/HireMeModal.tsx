import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Send } from 'lucide-react';

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate network request
    setTimeout(() => {
      setFormState('success');
      // Close modal after showing success message
      setTimeout(() => {
        onClose();
        setFormState('idle'); 
      }, 2500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-white">Hire Me</h3>
                  <p className="text-xs text-zinc-500 mt-1">Let's discuss your project or role.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-300 hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {formState === 'success' ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <CheckCircle size={56} className="text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
                    <h4 className="text-2xl font-bold text-white mb-2">Request Received!</h4>
                    <p className="text-zinc-400 max-w-xs mx-auto">
                      I've got your details. I will review them and get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">How can I help?</label>
                      <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 hover:border-zinc-600 appearance-none">
                        <option>Full-time Opportunity</option>
                        <option>Freelance / Contract</option>
                        <option>Technical Consultation</option>
                        <option>Code Audit / Review</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Name</label>
                        <input 
                          required
                          type="text" 
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 hover:border-zinc-600 placeholder:text-zinc-600"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Email</label>
                        <input 
                          required
                          type="email" 
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 hover:border-zinc-600 placeholder:text-zinc-600"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Project / Role Details</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 hover:border-zinc-600 resize-none placeholder:text-zinc-600"
                        placeholder="Tell me a bit about the team, the stack, or the problem you're solving..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={formState === 'submitting'}
                      className="w-full bg-accent text-background font-bold py-4 rounded-lg hover:bg-[#fcd34d] transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4"
                    >
                      {formState === 'submitting' ? 'Sending Request...' : (
                        <>
                          Send Request <Send size={18} />
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-xs text-zinc-600 mt-4">
                      Prefer email? <a href="mailto:vedantnimbarteofficial@gmail.com" className="text-zinc-400 hover:text-accent underline transition-colors hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">vedantnimbarteofficial@gmail.com</a>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};