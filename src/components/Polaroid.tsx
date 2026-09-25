import React from 'react';

interface PolaroidProps {
  src: string;
  alt?: string;
  width: number;
  // Seconds before the photo starts "developing"
  developDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

// A clean instant photo: softly rounded corners, a slightly wide print and the
// classic deeper bottom border. The image fades in from washed-out white the
// way a real one develops.
const Polaroid: React.FC<PolaroidProps> = ({ src, alt = '', width, developDelay = 0, className = '', style }) => {
  const pad = Math.round(width * 0.034);
  return (
    <div
      className={`polaroid ${className}`}
      style={{
        width,
        padding: `${pad}px ${pad}px ${Math.round(width * 0.16)}px`,
        borderRadius: Math.round(width * 0.03),
        ...style,
      }}
    >
      <div className="polaroid__photo" style={{ borderRadius: Math.max(2, Math.round(width * 0.008)) }}>
        <img src={src} alt={alt} draggable={false} style={{ animationDelay: `${developDelay}s` }} />
      </div>
    </div>
  );
};

export default Polaroid;
