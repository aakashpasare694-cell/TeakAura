import React from 'react';
import { SHOWROOM_SECTIONS } from '../data/studioProducts';
import { SectionId } from '../types';

interface StudioMiniMapProps {
  playerPos: { x: number; z: number };
  playerYaw: number;
  activeSectionId: SectionId;
  onTeleportToSection: (sectionId: SectionId) => void;
}

export function StudioMiniMap({
  playerPos,
  playerYaw,
  activeSectionId,
  onTeleportToSection,
}: StudioMiniMapProps) {
  // Map scaling parameters
  // Corridor Z goes from +5 (entrance) to -135 (back wall)
  // Map dimensions: width = 120px, height = 240px
  const mapWidth = 120;
  const mapHeight = 240;

  const minZ = 5;
  const maxZ = -135;

  const mapZ = (z: number) => {
    const ratio = (z - minZ) / (maxZ - minZ);
    return Math.max(10, Math.min(mapHeight - 10, ratio * (mapHeight - 20) + 10));
  };

  const mapX = (x: number) => {
    // X goes from -14 to +14
    const ratio = (x + 14) / 28;
    return Math.max(10, Math.min(mapWidth - 10, ratio * (mapWidth - 20) + 10));
  };

  const playerDotX = mapX(playerPos.x);
  const playerDotY = mapZ(playerPos.z);

  return (
    <div className="bg-[#120a05]/90 border border-gold-500/30 backdrop-blur-md rounded-2xl p-3 shadow-warm-xl text-[#f4efe8] w-[144px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gold-400">
          Showroom Map
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Blueprint Canvas Graphic */}
      <div className="relative w-[120px] h-[240px] bg-[#0c0603] border border-stone-800 rounded-lg overflow-hidden mx-auto">
        {/* Walking Corridor Path */}
        <div className="absolute left-[35px] top-[10px] w-[50px] bottom-[10px] bg-stone-900/60 border-x border-gold-500/20" />

        {/* Section Teleport Markers */}
        {SHOWROOM_SECTIONS.map((sec) => {
          const secY = mapZ(sec.posZ);
          const isActive = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onTeleportToSection(sec.id)}
              title={`Teleport to ${sec.title}`}
              className={`absolute left-1 right-1 py-0.5 px-1 rounded text-[8px] font-mono tracking-tighter truncate transition-all text-center ${
                isActive
                  ? 'bg-gold-500 text-stone-950 font-bold shadow-sm z-10'
                  : 'bg-stone-900/80 text-stone-400 hover:bg-gold-500/20 hover:text-gold-300'
              }`}
              style={{ top: `${secY - 8}px` }}
            >
              {sec.title.split(' ')[0]}
            </button>
          );
        })}

        {/* Player Location Indicator */}
        <div
          className="absolute w-3 h-3 rounded-full bg-gold-400 border-2 border-stone-950 shadow-warm-lg transition-all transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${playerDotX}px`,
            top: `${playerDotY}px`,
          }}
        >
          {/* Direction Cone Indicator */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-gold-400/80"
            style={{
              transform: `rotate(${-playerYaw}rad)`,
            }}
          />
        </div>
      </div>

      <div className="text-[9px] text-stone-400 text-center font-mono mt-2">
        Click section to jump
      </div>
    </div>
  );
}
