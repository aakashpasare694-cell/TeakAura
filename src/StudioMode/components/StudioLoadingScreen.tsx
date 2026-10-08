import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';

interface StudioLoadingScreenProps {
  onComplete: () => void;
}

export function StudioLoadingScreen({ onComplete }: StudioLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Virtual Showroom...');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    const steps = [
      { p: 25, msg: 'Loading 100% Solid Seasoned Teakwood Textures...' },
      { p: 55, msg: 'Calibrating Showroom Lighting & Spotlights...' },
      { p: 85, msg: 'Arranging Master Craftsman Exhibits & Displays...' },
      { p: 100, msg: 'Virtual Teakwood Studio Ready' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setShowWelcomeMessage(true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#120a05] text-[#f4efe8] flex flex-col items-center justify-center p-6 selection:bg-gold-500/30">
      {/* Background Subtle Wood Grain Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(160,90,40,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teak-900/80 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest shadow-warm-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TeakAura Luxury Studio</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#f9f5f0] mb-2">
            Virtual Teakwood Studio
          </h1>
          <p className="text-sm text-stone-400 font-light max-w-sm mx-auto">
            Step directly into our master craftsman workshop showroom. Explore 100% solid teakwood furniture in 3D.
          </p>
        </div>

        {!showWelcomeMessage ? (
          /* Progress Indicator */
          <div className="space-y-4 pt-4">
            <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden p-0.5 border border-gold-500/20">
              <motion.div
                className="h-full bg-gradient-to-r from-teak-700 via-gold-500 to-amber-300 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
              <span className="truncate pr-2">{statusText}</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : (
          /* Welcome Card Prompt */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1c1109] border border-gold-500/40 p-6 rounded-2xl shadow-2xl space-y-5"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h2 className="font-serif text-xl font-bold text-[#f9f5f0]">
                  Welcome to our Teakwood Studio
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed mt-2">
                  Use your mouse or <span className="text-gold-400 font-mono font-bold">W/A/S/D</span> keys (or touch controls) to walk down our grand showroom lobby. Approach any product exhibit to inspect details and request custom quotes.
                </p>
              </div>

              <button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 px-6 rounded-xl shadow-warm-md hover:shadow-warm-xl transition-all transform active:scale-98 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <span>Enter Showroom Lobby</span>
                <span className="text-lg">→</span>
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
