import React from 'react';

interface BoardroomEnvironmentProps {
  isCorrupted?: boolean;
  isFlickering?: boolean;
  tvState?: 'welcome' | 'mirrored' | 'upside_down' | 'distorted' | 'static' | 'messages' | 'blackout' | 'normal';
  tvMessage?: string;
  children?: React.ReactNode;
}

export const BoardroomEnvironment: React.FC<BoardroomEnvironmentProps> = ({
  isCorrupted = false,
  isFlickering = false,
  tvState = 'normal',
  tvMessage,
  children
}) => {
  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-700 ${
        isCorrupted
          ? 'bg-[#080711]'
          : isFlickering
          ? 'bg-[#181d29]'
          : 'bg-[#1e293b]'
      }`}
    >
      {/* Wall Panel Background */}
      <div
        className="absolute top-0 left-0 right-0 h-[62%]"
        style={{
          background: isCorrupted
            ? 'linear-gradient(180deg, #090913 0%, #151026 60%, #0d091a 100%)'
            : 'linear-gradient(180deg, #334155 0%, #475569 50%, #64748B 100%)',
          boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.4)'
        }}
      >
        {/* Wall Molding Stripes */}
        <div
          className="absolute top-0 left-0 right-0 h-4 border-b-2"
          style={{ borderColor: isCorrupted ? '#3b0764' : '#94a3b8' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-3 border-t-2"
          style={{ borderColor: isCorrupted ? '#450a0a' : '#cbd5e1' }}
        />

        {/* Corporate Office Windows overlooking City Skyline (or Dark Void) */}
        <div className="absolute top-8 left-10 w-44 h-56 rounded border-4 overflow-hidden shadow-lg hidden md:block"
             style={{ borderColor: isCorrupted ? '#7f1d1d' : '#94a3b8' }}>
          {isCorrupted ? (
            /* Corrupted Dark Sky with Cyber Red Clouds */
            <div className="w-full h-full bg-[#050508] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:12px_12px] opacity-40 animate-pulse" />
              <div className="absolute bottom-0 w-full h-24 bg-red-950/40 flex items-end gap-1 px-1">
                <div className="w-6 h-18 bg-black/80" />
                <div className="w-8 h-22 bg-black/90" />
                <div className="w-7 h-14 bg-black/80" />
                <div className="w-10 h-20 bg-black/90" />
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-600/40 blur-[2px] animate-ping" />
            </div>
          ) : (
            /* Sunny Corporate City Skyline */
            <div className="w-full h-full bg-gradient-to-b from-sky-400 to-sky-100 relative overflow-hidden">
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 shadow-[0_0_12px_#fef08a]" />
              <div className="absolute bottom-0 w-full h-24 flex items-end gap-1 px-1 opacity-70">
                <div className="w-6 h-16 bg-slate-600" />
                <div className="w-8 h-22 bg-slate-700" />
                <div className="w-7 h-12 bg-slate-500" />
                <div className="w-9 h-18 bg-slate-600" />
                <div className="w-6 h-14 bg-slate-700" />
              </div>
            </div>
          )}
        </div>

        {/* Whiteboard with Sprint Notes */}
        <div
          className="absolute top-10 right-10 w-44 h-48 rounded border-4 p-2 shadow-md hidden md:block"
          style={{
            borderColor: isCorrupted ? '#581c87' : '#94a3b8',
            background: isCorrupted ? '#0f0b1e' : '#f8fafc',
            color: isCorrupted ? '#ef4444' : '#0f172a'
          }}
        >
          <div className="text-[8px] font-pixel font-bold border-b pb-1 mb-1 border-current">
            {isCorrupted ? '⚠️ CRITICAL REPO' : '📋 SPRINT 1: ONBOARDING'}
          </div>
          <div className="text-[7px] font-pixel space-y-1.5 opacity-80">
            <div>{isCorrupted ? '> FATAL_EXCEPTION' : '✓ 9 Interns Onboard'}</div>
            <div>{isCorrupted ? '> REPO_LOCKED' : '✓ Meet Dept Heads'}</div>
            <div>{isCorrupted ? '> NO_ESCAPE' : '✓ Building Tour'}</div>
            <div>{isCorrupted ? '> 100% DEADLINE' : '✓ Lunch at 12:00'}</div>
          </div>
        </div>

        {/* Center Corporate Presentation Screen (Large TV) */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-44 rounded-lg p-3 shadow-2xl flex flex-col items-center justify-center transition-all duration-300"
          style={{
            background: '#090d16',
            border: `6px solid ${isCorrupted ? '#991B1B' : '#334155'}`,
            boxShadow: isCorrupted
              ? '0 0 35px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(0,0,0,0.9)'
              : '0 0 20px rgba(56, 189, 248, 0.25), inset 0 0 15px rgba(0,0,0,0.8)'
          }}
        >
          {/* Television Screen Content */}
          <div className="w-full h-full rounded bg-black/90 flex flex-col items-center justify-center relative overflow-hidden p-2 text-center">
            {/* TV Screen Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />

            {/* Scene 1 Default: Welcome Presentation */}
            {tvState === 'normal' && (
              <div className="space-y-1">
                <div className="text-amber-400 text-[10px] font-pixel tracking-wider font-bold">
                  MAKE TECHNOLOGY
                </div>
                <div className="text-sky-300 text-xs font-pixel font-bold">
                  NEW INTERN ORIENTATION
                </div>
                <div className="text-slate-400 text-[8px] font-pixel mt-1">
                  Saatchi House • Makati
                </div>
              </div>
            )}

            {/* Scene 2 State: Welcome text transforms */}
            {tvState === 'welcome' && (
              <div className="text-sky-400 text-sm font-pixel font-bold tracking-widest animate-pulse">
                WELCOME
              </div>
            )}

            {tvState === 'mirrored' && (
              <div className="flex flex-col items-center justify-center gap-1 animate-in fade-in duration-300">
                <div className="text-sky-400 text-xs sm:text-sm font-pixel font-bold tracking-widest">
                  WELCOME
                </div>
                <div className="w-36 h-[1px] bg-cyan-500/30" />
                <div
                  className="text-amber-400 text-xs sm:text-sm font-pixel font-bold tracking-widest opacity-85"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  WELCOME
                </div>
              </div>
            )}

            {tvState === 'upside_down' && (
              <div className="flex flex-col items-center justify-center gap-1 animate-in fade-in duration-300">
                {/* Upright original WELCOME */}
                <div className="text-sky-300 text-xs sm:text-sm font-pixel font-bold tracking-widest">
                  WELCOME
                </div>
                {/* Subtle digital mirror reflection seam */}
                <div className="w-36 h-[1px] bg-red-500/50 shadow-[0_0_8px_#ef4444]" />
                {/* Doubled mirrored & upside down WELCOME */}
                <div
                  className="text-red-500 text-xs sm:text-sm font-pixel font-bold tracking-widest animate-rgb-split"
                  style={{ transform: 'scaleX(-1) rotate(180deg)' }}
                >
                  WELCOME
                </div>
              </div>
            )}

            {tvState === 'distorted' && (
              <div className="flex flex-col items-center justify-center gap-1 text-center animate-tear">
                <div className="text-red-400 text-xs font-pixel font-bold animate-rgb-split">
                  W̴E̷L̴C̶O̶M̸E̷
                </div>
                <div
                  className="text-rose-600 text-xs font-pixel font-bold animate-rgb-split"
                  style={{ transform: 'scaleX(-1) rotate(180deg)' }}
                >
                  W̴E̷L̴C̶O̶M̸E̷
                </div>
                <div className="text-red-500/80 text-[8px] font-pixel mt-0.5">
                  // S̸Y̸S̸T̸E̸M̶_̵B̵R̸E̸A̷C̸H̶ //
                </div>
              </div>
            )}

            {tvState === 'static' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-glitch">
                <div className="text-red-500 text-[10px] font-pixel font-bold">
                  ⚠️ STATIC ERROR ⚠️
                </div>
                <div className="text-[8px] font-terminal text-slate-400 mt-1">
                  DARK_REPOSITORY::INIT
                </div>
              </div>
            )}

            {tvState === 'messages' && (
              <div className="w-full h-full flex items-center justify-center p-3 animate-rgb-split">
                <p className="text-red-500 text-[11px] sm:text-xs font-pixel font-bold leading-relaxed tracking-wider text-center glow-red">
                  {tvMessage}
                </p>
              </div>
            )}

            {tvState === 'blackout' && (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              </div>
            )}
          </div>

          {/* TV Power LED */}
          <div className="mt-1 flex items-center justify-end w-full px-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isCorrupted ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          </div>
        </div>

        {/* Corporate Banner above TV */}
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-b text-[8px] font-pixel font-bold tracking-widest shadow-md"
          style={{
            background: isCorrupted ? '#450a0a' : '#0B3BD3',
            color: isCorrupted ? '#ff4fa8' : '#ffffff',
            border: `1px solid ${isCorrupted ? '#ff4fa8' : '#C9D2EE'}`
          }}
        >
          {isCorrupted ? '/// B1 · CORRUPTED REPOSITORY ///' : 'SAATCHI HOUSE • MAKE TECHNOLOGY'}
        </div>
      </div>

      {/* Carpet / Floor Area */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[38%]"
        style={{
          background: isCorrupted
            ? 'repeating-linear-gradient(45deg, #090911, #090911 20px, #120e24 20px, #120e24 40px)'
            : 'repeating-linear-gradient(45deg, #1e293b, #1e293b 20px, #26334d 20px, #26334d 40px)',
          boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.6)'
        }}
      >
        {/* Floor Cracks / Corrupted Veins */}
        {isCorrupted && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 100,10 L 250,90 L 320,160 L 450,110 L 600,180" stroke="#ef4444" strokeWidth="2" fill="none" />
              <path d="M 800,20 L 720,120 L 650,90 L 550,170" stroke="#06b6d4" strokeWidth="2" fill="none" />
            </svg>
          </div>
        )}

        {/* Corporate Conference Table */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl h-24 rounded-lg shadow-2xl flex items-center justify-around px-4 border-b-4 transition-all"
          style={{
            background: isCorrupted
              ? 'linear-gradient(180deg, #1f1a2e 0%, #100b1a 100%)'
              : 'linear-gradient(180deg, #854d0e 0%, #582a06 100%)',
            borderColor: isCorrupted ? '#7f1d1d' : '#3d1d04',
            transform: isCorrupted ? 'rotate(-0.5deg)' : 'none'
          }}
        >
          {/* Laptops on Conference Table */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div
              key={item}
              className="relative w-7 h-5 rounded-t-sm flex flex-col items-center justify-end"
              style={{
                background: isCorrupted ? '#0b0f19' : '#cbd5e1',
                boxShadow: isCorrupted
                  ? '0 0 6px rgba(239, 68, 68, 0.4)'
                  : '0 0 4px rgba(56, 189, 248, 0.4)'
              }}
            >
              <div
                className="w-5 h-3.5 rounded-t-[1px] mb-0.5"
                style={{
                  background: isCorrupted ? '#450a0a' : '#0284c7'
                }}
              />
              <div
                className="w-8 h-1 rounded-sm"
                style={{
                  background: isCorrupted ? '#1e293b' : '#64748b'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Characters & Interactive Layer inside Boardroom */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {children}
      </div>

      {/* Emergency Lighting Flicker Overlay */}
      {isFlickering && (
        <div className="absolute inset-0 bg-red-950/25 pointer-events-none animate-pulse z-20" />
      )}
    </div>
  );
};
