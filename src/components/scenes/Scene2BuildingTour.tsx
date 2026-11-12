import React, { useEffect, useState, useCallback } from 'react';
import { BoardroomEnvironment } from './BoardroomEnvironment';
import { PixelSprite } from '../character/PixelSprite';
import { DepartmentHeadSprite } from '../character/DepartmentHeadSprite';
import { BossSprite } from '../character/BossSprite';
import { DialogueBox } from '../ui/DialogueBox';
import { INTERNS, DEPARTMENT_HEADS } from '../../data/characters';
import type { DialogueLine } from '../../types/cutscene';
import { playGlitchBurst } from '../../utils/audio';

interface Scene2Props {
  isPlaying: boolean;
  onSceneComplete: () => void;
  speed?: 'normal' | 'fast';
}

export const Scene2BuildingTour: React.FC<Scene2Props> = ({
  isPlaying,
  onSceneComplete,
  speed = 'normal'
}) => {
  // Timeline steps:
  // 0: Fade-in
  // 1: Boss speaks: "Alright everyone, follow us! We'll give you a tour of the building."
  // 2: Boss gestures towards the exit door (right side). Interns stand up.
  // 3: Dept Heads walk towards door and exit.
  // 4: Interns follow and exit sequentially.
  // 5: Completely empty boardroom hold.
  // 6: Focus camera on TV displaying "WELCOME".
  // 7: Mirrored horizontally.
  // 8: Rotates upside down.
  // 9: Increasingly distorted text + screen tearing.
  // 10: Lights twitch & flicker + static bursts.
  // 11: Sudden eerie glitch + transition complete.

  const [step, setStep] = useState<number>(0);
  const [fadeOpacity, setFadeOpacity] = useState<number>(1);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);

  // Character exit progress (X offsets towards right exit door)
  const [bossExitOffset, setBossExitOffset] = useState<number>(0);
  const [deptHeadExitOffset, setDeptHeadExitOffset] = useState<number>(0);
  const [internExitOffset, setInternExitOffset] = useState<number>(0);

  // TV horror state
  const [tvState, setTvState] = useState<'welcome' | 'mirrored' | 'upside_down' | 'distorted' | 'static' | 'blackout'>('welcome');
  const [isFlickering, setIsFlickering] = useState<boolean>(false);
  const [cameraZoom, setCameraZoom] = useState<number>(1.0);
  const [cameraFocusTV, setCameraFocusTV] = useState<boolean>(false);

  // Step 0: Fade-in
  useEffect(() => {
    if (!isPlaying) return;

    if (step === 0) {
      const t = setTimeout(() => {
        setFadeOpacity(0);
        setStep(1);
      }, 300);
      return () => clearTimeout(t);
    }

    if (step === 1) {
      // Boss speaks
      const handle = setTimeout(() => {
        setCurrentDialogue({
          speakerId: 'boss',
          speakerName: 'The Boss',
          speakerTitle: 'Executive Director',
          text: "Alright everyone, follow us! We'll give you a tour of the building.",
          voicePitch: 0.85
        });
      }, 0);
      return () => clearTimeout(handle);
    }

    if (step === 2) {
      // Boss gestures toward exit
      const t = setTimeout(() => {
        setStep(3);
      }, speed === 'fast' ? 700 : 1200);
      return () => clearTimeout(t);
    }

    if (step === 3) {
      // Dept heads and Boss walk briskly towards exit
      const moveInterval = setInterval(() => {
        setBossExitOffset((prev) => prev + 24);
        setDeptHeadExitOffset((prev) => prev + 20);
      }, 35);

      const t = setTimeout(() => {
        clearInterval(moveInterval);
        setStep(4);
      }, speed === 'fast' ? 1100 : 1800);

      return () => {
        clearInterval(moveInterval);
        clearTimeout(t);
      };
    }

    if (step === 4) {
      // Interns follow, and boss & dept heads continue moving completely off-screen
      const moveInterval = setInterval(() => {
        setInternExitOffset((prev) => prev + 26);
        setBossExitOffset((prev) => prev + 22);
        setDeptHeadExitOffset((prev) => prev + 20);
      }, 35);

      const t = setTimeout(() => {
        clearInterval(moveInterval);
        // Force complete off-screen offset before entering empty room step
        setBossExitOffset(2000);
        setDeptHeadExitOffset(2000);
        setInternExitOffset(2000);
        setStep(5);
      }, speed === 'fast' ? 1300 : 2200);

      return () => {
        clearInterval(moveInterval);
        clearTimeout(t);
      };
    }

    if (step === 5) {
      // Completely empty boardroom shot
      const t = setTimeout(() => {
        setStep(6);
      }, speed === 'fast' ? 1000 : 1800);
      return () => clearTimeout(t);
    }

    if (step === 6) {
      // Focus camera on TV displaying "WELCOME"
      setCameraFocusTV(true);
      setCameraZoom(1.25);
      const t = setTimeout(() => {
        setStep(7);
      }, speed === 'fast' ? 1000 : 1800);
      return () => clearTimeout(t);
    }

    if (step === 7) {
      // TV text doubled & mirrored horizontally
      setTvState('mirrored');
      playGlitchBurst(0.4);
      const t = setTimeout(() => {
        setStep(8);
      }, speed === 'fast' ? 1000 : 1600);
      return () => clearTimeout(t);
    }

    if (step === 8) {
      // Doubled with upside down mirrored WELCOME sign
      setTvState('upside_down');
      playGlitchBurst(0.6);
      const t = setTimeout(() => {
        setStep(9);
      }, speed === 'fast' ? 1200 : 2000);
      return () => clearTimeout(t);
    }

    if (step === 9) {
      // Displaying increasingly distorted doubled text & screen tearing
      setTvState('distorted');
      playGlitchBurst(0.8);
      const t = setTimeout(() => {
        setStep(10);
      }, speed === 'fast' ? 1100 : 1800);
      return () => clearTimeout(t);
    }

    if (step === 10) {
      // Room lights twitch & flicker, bursts of visual static
      setIsFlickering(true);
      setTvState('static');
      playGlitchBurst(1.2);

      const flickerCycle = setInterval(() => {
        setIsFlickering((f) => !f);
        if (Math.random() > 0.4) playGlitchBurst(0.5);
      }, 150);

      const t = setTimeout(() => {
        clearInterval(flickerCycle);
        setStep(11);
      }, speed === 'fast' ? 1400 : 2400);

      return () => {
        clearInterval(flickerCycle);
        clearTimeout(t);
      };
    }

    if (step === 11) {
      // Final sudden eerie glitch effect -> Blackout
      playGlitchBurst(1.5);
      setFadeOpacity(1);
      const t = setTimeout(() => {
        onSceneComplete();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [step, isPlaying, speed, onSceneComplete]);

  const handleDialogueComplete = useCallback(() => {
    setCurrentDialogue(null);
    setStep(2);
  }, []);

  const handleDialogueNext = useCallback(() => {
    setCurrentDialogue(null);
    setStep(2);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between">
      {/* Camera Viewport */}
      <div
        className={`w-full h-full transition-all duration-700 ease-out ${
          step >= 9 ? 'animate-tear' : ''
        }`}
        style={{
          transform: cameraFocusTV
            ? `scale(${cameraZoom}) translateY(50px)`
            : 'scale(1.0) translateY(0)'
        }}
      >
        <BoardroomEnvironment
          isCorrupted={false}
          isFlickering={isFlickering}
          tvState={tvState}
        >
          {/* Department Heads (Walking off to the right exit) - Only present before step 5 */}
          {step < 5 && deptHeadExitOffset < 1100 && (
            <div
              className="absolute top-[36%] w-full flex justify-between px-6 pointer-events-none z-10 transition-transform duration-100"
              style={{
                transform: `translateX(${deptHeadExitOffset}px)`,
                opacity: deptHeadExitOffset > 400 ? Math.max(0, 1 - (deptHeadExitOffset - 400) / 400) : 1
              }}
            >
              <div className="flex gap-4">
                {DEPARTMENT_HEADS.slice(0, 4).map((dh) => (
                  <DepartmentHeadSprite
                    key={dh.id}
                    head={dh}
                    animation={step >= 3 ? 'walking' : 'idle'}
                    direction="right"
                    scale={1.0}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                {DEPARTMENT_HEADS.slice(4, 9).map((dh) => (
                  <DepartmentHeadSprite
                    key={dh.id}
                    head={dh}
                    animation={step >= 3 ? 'walking' : 'idle'}
                    direction="right"
                    scale={1.0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* The Boss - Only present before step 5 */}
          {step < 5 && bossExitOffset < 1100 && (
            <div
              className="absolute top-[42%] left-[48%] -translate-x-1/2 z-20 pointer-events-none transition-transform duration-100"
              style={{
                transform: `translateX(${bossExitOffset}px)`,
                opacity: bossExitOffset > 350 ? Math.max(0, 1 - (bossExitOffset - 350) / 400) : 1
              }}
            >
              <BossSprite
                animation={
                  step === 1
                    ? 'talking'
                    : step === 2
                    ? 'gesture'
                    : step >= 3
                    ? 'walking'
                    : 'idle'
                }
                direction="right"
                scale={1.2}
              />
            </div>
          )}

          {/* Interns (Stand up and follow out in Step 4) - Only present before step 5 */}
          {step < 5 && internExitOffset < 1200 && (
            <div
              className="absolute top-[64%] left-1/2 -translate-x-1/2 w-[85%] max-w-4xl flex justify-between px-3 z-30 pointer-events-none transition-transform duration-100"
              style={{
                transform: `translateX(${internExitOffset}px)`,
                opacity: internExitOffset > 450 ? Math.max(0, 1 - (internExitOffset - 450) / 450) : 1
              }}
            >
              {INTERNS.map((intern, idx) => (
                <div key={intern.id} className="flex flex-col items-center">
                  <PixelSprite
                    id={intern.id}
                    animation={step >= 4 ? 'walking' : step >= 2 ? 'idle' : 'idle'}
                    direction="right"
                    scale={1.0}
                    emotion={step === 2 ? '!' : null}
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    fixedFrame={1}
                  />
                </div>
              ))}
            </div>
          )}
        </BoardroomEnvironment>
      </div>

      {/* Dialogue Overlay */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-40 pointer-events-auto">
        <DialogueBox
          dialogue={currentDialogue}
          onComplete={handleDialogueComplete}
          onNext={handleDialogueNext}
          speed={speed}
        />
      </div>

      {/* Screen Glitch overlay during horror transition */}
      {step >= 10 && (
        <div className="absolute inset-0 bg-red-900/15 pointer-events-none animate-glitch z-45" />
      )}

      {/* Screen Fade In/Out */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700 z-50"
        style={{ opacity: fadeOpacity }}
      />
    </div>
  );
};
