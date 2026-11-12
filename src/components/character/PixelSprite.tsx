import React, { useEffect, useState } from 'react';
import { INTERNS } from '../../data/characters';
import type { InternId } from '../../types/cutscene';

interface PixelSpriteProps {
  id: InternId;
  animation?: 'idle' | 'walking' | 'talking' | 'clapping' | 'working' | 'scared' | 'struggling' | 'hero' | 'none';
  direction?: 'left' | 'right' | 'front';
  scale?: number;
  showGlow?: boolean;
  emotion?: '!' | '?' | 'sweat' | 'dots' | 'smile' | 'panic' | null;
  className?: string;
  style?: React.CSSProperties;
  fixedFrame?: number;
}

export const PixelSprite: React.FC<PixelSpriteProps> = ({
  id,
  animation = 'idle',
  direction = 'front',
  scale = 1,
  showGlow = false,
  emotion = null,
  className = '',
  style = {},
  fixedFrame
}) => {
  const intern = INTERNS.find((item) => item.id === id) || INTERNS[0];
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    if (fixedFrame !== undefined) {
      const handle = setTimeout(() => setFrame(fixedFrame), 0);
      return () => clearTimeout(handle);
    }

    if (animation === 'none') {
      const handle = setTimeout(() => setFrame(1), 0);
      return () => clearTimeout(handle);
    }

    let intervalMs = 250;
    if (animation === 'walking') intervalMs = 180;
    if (animation === 'talking') intervalMs = 200;
    if (animation === 'clapping') intervalMs = 150;
    if (animation === 'working') intervalMs = 220;
    if (animation === 'scared' || animation === 'struggling') intervalMs = 120;

    const interval = setInterval(() => {
      setFrame((prev) => (prev % 4) + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [animation, fixedFrame]);

  // Motion transform based on animation state
  let motionTransform = '';
  if (animation === 'talking') {
    motionTransform = frame % 2 === 0 ? 'translateY(-2px)' : 'translateY(0px)';
  } else if (animation === 'clapping') {
    motionTransform = frame % 2 === 0 ? 'scale(1.05) translateY(-3px)' : 'scale(1) translateY(0px)';
  } else if (animation === 'scared') {
    motionTransform = frame % 2 === 0 ? 'translate(-2px, -3px) rotate(-2deg)' : 'translate(2px, 0px) rotate(2deg)';
  } else if (animation === 'struggling') {
    motionTransform = frame % 2 === 0 ? 'translateX(-4px) scale(0.95)' : 'translateX(4px) scale(1.02)';
  } else if (animation === 'walking') {
    motionTransform = frame % 2 === 0 ? 'translateY(-4px)' : 'translateY(0px)';
  } else if (animation === 'hero') {
    motionTransform = 'scale(1.08) translateY(-2px)';
  }

  const flipStyle = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{
        width: 78 * scale,
        height: 88 * scale,
        ...style
      }}
    >
      {/* Emotion Bubble */}
      {emotion && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-sm text-xs font-pixel font-bold shadow-md animate-bounce"
          style={{
            backgroundColor: emotion === '!' || emotion === 'panic' ? '#EF4444' : emotion === '?' ? '#F59E0B' : '#38BDF8',
            color: '#FFFFFF',
            border: '2px solid #000000',
            fontSize: '10px'
          }}
        >
          {emotion === 'panic' ? '!!' : emotion}
        </div>
      )}

      {/* Hero / Glowing Aura */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-70 animate-pulse pointer-events-none"
          style={{
            backgroundColor: intern.color,
            transform: 'scale(1.2)'
          }}
        />
      )}

      {/* Sprite Image */}
      <div
        className="w-full h-full relative"
        style={{
          transform: `${flipStyle} ${motionTransform}`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <img
          src={`/sprites/${intern.prefix}${fixedFrame !== undefined ? fixedFrame : frame}.png`}
          alt={intern.name}
          className="w-full h-full object-contain pixel-art"
          loading="eager"
        />
      </div>

      {/* Shadow */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-black/40 blur-[1px] pointer-events-none"
      />
    </div>
  );
};
