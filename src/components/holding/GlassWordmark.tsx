/**
 * AUXILIUM in glass on a white page, with gold light moving inside the letters.
 *
 * The gold lives only within the glyphs; nothing moves behind them. The letters
 * are built in layers: a pale warm body, the drifting gold, a frosted gradient,
 * a sheen that sweeps across now and then, a bright inner bevel, and a lit rim.
 * A faint static shadow under the word gives the glass some weight on white.
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
          <stop offset="0%" stopColor="#efb73e" />
          <stop offset="45%" stopColor="#c98f27" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a8761f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hg-blob-soft">
          <stop offset="0%" stopColor="#ffe09a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d9a845" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hg-base" x1="0" y1="10" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#efe6d2" />
          <stop offset="100%" stopColor="#c9b48a" />
        </linearGradient>
        <linearGradient id="hg-body" x1="0" y1="10" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="hg-rim" x1="0" y1="10" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b3a17a" />
          <stop offset="50%" stopColor="#9a7430" />
          <stop offset="100%" stopColor="#6e5a32" />
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

      <g fill="#5b4a2a" opacity="0.18" transform="translate(0 14)" filter="url(#hg-shadow)">
        {word}
      </g>

      <g mask="url(#hg-glyphs)">
        <rect width="1200" height="220" fill="url(#hg-base)" />
        <ellipse className="holding-blob holding-blob-a" cx="200" cy="110" rx="300" ry="170" fill="url(#hg-blob)" />
        <ellipse className="holding-blob holding-blob-b" cx="1000" cy="120" rx="320" ry="160" fill="url(#hg-blob)" />
        <ellipse className="holding-blob holding-blob-c" cx="600" cy="90" rx="240" ry="130" fill="url(#hg-blob-soft)" />
        <rect width="1200" height="220" fill="url(#hg-body)" />
        <rect className="holding-sheen" x="-400" y="0" width="300" height="220" fill="url(#hg-sheen)" />
        <g fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="8">
          {word}
        </g>
      </g>

      <g fill="none" stroke="url(#hg-rim)" strokeWidth="2.4">
        {word}
      </g>
    </svg>
  );
}
