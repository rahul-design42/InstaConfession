import { useState, type FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Dynamically adjust textarea height
    const textarea = document.getElementById('message-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanFrom = from.trim();
    const cleanTo = to.trim();
    const cleanMessage = message.trim();

    if (!cleanFrom || !cleanTo || !cleanMessage) {
      toast.error('Please fill in all fields');
      return;
    }

    if (cleanFrom.length > 100 || cleanTo.length > 100) {
      toast.error('Names must be under 100 characters');
      return;
    }

    if (cleanMessage.length > 2000) {
      toast.error('Message must be under 2000 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: cleanFrom, to: cleanTo, message: cleanMessage }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("API not found. If running locally, make sure to use 'npx vercel dev' instead of 'npm run dev'.");
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message');
      }

      setIsSuccess(true);
      setFrom('');
      setTo('');
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
  };

  return (
    <div className="min-h-[100svh] relative flex flex-col items-center md:justify-center overflow-x-hidden w-full selection:bg-purple-500/30">

      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/IMG_20260710_162056.jpg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/60 to-zinc-950/95 md:from-zinc-950/80 md:via-zinc-950/80 md:to-zinc-950/95 pointer-events-none"></div>
      </div>

      <Toaster position="top-center" />

      {/* Background Orbs */}
      <div className="fixed top-1/4 left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Content Wrapper - Push down on mobile to show hero image */}
      <div className="w-[92%] md:w-full md:max-w-[620px] z-10 flex flex-col pt-[28svh] pb-8 md:pt-4 md:pb-4">

        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 drop-shadow-lg">
              100% Anonymous <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Message</span>
            </h1>
            <p className="text-white text-sm md:text-base max-w-md mx-auto font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)] px-2">
              Got a story to tell? Let it out. <br />
              100% safe, 100% anonymous.
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 font-extrabold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Uncensored! Unfiltered! Unapologetic!</span>
            </p>
          </motion.div>
        </div>

        {/* Floating Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* From Field */}
                  <div className="space-y-2.5">
                    <label htmlFor="from" className="block text-sm font-semibold text-zinc-200">
                      👀 Who's this?
                    </label>
                    <input
                      type="text"
                      id="from"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      maxLength={100}
                      required
                      placeholder="Captain America"
                      className="block w-full h-[56px] px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all text-base"
                    />
                  </div>

                  {/* To Field */}
                  <div className="space-y-2.5">
                    <label htmlFor="to" className="block text-sm font-semibold text-zinc-200">
                      🎯 Who's receiving this?
                    </label>
                    <input
                      type="text"
                      id="to"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      maxLength={100}
                      required
                      placeholder="Your crush... your bestie... your nemesis 😏"
                      className="block w-full h-[56px] px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all text-base"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-end">
                      <label htmlFor="message-textarea" className="block text-sm font-semibold text-zinc-200">
                        💌 Spill the Tea
                      </label>
                      <span className={`text-xs font-medium ${message.length > 1900 ? 'text-red-400' : 'text-zinc-400'}`}>
                        {message.length} / 2000
                      </span>
                    </div>
                    <textarea
                      id="message-textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                      required
                      placeholder="..... nobody knows it's you, not even admins"
                      className="block w-full min-h-[140px] p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all text-base resize-none overflow-hidden leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !from || !to || !message}
                    className="w-full flex justify-center items-center h-[56px] px-4 mt-2 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_12px_24px_rgba(168,85,247,0.4)] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        Send
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 mb-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="36" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-zinc-300 mb-8 max-w-sm text-base">
                    Your anonymous message has been sent successfully. Thank you for sharing.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-8 h-[48px] bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-all active:scale-[0.98] border border-white/10"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center pb-2">
          <p className="text-sm font-medium text-zinc-300 drop-shadow-md">
            🤫 Your identity stays a secret. Always.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
