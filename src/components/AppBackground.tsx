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



// Starfield tiles for the night theme: a seeded scatter of tiny stars, drawn as an
// SVG so it's crisp at any size and costs nothing to download
const starTile = (size: number, count: number, seed: number, rMin: number, rMax: number, glow: boolean) => {
  let x = seed;
  const rand = () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646;
  let stars = '';
  for (let i = 0; i < count; i++) {
    const r = (rMin + rand() * (rMax - rMin)).toFixed(2);
    const o = (0.35 + rand() * 0.6).toFixed(2);
    // most stars are white, a few lean warm or cool, like real ones
    const hue = rand();
    const fill = hue < 0.12 ? '#ffd9c7' : hue < 0.24 ? '#cfe0ff' : '#ffffff';
    const cx = (rand() * size).toFixed(1);
    const cy = (rand() * size).toFixed(1);
    if (glow) stars += `<circle cx='${cx}' cy='${cy}' r='${(Number(r) * 3.2).toFixed(2)}' fill='${fill}' opacity='0.08'/>`;
    stars += `<circle cx='${cx}' cy='${cy}' r='${r}' fill='${fill}' opacity='${o}'/>`;
  }
  return `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${stars}</svg>`
  )}")`;
};
const faintStars = starTile(1100, 520, 11, 0.3, 0.75, false);
const brightStars = starTile(1500, 34, 29, 0.85, 1.45, true);

// Woven linen threads (horizontal and vertical) for the daylight theme
const linenWeft = svgUrl(
  300,
  "<feTurbulence type='fractalNoise' baseFrequency='0.9 0.012' numOctaves='2' seed='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/>"
);
const linenWarp = svgUrl(
  300,
  "<feTurbulence type='fractalNoise' baseFrequency='0.012 0.9' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/>"
);

// Two looks, switched by the theme (see theme-light.css):
// dark: near-black with layered, uneven grain and a faint lift in the middle;
// light: a linen tabletop in soft window light.
const AppBackground: React.FC<AppBackgroundProps> = ({ isLoaded }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div className="bg-layer-light absolute inset-0" style={{ backgroundColor: '#ebe5da' }}>
        <div className="absolute inset-0" style={{ opacity: 0.16, mixBlendMode: 'multiply', backgroundImage: linenWeft, backgroundSize: '300px 300px' }} />
        <div className="absolute inset-0" style={{ opacity: 0.12, mixBlendMode: 'multiply', backgroundImage: linenWarp, backgroundSize: '300px 300px' }} />
        <div className="absolute inset-0" style={{ opacity: 0.08, mixBlendMode: 'multiply', backgroundImage: fineGrain, backgroundSize: '200px 200px' }} />

        {/* Window light falling across the table, with the frame's soft shadow */}
        <div className="linen-window absolute pointer-events-none" />

        {/* Daylight from the top left, warm falloff to the bottom right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 12% 0%, rgba(255, 252, 244, 0.85) 0%, rgba(255, 252, 244, 0) 65%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(130, 100, 60, 0.16) 0%, rgba(130, 100, 60, 0) 70%)',
          }}
        />
      </div>

      {/* Night: deep space. Blue-black, faint nebula haze in Kineship's sage and rose,
          fine stars with a few brighter ones, and film grain on top */}
      <div className="bg-layer-dark absolute inset-0" style={{ backgroundColor: '#07080c' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 82% 18%, rgba(106, 185, 151, 0.1) 0%, transparent 70%),' +
            'radial-gradient(ellipse 65% 50% at 12% 88%, rgba(248, 93, 94, 0.08) 0%, transparent 70%),' +
            'radial-gradient(ellipse 55% 45% at 45% 45%, rgba(130, 110, 200, 0.06) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: faintStars, backgroundSize: '1100px 1100px' }} />
      <div className="bg-stars-bright absolute inset-0 pointer-events-none" style={{ backgroundImage: brightStars, backgroundSize: '1500px 1500px' }} />

      {/* Oversized so the flicker animation never reveals an edge */}
      <div
        className="bg-grain absolute pointer-events-none"
        style={{ inset: '-10%', opacity: 0.12, backgroundImage: fineGrain, backgroundSize: '200px 200px' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)' }}
      />
      </div>
    </div>
  );
};

export default AppBackground;
