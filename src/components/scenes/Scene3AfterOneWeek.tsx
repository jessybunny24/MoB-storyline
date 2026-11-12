import React, { useEffect, useState } from 'react';
import { PixelSprite } from '../character/PixelSprite';
import { DepartmentHeadSprite } from '../character/DepartmentHeadSprite';
import { BossSprite } from '../character/BossSprite';
import { DialogueBox } from '../ui/DialogueBox';
import { INTERNS, DEPARTMENT_HEADS } from '../../data/characters';
import type { DialogueLine } from '../../types/cutscene';
import { playClockTick, playClockChime, playGlitchBurst, startCorporateMusic } from '../../utils/audio';

interface Scene3Props {
  isPlaying: boolean;
  onSceneComplete: () => void;
  speed?: 'normal' | 'fast';
}

export const Scene3AfterOneWeek: React.FC<Scene3Props> = ({
  isPlaying,
  onSceneComplete,
  speed = 'normal'
}) => {
  // Steps:
  // 0: "AFTER 1 WEEK" title card
  // 1: Office fade-in, busy office life
  // 2: Boss dialogue: "How's everything going so far?"
  // 3: Intern dialogue: "Pretty good! We're getting the hang of it."
  // 4: Department Head dialogue: "Keep up the good work!"
  // 5: Environmental anomaly: Lights flicker subtly, interns stop typing and look around in confusion
  // 6: Dramatic close-up cut to the office wall clock ticking toward 12:00 PM
  // 7: Clock strikes 12:00:00 NOON (chime rings, golden halo flash!)
  // 8: Cut back to office floor: Intern dialogue: "Finally, lunch time!"
  // 9: Interns pack up, stand up, walk toward hallway exit
  // 10: Fade out -> Complete

  const [step, setStep] = useState<number>(0);
  const [fadeOpacity, setFadeOpacity] = useState<number>(1);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);

  // Clock close-up state
  const [clockSeconds, setClockSeconds] = useState<number>(54); // Counts 54 -> 60 (12:00:00)
  const [clockHitNoon, setClockHitNoon] = useState<boolean>(false);
  const [isFlickering, setIsFlickering] = useState<boolean>(false);

  // Intern packing/leaving offset
  const [packOffset, setPackOffset] = useState<number>(0);

  useEffect(() => {
    startCorporateMusic();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (step === 0) {
      // Step 0: "AFTER 1 WEEK" title card
      const handle = setTimeout(() => {
        setFadeOpacity(0);
      }, 0);
      const t = setTimeout(() => {
        setFadeOpacity(1);
        setTimeout(() => {
          setStep(1);
        }, 500);
      }, speed === 'fast' ? 1400 : 2200);
      return () => {
        clearTimeout(handle);
        clearTimeout(t);
      };
    }

    if (step === 1) {
      // Step 1: Office fade-in
      const handle = setTimeout(() => {
        setFadeOpacity(0);
      }, 0);
      const t = setTimeout(() => {
        setStep(2);
      }, speed === 'fast' ? 800 : 1400);
      return () => {
        clearTimeout(handle);
        clearTimeout(t);
      };
    }

    if (step === 2) {
      // Dialogue 1: Boss
      const handle = setTimeout(() => {
        setCurrentDialogue({
          speakerId: 'boss',
          speakerName: 'The Boss',
          speakerTitle: 'Executive Director',
          text: "How's everything going so far?",
          voicePitch: 0.85
        });
      }, 0);
      return () => clearTimeout(handle);
    }

    if (step === 3) {
      // Dialogue 1: Intern (WebDev)
      const handle = setTimeout(() => {
        setCurrentDialogue({
          speakerId: 'webdev',
          speakerName: 'Web Dev Intern',
          speakerTitle: 'Engineering',
          text: "Pretty good! We're getting the hang of it.",
          voicePitch: 1.15
        });
      }, 0);
      return () => clearTimeout(handle);
    }

    if (step === 4) {
      // Dialogue 2: Department Head
      const handle = setTimeout(() => {
        setCurrentDialogue({
          speakerId: 'dh_webdev',
          speakerName: 'Web Dev Lead',
          speakerTitle: 'VP of Web Engineering',
          text: 'Keep up the good work!',
          voicePitch: 0.95
        });
      }, 0);
      return () => clearTimeout(handle);
    }

    if (step === 5) {
      // Environmental Anomaly: Lights flicker subtly
      playGlitchBurst(0.3);
      setIsFlickering(true);
      const flickerTimer = setTimeout(() => {
        setIsFlickering(false);
        setStep(6);
      }, speed === 'fast' ? 900 : 1600);
      return () => clearTimeout(flickerTimer);
    }

    if (step === 6) {
      // Dramatic cut to close-up of clock at 11:59:54
      setClockSeconds(54);
      setClockHitNoon(false);
      const t = setTimeout(() => {
        setStep(7);
      }, speed === 'fast' ? 400 : 700);
      return () => clearTimeout(t);
    }

    if (step === 7) {
      // Clock hands tick down second-by-second to 12:00:00 NOON
      let currentSec = 54;
      const tickInterval = setInterval(() => {
        currentSec++;
        setClockSeconds(currentSec);
        playClockTick();

        if (currentSec >= 60) {
          clearInterval(tickInterval);
          setClockHitNoon(true);
          playClockChime();

          // Linger on the dramatic 12:00 NOON strike before returning to the office floor
          setTimeout(() => {
            setStep(8);
          }, speed === 'fast' ? 1200 : 2000);
        }
      }, speed === 'fast' ? 220 : 360);

      return () => clearInterval(tickInterval);
    }

    if (step === 8) {
      // Cut back to office floor: Intern dialogue: "Finally, lunch time!"
      const handle = setTimeout(() => {
        setCurrentDialogue({
          speakerId: 'pm',
          speakerName: 'PM Intern',
          speakerTitle: 'Product Management',
          text: 'Finally, lunch time!',
          voicePitch: 1.1
        });
      }, 0);
      return () => clearTimeout(handle);
    }

    if (step === 9) {
      // Interns gather belongings, stand up, move toward hallway
      const leaveInterval = setInterval(() => {
        setPackOffset((prev) => prev + 14);
      }, 40);

      const t = setTimeout(() => {
        clearInterval(leaveInterval);
        setStep(10);
      }, speed === 'fast' ? 1400 : 2200);

      return () => {
        clearInterval(leaveInterval);
        clearTimeout(t);
      };
    }

    if (step === 10) {
      // Fade out -> complete
      const handle = setTimeout(() => {
        setFadeOpacity(1);
      }, 0);
      const t = setTimeout(() => {
        onSceneComplete();
      }, 700);
      return () => {
        clearTimeout(handle);
        clearTimeout(t);
      };
    }
  }, [step, isPlaying, speed, onSceneComplete]);

  const handleDialogueNext = () => {
    setCurrentDialogue(null);
    if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 8) setStep(9);
  };

  // Close-up clock calculations
  const isCloseUp = step === 6 || step === 7;
  const isNoon = clockSeconds >= 60;

  // Angles:
  // When seconds < 60:
  // Minute hand is at 59 + (clockSeconds / 60) min -> angle = (59 + clockSeconds / 60) * 6 deg
  // Hour hand is at 11 + (59 + clockSeconds / 60)/60 hr -> angle = (11 + (59 + clockSeconds / 60)/60) * 30 deg
  // At 60 (12:00:00):
  // Hour = 0°, Minute = 0°, Second = 0°
  const secondAngle = isNoon ? 0 : clockSeconds * 6;
  const minuteAngle = isNoon ? 0 : (59 + clockSeconds / 60) * 6;
  const hourAngle = isNoon ? 0 : (11 + (59 + clockSeconds / 60) / 60) * 30;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between select-none">
      {/* Title Card: "AFTER 1 WEEK" */}
      {step === 0 && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <h1 className="text-2xl sm:text-3xl font-pixel text-amber-400 tracking-widest text-center px-4 animate-pulse glow-gold">
            AFTER 1 WEEK
          </h1>
          <p className="text-xs font-pixel text-[#6e8bff] mt-4 tracking-wider">
            SAATCHI HOUSE • 2F OPEN WORKSPACE
          </p>
        </div>
      )}

      {/* Main Office Viewport (Active when not in clock close-up) */}
      {step > 0 && (
        <div className="w-full h-full relative">
          {/* Office Walls and Workstations */}
          <div
            className={`w-full h-full transition-colors duration-500 ${
              isFlickering ? 'bg-[#181d29]' : 'bg-[#1e293b]'
            }`}
          >
            {/* Upper Wall */}
            <div className="absolute top-0 left-0 right-0 h-[58%] bg-gradient-to-b from-[#334155] to-[#475569] border-b-4 border-[#64748b]">
              {/* Motivational Posters */}
              <div className="absolute top-8 left-12 px-3 py-2 bg-slate-800 rounded border-2 border-[#0B3BD3] shadow">
                <span className="text-[7px] font-pixel text-[#6E8BFF]">
                  "SAATCHI HOUSE · THINK FORWARD"
                </span>
              </div>

              {/* Office Wall Clock (Wide Shot) */}
              <div
                className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#fefce8] border-4 border-[#78350f] shadow-xl flex items-center justify-center"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="absolute top-1 text-[7px] font-pixel text-slate-900 font-bold">12</span>
                  <span className="absolute right-1.5 text-[7px] font-pixel text-slate-900 font-bold">3</span>
                  <span className="absolute bottom-1 text-[7px] font-pixel text-slate-900 font-bold">6</span>
                  <span className="absolute left-1.5 text-[7px] font-pixel text-slate-900 font-bold">9</span>

                  {/* Hands in Wide View (Shows 11:45 early on, 12:00 after noon) */}
                  <div
                    className="absolute w-1 h-5 bg-slate-900 rounded-full origin-bottom"
                    style={{
                      transform: `rotate(${step >= 8 ? 0 : 350}deg) translateY(-2.5px)`
                    }}
                  />
                  <div
                    className="absolute w-0.5 h-7 bg-red-600 rounded-full origin-bottom"
                    style={{
                      transform: `rotate(${step >= 8 ? 0 : 330}deg) translateY(-3.5px)`
                    }}
                  />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 z-10" />
                </div>
              </div>

              {/* Windows */}
              <div className="absolute top-8 right-12 w-36 h-28 rounded border-4 border-slate-600 overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200 hidden sm:block">
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-200" />
              </div>
            </div>

            {/* Open-Plan Office Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
              {/* Desks with Workstations */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl h-28 bg-[#334155] rounded-t border-t-4 border-[#64748b] shadow-2xl flex items-center justify-around px-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <div key={d} className="flex flex-col items-center">
                    <div className="w-8 h-6 bg-slate-900 rounded-t-sm border border-cyan-500/60 p-0.5 flex flex-col justify-around">
                      <div className="w-full h-0.5 bg-emerald-400" />
                      <div className="w-3/4 h-0.5 bg-cyan-400" />
                      <div className="w-1/2 h-0.5 bg-amber-400" />
                    </div>
                    <div className="w-2 h-2 bg-slate-700" />
                    <div className="w-6 h-1 bg-slate-600 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Boss & Dept Heads */}
            <div className="absolute top-[38%] left-12 z-20 pointer-events-none">
              <BossSprite
                animation={step === 2 ? 'talking' : 'idle'}
                scale={1.1}
                direction="right"
              />
            </div>
            <div className="absolute top-[39%] left-28 z-20 pointer-events-none hidden sm:block">
              <DepartmentHeadSprite
                head={DEPARTMENT_HEADS[0]}
                animation={step === 4 ? 'talking' : 'idle'}
                scale={1.0}
                direction="right"
                emotion={step === 4 ? '👍' : null}
              />
            </div>
            <div className="absolute top-[39%] right-20 z-20 pointer-events-none hidden md:block">
              <DepartmentHeadSprite
                head={DEPARTMENT_HEADS[3]}
                animation="idle"
                scale={1.0}
                direction="left"
              />
            </div>

            {/* Interns at work stations */}
            <div
              className="absolute top-[54%] left-1/2 -translate-x-1/2 w-[92%] max-w-5xl flex justify-around px-2 z-30 pointer-events-none transition-transform duration-100"
              style={{
                transform: `translateX(${packOffset}px)`,
                opacity: packOffset > 500 ? Math.max(0, 1 - (packOffset - 500) / 400) : 1
              }}
            >
              {INTERNS.map((intern, idx) => {
                const isConfused = step === 5;
                const isLeaving = step >= 9;
                const anim = isLeaving
                  ? 'walking'
                  : isConfused
                  ? 'scared'
                  : 'working';

                return (
                  <div key={intern.id} className="flex flex-col items-center">
                    <PixelSprite
                      id={intern.id}
                      animation={anim}
                      direction={isLeaving ? 'right' : 'front'}
                      scale={1.0}
                      emotion={isConfused ? '?' : step === 8 ? '!' : null}
                      style={{ animationDelay: `${idx * 0.12}s` }}
                      fixedFrame={1}
                    />
                    <span
                      className="text-[7px] font-pixel px-1 rounded mt-0.5"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: intern.color
                      }}
                    >
                      {intern.shortName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ================= CINEMATIC CLOSE-UP: CLOCK HITS 12 NOON =============== */}
      {/* ========================================================================= */}
      {isCloseUp && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 animate-in fade-in duration-300">
          {/* Cinematic Top Letterbox Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-black border-b border-amber-500/40 flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[9px] font-pixel text-amber-400 font-bold uppercase tracking-wider">
                CHRONOGRAPH FEED // HQ TOWER
              </span>
            </div>
            <span className="text-[8px] font-pixel text-slate-400">
              TIME REMAINING: {Math.max(0, 60 - clockSeconds)}s
            </span>
          </div>

          {/* High-Resolution Clock Close-Up Face */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Clock Chime Golden Aura Flare when hitting 12 */}
            {clockHitNoon && (
              <div className="absolute w-[380px] h-[380px] rounded-full bg-amber-400/25 blur-2xl animate-pulse pointer-events-none" />
            )}

            {/* Vintage Clock Bezel Body */}
            <div
              className={`relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center p-3 transition-all duration-300 ${
                clockHitNoon ? 'ring-8 ring-amber-400/80 shadow-[0_0_60px_#f59e0b]' : 'ring-4 ring-amber-800/60'
              }`}
              style={{
                background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #78350f 100%)',
                boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.25), inset -2px -2px 6px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.9)'
              }}
            >
              {/* Inner Brass Rim */}
              <div
                className="w-full h-full rounded-full p-2 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #d97706 0%, #92400e 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
                }}
              >
                {/* Vintage Cream Dial Face */}
                <div
                  className="relative w-full h-full rounded-full bg-[#fefce8] overflow-hidden flex items-center justify-center shadow-inner"
                  style={{
                    boxShadow: 'inset 0 0 25px rgba(120, 53, 15, 0.25)'
                  }}
                >
                  {/* Concentric Decorative Rings */}
                  <div className="absolute w-[72%] h-[72%] rounded-full border border-amber-900/15 pointer-events-none" />
                  <div className="absolute w-[45%] h-[45%] rounded-full border border-amber-900/10 pointer-events-none" />

                  {/* Brand Typography */}
                  <div className="absolute top-12 flex flex-col items-center pointer-events-none">
                    <span className="text-[9px] font-pixel text-slate-800 font-bold tracking-widest">
                      SAATCHI HOUSE
                    </span>
                    <span className="text-[6.5px] font-pixel text-amber-900 tracking-wider mt-0.5 opacity-80">
                      17 JEWELS • QUARTZ
                    </span>
                  </div>

                  {/* Bottom Noon Badge */}
                  <div className="absolute bottom-11 flex flex-col items-center pointer-events-none">
                    <span
                      className={`text-[8px] font-pixel font-bold tracking-wider transition-colors ${
                        clockHitNoon ? 'text-red-600 animate-pulse' : 'text-slate-700'
                      }`}
                    >
                      {clockHitNoon ? '12:00 NOON' : 'LUNCH RECESS'}
                    </span>
                  </div>

                  {/* 12 Hour Numerals around Dial */}
                  {[
                    { num: 12, top: '6%', left: '50%', transform: 'translateX(-50%)' },
                    { num: 1, top: '11%', left: '72%', transform: 'translate(-50%, -50%)' },
                    { num: 2, top: '27%', left: '88%', transform: 'translate(-50%, -50%)' },
                    { num: 3, top: '50%', right: '7%', transform: 'translateY(-50%)' },
                    { num: 4, bottom: '27%', left: '88%', transform: 'translate(-50%, 50%)' },
                    { num: 5, bottom: '11%', left: '72%', transform: 'translate(-50%, 50%)' },
                    { num: 6, bottom: '6%', left: '50%', transform: 'translateX(-50%)' },
                    { num: 7, bottom: '11%', left: '28%', transform: 'translate(-50%, 50%)' },
                    { num: 8, bottom: '27%', left: '12%', transform: 'translate(-50%, 50%)' },
                    { num: 9, top: '50%', left: '7%', transform: 'translateY(-50%)' },
                    { num: 10, top: '27%', left: '12%', transform: 'translate(-50%, -50%)' },
                    { num: 11, top: '11%', left: '28%', transform: 'translate(-50%, -50%)' }
                  ].map((pos) => (
                    <span
                      key={pos.num}
                      className="absolute font-pixel text-[13px] sm:text-[15px] font-bold text-slate-900"
                      style={{
                        top: pos.top,
                        bottom: pos.bottom,
                        left: pos.left,
                        right: pos.right,
                        transform: pos.transform
                      }}
                    >
                      {pos.num}
                    </span>
                  ))}

                  {/* Hour Hand (Vintage Spade Hand) */}
                  <div
                    className="absolute w-2 h-16 sm:h-20 bg-slate-950 rounded-sm origin-bottom z-20 shadow-md"
                    style={{
                      transform: `rotate(${hourAngle}deg) translateY(-8px)`,
                      transition: isNoon ? 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
                    }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-950 -top-2 left-1/2 -translate-x-1/2 absolute" />
                  </div>

                  {/* Minute Hand (Sleek Sword Hand) */}
                  <div
                    className="absolute w-1.5 h-24 sm:h-28 bg-slate-900 rounded-sm origin-bottom z-20 shadow-lg"
                    style={{
                      transform: `rotate(${minuteAngle}deg) translateY(-12px)`,
                      transition: isNoon ? 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
                    }}
                  />

                  {/* Second Hand (Vivid Crimson Needle) */}
                  <div
                    className="absolute w-0.5 h-28 sm:h-32 bg-red-600 origin-bottom z-30"
                    style={{
                      transform: `rotate(${secondAngle}deg) translateY(-14px)`,
                      boxShadow: '0 0 4px rgba(239, 68, 68, 0.8)'
                    }}
                  >
                    {/* Tail Counterweight */}
                    <div className="w-2 h-2 rounded-full bg-red-600 -bottom-2 left-1/2 -translate-x-1/2 absolute" />
                  </div>

                  {/* Central Brass Cap Pivot */}
                  <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600 z-30 shadow" />

                  {/* Curved Glass Specular Highlight Glare */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 60%)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Strike Noon Notification Pill */}
            {clockHitNoon && (
              <div className="mt-6 px-4 py-2 rounded-md bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-pixel text-xs sm:text-sm font-bold tracking-widest animate-bounce shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                🔔 12:00 PM • NOON RECESS
              </div>
            )}
          </div>

          {/* Cinematic Bottom Letterbox Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-black border-t border-amber-500/40 flex items-center justify-between px-6 z-50">
            <span className="text-[8px] font-pixel text-slate-400">
              OFFICE WORKDAY // WEEK 01
            </span>
            <span className="text-[8px] font-pixel text-amber-400">
              [LUNCH SHIFT COMMENCING]
            </span>
          </div>
        </div>
      )}

      {/* Dialogue Overlay */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-40 pointer-events-auto">
        <DialogueBox
          dialogue={currentDialogue}
          onComplete={handleDialogueNext}
          onNext={handleDialogueNext}
          speed={speed}
        />
      </div>

      {/* Screen Fade In/Out */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700 z-50"
        style={{ opacity: fadeOpacity }}
      />
    </div>
  );
};
