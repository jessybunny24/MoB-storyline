import React, { useEffect, useState } from 'react';

interface BossSpriteProps {
  animation?: 'idle' | 'talking' | 'gesture' | 'walking' | 'corrupted' | 'silhouette';
  direction?: 'left' | 'right' | 'front';
  scale?: number;
  mode?: 'full' | 'bust';
  className?: string;
  style?: React.CSSProperties;
}

export const BossSprite: React.FC<BossSpriteProps> = ({
  animation = 'idle',
  direction = 'front',
  scale = 1.15,
  mode = 'full',
  className = '',
  style = {}
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const isCorrupted = animation === 'corrupted' || animation === 'silhouette';
  const isTalking = animation === 'talking';
  const isWalking = animation === 'walking';
  const isGesture = animation === 'gesture';

  // In the source sprite, the boss naturally faces slightly to his right (viewer's left).
  // When direction is 'right', flip horizontally with scaleX(-1).
  const flip = direction === 'right' ? 'scaleX(-1)' : 'scaleX(1)';

  // Talking mouth toggle: alternates between mouth-open and mouth-closed
  const isMouthOpen = step % 2 === 0;

  // Motion bobbing
  let motionTransform = '';
  if (isTalking) {
    motionTransform = isMouthOpen ? 'translateY(-2px)' : 'translateY(0px)';
  } else if (isWalking) {
    motionTransform = step % 2 === 0 ? 'translateY(-4px)' : 'translateY(0px)';
  } else if (isGesture) {
    motionTransform = 'scale(1.04) translateY(-2px)';
  } else if (step === 0) {
    motionTransform = 'translateY(-1px)';
  }

  // Dimensions based on mode
  const width = mode === 'bust' ? 76 * scale : 88 * scale;
  const height = mode === 'bust' ? 76 * scale : 108 * scale;

  // Determine active sprite source
  let spriteSrc = '';
  if (mode === 'bust') {
    if (isTalking || isGesture) {
      spriteSrc = isMouthOpen
        ? '/sprites/BossTalkOpen_bust.png'
        : '/sprites/BossTalkClosed_bust.png';
    } else {
      spriteSrc = '/sprites/BossBust.png';
    }
  } else {
    if (isTalking || isGesture) {
      spriteSrc = isMouthOpen
        ? '/sprites/BossTalkOpen.png'
        : '/sprites/BossTalkClosed.png';
    } else {
      spriteSrc = '/sprites/BossGoodFrame1.png';
    }
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{
        width,
        height,
        ...style
      }}
    >
      {/* Glitch / Ominous Aura in Corrupted state */}
      {isCorrupted && (
        <div className="absolute inset-0 rounded-full bg-red-600/35 blur-xl animate-pulse pointer-events-none scale-125" />
      )}

      {/* Main Good Boss (High-Detail 16-Bit Pixel Art Animated Sprite) */}
      {!isCorrupted ? (
        <div
          className="w-full h-full relative flex items-center justify-center"
          style={{
            transform: `${flip} ${motionTransform}`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img
            src={spriteSrc}
            alt="Executive Director Boss"
            className="w-full h-full object-contain pixel-art drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            loading="eager"
          />
        </div>
      ) : (
        /* Corrupted Dark Repository Cyber Entity Boss */
        <div
          className="w-full h-full relative flex flex-col items-center"
          style={{
            transform: `${flip} ${motionTransform}`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <svg
            viewBox="0 0 50 64"
            className="w-full h-full pixel-art animate-glitch"
            style={{ shapeRendering: 'crispEdges' }}
          >
            {/* Dark Digital Void Aura Shadow */}
            <rect x="8" y="4" width="34" height="54" fill="#030206" opacity="0.9" />

            {/* Corrupted Silhouette Body with Broken Pixel Edges */}
            <rect x="13" y="6" width="24" height="20" fill="#08060f" />
            <rect x="11" y="24" width="28" height="24" fill="#05030a" />

            {/* Glitch artifacts & horizontal scan lines */}
            <rect x="6" y="14" width="38" height="1" fill="#ef4444" opacity="0.7" className="animate-pulse" />
            <rect x="10" y="28" width="32" height="1" fill="#06b6d4" opacity="0.6" />
            <rect x="4" y="42" width="42" height="1" fill="#ef4444" opacity="0.5" className="animate-pulse" />

            {/* Glowing Crimson and Cyan Cyber Ocular Implants */}
            {/* Left Eye - Menacing Crimson Red */}
            <rect x="17" y="16" width="5" height="3" fill="#ef4444" className="animate-pulse shadow-[0_0_10px_#ef4444]" />
            <rect x="18" y="17" width="2" height="1" fill="#ffffff" />

            {/* Right Eye - Ominous Electric Cyan */}
            <rect x="28" y="16" width="5" height="3" fill="#06b6d4" className="animate-pulse shadow-[0_0_10px_#06b6d4]" />
            <rect x="29" y="17" width="2" height="1" fill="#ffffff" />

            {/* Digital Veins branching across suit */}
            <rect x="24" y="26" width="2" height="14" fill="#ef4444" opacity="0.8" />
            <rect x="19" y="32" width="12" height="2" fill="#dc2626" opacity="0.7" />
            <rect x="16" y="38" width="18" height="1" fill="#06b6d4" opacity="0.7" />
            <rect x="21" y="44" width="8" height="2" fill="#ef4444" opacity="0.6" />

            {/* Glitching Void Suit Lapels */}
            <polygon points="15,26 21,26 19,38 16,38" fill="#150a1e" />
            <polygon points="35,26 29,26 31,38 34,38" fill="#150a1e" />

            {/* Corrupted Legs */}
            <rect x="17" y="48" width="6" height="12" fill="#050308" />
            <rect x="27" y="48" width="6" height="12" fill="#050308" />
            <rect x="15" y="60" width="8" height="3" fill="#000000" />
            <rect x="27" y="60" width="8" height="3" fill="#000000" />
          </svg>
        </div>
      )}

      {/* Ground Shadow */}
      {mode === 'full' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-black/50 blur-[1px] pointer-events-none" />
      )}
    </div>
  );
};
