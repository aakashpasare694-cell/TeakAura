import { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Compass,
  Eye,
  Move,
  LogOut,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  Play,
  Square,
} from 'lucide-react';
import { StudioProduct, SectionId, CameraMode } from '../types';
import { SHOWROOM_SECTIONS, STUDIO_PRODUCTS } from '../data/studioProducts';

interface StudioOverlayProps {
  activeSectionId: SectionId;
  nearbyProduct: StudioProduct | null;
  cameraMode: CameraMode;
  onToggleCameraMode: () => void;
  onOpenProductModal: (prod: StudioProduct) => void;
  onExitStudio: () => void;
  onToggleMap: () => void;
  isMapVisible: boolean;

  // Direct Navigation Button Callbacks
  onStepForward: () => void;
  onStepBackward: () => void;
  onTurnLeft: () => void;
  onTurnRight: () => void;
  onStrafeLeft: () => void;
  onStrafeRight: () => void;
  onSelectSection: (secId: SectionId) => void;
  onAutoTourToggle: (isTouring: boolean) => void;
  isAutoTouring: boolean;
}

export function StudioOverlay({
  activeSectionId,
  nearbyProduct,
  cameraMode,
  onToggleCameraMode,
  onOpenProductModal,
  onExitStudio,
  onToggleMap,
  isMapVisible,
  onStepForward,
  onStepBackward,
  onTurnLeft,
  onTurnRight,
  onStrafeLeft,
  onStrafeRight,
  onSelectSection,
  onAutoTourToggle,
  isAutoTouring,
}: StudioOverlayProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const activeSec = SHOWROOM_SECTIONS.find((s) => s.id === activeSectionId) || SHOWROOM_SECTIONS[0];

  // Press-and-hold handler for continuous D-Pad walking & turning
  const useHoldAction = (action: () => void) => {
    const intervalRef = useState<any>(null);

    const start = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      action();
      const id = setInterval(() => {
        action();
      }, 100);
      intervalRef[1](id);
    };

    const stop = () => {
      if (intervalRef[0]) {
        clearInterval(intervalRef[0]);
        intervalRef[1](null);
      }
    };

    return {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
    };
  };

  const holdForward = useHoldAction(onStepForward);
  const holdBackward = useHoldAction(onStepBackward);
  const holdStrafeLeft = useHoldAction(onStrafeLeft);
  const holdStrafeRight = useHoldAction(onStrafeRight);
  const holdTurnLeft = useHoldAction(onTurnLeft);
  const holdTurnRight = useHoldAction(onTurnRight);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-6 text-[#f4efe8] select-none overflow-hidden">
      {/* 1. TOP HEADER BAR */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* Brand Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#1c1109] border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-warm-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="font-serif font-bold text-xs sm:text-sm text-[#f9f5f0] tracking-tight">
              TEAKAURA STUDIO
            </div>
            <div className="text-[9px] uppercase tracking-widest text-gold-400 font-mono">
              Virtual 3D Showroom
            </div>
          </div>
        </div>

        {/* Quick Jump Section Bar */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#120a05]/90 border border-gold-500/30 backdrop-blur-md p-1.5 rounded-2xl shadow-warm-lg">
          {SHOWROOM_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-gold-300'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          {/* Auto Tour Toggle */}
          <button
            onClick={() => onAutoTourToggle(!isAutoTouring)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all ${
              isAutoTouring
                ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                : 'bg-[#120a05]/90 text-gold-400 border-gold-500/30 hover:bg-stone-900'
            }`}
          >
            {isAutoTouring ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoTouring ? 'Stop Tour' : 'Auto Tour'}</span>
          </button>

          {/* Map Toggle */}
          <button
            onClick={onToggleMap}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
              isMapVisible
                ? 'bg-gold-500 text-stone-950 border-gold-400 font-bold shadow-warm-md'
                : 'bg-[#120a05]/90 text-stone-300 border-gold-500/30 hover:bg-stone-900'
            }`}
            title="Toggle Showroom Map"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Prominent EXIT STUDIO CTA Button */}
          <button
            onClick={onExitStudio}
            className="bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 text-rose-100 border border-rose-500/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-warm-lg hover:shadow-warm-xl transition-all flex items-center gap-1.5 uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* 2. PROXIMITY INTERACTION BANNER (CENTERED NEAR BOTTOM) */}
      {nearbyProduct && (
        <div className="pointer-events-auto max-w-lg mx-auto w-full mb-3">
          <div className="bg-[#190f07]/95 border-2 border-gold-500 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <img
                src={nearbyProduct.coverImage}
                alt={nearbyProduct.name}
                className="w-12 h-12 rounded-xl object-cover border border-gold-500/30"
              />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-400 block">
                  Interactive Exhibit
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-white block">
                  {nearbyProduct.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenProductModal(nearbyProduct)}
              className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-warm-md flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <span>Inspect</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ALWAYS-VISIBLE NAVIGATION D-PAD DOCK & QUICK GUIDE */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-auto">
        {/* On-Screen Touch & Click D-Pad with Continuous Hold */}
        <div className="bg-[#120a05]/95 border border-gold-500/40 backdrop-blur-md p-2.5 rounded-2xl shadow-warm-xl flex items-center gap-3">
          {/* Movement Direction Pad */}
          <div className="grid grid-cols-3 gap-1 w-28 h-28 p-1 bg-stone-900/90 rounded-xl border border-stone-800">
            <div />
            <button
              {...holdForward}
              className="bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-stone-950 rounded-lg flex items-center justify-center font-bold transition-all active:scale-95 border border-gold-500/30"
              title="Walk Forward (Press & Hold)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div />

            <button
              {...holdStrafeLeft}
              className="bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-stone-950 rounded-lg flex items-center justify-center font-bold transition-all active:scale-95 border border-gold-500/30"
              title="Strafe Left (Press & Hold)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              {...holdBackward}
              className="bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-stone-950 rounded-lg flex items-center justify-center font-bold transition-all active:scale-95 border border-gold-500/30"
              title="Walk Backward (Press & Hold)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              {...holdStrafeRight}
              className="bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-stone-950 rounded-lg flex items-center justify-center font-bold transition-all active:scale-95 border border-gold-500/30"
              title="Strafe Right (Press & Hold)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Turn Buttons */}
          <div className="flex flex-col gap-1.5">
            <button
              {...holdTurnLeft}
              className="bg-stone-800 hover:bg-gold-500 text-stone-200 hover:text-stone-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-stone-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Turn Left</span>
            </button>

            <button
              {...holdTurnRight}
              className="bg-stone-800 hover:bg-gold-500 text-stone-200 hover:text-stone-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-stone-700"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Turn Right</span>
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Help Bar */}
        <div className="flex items-center gap-3 bg-[#120a05]/90 border border-gold-500/40 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs text-stone-200 shadow-warm-lg">
          <div className="flex items-center gap-1.5 text-gold-400 font-bold">
            <Move className="w-4 h-4" />
            <span>Click Floor to Walk</span>
          </div>
          <span className="text-stone-600">|</span>
          <span className="text-stone-300">WASD / Arrow Keys</span>
          <span className="text-stone-600">|</span>
          <span className="text-stone-300">Drag to Look</span>
        </div>
      </div>

      {/* 4. HELP MODAL POPUP */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md pointer-events-auto">
          <div className="bg-[#1c1109] border border-gold-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold-400" />
                <span>Showroom Navigation Guide</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-gold-400 font-mono font-bold flex-shrink-0">
                  D-PAD
                </div>
                <div>
                  <span className="font-bold text-white block">On-Screen Controls</span>
                  <span className="text-stone-400">Click the direction arrows on screen to walk forward, backward, strafe, or turn!</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-gold-400 font-mono font-bold flex-shrink-0">
                  AUTO
                </div>
                <div>
                  <span className="font-bold text-white block">Auto Tour Mode</span>
                  <span className="text-stone-400">Click "Auto Tour" at top right to let the camera guide you through all exhibits automatically!</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors mt-2"
            >
              Resume Exploration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
