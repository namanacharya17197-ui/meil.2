import React from 'react';
import meilLogoImg from '../../assets/meil-logo.png';
import meilEmblemImg from '../../assets/meil-emblem.png';

interface MeilLogoProps {
  className?: string;
  height?: number | string;
  showText?: boolean;
}

export const MeilLogo: React.FC<MeilLogoProps> = ({
  className = '',
  height = 28,
  showText = true,
}) => {
  const imgSrc = showText ? meilLogoImg : meilEmblemImg;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={imgSrc}
        alt="MEIL Official Brand Logo"
        className="w-auto max-h-full object-contain shrink-0"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        draggable={false}
      />
    </div>
  );
};
