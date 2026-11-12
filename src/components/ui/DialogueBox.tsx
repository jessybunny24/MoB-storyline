import React, { useEffect, useState, useRef } from 'react';
import type { DialogueLine, InternId } from '../../types/cutscene';
import { PixelSprite } from '../character/PixelSprite';
import { BossSprite } from '../character/BossSprite';
import { DepartmentHeadSprite } from '../character/DepartmentHeadSprite';
import { INTERNS, DEPARTMENT_HEADS } from '../../data/characters';
import { playTypewriterTick, playSpeechBlip } from '../../utils/audio';

interface DialogueBoxProps {
  dialogue: DialogueLine | null;
  onComplete?: () => void;
  onNext?: () => void;
  speed?: 'normal' | 'fast';
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onComplete,
  onNext,
  speed = 'normal'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Store callbacks in refs so changes to parent callbacks don't cancel/restart the typewriter effect
  const onCompleteRef = useRef(onComplete);
  const onNextRef = useRef(onNext);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const hasDialogue = Boolean(dialogue);
  const dialogueText = dialogue?.text ?? '';
  const speakerId = dialogue?.speakerId ?? '';
  const voicePitch = dialogue?.voicePitch;

  useEffect(() => {
    // Clear any active timers
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current);
      typeTimerRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (!hasDialogue || !dialogueText) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const stepMs = speed === 'fast' ? 18 : 34;

    typeTimerRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(dialogueText.slice(0, charIndex));

      if (charIndex % 2 === 0) {
        if (voicePitch) {
          playSpeechBlip(voicePitch);
        } else {
          playTypewriterTick();
        }
      }

      if (charIndex >= dialogueText.length) {
        if (typeTimerRef.current) {
          clearInterval(typeTimerRef.current);
          typeTimerRef.current = null;
        }
        setIsTyping(false);

        const readingDelay = speed === 'fast' ? 1400 : Math.max(2200, Math.min(4000, dialogueText.length * 55));
        autoAdvanceTimerRef.current = setTimeout(() => {
          onCompleteRef.current?.();
        }, readingDelay);
      }
    }, stepMs);

    return () => {
      if (typeTimerRef.current) {
        clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
      }
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [hasDialogue, dialogueText, speakerId, speed, voicePitch]);

  if (!dialogue) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTyping) {
      // Instantly reveal complete line on click
      if (typeTimerRef.current) {
        clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
      }
      setDisplayedText(dialogueText);
      setIsTyping(false);

      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      const readingDelay = speed === 'fast' ? 1200 : Math.max(1800, Math.min(3200, dialogueText.length * 45));
      autoAdvanceTimerRef.current = setTimeout(() => {
        onCompleteRef.current?.();
      }, readingDelay);
    } else {
      // Advance to next dialogue or phase
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
      onNextRef.current?.();
    }
  };

  const intern = INTERNS.find((i) => i.id === dialogue.speakerId);
  const deptHead = DEPARTMENT_HEADS.find((dh) => dh.id === dialogue.speakerId);
  const isBoss = dialogue.speakerId === 'boss';
  const isTV = dialogue.speakerId === 'tv';

  const themeColor = intern?.color || deptHead?.color || (isBoss ? '#0B3BD3' : isTV ? '#FF4FA8' : '#FCD34D');
  const isDarkRepo = dialogue.isGlitchy || isTV;

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transition-all duration-200 select-none group"
      style={{
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '14px 18px 12px 18px',
        background: isDarkRepo
          ? 'linear-gradient(180deg, rgba(21, 26, 38, 0.98) 0%, rgba(13, 15, 23, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(14, 20, 36, 0.97) 0%, rgba(8, 11, 20, 0.98) 100%)',
        border: `2px solid ${isDarkRepo ? '#FF4FA8' : '#0B3BD3'}`,
        boxShadow: isDarkRepo
          ? '0 0 24px rgba(255,79,168,0.25), inset 0 0 16px rgba(0,0,0,0.9)'
          : '0 0 24px rgba(11,59,211,0.25), inset 0 0 16px rgba(0,0,0,0.9)',
        borderRadius: '6px',
        position: 'relative'
      }}
    >
      {/* Corner Saatchi Rivets */}
      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-400/60 shadow-[inset_0_0_1px_#fff]" />
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-400/60 shadow-[inset_0_0_1px_#fff]" />
      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-400/60 shadow-[inset_0_0_1px_#fff]" />
      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-400/60 shadow-[inset_0_0_1px_#fff]" />

      {/* Top Header Row: Saatchi Staff Badge Nameplate + Clearance */}
      <div className="flex items-center justify-between -mt-6 mb-2 px-1">
        {/* Speaker Nameplate */}
        <div
          className="flex items-center gap-2 px-3 py-1 text-xs font-pixel font-bold uppercase tracking-wider"
          style={{
            background: isDarkRepo ? '#151A26' : '#0B1022',
            color: isDarkRepo ? '#FF4FA8' : '#6E8BFF',
            border: `2px solid ${isDarkRepo ? '#FF4FA8' : '#0B3BD3'}`,
            boxShadow: '0 3px 8px rgba(0,0,0,0.8)',
            borderRadius: '4px'
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: isDarkRepo ? '#FF4FA8' : '#6E8BFF' }}
          />
          <span>{dialogue.speakerName}</span>
          {dialogue.speakerTitle && (
            <span className="text-[9px] text-slate-300 font-normal opacity-90 border-l border-slate-700 pl-2">
              {dialogue.speakerTitle}
            </span>
          )}
        </div>

        {/* Saatchi Staff Clearance Pill */}
        <div className="hidden sm:flex items-center gap-2 text-[8px] font-pixel bg-black/80 px-2.5 py-0.5 rounded border border-slate-700">
          <span className="text-amber-400 font-bold">SAATCHI HOUSE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">STAFF KEYCARD · A-M7</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-1">
        {/* Speaker Avatar Viewfinder Box */}
        <div
          className="flex-shrink-0 w-[78px] h-[78px] rounded border-2 flex items-center justify-center overflow-hidden bg-slate-950/90 relative shadow-inner"
          style={{ borderColor: themeColor }}
        >
          {/* Blueprint Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #6E8BFF 1px, transparent 1px), linear-gradient(to bottom, #6E8BFF 1px, transparent 1px)',
              backgroundSize: '8px 8px'
            }}
          />

          {/* Viewfinder Corner Brackets */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/60 pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/60 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/60 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/60 pointer-events-none" />

          {/* Avatar Sprite */}
          {intern && (
            <PixelSprite
              id={intern.id as InternId}
              animation={isTyping ? 'talking' : 'idle'}
              scale={0.82}
              fixedFrame={1}
            />
          )}
          {deptHead && (
            <DepartmentHeadSprite
              head={deptHead}
              animation={isTyping ? 'talking' : 'idle'}
              scale={0.9}
              mode="bust"
            />
          )}
          {isBoss && (
            <BossSprite
              animation={dialogue.isGlitchy ? 'corrupted' : isTyping ? 'talking' : 'idle'}
              scale={0.9}
              mode="bust"
            />
          )}
          {isTV && (
            <div className="text-3xl animate-pulse">📺</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-h-[58px] flex flex-col justify-center">
          <p
            className={`font-pixel text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-100 ${
              dialogue.isGlitchy ? 'animate-rgb-split' : ''
            }`}
            style={{
              textShadow: '1px 1px 0 #000, 2px 2px 2px rgba(0,0,0,0.9)'
            }}
          >
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-3.5 bg-amber-400 ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* Audio Waveform + Saatchi Advance Prompt */}
        <div className="flex-shrink-0 flex flex-col items-center justify-between h-[64px] pl-2 border-l border-slate-800/80">
          <div className="flex items-end gap-1 h-5 mb-auto">
            {isTyping ? (
              <>
                <div className={`w-1 rounded-sm eq-bar-1 ${isDarkRepo ? 'bg-[#ff4fa8]' : 'bg-[#6e8bff]'}`} />
                <div className={`w-1 rounded-sm eq-bar-2 ${isDarkRepo ? 'bg-[#ff4fa8]' : 'bg-[#6e8bff]'}`} />
                <div className={`w-1 rounded-sm eq-bar-3 ${isDarkRepo ? 'bg-[#ff4fa8]' : 'bg-[#6e8bff]'}`} />
                <div className={`w-1 rounded-sm eq-bar-4 ${isDarkRepo ? 'bg-[#ff4fa8]' : 'bg-[#6e8bff]'}`} />
              </>
            ) : (
              <>
                <div className="w-1 h-1.5 rounded-sm bg-slate-600" />
                <div className="w-1 h-1.5 rounded-sm bg-slate-600" />
                <div className="w-1 h-1.5 rounded-sm bg-slate-600" />
                <div className="w-1 h-1.5 rounded-sm bg-slate-600" />
              </>
            )}
          </div>

          <div className="mt-auto">
            {!isTyping ? (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border shadow-md animate-bounce ${
                  isDarkRepo
                    ? 'bg-[#ff4fa8] text-white border-white'
                    : 'bg-[#0b3bd3] text-white border-[#c9d2ee]'
                }`}
                title="Click or press Space to proceed"
              >
                <span className="text-[8px] font-pixel font-bold hidden sm:inline">
                  NEXT
                </span>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white" />
              </div>
            ) : (
              <span className="text-[7.5px] font-pixel text-slate-500 uppercase tracking-tighter">
                SKIP
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
