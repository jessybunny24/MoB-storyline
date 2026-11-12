import React, { useEffect, useState } from 'react';
import type { DeptHeadInfo } from '../../types/cutscene';

interface DeptHeadSpriteProps {
  head: DeptHeadInfo;
  animation?: 'idle' | 'walking' | 'talking' | 'clapping' | 'standing';
  direction?: 'left' | 'right' | 'front';
  scale?: number;
  mode?: 'full' | 'bust';
  emotion?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export const DepartmentHeadSprite: React.FC<DeptHeadSpriteProps> = ({
  head,
  animation = 'idle',
  direction = 'front',
  scale = 1,
  mode = 'full',
  emotion = null,
  className = '',
  style = {}
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 220);
    return () => clearInterval(interval);
  }, []);

  // When direction is 'right', flip horizontally with scaleX(-1) so they look towards the right
  const flip = direction === 'right' ? 'scaleX(-1)' : 'scaleX(1)';

  // Motion bobbing based on animation state
  let motionTransform = '';
  if (animation === 'talking') {
    motionTransform = step % 2 === 0 ? 'translateY(-2px)' : 'translateY(0px)';
  } else if (animation === 'clapping') {
    motionTransform = step % 2 === 0 ? 'scale(1.04) translateY(-2px)' : 'scale(1) translateY(0px)';
  } else if (animation === 'walking') {
    motionTransform = step % 2 === 0 ? 'translateY(-3px)' : 'translateY(0px)';
  } else if (step === 0) {
    motionTransform = 'translateY(-1px)';
  }

  // Dimensions based on mode
  const width = mode === 'bust' ? 74 * scale : 72 * scale;
  const height = mode === 'bust' ? 74 * scale : 104 * scale;

  const spriteSrc = mode === 'bust'
    ? `/sprites/${head.id}_bust.png`
    : `/sprites/${head.id}.png`;

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{
        width,
        height,
        ...style
      }}
    >
      {/* Floating Emotion Badge */}
      {emotion && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 rounded-sm bg-slate-900/90 border border-amber-400 text-xs shadow-md animate-bounce"
        >
          {emotion}
        </div>
      )}

      {/* High-Fidelity 16-Bit Pixel Art Department Head Sprite */}
      <div
        className="w-full h-full relative flex items-center justify-center"
        style={{
          transform: `${flip} ${motionTransform}`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <img
          src={spriteSrc}
          alt={head.name}
          className="w-full h-full object-contain pixel-art drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          loading="eager"
        />
      </div>

      {/* Ground Shadow */}
      {mode === 'full' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-black/50 blur-[1px] pointer-events-none" />
      )}
    </div>
  );
};
