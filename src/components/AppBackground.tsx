import React from 'react';

interface AppBackgroundProps {
  isLoaded: boolean; // Fades the color in once the app is ready
}

const svgUrl = (size: number, filter: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n' x='0' y='0'>${filter}</filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  )}")`;

// Fine, even film grain
const fineGrain = svgUrl(
  200,
  "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/>"
);

// Sparse light specks, like dust on a scan: keep only the brightest bits of the noise
const dust = svgUrl(
  420,
  "<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/>" +
    "<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -0.62'/>" +
    "<feComponentTransfer><feFuncA type='discrete' tableValues='0 0 0 0 0 0 0 0.9'/></feComponentTransfer>"
);

// Large, soft blotches so the darkness isn't perfectly uniform
const mottle = svgUrl(
  900,
  "<feTurbulence type='fractalNoise' baseFrequency='0.0035' numOctaves='3' seed='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/>"
);

// Near-black with layered, uneven grain and a faint lift in the middle for depth.
const AppBackground: React.FC<AppBackgroundProps> = ({ isLoaded }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0" style={{ backgroundColor: '#0b0b0c' }}>
      <div
        className="absolute inset-0"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
          background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.09, mixBlendMode: 'screen', backgroundImage: mottle, backgroundSize: '900px 900px' }}
      />

      {/* Oversized so the flicker animation never reveals an edge */}
      <div
        className="bg-grain absolute pointer-events-none"
        style={{ inset: '-10%', opacity: 0.17, backgroundImage: fineGrain, backgroundSize: '200px 200px' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.55, backgroundImage: dust, backgroundSize: '420px 420px' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)' }}
      />
    </div>
  );
};

export default AppBackground;
