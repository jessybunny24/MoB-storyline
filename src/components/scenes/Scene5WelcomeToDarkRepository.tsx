import React, { useEffect, useState } from 'react';
import { BoardroomEnvironment } from './BoardroomEnvironment';
import { PixelSprite } from '../character/PixelSprite';
import { BossSprite } from '../character/BossSprite';
import { DialogueBox } from '../ui/DialogueBox';
import { INTERNS } from '../../data/characters';
import type { DialogueLine } from '../../types/cutscene';
import {
  playGlitchBurst,
  playBossBoom,
  playHeroFanfare,
  playTypewriterTick,
  startDarkRepositoryMusic,
  stopAmbientMusic
} from '../../utils/audio';

interface Scene5Props {
  isPlaying: boolean;
  onCutsceneComplete: () => void;
  speed?: 'normal' | 'fast';
}

export const Scene5WelcomeToDarkRepository: React.FC<Scene5Props> = ({
  isPlaying,
  onCutsceneComplete,
  speed = 'normal'
}) => {
  // Timeline:
  // 0: Fade-in to corrupted boardroom
  // 1: Television turns on with intense static -> zoom toward screen
  // 2: TV Message 1: "Welcome to the Dark Repository."
  // 3: TV Message 2: "Your application has been… accepted."
  // 4: TV Message 3: "You will not be leaving until the sprint is complete."
  // 5: TV Message 4: "No EXTENSION. No EXCEPTION."
  // 6: TV glitches violently, distorts, turns black, room quiet silence
  // 7: Door slowly creaks open, silhouette emerges, Boss enters!
  // 8: Boss dialogue: "Interns start working"
  // 9: Blackout -> MONTAGE:
  //    - Montage 1: Inspecting Corrupted Computers
  //    - Montage 2: Preparing Their Tools
  //    - Montage 3: Exploring the Boardroom
  //    - Montage 4: Standing Together (Determination)
  //    - Montage 5: Final Hero Shot (Auras, ready for battle, slow zoom out)
  // 10: Title Card: "YOUR JOURNEY BEGINS"
  // 11: Final glitch + Complete

  const [step, setStep] = useState<number>(0);
  const [fadeOpacity, setFadeOpacity] = useState<number>(1);
  const [tvMessage, setTvMessage] = useState<string>('');
  const [tvState, setTvState] = useState<'static' | 'messages' | 'blackout'>('static');
  const [cameraZoom, setCameraZoom] = useState<number>(1.0);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);

  // Boss entrance offset (Y/X into room)
  const [bossEntrance, setBossEntrance] = useState<boolean>(false);
  // Montage shot (1 to 5)
  const [montageShot, setMontageShot] = useState<number>(0);

  useEffect(() => {
    startDarkRepositoryMusic();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (step === 0) {
      // Fade-in to corrupted boardroom
      const handle = setTimeout(() => {
        setFadeOpacity(0);
      }, 0);
      const t = setTimeout(() => {
        setStep(1);
      }, 400);
      return () => {
        clearTimeout(handle);
        clearTimeout(t);
      };
    }

    if (step === 1) {
      // TV turns on with static, camera zooms toward screen
      playGlitchBurst(0.8);
      setCameraZoom(1.25);
      const t = setTimeout(() => {
        setStep(2);
      }, speed === 'fast' ? 1000 : 1800);
      return () => clearTimeout(t);
    }

    if (step === 2) {
      // Message 1: "Welcome to the Dark Repository."
      setTvState('messages');
      setTvMessage('Welcome to the Dark Repository.');
      playTypewriterTick();
      const t = setTimeout(() => {
        setStep(3);
      }, speed === 'fast' ? 1400 : 2400);
      return () => clearTimeout(t);
    }

    if (step === 3) {
      // Message 2: "Your application has been… accepted."
      setTvMessage('Your application has been… accepted.');
      playTypewriterTick();
      const t = setTimeout(() => {
        setStep(4);
      }, speed === 'fast' ? 1400 : 2400);
      return () => clearTimeout(t);
    }

    if (step === 4) {
      // Message 3: "You will not be leaving until the sprint is complete."
      setTvMessage('You will not be leaving until the sprint is complete.');
      playTypewriterTick();
      const t = setTimeout(() => {
        setStep(5);
      }, speed === 'fast' ? 1600 : 2800);
      return () => clearTimeout(t);
    }

    if (step === 5) {
      // Message 4: "No EXTENSION. No EXCEPTION."
      setTvMessage('No EXTENSION. No EXCEPTION.');
      playGlitchBurst(1.0);
      const t = setTimeout(() => {
        setStep(6);
      }, speed === 'fast' ? 1600 : 2800);
      return () => clearTimeout(t);
    }

    if (step === 6) {
      // Violent glitch -> TV turns black -> Silence
      playGlitchBurst(1.4);
      setTvState('blackout');
      setCameraZoom(1.05);

      const t = setTimeout(() => {
        setStep(7);
      }, speed === 'fast' ? 1000 : 1800);
      return () => clearTimeout(t);
    }

    if (step === 7) {
      // Door opens, Boss enters as corrupted silhouette
      playBossBoom();
      setBossEntrance(true);

      const t = setTimeout(() => {
        setStep(8);
      }, speed === 'fast' ? 1200 : 2000);
      return () => clearTimeout(t);
    }

    if (step === 8) {
      // Boss Dialogue: "Interns start working"
      setCurrentDialogue({
        speakerId: 'boss',
        speakerName: 'The Boss',
        speakerTitle: 'The Controller',
        text: 'Interns start working',
        isGlitchy: true,
        voicePitch: 0.7
      });
    }

    if (step === 9) {
      // Transition to Montage sequence (5 shots)
      stopAmbientMusic();
      setFadeOpacity(1);

      // Shot 1
      setTimeout(() => {
        setMontageShot(1);
        setFadeOpacity(0);
        playGlitchBurst(0.5);

        // Shot 2
        setTimeout(() => {
          setMontageShot(2);
          playGlitchBurst(0.5);

          // Shot 3
          setTimeout(() => {
            setMontageShot(3);
            playGlitchBurst(0.5);

            // Shot 4
            setTimeout(() => {
              setMontageShot(4);
              playGlitchBurst(0.5);

              // Shot 5: Final Hero Shot
              setTimeout(() => {
                setMontageShot(5);
                playHeroFanfare();

                // Step 10: "YOUR JOURNEY BEGINS"
                setTimeout(() => {
                  setStep(10);
                }, speed === 'fast' ? 2400 : 3800);
              }, speed === 'fast' ? 1600 : 2600);
            }, speed === 'fast' ? 1500 : 2400);
          }, speed === 'fast' ? 1500 : 2400);
        }, speed === 'fast' ? 1500 : 2400);
      }, 600);
    }

    if (step === 10) {
      // "YOUR JOURNEY BEGINS"
      playGlitchBurst(0.8);
      const t = setTimeout(() => {
        setStep(11);
      }, speed === 'fast' ? 2400 : 3800);
      return () => clearTimeout(t);
    }

    if (step === 11) {
      // Final glitch and fade to black
      playGlitchBurst(1.2);
      setFadeOpacity(1);
      const t = setTimeout(() => {
        onCutsceneComplete();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [step, isPlaying, speed, onCutsceneComplete]);

  const handleDialogueNext = () => {
    setCurrentDialogue(null);
    if (step === 8) {
      setStep(9);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between">
      {/* ================= STAGE 1: CORRUPTED BOARDROOM & TV MESSAGES & BOSS ================= */}
      {step < 9 && (
        <div
          className="w-full h-full relative transition-transform duration-1000 ease-out"
          style={{ transform: `scale(${cameraZoom})` }}
        >
          <BoardroomEnvironment
            isCorrupted={true}
            isFlickering={step >= 1 && step <= 6}
            tvState={tvState}
            tvMessage={tvMessage}
          >
            {/* Door at back of the room */}
            <div className="absolute top-[28%] left-16 z-10 flex flex-col items-center">
              <div
                className={`w-16 h-36 border-2 transition-all duration-700 ${
                  bossEntrance
                    ? 'bg-red-950/90 border-red-500 shadow-[0_0_20px_#ef4444]'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                {/* Door Opening light slit */}
                {bossEntrance && (
                  <div className="w-1.5 h-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                )}
              </div>
            </div>

            {/* The Boss Entrance */}
            {bossEntrance && (
              <div className="absolute top-[38%] left-24 z-20 transition-all duration-700 animate-in fade-in slide-in-from-left-6">
                <BossSprite
                  animation="corrupted"
                  scale={1.3}
                  direction="right"
                />
              </div>
            )}

            {/* Interns turned toward door in shock */}
            <div className="absolute top-[64%] left-1/2 -translate-x-1/2 w-[85%] max-w-4xl flex justify-between px-3 z-30 pointer-events-none">
              {INTERNS.map((intern, idx) => (
                <div key={intern.id} className="flex flex-col items-center">
                  <PixelSprite
                    id={intern.id}
                    animation={step >= 7 ? 'scared' : 'idle'}
                    direction={step >= 7 ? 'left' : idx < 4 ? 'right' : 'left'}
                    scale={1.0}
                    emotion={step >= 7 ? '!' : null}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  />
                  <span
                    className="text-[7px] font-pixel px-1 rounded mt-0.5 bg-black/80"
                    style={{ color: intern.color }}
                  >
                    {intern.shortName}
                  </span>
                </div>
              ))}
            </div>
          </BoardroomEnvironment>
        </div>
      )}

      {/* ================= STAGE 2: 5-SHOT CINEMATIC MONTAGE ================= */}
      {step === 9 && (
        <div className="w-full h-full relative flex items-center justify-center bg-black">
          {/* Letterbox Cinema Bars */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-black z-30 border-b border-red-900/40" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-black z-30 border-t border-red-900/40" />

          {/* Shot 1: Inspecting the Corrupted Computers */}
          {montageShot === 1 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#090b14] animate-in fade-in duration-500">
              <div className="text-xs font-pixel text-red-400 mb-4 tracking-widest uppercase">
                [ Shot 1 / 5: Inspecting Corrupted Terminals ]
              </div>
              <div className="w-96 max-w-full p-4 bg-black border-2 border-red-600 rounded shadow-2xl font-terminal text-sm text-green-400 space-y-1 animate-tear">
                <div>&gt; git checkout sprint-survival</div>
                <div className="text-red-500">&gt; ERROR: UNCOMMITTED REALITY FRAGMENT</div>
                <div className="text-amber-400">&gt; WARNING: REPOSITORY ANOMALY DETECTED</div>
                <div>&gt; SPRINT_LOCK: 100% DEADLINE ACTIVE</div>
              </div>
              <div className="flex gap-6 mt-6">
                <PixelSprite id="webdev" animation="working" scale={1.2} />
                <PixelSprite id="devops" animation="working" scale={1.2} />
              </div>
            </div>
          )}

          {/* Shot 2: Preparing Their Tools */}
          {montageShot === 2 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0a0814] animate-in fade-in duration-500">
              <div className="text-xs font-pixel text-cyan-400 mb-4 tracking-widest uppercase">
                [ Shot 2 / 5: Preparing Debug Weapons & Tools ]
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-lg">
                <div className="p-3 bg-slate-900 border border-emerald-500 rounded text-center">
                  <div className="text-lg">⚡</div>
                  <div className="text-[8px] font-pixel text-emerald-400 mt-1">CSS Shield</div>
                </div>
                <div className="p-3 bg-slate-900 border border-rose-500 rounded text-center">
                  <div className="text-lg">📱</div>
                  <div className="text-[8px] font-pixel text-rose-400 mt-1">Sonic Viewport</div>
                </div>
                <div className="p-3 bg-slate-900 border border-sky-500 rounded text-center">
                  <div className="text-lg">❄️</div>
                  <div className="text-[8px] font-pixel text-sky-400 mt-1">Bug Freeze</div>
                </div>
              </div>
              <div className="flex gap-6 mt-6">
                <PixelSprite id="mobile" animation="working" scale={1.2} />
                <PixelSprite id="qa" animation="working" scale={1.2} />
              </div>
            </div>
          )}

          {/* Shot 3: Exploring the Boardroom */}
          {montageShot === 3 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#06040c] animate-in fade-in duration-500">
              <div className="text-xs font-pixel text-[#ff4fa8] mb-4 tracking-widest uppercase animate-pulse">
                [ Shot 3 / 5: SAATCHI HOUSE · B1 SUBTERRANEAN REPOSITORY ]
              </div>
              <div className="flex items-center gap-8 animate-pulse">
                <PixelSprite id="design" animation="idle" scale={1.2} emotion="?" />
                <PixelSprite id="operations" animation="idle" scale={1.2} emotion="!" />
                <PixelSprite id="productowner" animation="idle" scale={1.2} emotion="panic" />
              </div>
              <p className="text-[9px] font-pixel text-slate-400 mt-6 text-center max-w-md leading-relaxed">
                Damaged monitors flicker with strange glyphs. The walls hum with digital distortion.
              </p>
            </div>
          )}

          {/* Shot 4: Standing Together */}
          {montageShot === 4 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#070b1a] animate-in fade-in duration-500">
              <div className="text-xs font-pixel text-sky-400 mb-4 tracking-widest uppercase">
                [ Shot 4 / 5: United in Determination ]
              </div>
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                {INTERNS.map((intern) => (
                  <div key={intern.id} className="flex flex-col items-center">
                    <PixelSprite id={intern.id} animation="hero" scale={1.1} showGlow={true} />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-pixel text-amber-300 mt-6 glow-gold text-center">
                Nine roles. One goal. Survive the sprint.
              </p>
            </div>
          )}

          {/* Shot 5: Final Hero Shot */}
          {montageShot === 5 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#0a0f24] via-[#05050f] to-[#000000] animate-in fade-in duration-700">
              <div className="text-xs font-pixel text-amber-400 mb-6 tracking-widest uppercase animate-pulse glow-gold">
                ★ MAKE GUILD: THE NINE INTERNS ★
              </div>
              {/* All 9 interns side by side with glowing hero aura */}
              <div className="flex items-end justify-center gap-2 sm:gap-4 scale-95 sm:scale-105 transition-transform duration-1000">
                {INTERNS.map((intern) => (
                  <div key={intern.id} className="flex flex-col items-center">
                    <PixelSprite id={intern.id} animation="hero" scale={1.2} showGlow={true} />
                    <span
                      className="text-[7px] font-pixel px-1 rounded mt-1 shadow"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: intern.color,
                        border: `1px solid ${intern.color}`
                      }}
                    >
                      {intern.shortName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STAGE 3: "YOUR JOURNEY BEGINS" ================= */}
      {step >= 10 && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black animate-in fade-in duration-1000">
          <h1 className="text-2xl sm:text-4xl font-pixel text-amber-400 tracking-widest text-center px-4 animate-rgb-split glow-gold">
            YOUR JOURNEY BEGINS
          </h1>
          <p className="text-xs sm:text-sm font-pixel text-cyan-400 mt-6 tracking-widest text-center">
            WELCOME TO THE DARK REPOSITORY
          </p>
          <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping delay-100" />
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping delay-200" />
          </div>
        </div>
      )}

      {/* Dialogue Overlay for Boss Dialogue in Step 8 */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-40 pointer-events-auto">
        <DialogueBox
          dialogue={currentDialogue}
          onComplete={handleDialogueNext}
          onNext={handleDialogueNext}
          speed={speed}
        />
      </div>

      {/* Fade In/Out Layer */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700 z-50"
        style={{ opacity: fadeOpacity }}
      />
    </div>
  );
};
