import React, { useEffect, useState, useCallback } from 'react';
import { BoardroomEnvironment } from './BoardroomEnvironment';
import { PixelSprite } from '../character/PixelSprite';
import { DepartmentHeadSprite } from '../character/DepartmentHeadSprite';
import { BossSprite } from '../character/BossSprite';
import { DialogueBox } from '../ui/DialogueBox';
import { INTERNS, DEPARTMENT_HEADS } from '../../data/characters';
import type { DialogueLine } from '../../types/cutscene';
import { playApplause, startCorporateMusic } from '../../utils/audio';

interface Scene1Props {
  isPlaying: boolean;
  onSceneComplete: () => void;
  speed?: 'normal' | 'fast';
}

export const Scene1Onboarding: React.FC<Scene1Props> = ({
  isPlaying,
  onSceneComplete,
  speed = 'normal'
}) => {
  // Timeline phases:
  // 0: Fade-in from black
  // 1: Wide shot -> camera moves toward conference table
  // 2: Boss speaks welcome dialogue
  // 3: Interns & Department Heads clap and celebrate
  // 4: Fade to black / complete
  const [phase, setPhase] = useState<number>(0);
  const [cameraZoom, setCameraZoom] = useState<number>(0.92);
  const [cameraY, setCameraY] = useState<number>(0);
  const [fadeOpacity, setFadeOpacity] = useState<number>(1);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);

  useEffect(() => {
    startCorporateMusic();
  }, []);

  // Step 0: Fade-in from black
  useEffect(() => {
    if (!isPlaying) return;

    if (phase === 0) {
      const timer = setTimeout(() => {
        setFadeOpacity(0);
        // Move to camera approach
        setPhase(1);
      }, 350);
      return () => clearTimeout(timer);
    }

    if (phase === 1) {
      // Zoom camera smoothly toward conference table
      const zoomInterval = setInterval(() => {
        setCameraZoom((prev) => {
          if (prev >= 1.05) {
            clearInterval(zoomInterval);
            setPhase(2);
            return 1.05;
          }
          return prev + 0.015;
        });
        setCameraY((prev) => (prev > -20 ? prev - 2 : -20));
      }, 50);
      return () => clearInterval(zoomInterval);
    }

    if (phase === 2) {
      // Set the exact Boss dialogue
      const handle = setTimeout(() => {
        setCurrentDialogue({
          speakerId: 'boss',
          speakerName: 'The Boss',
          speakerTitle: 'Executive Director',
          text: 'Welcome to make technology interns. Where we make thoughtful technology. We are so excited to have you all onboard.',
          voicePitch: 0.85
        });
      }, 0);
      return () => clearTimeout(handle);
    }

    if (phase === 3) {
      // Play celebratory applause
      playApplause();
      const clapTimer = setTimeout(() => {
        setPhase(4);
      }, speed === 'fast' ? 2200 : 3800);
      return () => clearTimeout(clapTimer);
    }

    if (phase === 4) {
      // Fade out
      setFadeOpacity(1);
      const exitTimer = setTimeout(() => {
        onSceneComplete();
      }, 700);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, isPlaying, speed, onSceneComplete]);

  const handleDialogueComplete = useCallback(() => {
    setCurrentDialogue(null);
    setPhase(3);
  }, []);

  const handleDialogueNext = useCallback(() => {
    setCurrentDialogue(null);
    setPhase(3);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between">
      {/* Dynamic Camera Container */}
      <div
        className="w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: `scale(${cameraZoom}) translateY(${cameraY}px)`
        }}
      >
        <BoardroomEnvironment tvState="normal">
          {/* Department Heads standing at sides and back */}
          <div className="absolute top-[36%] w-full flex justify-between px-6 pointer-events-none z-10">
            {/* Left 4 Department Heads */}
            <div className="flex gap-4">
              {DEPARTMENT_HEADS.slice(0, 4).map((dh, idx) => (
                <DepartmentHeadSprite
                  key={dh.id}
                  head={dh}
                  animation={phase === 3 ? 'clapping' : 'idle'}
                  direction="right"
                  scale={1.0}
                  emotion={phase === 3 ? '👏' : null}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                />
              ))}
            </div>

            {/* Right 5 Department Heads */}
            <div className="flex gap-4">
              {DEPARTMENT_HEADS.slice(4, 9).map((dh, idx) => (
                <DepartmentHeadSprite
                  key={dh.id}
                  head={dh}
                  animation={phase === 3 ? 'clapping' : 'idle'}
                  direction="left"
                  scale={1.0}
                  emotion={phase === 3 ? '👏' : null}
                  style={{ animationDelay: `${(idx + 4) * 0.12}s` }}
                />
              ))}
            </div>
          </div>

          {/* The Boss standing at head of the conference room (center-left) */}
          <div className="absolute top-[42%] left-[48%] -translate-x-1/2 z-20 pointer-events-none">
            <BossSprite
              animation={phase === 2 ? 'talking' : phase === 3 ? 'idle' : 'idle'}
              scale={1.2}
            />
          </div>

          {/* All 9 Interns seated along the conference table */}
          <div className="absolute top-[64%] left-1/2 -translate-x-1/2 w-[85%] max-w-4xl flex justify-between px-3 z-30 pointer-events-none">
            {INTERNS.map((intern, idx) => {
              // Interns look toward boss in phase 2, clap and smile in phase 3
              const direction = idx < 4 ? 'right' : 'left';
              const anim =
                phase === 3
                  ? 'clapping'
                  : phase === 2
                  ? (idx % 3 === 0 ? 'talking' : 'idle')
                  : 'idle';

              return (
                <div key={intern.id} className="flex flex-col items-center">
                  <PixelSprite
                    id={intern.id}
                    animation={anim}
                    direction={direction}
                    scale={1.0}
                    emotion={phase === 3 ? 'smile' : null}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    fixedFrame={1}
                  />
                  <span
                    className="text-[8px] font-pixel px-1 rounded mt-0.5"
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
        </BoardroomEnvironment>
      </div>

      {/* Overlay Dialogue Box */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-40 pointer-events-auto">
        <DialogueBox
          dialogue={currentDialogue}
          onComplete={handleDialogueComplete}
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
