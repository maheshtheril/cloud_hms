import React from 'react';

interface ZionaLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | number;
    variant?: 'full' | 'icon';
    theme?: 'light' | 'dark';
    colorScheme?: 'signature' | 'indigo' | 'sunset' | 'emerald' | 'ocean' | 'royal' | 'monochrome';
    speed?: 'slow' | 'normal' | 'fast';
}

const colorPresets = {
    signature: ['#06b6d4', '#3b82f6', '#8b5cf6', '#db2777', '#10b981', '#059669'], // Multi-industry spectrum
    indigo: ['#6366f1', '#4f46e5', '#a855f7', '#9333ea', '#06b6d4', '#0891b2'],
    sunset: ['#f59e0b', '#d97706', '#ef4444', '#dc2626', '#ec4899', '#db2777'],
    emerald: ['#10b981', '#059669', '#22c55e', '#16a34a', '#84cc16', '#65a30d'],
    ocean: ['#0ea5e9', '#0284c7', '#3b82f6', '#2563eb', '#6366f1', '#4f46e5'],
    royal: ['#8b5cf6', '#7c3aed', '#6366f1', '#4f46e5', '#db2777', '#c026d3'],
    monochrome: ['#64748b', '#475569', '#94a3b8', '#64748b', '#cbd5e1', '#94a3b8'],
};

export const ZionaLogo: React.FC<ZionaLogoProps> = ({
    className = '',
    size = 'md',
    variant = 'full',
    theme = 'light',
    colorScheme = 'signature',
    speed = 'slow'
}) => {
    const sizeMap = {
        sm: 24,
        md: 40,
        lg: 64,
        xl: 120,
    };

    const speedMap = {
        slow: '6s',
        normal: '3s',
        fast: '1.5s',
    };

    const colors = colorPresets[colorScheme] || colorPresets.signature;
    const finalSize = typeof size === 'number' ? size : sizeMap[size];
    const duration = speed === 'fast' ? '1.5s' : speed === 'slow' ? '4s' : '2.5s';
    const textColor = theme === 'light' ? '#0f172a' : '#ffffff';

    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ height: finalSize }}>
            <svg
                width={finalSize}
                height={finalSize}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
            >
                <defs>
                    <linearGradient id={`${colorScheme}-shaper-1`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors[0]} />
                        <stop offset="100%" stopColor={colors[1]} />
                    </linearGradient>
                    <linearGradient id={`${colorScheme}-shaper-2`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors[2]} />
                        <stop offset="100%" stopColor={colors[3]} />
                    </linearGradient>
                    <linearGradient id={`${colorScheme}-shaper-3`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors[4]} />
                        <stop offset="100%" stopColor={colors[5]} />
                    </linearGradient>

                    <filter id="glass-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <clipPath id="z-mask">
                        <path d="M20 25H80L40 75H80" />
                    </clipPath>
                </defs>

                {/* Crystalline Shards forming a 'Z' */}
                <g filter="url(#glass-glow)">
                    {/* Top Plate */}
                    <path d="M20 25C20 22.2386 22.2386 20 25 20H75C77.7614 20 80 22.2386 80 25V28C80 30.7614 77.7614 33 75 33H35L20 25Z" fill={`url(#${colorScheme}-shaper-1)`} opacity="0.9">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0,0; 0,-4; 0,0"
                            dur={duration}
                            repeatCount="indefinite"
                        />
                    </path>

                    {/* Diagonal Bridge (Multi-segmented for depth) */}
                    <path d="M78 28L35 78C33.5 79.5 31 79.5 29.5 78L22 72L65 22L78 28Z" fill={`url(#${colorScheme}-shaper-2)`} opacity="0.8">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0,0; 2,-2; 0,0"
                            dur={duration}
                            repeatCount="indefinite"
                            begin="0.5s"
                        />
                    </path>

                    {/* Bottom Plate */}
                    <path d="M25 67H65L80 75V78C80 80.7614 77.7614 83 75 83H25C22.2386 83 20 80.7614 20 78V75C20 72.2386 22.2386 70 25 70L25 67Z" fill={`url(#${colorScheme}-shaper-3)`} opacity="0.9">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0,0; 0,4; 0,0"
                            dur={duration}
                            repeatCount="indefinite"
                            begin="1s"
                        />
                    </path>
                </g>

                {/* Ambient Orbitals */}
                <circle cx="15" cy="45" r="3" fill={colors[0]}>
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="translate" values="0,0; -5,10; 0,0" dur="8s" repeatCount="indefinite" />
                </circle>

                <circle cx="85" cy="55" r="2" fill={colors[4]}>
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="translate" values="0,0; 5,-10; 0,0" dur="10s" repeatCount="indefinite" />
                </circle>

                <path d="M50 45L55 50L50 55L45 50L50 45Z" fill="white" opacity="0.4">
                    <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="15s" repeatCount="indefinite" />
                </path>
            </svg>

            {variant === 'full' && (
                <div className="flex flex-col justify-center leading-none">
                    <span
                        style={{
                            fontSize: finalSize * 0.55,
                            fontWeight: '900',
                            letterSpacing: '-0.04em',
                            color: textColor,
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                        className="tracking-tighter uppercase"
                    >
                        Ziona
                    </span>
                    <span
                        className="text-[0.25em] font-mono tracking-[0.4em] opacity-40 uppercase font-black"
                        style={{ color: colors[1], fontSize: finalSize * 0.15 }}
                    >
                        Antigravity ERP
                    </span>
                </div>
            )}
        </div>
    );
};
