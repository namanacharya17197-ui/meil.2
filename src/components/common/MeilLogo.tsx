import React from 'react';

interface MeilLogoProps {
  className?: string;
  height?: number | string;
  showText?: boolean;
}

export const MeilLogo: React.FC<MeilLogoProps> = ({
  className = '',
  height = 36,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* MEIL Official SVG Logo matching the user's uploaded image */}
      <svg
        viewBox="0 0 420 160"
        height={height}
        className="w-auto max-h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* LEFT EMBLEM (Red with white borders and central wheel) */}
        <g id="meil-emblem">
          {/* Main Red Geometric Body */}
          <path
            d="M 12 18 
               C 12 14, 15 12, 20 12 
               L 95 12 
               C 112 12, 125 25, 125 42 
               L 125 105 
               L 100 105 
               L 100 44 
               C 100 37, 95 33, 88 33 
               L 70 33 
               L 70 82 
               L 55 58 
               L 40 82 
               L 40 33 
               L 26 33 
               L 26 105 
               L 12 105 
               Z"
            fill="#FF1801"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Bottom Left 'E' Block */}
          <path
            d="M 12 112 
               L 52 112 
               L 52 123 
               L 26 123 
               L 26 131 
               L 46 131 
               L 46 141 
               L 26 141 
               L 26 149 
               L 52 149 
               L 52 160 
               L 12 160 
               Z"
            fill="#FF1801"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Bottom Right Reversing 'E' Block */}
          <path
            d="M 125 112 
               L 85 112 
               L 85 123 
               L 111 123 
               L 111 131 
               L 91 131 
               L 91 141 
               L 111 141 
               L 111 149 
               L 85 149 
               L 85 160 
               L 125 160 
               Z"
            fill="#FF1801"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Center Wheel / Gear Hub */}
          <circle
            cx="68.5"
            cy="136"
            r="16.5"
            fill="#FF1801"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <circle
            cx="68.5"
            cy="136"
            r="6.5"
            fill="#090E17"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          {/* Circular Spokes Dots */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 68.5 + 11.5 * Math.cos(rad);
            const cy = 136 + 11.5 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="1.8"
                fill="#FFFFFF"
              />
            );
          })}
        </g>

        {/* RIGHT WORDMARK: "meil" in bright bold royal blue with crisp white outlines */}
        {showText && (
          <g id="meil-wordmark" transform="translate(150, 20)">
            {/* Letter 'm' */}
            <path
              d="M 0 42 
                 C 0 35, 6 28, 14 28 
                 C 20 28, 25 31, 28 36 
                 C 32 31, 38 28, 44 28 
                 C 54 28, 60 35, 60 46 
                 L 60 126 
                 L 43 126 
                 L 43 55 
                 C 43 48, 40 44, 34 44 
                 C 28 44, 25 48, 25 55 
                 L 25 126 
                 L 8 126 
                 L 8 55 
                 C 8 48, 5 44, 0 44 
                 Z"
              fill="#002DB3"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Letter 'e' */}
            <path
              d="M 75 76 
                 C 75 48, 92 28, 120 28 
                 C 145 28, 160 45, 160 74 
                 L 160 84 
                 L 93 84 
                 C 94 102, 104 112, 122 112 
                 C 134 112, 144 107, 150 99 
                 L 160 109 
                 C 151 121, 137 128, 119 128 
                 C 93 128, 75 106, 75 76 
                 Z 
                 M 94 69 
                 L 142 69 
                 C 141 53, 133 43, 119 43 
                 C 105 43, 96 52, 94 69 
                 Z"
              fill="#002DB3"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Letter 'i' */}
            <path
              d="M 178 30 
                 L 196 30 
                 L 196 126 
                 L 178 126 
                 Z 
                 M 178 4 
                 L 196 4 
                 L 196 20 
                 L 178 20 
                 Z"
              fill="#002DB3"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Letter 'l' (Split double column bar matching official MEIL logo) */}
            <path
              d="M 212 4 
                 L 230 4 
                 L 230 126 
                 L 212 126 
                 Z 
                 M 235 4 
                 L 253 4 
                 L 253 126 
                 L 235 126 
                 Z"
              fill="#002DB3"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
