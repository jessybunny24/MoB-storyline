import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BoardroomEnvironment } from './BoardroomEnvironment';
import { PixelSprite } from '../character/PixelSprite';
import { DialogueBox } from '../ui/DialogueBox';
import { INTERNS } from '../../data/characters';
import type { DialogueLine } from '../../types/cutscene';
import {
  playGlitchBurst,
  playPortalPullSound,
  playHeroFanfare,
  startDarkRepositoryMusic,
  playElevatorDing,
  playElevatorAlarm,
  playElevatorBrakeScreech
} from '../../utils/audio';

interface Scene4Props {
  isPlaying: boolean;
  onSceneComplete: () => void;
  speed?: 'normal' | 'fast';
}

// Camera coordinate calculator: smoothly zooms and pans to whomever is speaking
const getCameraState = (step: number, _speakerId?: string) => {
  // ACT 1: THE ELEVATOR LOBBY & MALFUNCTION (Steps 0 - 6)
  if (step === 1) {
    // Mobile Dev Intern speaking at elevator entrance
    return { zoom: 1.25, originX: 46, originY: 54 };
  }
  if (step === 2) {
    // Design Intern speaking as interns step in
    return { zoom: 1.25, originX: 52, originY: 54 };
  }
  if (step === 3) {
    // Doors slam shut, brakes slip, sparks fly & indicator goes crazy!
    return { zoom: 1.35, originX: 50, originY: 42 };
  }
  if (step === 4) {
    // DevOps Intern reacts to plunge from inside
    return { zoom: 1.35, originX: 50, originY: 42 };
  }
  if (step === 5) {
    // PM Intern reacts to descent
    return { zoom: 1.35, originX: 50, originY: 42 };
  }
  if (step === 6) {
    // Emergency impact stop; doors pry open with steam
    return { zoom: 1.22, originX: 50, originY: 46 };
  }

  // ACT 2: WEIRD B1 BASEMENT & GLITCHING COMPUTER (Steps 7 - 12)
  if (step === 7) {
    // Wide pan across dark subterranean corridor
    return { zoom: 1.1, originX: 48, originY: 50 };
  }
  if (step === 8) {
    // QA Intern points at strange computer
    return { zoom: 1.36, originX: 68, originY: 52 };
  }
  if (step === 9) {
    // Operations Intern examines unmapped hardware
    return { zoom: 1.36, originX: 58, originY: 52 };
  }
  if (step === 10) {
    // Close-up on the tearing, glitching computer terminal
    return { zoom: 1.45, originX: 74, originY: 38 };
  }
  if (step === 11) {
    // DevOps Intern reacts to dark portal
    return { zoom: 1.38, originX: 78, originY: 52 };
  }
  if (step === 12) {
    // Suction pull: wide shot showing interns flying into the vortex
    return { zoom: 1.1, originX: 62, originY: 48 };
  }

  // ACT 3: THE DARK REPOSITORY BOARDROOM & SUPERPOWERS (Steps 13 - 22)
  if (step === 13) {
    // Atmospheric reveal wide shot
    return { zoom: 1.05, originX: 50, originY: 50 };
  }
  if (step === 14) {
    // Web Dev Intern speaking
    return { zoom: 1.42, originX: 16, originY: 46 };
  }
  if (step === 15) {
    // PM Intern speaking
    return { zoom: 1.42, originX: 42, originY: 46 };
  }
  if (step === 16) {
    // Biz Dev Intern speaking
    return { zoom: 1.42, originX: 86, originY: 46 };
  }
  if (step === 17) {
    // Superpower: Web Dev Intern digital DOM energy shield
    return { zoom: 1.48, originX: 16, originY: 46 };
  }
  if (step === 18) {
    // Superpower: QA Intern magnifying anomaly scanner
    return { zoom: 1.48, originX: 68, originY: 46 };
  }
  if (step === 19) {
    // Superpower: DevOps Intern CI/CD pipeline keycard
    return { zoom: 1.48, originX: 78, originY: 46 };
  }
  if (step === 20) {
    // Superpower: Design Intern vector stylus constructs
    return { zoom: 1.48, originX: 30, originY: 46 };
  }
  if (step === 21) {
    // PM Intern rallies team
    return { zoom: 1.35, originX: 45, originY: 46 };
  }
  if (step === 22) {
    // Camera tilts up to corrupted TV screen
    return { zoom: 1.45, originX: 50, originY: 26 };
  }

  return { zoom: 1.0, originX: 50, originY: 50 };
};

export const Scene4TheDarkRepository: React.FC<Scene4Props> = ({
  isPlaying,
  onSceneComplete,
  speed = 'normal'
}) => {
  const [step, setStep] = useState<number>(0);
  const [fadeOpacity, setFadeOpacity] = useState<number>(1);
  const [whiteFlash, setWhiteFlash] = useState<boolean>(false);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);

  // Elevator State
  const [elevatorDisplay, setElevatorDisplay] = useState<string>('2F ▼');
  const [elevatorDoorsOpen, setElevatorDoorsOpen] = useState<boolean>(true); // Open on 2F lobby
  const [elevatorAlarmActive, setElevatorAlarmActive] = useState<boolean>(false);

  // Portal & Pull state
  const [portalSize, setPortalSize] = useState<number>(0);
  const [suckedCount, setSuckedCount] = useState<number>(0);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Compute camera framing based on step and speaker
  const camera = useMemo(() => {
    return getCameraState(step, currentDialogue?.speakerId);
  }, [step, currentDialogue?.speakerId]);

  useEffect(() => {
    if (!isPlaying) return;

    // STEP 0: Fade-in at 2F Elevator Lobby
    if (step === 0) {
      const handle = setTimeout(() => {
        setFadeOpacity(0);
      }, 0);
      const t = setTimeout(() => {
        setStep(1);
      }, 600);
      return () => {
        clearTimeout(handle);
        clearTimeout(t);
      };
    }

    // STEP 1: Intern 1 dialogue at 2F elevator
    if (step === 1) {
      setCurrentDialogue({
        speakerId: 'mobile',
        speakerName: 'Mobile Dev Intern',
        speakerTitle: 'Mobile Engineering',
        text: 'So, where are we eating?',
        voicePitch: 1.2
      });
    }

    // STEP 2: Intern 2 dialogue at 2F elevator
    if (step === 2) {
      setCurrentDialogue({
        speakerId: 'design',
        speakerName: 'Design Intern',
        speakerTitle: 'Design & UX',
        text: "Let's check the dining hall on 1F!",
        voicePitch: 1.25
      });
    }

    // STEP 3: Doors close, elevator descends, then malfunctions!
    if (step === 3) {
      // Close elevator doors
      setElevatorDoorsOpen(false);
      playElevatorDing();

      const tDing = setTimeout(() => {
        setElevatorDisplay('1F ▼');
      }, 400);

      // Brakes slip! Screech, alarm, and shudder
      const tSlip = setTimeout(() => {
        playElevatorBrakeScreech();
        playElevatorAlarm();
        setScreenShake(true);
        setElevatorAlarmActive(true);
        setElevatorDisplay('G ▼');
      }, 800);

      const tPlunge = setTimeout(() => {
        playGlitchBurst(0.7);
        setElevatorDisplay('B1 ???');
      }, 1400);

      const tErr = setTimeout(() => {
        playElevatorAlarm();
        setElevatorDisplay('⚠ ERR: B1');
      }, 1900);

      const tNext = setTimeout(() => {
        setStep(4);
      }, speed === 'fast' ? 2200 : 2800);

      return () => {
        clearTimeout(tDing);
        clearTimeout(tSlip);
        clearTimeout(tPlunge);
        clearTimeout(tErr);
        clearTimeout(tNext);
      };
    }

    // STEP 4: DevOps reacts to plunge
    if (step === 4) {
      setCurrentDialogue({
        speakerId: 'devops',
        speakerName: 'DevOps Intern',
        speakerTitle: 'DevOps & Cloud',
        text: 'Whoa! The emergency brakes slipped past 1F! The cabin is plunging into the sub-basement!',
        voicePitch: 1.3
      });
    }

    // STEP 5: PM tells team to hold on
    if (step === 5) {
      setCurrentDialogue({
        speakerId: 'pm',
        speakerName: 'PM Intern',
        speakerTitle: 'Product Management',
        text: 'Hold onto the handrails! Is there even a B1 on the building directory?!',
        voicePitch: 1.05
      });
    }

    // STEP 6: Emergency Impact Stop & Doors Pry Open
    if (step === 6) {
      playGlitchBurst(1.15);
      setScreenShake(false);
      setElevatorDisplay('▼ B1 SUB-LEVEL');

      const tDoors = setTimeout(() => {
        setElevatorDoorsOpen(true);
      }, 500);

      const tAdvance = setTimeout(() => {
        setStep(7);
      }, speed === 'fast' ? 1400 : 2200);

      return () => {
        clearTimeout(tDoors);
        clearTimeout(tAdvance);
      };
    }

    // STEP 7: Reveal B1 Weird Basement Corridor
    if (step === 7) {
      const t = setTimeout(() => {
        setStep(8);
      }, speed === 'fast' ? 1200 : 2000);
      return () => clearTimeout(t);
    }

    // STEP 8: QA notices strange computer in B1 basement
    if (step === 8) {
      setCurrentDialogue({
        speakerId: 'qa',
        speakerName: 'QA Intern',
        speakerTitle: 'Quality Assurance',
        text: "Wait… what is this place? And what's wrong with that computer over there?",
        voicePitch: 1.1
      });
    }

    // STEP 9: Operations examines unmapped hardware
    if (step === 9) {
      setCurrentDialogue({
        speakerId: 'operations',
        speakerName: 'Operations Intern',
        speakerTitle: 'Operations',
        text: 'These server racks are completely unmapped... is that terminal supposed to do that?',
        voicePitch: 1.05
      });
    }

    // STEP 10: Computer corruption sequence
    if (step === 10) {
      playGlitchBurst(0.85);
      const glitchInterval = setInterval(() => {
        playGlitchBurst(0.65);
      }, 260);

      const t = setTimeout(() => {
        clearInterval(glitchInterval);
        setStep(11);
      }, speed === 'fast' ? 1800 : 3200);

      return () => {
        clearInterval(glitchInterval);
        clearTimeout(t);
      };
    }

    // STEP 11: DevOps reacts to portal opening
    if (step === 11) {
      setCurrentDialogue({
        speakerId: 'devops',
        speakerName: 'DevOps Intern',
        speakerTitle: 'DevOps & Cloud',
        text: 'What is THAT?!',
        isGlitchy: true,
        voicePitch: 1.3
      });
    }

    // STEP 12: Portal suction pull sequence
    if (step === 12) {
      setScreenShake(true);
      playPortalPullSound();
      setPortalSize(380);

      const pullInterval = setInterval(() => {
        playPortalPullSound();
        setSuckedCount((prev) => {
          if (prev >= 9) {
            clearInterval(pullInterval);
            setScreenShake(false);
            setWhiteFlash(true);

            // Blackout hold -> Enter Act 3 (Dark Repository Boardroom)
            setTimeout(() => {
              setWhiteFlash(false);
              setFadeOpacity(1);
              startDarkRepositoryMusic();

              setTimeout(() => {
                setStep(13);
              }, 1000);
            }, 600);

            return 9;
          }
          return prev + 1;
        });
      }, speed === 'fast' ? 320 : 520);

      return () => clearInterval(pullInterval);
    }

    // STEP 13: Reveal Dark Repository Boardroom
    if (step === 13) {
      setFadeOpacity(0);
      const t = setTimeout(() => {
        setStep(14);
      }, speed === 'fast' ? 1200 : 2000);
      return () => clearTimeout(t);
    }

    // STEP 14: Web Dev awakens
    if (step === 14) {
      setCurrentDialogue({
        speakerId: 'webdev',
        speakerName: 'Web Dev Intern',
        speakerTitle: 'Web Engineering',
        text: 'Where… are we?',
        voicePitch: 1.05
      });
    }

    // STEP 15: PM examines room
    if (step === 15) {
      setCurrentDialogue({
        speakerId: 'pm',
        speakerName: 'PM Intern',
        speakerTitle: 'Product Management',
        text: 'This looks like the boardroom…',
        voicePitch: 1.0
      });
    }

    // STEP 16: Biz Dev notices anomalies
    if (step === 16) {
      setCurrentDialogue({
        speakerId: 'bizdev',
        speakerName: 'Biz Dev Intern',
        speakerTitle: 'Business Development',
        text: "But something's wrong.",
        isGlitchy: true,
        voicePitch: 0.95
      });
    }

    // STEP 17: Superpower Discovery 1: Web Dev Intern
    if (step === 17) {
      playGlitchBurst(0.4);
      setCurrentDialogue({
        speakerId: 'webdev',
        speakerName: 'Web Dev Intern',
        speakerTitle: 'Frontend Architecture',
        text: "Wait... look at my hands! A digital energy shield is manifesting around my fingertips—like a reactive DOM barrier!",
        voicePitch: 1.15
      });
    }

    // STEP 18: Superpower Discovery 2: QA Intern
    if (step === 18) {
      playGlitchBurst(0.4);
      setCurrentDialogue({
        speakerId: 'qa',
        speakerName: 'QA Intern',
        speakerTitle: 'Quality Assurance',
        text: "My magnifying badge is pulsing! I can see memory leaks, syntax glitches, and bug vectors highlighted across reality!",
        voicePitch: 1.1
      });
    }

    // STEP 19: Superpower Discovery 3: DevOps Intern
    if (step === 19) {
      playGlitchBurst(0.5);
      setCurrentDialogue({
        speakerId: 'devops',
        speakerName: 'DevOps Intern',
        speakerTitle: 'DevOps & Cloud',
        text: "My server keycard is surging with live deployment pipelines! We've all gained superpowers tailored to our exact intern roles!",
        voicePitch: 1.2
      });
    }

    // STEP 20: Superpower Discovery 4: Design Intern
    if (step === 20) {
      playHeroFanfare();
      setCurrentDialogue({
        speakerId: 'design',
        speakerName: 'Design Intern',
        speakerTitle: 'Design & UI/UX',
        text: "My stylus can construct solid vector wireframes! Whatever this place threw at us... we have the power to fight back!",
        voicePitch: 1.25
      });
    }

    // STEP 21: PM Intern rallies team
    if (step === 21) {
      setCurrentDialogue({
        speakerId: 'pm',
        speakerName: 'PM Intern',
        speakerTitle: 'Product Management',
        text: "Stay grouped, everyone. Ready your abilities. Look—the presentation screen is turning on...",
        voicePitch: 1.05
      });
    }

    // STEP 22: Camera moves to corrupted TV -> Transition into Scene 5
    if (step === 22) {
      const t = setTimeout(() => {
        setFadeOpacity(1);
        setTimeout(() => {
          onSceneComplete();
        }, 700);
      }, speed === 'fast' ? 1400 : 2400);
      return () => clearTimeout(t);
    }
  }, [step, isPlaying, speed, onSceneComplete]);

  const handleDialogueNext = useCallback(() => {
    setCurrentDialogue(null);
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
    else if (step === 8) setStep(9);
    else if (step === 9) setStep(10);
    else if (step === 11) setStep(12);
    else if (step === 14) setStep(15);
    else if (step === 15) setStep(16);
    else if (step === 16) setStep(17);
    else if (step === 17) setStep(18);
    else if (step === 18) setStep(19);
    else if (step === 19) setStep(20);
    else if (step === 20) setStep(21);
    else if (step === 21) setStep(22);
  }, [step]);

  // Which environment to render:
  const isLobby = step <= 6;
  const isB1Basement = step >= 7 && step <= 12;
  const isDarkRepo = step >= 13;

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black flex flex-col justify-between ${
        screenShake ? 'animate-glitch' : ''
      }`}
    >
      {/* ================= ACT 1: 2F ELEVATOR LOBBY & DESCENT MALFUNCTION ================= */}
      {isLobby && (
        <div
          className="w-full h-full relative"
          style={{
            transform: `scale(${camera.zoom})`,
            transformOrigin: `${camera.originX}% ${camera.originY}%`,
            transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), transform-origin 850ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* 2F Lobby Environment */}
          <div className="w-full h-full bg-[#1e293b] flex flex-col justify-between relative overflow-hidden">
            {/* Upper Lobby Wall: Corporate Slate & Architectural Trim */}
            <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-[#334155] via-[#243045] to-[#1e293b] border-b-4 border-slate-700">
              {/* Saatchi House Lobby Wayfinding Header */}
              <div className="absolute top-5 left-10 flex items-center gap-3">
                <div className="px-3 py-1 bg-[#0b1022] border border-[#6e8bff] rounded text-[8px] font-pixel text-[#6e8bff] shadow">
                  SAATCHI HOUSE · 2F ELEVATOR LOBBY
                </div>
                <div className="text-[7px] font-pixel text-slate-400">
                  LIFT 04 [PASSENGER CONCOURSE]
                </div>
              </div>

              {/* Emergency Warning Flash during malfunction */}
              {elevatorAlarmActive && (
                <div className="absolute inset-0 bg-red-600/25 pointer-events-none animate-pulse z-25" />
              )}

              {/* Architectural Elevator Portal Frame (Centrally Proportioned) */}
              <div
                className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[340px] sm:w-[400px] h-[220px] sm:h-[240px] z-10 flex flex-col justify-between"
                style={{
                  border: '6px solid #475569',
                  borderBottom: 'none',
                  borderRadius: '6px 6px 0 0',
                  background: '#0b0f19',
                  boxShadow: elevatorAlarmActive
                    ? '0 0 35px rgba(239,68,68,0.6), inset 0 0 20px rgba(0,0,0,0.9)'
                    : '0 10px 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(0,0,0,0.8)'
                }}
              >
                {/* Lintel Bar with Saatchi Branding & Digital Floor Display */}
                <div className="w-full h-10 bg-slate-900 border-b-2 border-slate-700 flex items-center justify-between px-3 z-30">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        elevatorAlarmActive ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[7px] font-pixel text-slate-300">LIFT 04</span>
                  </div>

                  {/* Digital Amber / Glitch Red LED Display */}
                  <div className="px-3 py-0.5 rounded bg-black border border-slate-700 flex items-center gap-2 shadow-inner">
                    <span
                      className={`font-pixel text-[11px] sm:text-xs font-bold tracking-widest ${
                        elevatorAlarmActive ? 'text-red-500 animate-pulse' : 'text-amber-400'
                      }`}
                    >
                      {elevatorDisplay}
                    </span>
                  </div>

                  <span className="text-[6.5px] font-pixel text-slate-500">
                    CAP. 12
                  </span>
                </div>

                {/* Elevator Doors Housing */}
                <div className="relative flex-1 w-full overflow-hidden flex">
                  {/* Inside Elevator Cabin Backdrop (Revealed when doors are open) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a2333] to-[#0f172a] flex flex-col justify-between p-2">
                    {/* Ceiling Downlight Cone */}
                    <div className="w-24 h-12 bg-amber-300/15 rounded-full blur-md mx-auto" />
                    {/* Chrome Handrail */}
                    <div className="w-full h-2 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full shadow" />
                    {/* Interior Safety Floor */}
                    <div className="w-full h-8 bg-slate-900/90 border-t border-slate-700" />
                  </div>

                  {/* Left Sliding Steel Door */}
                  <div
                    className="w-1/2 h-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 border-r border-slate-900 shadow-2xl flex items-center justify-end pr-2 transition-transform duration-700 ease-in-out z-20"
                    style={{
                      transform: elevatorDoorsOpen ? 'translateX(-85%)' : 'translateX(0)'
                    }}
                  >
                    <div className="w-1.5 h-16 bg-slate-800 rounded-sm shadow-inner" />
                  </div>

                  {/* Right Sliding Steel Door */}
                  <div
                    className="w-1/2 h-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 border-l border-slate-900 shadow-2xl flex items-center justify-start pl-2 transition-transform duration-700 ease-in-out z-20"
                    style={{
                      transform: elevatorDoorsOpen ? 'translateX(85%)' : 'translateX(0)'
                    }}
                  >
                    <div className="w-1.5 h-16 bg-slate-800 rounded-sm shadow-inner" />
                  </div>

                  {/* Sparks effect during elevator brake slip (Steps 3-5) */}
                  {elevatorAlarmActive && !elevatorDoorsOpen && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-25">
                      <div className="text-amber-300 text-xs font-pixel animate-ping">⚡ ⚠ SHUDDER ⚡</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Elevator Wall Call Panel on the Right */}
              <div
                className="absolute w-6 h-18 bg-slate-800 border border-slate-600 rounded flex flex-col items-center justify-around py-1 shadow-md hidden sm:flex"
                style={{
                  bottom: '40px',
                  left: 'calc(50% + 215px)'
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-[5px] text-slate-400">
                  ▲
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90 border border-amber-300 flex items-center justify-center text-[5px] text-black font-bold shadow-[0_0_6px_#f59e0b]">
                  ▼
                </div>
              </div>
            </div>

            {/* Lobby Floor: Polished Corporate Floor with Depth */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#182133] to-[#0f172a]">
              {/* Floor Tile Perspective Seams */}
              <div className="absolute inset-0 flex justify-around opacity-15 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-slate-400" />
                ))}
              </div>
            </div>

            {/* Interns Gathering & Entering Elevator on 2F (Steps 0 - 2) */}
            {/* Positioned at bottom-[114px] right at elevator entrance with proper proportions */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center gap-2 sm:gap-3.5 z-30 pointer-events-none"
              style={{
                bottom: '114px',
                width: '380px'
              }}
            >
              {INTERNS.map((intern, idx) => {
                const isTalking = currentDialogue?.speakerId === intern.id;

                return (
                  <div
                    key={intern.id}
                    className="flex flex-col items-center transition-all duration-300"
                    style={{
                      transform: isTalking ? 'translateY(-8px)' : 'translateY(0)',
                      zIndex: isTalking ? 35 : 30
                    }}
                  >
                    <div className="relative rounded-md transition-all duration-300">
                      <PixelSprite
                        id={intern.id}
                        animation={isTalking ? 'talking' : 'idle'}
                        direction={idx < 4 ? 'right' : 'left'}
                        scale={isTalking ? 1.42 : 1.28}
                        emotion={isTalking ? '!' : null}
                      />
                    </div>

                    <span
                      className="text-[6.5px] font-pixel px-1.5 py-0.5 rounded mt-0.5 bg-black/85 transition-all duration-300"
                      style={{ color: intern.color }}
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

      {/* ================= ACT 2: WEIRD B1 BASEMENT & GLITCHING COMPUTER ================= */}
      {isB1Basement && (
        <div
          className="w-full h-full relative"
          style={{
            transform: `scale(${camera.zoom})`,
            transformOrigin: `${camera.originX}% ${camera.originY}%`,
            transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), transform-origin 850ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Subterranean B1 Corridor Environment */}
          <div className="w-full h-full bg-[#0a0c14] flex flex-col justify-between relative">
            {/* Concrete Catacomb Walls */}
            <div className="absolute top-0 left-0 right-0 h-[56%] bg-gradient-to-b from-[#151a28] via-[#0f1422] to-[#0a0d18] border-b-4 border-slate-800">
              {/* Heavy Industrial Overhead Conduit Pipes */}
              <div className="absolute top-3 left-0 right-0 h-3 bg-gradient-to-b from-slate-700 to-slate-900 border-b border-slate-600 flex items-center justify-around px-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-3 h-4 bg-slate-600 rounded-sm" />
                ))}
              </div>

              {/* Malfunctioned Elevator Shaft on Far Left with Doors Jammed Open */}
              <div className="absolute top-8 left-8 w-26 h-48 bg-slate-950 rounded-t border-2 border-red-700 flex flex-col items-center pt-2 shadow-2xl">
                <span className="text-[6.5px] font-pixel text-red-400 animate-pulse">
                  ⚠ LIFT 04 · B1 STOP
                </span>
                <div className="w-full h-0.5 bg-red-600 my-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping mt-1" />
                {/* Open Door Cavity with flickering light & steam */}
                <div className="w-22 flex-1 bg-black/90 mt-2 border border-slate-800 flex flex-col items-center justify-center p-1">
                  <span className="text-[6px] font-pixel text-slate-500">JAMMED</span>
                  <span className="text-[5px] font-pixel text-red-500 mt-1">EMERGENCY</span>
                </div>
              </div>

              {/* Forbidden B1 Subterranean Wayfinding Sign */}
              <div className="absolute top-9 left-40 px-3 py-1 bg-[#151a26] border border-[#ff4fa8] rounded text-[7.5px] font-pixel text-[#ff4fa8] shadow-[0_0_12px_rgba(255,79,168,0.3)] animate-pulse">
                ⚠ B1 FORBIDDEN SECTOR · RESTRICTED ACCESS
              </div>

              {/* Saatchi Archival Server Rack Unit */}
              <div className="absolute top-10 right-48 w-16 h-38 bg-slate-900 border border-slate-700 rounded-sm p-1 flex flex-col justify-between hidden md:flex">
                <div className="text-[5.5px] font-pixel text-slate-400">RACK 0x9F</div>
                <div className="space-y-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-1 bg-slate-800 flex items-center gap-1 px-0.5">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* The Strange Glitching Computer Terminal Desk on the Right */}
              <div
                className="absolute right-[22%] flex flex-col items-center z-20"
                style={{ bottom: '-4px' }}
              >
                {/* Computer Monitor */}
                <div
                  className={`relative rounded-t p-1.5 transition-all ${
                    step >= 10
                      ? 'animate-tear ring-2 ring-red-500 shadow-[0_0_28px_#ef4444]'
                      : 'bg-slate-900 border border-slate-700'
                  }`}
                  style={{
                    width: step >= 12 ? `${portalSize}px` : '64px',
                    height: step >= 12 ? `${portalSize * 0.75}px` : '46px',
                    backgroundColor: step >= 10 ? '#050508' : '#0f172a'
                  }}
                >
                  {/* Glitching screen content */}
                  <div className="w-full h-full bg-black relative overflow-hidden flex flex-col items-center justify-center">
                    {step < 10 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center animate-pulse">
                        <span className="text-[7px] font-terminal text-cyan-400 font-bold">PORTAL READY</span>
                        <div className="w-3/4 h-0.5 bg-red-500 mt-1" />
                      </div>
                    ) : (
                      /* Matrix Glitch / Dark Portal Vortex */
                      <div className="w-full h-full relative flex items-center justify-center animate-glitch">
                        <div
                          className="absolute inset-0 bg-radial from-purple-900 via-red-950 to-black rounded-full animate-spin"
                          style={{ animationDuration: '2s' }}
                        />
                        <div className="text-[9px] font-pixel text-red-500 font-bold z-10 animate-rgb-split">
                          0xDEAD_BEEF
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desk Chassis */}
                <div className="w-28 h-14 bg-slate-800 border-t-2 border-slate-600 rounded-sm shadow-xl flex items-center justify-around px-2">
                  <div className="w-1.5 h-10 bg-slate-900/60 rounded" />
                  <div className="w-1.5 h-10 bg-slate-900/60 rounded" />
                </div>
              </div>
            </div>

            {/* Basement Concrete Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-[44%] bg-gradient-to-b from-[#090b12] to-[#040508]" />

            {/* Interns gathered in B1 Basement */}
            {/* Positioned at bottom-[136px] so they stand cleanly above the dialogue box at all times */}
            <div
              className="absolute left-6 right-6 flex items-end justify-start gap-4 sm:gap-6 z-30 pointer-events-none"
              style={{ bottom: '136px' }}
            >
              {INTERNS.map((intern, idx) => {
                const isPulledIn = idx < suckedCount;
                const isStruggling = step === 12 && !isPulledIn;
                const isTalking = currentDialogue?.speakerId === intern.id;

                if (isPulledIn) return null;

                // Suction motion: pull toward computer (right side)
                const pullTransform = isStruggling
                  ? `translate(${180 + idx * 25}px, -30px) rotate(${idx % 2 === 0 ? 15 : -15}deg) scale(0.85)`
                  : `translate(${idx * 16}px, ${isTalking ? -8 : 0}px)`;

                return (
                  <div
                    key={intern.id}
                    className="flex flex-col items-center transition-all duration-300"
                    style={{
                      transform: pullTransform,
                      zIndex: isTalking ? 35 : 30
                    }}
                  >
                    <div className="relative rounded-md transition-all duration-300">
                      <PixelSprite
                        id={intern.id}
                        animation={
                          isStruggling
                            ? 'struggling'
                            : step >= 10
                            ? 'scared'
                            : isTalking
                            ? 'talking'
                            : 'idle'
                        }
                        direction="right"
                        scale={isTalking ? 1.42 : 1.3}
                        emotion={step >= 10 ? 'panic' : isTalking ? '!' : '?'}
                      />
                    </div>

                    <span
                      className="text-[7px] font-pixel px-1.5 py-0.5 rounded mt-1 bg-black/85 transition-all duration-300"
                      style={{ color: intern.color }}
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

      {/* ================= ACT 3: THE DARK REPOSITORY BOARDROOM ================= */}
      {isDarkRepo && (
        <div
          className="w-full h-full relative"
          style={{
            transform: `scale(${camera.zoom})`,
            transformOrigin: `${camera.originX}% ${camera.originY}%`,
            transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), transform-origin 850ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <BoardroomEnvironment
            isCorrupted={true}
            isFlickering={true}
            tvState="static"
          >
            {/* Corrupted Conference Area with Interns Elevated to top-[46%] */}
            {/* Positioned higher up so they stand prominently clear of the bottom dialogue box */}
            <div className="absolute top-[46%] left-1/2 -translate-x-1/2 w-[92%] max-w-5xl flex justify-between px-3 z-30 pointer-events-none">
              {INTERNS.map((intern, idx) => {
                const isTalking = currentDialogue?.speakerId === intern.id;
                const hasDiscoveredPower =
                  step >= 20 ||
                  (step === 17 && intern.id === 'webdev') ||
                  (step === 18 && (intern.id === 'webdev' || intern.id === 'qa')) ||
                  (step === 19 && (intern.id === 'webdev' || intern.id === 'qa' || intern.id === 'devops'));

                const internAnim = isTalking
                  ? 'talking'
                  : step >= 20
                  ? 'hero'
                  : hasDiscoveredPower
                  ? 'working'
                  : 'scared';
                const internEmotion = isTalking
                  ? '!'
                  : step >= 20
                  ? '!'
                  : hasDiscoveredPower
                  ? '!'
                  : '?';

                return (
                  <div
                    key={intern.id}
                    className="flex flex-col items-center transition-all duration-300"
                    style={{
                      transform: isTalking ? 'translateY(-10px)' : 'translateY(0)',
                      zIndex: isTalking ? 35 : 30
                    }}
                  >
                    {/* Intern Sprite (Scaled up to 1.32 - 1.45 for high visibility & detail) */}
                    <div className="relative rounded-md transition-all duration-300">
                      <PixelSprite
                        id={intern.id}
                        animation={internAnim}
                        direction={idx < 4 ? 'right' : 'left'}
                        scale={isTalking ? 1.45 : 1.32}
                        showGlow={hasDiscoveredPower}
                        emotion={internEmotion}
                        style={{ animationDelay: `${idx * 0.15}s` }}
                      />
                    </div>

                    {/* Intern Nameplate & Power Aura */}
                    <span
                      className="text-[7.5px] font-pixel px-1.5 py-0.5 rounded mt-1 bg-black/85 transition-all duration-300"
                      style={{
                        color: intern.color,
                        boxShadow: hasDiscoveredPower
                          ? `0 0 12px ${intern.color}`
                          : 'none',
                        border: hasDiscoveredPower
                          ? `1px solid ${intern.color}`
                          : '1px solid transparent'
                      }}
                    >
                      {intern.shortName}
                    </span>
                  </div>
                );
              })}
            </div>
          </BoardroomEnvironment>
        </div>
      )}

      {/* White Flash Transition */}
      {whiteFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-pulse" />
      )}

      {/* Dialogue Box (Positioned at bottom-4 with ample clearance above it) */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-40 pointer-events-auto">
        <DialogueBox
          dialogue={currentDialogue}
          onComplete={handleDialogueNext}
          onNext={handleDialogueNext}
          speed={speed}
        />
      </div>

      {/* Fade In/Out */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700 z-50"
        style={{ opacity: fadeOpacity }}
      />
    </div>
  );
};
