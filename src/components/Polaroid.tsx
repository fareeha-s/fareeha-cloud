import React from 'react';

interface PolaroidProps {
  src: string;
  caption?: string;
  width: number;
  // Seconds before the photo starts "developing"
  developDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

// A warm-paper instant photo with a handwritten caption. The image fades in
// from washed-out white the way a real polaroid develops.
const Polaroid: React.FC<PolaroidProps> = ({ src, caption, width, developDelay = 0, className = '', style }) => {
  const pad = Math.round(width * 0.06);
  return (
    <div
      className={`polaroid ${className}`}
      style={{
        width,
        padding: `${pad}px ${pad}px ${Math.round(width * 0.2)}px`,
        ...style,
      }}
    >
      <div className="polaroid__photo">
        <img
          src={src}
          alt={caption || ''}
          draggable={false}
          style={{ animationDelay: `${developDelay}s` }}
        />
      </div>
      {caption && (
        <span className="polaroid__caption" style={{ fontSize: Math.max(12, Math.round(width * 0.085)) }}>
          {caption}
        </span>
      )}
    </div>
  );
};

export default Polaroid;
