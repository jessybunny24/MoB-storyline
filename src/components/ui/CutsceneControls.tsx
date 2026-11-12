import React from 'react';

interface CutsceneControlsProps {
  currentScene: number;
  totalScenes: number;
  sceneTitle: string;
  isPlaying: boolean;
  isMuted: boolean;
  isAutoPlay: boolean;
  isCRT: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleAutoPlay: () => void;
  onToggleCRT: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  onRestart: () => void;
  onJumpScene: (sceneId: number) => void;
}

const SAATCHI_FLOORS = [
  { id: 1, floor: '1F', label: 'LOBBY', isB1: false },
  { id: 2, floor: '1F', label: 'TOUR', isB1: false },
  { id: 3, floor: '2F', label: 'OFFICE', isB1: false },
  { id: 4, floor: 'B1', label: 'DESCENT', isB1: true },
  { id: 5, floor: 'B1', label: 'VOID', isB1: true }
];

export const CutsceneControls: React.FC<CutsceneControlsProps> = ({
  currentScene,
  totalScenes,
  sceneTitle,
  isPlaying,
  isMuted,
  isAutoPlay,
  isCRT,
  onTogglePlay,
  onToggleMute,
  onToggleAutoPlay,
  onToggleCRT,
  onPrevScene,
  onNextScene,
  onRestart,
  onJumpScene
}) => {
  const currentFloorData = SAATCHI_FLOORS[currentScene - 1] || SAATCHI_FLOORS[0];
  const isB1 = currentFloorData.isB1;

  return (
    <div
      className={`w-full max-w-5xl mx-auto px-4 py-2.5 flex flex-col gap-2 font-pixel select-none z-40 rounded-lg transition-colors duration-500 ${
        isB1
          ? 'bg-[#151a26]/95 border border-[#ff4fa8]/40 shadow-[0_8px_24px_rgba(255,79,168,0.15)]'
          : 'bg-[#0f1424]/95 border border-[#0b3bd3]/40 shadow-[0_8px_24px_rgba(11,59,211,0.2)]'
      }`}
    >
      {/* Top Wayfinding Deck: Elevator Track & Current Floor Callout */}
      <div className="w-full flex items-center justify-between gap-3 px-1 text-[9px]">
        <div className="flex items-center gap-2">
          {/* Animated Floor Beacon */}
          <span
            className={`w-2 h-2 rounded-full animate-ping ${
              isB1 ? 'bg-[#ff4fa8]' : 'bg-[#6e8bff]'
            }`}
          />
          <span className={`font-bold uppercase tracking-wider ${isB1 ? 'text-[#ff4fa8]' : 'text-[#6e8bff]'}`}>
            {sceneTitle}
          </span>
        </div>

        {/* 5-Step Segmented Building Elevator Shaft Track */}
        <div className="flex-1 max-w-xs mx-4 hidden md:flex items-center gap-1.5">
          {SAATCHI_FLOORS.map((f) => {
            const isPassed = f.id < currentScene;
            const isCurrent = f.id === currentScene;
            return (
              <div
                key={f.id}
                onClick={() => onJumpScene(f.id)}
                className={`flex-1 h-2 rounded-sm cursor-pointer transition-all ${
                  isCurrent
                    ? f.isB1
                      ? 'bg-[#ff4fa8] shadow-[0_0_8px_#ff4fa8]'
                      : 'bg-[#6e8bff] shadow-[0_0_8px_#6e8bff]'
                    : isPassed
                    ? 'bg-[#0b3bd3]/80'
                    : 'bg-slate-800'
                }`}
                title={`Ride Elevator to ${f.floor}: ${f.label}`}
              />
            );
          })}
        </div>

        <div className="text-[8px] text-slate-400 hidden sm:block">
          FLOOR {currentFloorData.floor} // ACT {currentScene} / {totalScenes}
        </div>
      </div>

      {/* Main Console Button Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/80">
        {/* Left: Saatchi House Elevator Floor Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[8px] text-slate-400 uppercase tracking-tighter mr-1 hidden sm:inline">
            ELEVATOR:
          </span>
          {SAATCHI_FLOORS.map((f) => {
            const isActive = currentScene === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onJumpScene(f.id)}
                className={`px-2 py-1 rounded flex items-center gap-1 text-[9px] transition-all saatchi-floor-badge ${
                  isActive
                    ? f.isB1
                      ? 'bg-[#ff4fa8] text-black border-white shadow-[0_0_10px_#ff4fa8]'
                      : 'saatchi-floor-active'
                    : 'saatchi-floor-idle'
                }`}
                title={`Floor ${f.floor} (${f.label})`}
              >
                <span>{f.isB1 ? '↓' : '↑'}</span>
                <span>{f.floor}</span>
                <span className="text-[7.5px] opacity-75 hidden lg:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Saatchi Primary & Media Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous Floor */}
          <button
            onClick={onPrevScene}
            disabled={currentScene <= 1}
            title="Previous Scene [Left Arrow]"
            className="px-2.5 py-1.5 rounded text-[9.5px] text-slate-300 btn-tactile disabled:opacity-40 flex items-center gap-1"
          >
            <span>⏮</span>
            <span className="hidden sm:inline">PREV</span>
          </button>

          {/* Primary Play / Pause Button (Saatchi Primary) */}
          <button
            onClick={onTogglePlay}
            title="Play / Pause Cutscene [Space]"
            className={`px-3.5 py-1.5 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all ${
              isB1
                ? 'saatchi-btn-alarm'
                : 'saatchi-btn-primary'
            }`}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          {/* Next Floor */}
          <button
            onClick={onNextScene}
            disabled={currentScene >= totalScenes}
            title="Next Scene [Right Arrow]"
            className="px-2.5 py-1.5 rounded text-[9.5px] text-slate-300 btn-tactile disabled:opacity-40 flex items-center gap-1"
          >
            <span className="hidden sm:inline">NEXT</span>
            <span>⏭</span>
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Return to 1F Lobby [R]"
            className="px-2.5 py-1.5 rounded text-[9.5px] text-slate-300 btn-tactile hover:text-amber-300 flex items-center gap-1"
          >
            <span>↺</span>
            <span className="hidden md:inline">1F LOBBY</span>
          </button>

          {/* Audio Mute Switch */}
          <button
            onClick={onToggleMute}
            title="Toggle Sound [M]"
            className={`px-2.5 py-1.5 rounded text-[9px] btn-tactile flex items-center gap-1.5 ${
              isMuted
                ? 'text-red-400 border-red-900/60'
                : 'text-emerald-400 border-emerald-900/60'
            }`}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <div className="flex items-end gap-0.5 h-3">
              <span className={`w-0.5 h-1.5 ${isMuted ? 'bg-red-500' : 'bg-emerald-400'}`} />
              <span className={`w-0.5 h-2.5 ${isMuted ? 'bg-red-900' : 'bg-emerald-400'}`} />
              <span className={`w-0.5 h-3.5 ${isMuted ? 'bg-red-900' : 'bg-emerald-400'}`} />
            </div>
          </button>

          {/* Auto Mode Switch */}
          <button
            onClick={onToggleAutoPlay}
            title="Toggle Auto Advance vs Manual Click"
            className={`px-2 py-1.5 rounded text-[9px] btn-tactile flex items-center gap-1 ${
              isAutoPlay ? 'text-indigo-300 border-indigo-500/50' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAutoPlay ? 'bg-indigo-400 shadow-[0_0_5px_#818cf8]' : 'bg-slate-700'
              }`}
            />
            <span className="hidden sm:inline">AUTO</span>
          </button>

          {/* CRT Scanline Filter Switch */}
          <button
            onClick={onToggleCRT}
            title="Toggle CRT Cathode Ray Tube Filter"
            className={`px-2 py-1.5 rounded text-[9px] btn-tactile flex items-center gap-1 ${
              isCRT ? 'text-cyan-300 border-cyan-500/50' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCRT ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-slate-700'
              }`}
            />
            <span>CRT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
