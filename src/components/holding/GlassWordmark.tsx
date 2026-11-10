/**
 * AUXILIUM in glass over the page's moving green gradient.
 *
 * The body of the letters is translucent, so the gradient behind them shows
 * through, with paler light drifting inside the glyphs as if refracted. On top
 * sit a frosted gradient, a sheen that sweeps across now and then, a bright
 * inner bevel, and a lit rim.
 */
export function GlassWordmark() {
  const word = (
    <text x="600" y="196" textAnchor="middle" className="holding-glyphs" fontSize="262">
      AUXILIUM
    </text>
  );

  return (
    <svg viewBox="0 0 1200 220" className="block h-auto w-full overflow-visible" role="img" aria-label="Auxilium">
      <defs>
        <radialGradient id="hg-blob">
          <stop offset="0%" stopColor="#d6efe5" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#8fc4b3" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#417c6c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hg-blob-soft">
          <stop offset="0%" stopColor="#fffef2" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#a9d6c7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hg-base" x1="0" y1="10" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffef2" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#fffef2" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="hg-body" x1="0" y1="10" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="hg-rim" x1="0" y1="10" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffef2" />
          <stop offset="50%" stopColor="#cfe6dc" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fffef2" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hg-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="hg-shadow" x="-5%" y="-20%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <mask id="hg-glyphs" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="220">
          <g fill="#fff">{word}</g>
        </mask>
      </defs>

      <g fill="#0b241d" opacity="0.28" transform="translate(0 14)" filter="url(#hg-shadow)">
        {word}
      </g>

      <g mask="url(#hg-glyphs)">
        <rect width="1200" height="220" fill="url(#hg-base)" />
        <ellipse className="holding-blob holding-blob-a" cx="200" cy="110" rx="300" ry="170" fill="url(#hg-blob)" />
        <ellipse className="holding-blob holding-blob-b" cx="1000" cy="120" rx="320" ry="160" fill="url(#hg-blob)" />
        <ellipse className="holding-blob holding-blob-c" cx="600" cy="90" rx="240" ry="130" fill="url(#hg-blob-soft)" />
        <rect width="1200" height="220" fill="url(#hg-body)" />
        <rect className="holding-sheen" x="-400" y="0" width="300" height="220" fill="url(#hg-sheen)" />
        <g fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="8">
          {word}
        </g>
      </g>

      <g fill="none" stroke="url(#hg-rim)" strokeWidth="2">
        {word}
      </g>
    </svg>
  );
}
