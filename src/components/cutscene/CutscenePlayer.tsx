import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Scene1Onboarding } from '../scenes/Scene1Onboarding';
import { Scene2BuildingTour } from '../scenes/Scene2BuildingTour';
import { Scene3AfterOneWeek } from '../scenes/Scene3AfterOneWeek';
import { Scene4TheDarkRepository } from '../scenes/Scene4TheDarkRepository';
import { Scene5WelcomeToDarkRepository } from '../scenes/Scene5WelcomeToDarkRepository';
import { CutsceneControls } from '../ui/CutsceneControls';
import { setMuted, getMuted, stopAmbientMusic } from '../../utils/audio';

const SCENE_TITLES: Record<number, string> = {
  1: '1F · The Onboarding Meeting',
  2: '1F · The Building Tour',
  3: '2F · After 1 Week (Workspace)',
  4: '↓ B1 · The Descent (Dark Repository)',
  5: 'B1 · Subterranean Void'
};

const FLOOR_LABELS: Record<number, { floor: string; name: string; isB1: boolean }> = {
  1: { floor: '1F', name: 'LOBBY & BOARDROOM', isB1: false },
  2: { floor: '1F', name: 'FACILITY TOUR', isB1: false },
  3: { floor: '2F', name: 'OPEN WORKSPACE', isB1: false },
  4: { floor: 'B1', name: 'THE DESCENT', isB1: true },
  5: { floor: 'B1', name: 'DARK REPOSITORY', isB1: true }
};

// Studio PVM Timecode display isolated to prevent parent re-renders at 30 FPS
const MonitorTimecode: React.FC = () => {
  const [timecode, setTimecode] = useState('00:01:14:08');
  const frameCounterRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      frameCounterRef.current++;
      const totalFrames = frameCounterRef.current;
      const frames = String(totalFrames % 60).padStart(2, '0');
      const totalSecs = Math.floor(totalFrames / 60);
      const secs = String(totalSecs % 60).padStart(2, '0');
      const mins = String(Math.floor(totalSecs / 60) % 60).padStart(2, '0');
      const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
      setTimecode(`${hrs}:${mins}:${secs}:${frames}`);
    }, 1000 / 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-[8px] text-slate-400 font-terminal tracking-wider ml-1 hidden sm:inline">
      {timecode}
    </span>
  );
};

export const CutscenePlayer: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMutedState, setIsMutedState] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isCRT, setIsCRT] = useState<boolean>(true);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const handleToggleMute = useCallback(() => {
    const nextMuted = !getMuted();
    setMuted(nextMuted);
    setIsMutedState(nextMuted);
  }, []);

  const handleJumpScene = useCallback((sceneId: number) => {
    stopAmbientMusic();
    setIsFinished(false);
    setCurrentScene(sceneId);
    setIsPlaying(true);
  }, []);

  const handleNextScene = useCallback(() => {
    if (currentScene < 5) {
      handleJumpScene(currentScene + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentScene, handleJumpScene]);

  const handlePrevScene = useCallback(() => {
    if (currentScene > 1) {
      handleJumpScene(currentScene - 1);
    }
  }, [currentScene, handleJumpScene]);

  const handleRestart = useCallback(() => {
    handleJumpScene(1);
  }, [handleJumpScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextScene();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevScene();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextScene, handlePrevScene, handleToggleMute, handleRestart]);

  const currentFloor = FLOOR_LABELS[currentScene] || FLOOR_LABELS[1];
  const isB1 = currentFloor.isB1;

  return (
    <div
      className={`relative w-screen h-screen flex flex-col items-center justify-between overflow-hidden transition-colors duration-700 ${
        isB1 ? 'bg-[#090b12]' : 'bg-[#080a14]'
      }`}
    >
      {/* ========================================================================= */}
      {/* ====== SAATCHI HOUSE WAYFINDING & ELEVATOR INDICATOR HEADER ============= */}
      {/* ========================================================================= */}
      <header
        className={`w-full max-w-6xl px-4 py-2 flex items-center justify-between text-xs font-pixel z-40 select-none border-b transition-colors duration-500 ${
          isB1
            ? 'bg-[#151a26]/95 border-[#ff4fa8]/40 shadow-[0_4px_16px_rgba(255,79,168,0.15)]'
            : 'bg-[#0b1022]/95 border-[#0b3bd3]/40 shadow-[0_4px_16px_rgba(11,59,211,0.2)]'
        }`}
      >
        {/* Left: Saatchi House Branding + Elevator Floor Badge */}
        <div className="flex items-center gap-3">
          {/* Saatchi House Elevator Indicator Circle */}
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-[10px] border-2 transition-all ${
              isB1
                ? 'bg-[#ff4fa8] text-black border-white shadow-[0_0_10px_#ff4fa8] animate-pulse'
                : 'bg-[#0b3bd3] text-white border-[#c9d2ee] shadow-[0_0_8px_#0b3bd3]'
            }`}
          >
            {currentFloor.floor}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wider text-[11px] sm:text-xs">
                SAATCHI HOUSE
              </span>
              <span className="text-slate-500">•</span>
              <span className={`text-[10px] font-bold ${isB1 ? 'text-[#ff4fa8]' : 'text-[#6e8bff]'}`}>
                {currentFloor.name}
              </span>
            </div>
            <span className="text-[7.5px] text-slate-400 tracking-wider">
              MAKE TECHNOLOGY CORP // WAYFINDING SYSTEM
            </span>
          </div>
        </div>

        {/* Center: Saatchi Staff Keycard Floor Stamps */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/60 rounded border border-slate-700/80">
          <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter mr-1">
            STAFF KEYCARD:
          </span>
          <div className="flex items-center gap-1.5 text-[8px]">
            {/* 1F Stamp */}
            <span
              className={`px-1.5 py-0.5 rounded border ${
                currentScene >= 1
                  ? 'bg-[#0b3bd3]/30 border-[#6e8bff] text-[#6e8bff]'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}
            >
              1F ✓
            </span>

            {/* 2F Stamp */}
            <span
              className={`px-1.5 py-0.5 rounded border ${
                currentScene >= 3
                  ? 'bg-[#0b3bd3]/30 border-[#6e8bff] text-[#6e8bff]'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}
            >
              2F {currentScene >= 3 ? '✓' : '—'}
            </span>

            {/* B1 Stamp */}
            <span
              className={`px-1.5 py-0.5 rounded border ${
                currentScene >= 4
                  ? 'bg-[#ff4fa8]/30 border-[#ff4fa8] text-[#ff4fa8] animate-pulse font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}
            >
              B1 {currentScene >= 4 ? '⚠ UNLOCKED' : 'LOCKED'}
            </span>
          </div>
        </div>

        {/* Right: Telemetry & Speed Toggle */}
        <div className="flex items-center gap-3">
          {/* Speed Toggle Switch */}
          <button
            onClick={() => setSpeed((s) => (s === 'normal' ? 'fast' : 'normal'))}
            className={`px-2 py-1 rounded text-[9.5px] font-pixel transition-all ${
              speed === 'fast'
                ? isB1
                  ? 'bg-[#ff4fa8] text-black font-bold shadow-[0_0_8px_#ff4fa8]'
                  : 'bg-[#0b3bd3] text-white font-bold shadow-[0_0_8px_#0b3bd3]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            SPEED: {speed.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Studio PVM Monitor Chassis */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 relative">
        <div className="relative w-full max-w-[1320px] aspect-[16/9] max-h-[84vh] p-2 sm:p-3 rounded-xl bezel-chassis flex flex-col justify-between">
          
          {/* Chassis Top Hardware Screws & Ventilation Slits */}
          <div className="w-full flex items-center justify-between px-2 pb-1.5 opacity-75">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400/50 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-0.5 bg-slate-900 rotate-45" />
            </div>

            <div className="flex items-center gap-1.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-4 sm:w-6 h-1 rounded-full bg-black/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.9)]" />
              ))}
            </div>

            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400/50 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-0.5 bg-slate-900 -rotate-45" />
            </div>
          </div>

          {/* CRT Screen Display Tube Housing */}
          <div className="relative flex-1 w-full rounded-lg overflow-hidden bg-black bezel-inner-frame flex items-center justify-center">
            
            {/* Side Speaker Grilles */}
            <div className="absolute top-0 bottom-0 left-1 w-1.5 hidden md:flex flex-col justify-around py-6 z-40 opacity-40 pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1 rounded-full bg-slate-700" />
              ))}
            </div>
            <div className="absolute top-0 bottom-0 right-1 w-1.5 hidden md:flex flex-col justify-around py-6 z-40 opacity-40 pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1 rounded-full bg-slate-700" />
              ))}
            </div>

            {/* CRT Shader & Filter Layers */}
            {isCRT && (
              <>
                <div className="crt-overlay" />
                <div className="crt-vignette" />
                <div className="crt-glass-glare" />
                <div className="crt-aperture-grille" />
              </>
            )}

            {/* Active Scene Playback */}
            {!isFinished ? (
              <>
                {currentScene === 1 && (
                  <Scene1Onboarding
                    isPlaying={isPlaying}
                    onSceneComplete={handleNextScene}
                    speed={speed}
                  />
                )}
                {currentScene === 2 && (
                  <Scene2BuildingTour
                    isPlaying={isPlaying}
                    onSceneComplete={handleNextScene}
                    speed={speed}
                  />
                )}
                {currentScene === 3 && (
                  <Scene3AfterOneWeek
                    isPlaying={isPlaying}
                    onSceneComplete={handleNextScene}
                    speed={speed}
                  />
                )}
                {currentScene === 4 && (
                  <Scene4TheDarkRepository
                    isPlaying={isPlaying}
                    onSceneComplete={handleNextScene}
                    speed={speed}
                  />
                )}
                {currentScene === 5 && (
                  <Scene5WelcomeToDarkRepository
                    isPlaying={isPlaying}
                    onCutsceneComplete={() => setIsFinished(true)}
                    speed={speed}
                  />
                )}
              </>
            ) : (
              /* Enhanced Cutscene Complete Screen */
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#070b19] p-6 text-center animate-in fade-in z-30 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />
                <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                  <div className="px-3 py-1 rounded bg-[#ff4fa8]/20 border border-[#ff4fa8] text-[#ff4fa8] font-pixel text-[10px] uppercase tracking-widest mb-3 animate-pulse">
                    SAATCHI HOUSE · B1 INCIDENT CONCLUDED
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-pixel text-amber-400 mb-4 glow-gold">
                    CUTSCENE COMPLETE
                  </h2>
                  <p className="text-xs font-pixel text-slate-300 leading-relaxed mb-8 bg-black/60 p-4 rounded-lg border border-slate-800">
                    The nine interns have stepped across the threshold into the Dark Repository in Basement B1. The trial has begun.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={handleRestart}
                      className="px-6 py-3 saatchi-btn-primary font-pixel font-bold rounded shadow-lg transition-transform hover:scale-105"
                    >
                      ↺ REPLAY CUTSCENE
                    </button>
                    <button
                      onClick={() => handleJumpScene(1)}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel rounded border border-slate-600 transition-colors"
                    >
                      1F LOBBY SELECT
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Monitor Bezel Deck: Manufacturer Plate & LEDs */}
          <div className="w-full flex items-center justify-between px-2 pt-2 text-[9px] font-pixel select-none">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400/50 flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-0.5 bg-slate-900 rotate-45" />
              </div>
              <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-black/70 border border-slate-800 text-slate-400">
                <span className="text-white font-bold tracking-wider">MAKE</span>
                <span className="text-slate-400">SAATCHI-PVM</span>
                <span className="text-[7.5px] text-slate-500 hidden sm:inline">60Hz NTSC</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" title="Power Status">
                  <div className="w-2 h-2 rounded-full led-power-green" />
                  <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter">PWR</span>
                </div>

                <div className="flex items-center gap-1.5" title="Signal Synchronization Lock">
                  <div className="w-2 h-2 rounded-full led-signal-amber" />
                  <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter">SYNC</span>
                </div>

                <div className="flex items-center gap-1.5" title="Recording / Timecode">
                  <div className="w-2 h-2 rounded-full led-rec-red" />
                  <span className="text-[7.5px] text-red-400 uppercase font-bold tracking-tighter">REC</span>
                  <MonitorTimecode />
                </div>
              </div>

              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400/50 flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-0.5 bg-slate-900 -rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Console Controls Bar */}
      <footer className="w-full p-2 z-40">
        <CutsceneControls
          currentScene={currentScene}
          totalScenes={5}
          sceneTitle={SCENE_TITLES[currentScene]}
          isPlaying={isPlaying}
          isMuted={isMutedState}
          isAutoPlay={isAutoPlay}
          isCRT={isCRT}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onToggleMute={handleToggleMute}
          onToggleAutoPlay={() => setIsAutoPlay((a) => !a)}
          onToggleCRT={() => setIsCRT((c) => !c)}
          onPrevScene={handlePrevScene}
          onNextScene={handleNextScene}
          onRestart={handleRestart}
          onJumpScene={handleJumpScene}
        />
      </footer>
    </div>
  );
};
