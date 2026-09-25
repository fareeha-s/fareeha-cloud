export type PolaroidPhoto = {
  src: string;
  caption: string;
};

// Stills from past gatherings, sized down for the polaroid decorations
export const polaroidPhotos: Record<string, PolaroidPhoto> = {
  ftc: { src: './images/polaroids/ftc.webp', caption: 'for the culture' },
  citrus: { src: './images/polaroids/cs.webp', caption: 'citrus salon' },
  scrumptious: { src: './images/polaroids/s.webp', caption: 'scrumptious' },
  pomegranate: { src: './images/polaroids/pg.webp', caption: 'pomegranate garden' },
  kiwi: { src: './images/polaroids/ks.webp', caption: 'kiwi soirée' },
  strawberry: { src: './images/polaroids/sh.webp', caption: 'strawberry hour' },
  bloodMoon: { src: './images/polaroids/bmr.webp', caption: 'blood moon rising' },
  mentalStatic: { src: './images/polaroids/ms.webp', caption: 'mental static' },
};
