export type EventItem = {
  id: number;
  title: string;
  date: string;
  attendees: number;
  clickable: boolean;
  timeframe: 'upcoming' | 'past';
  // Additional fields for event-specific content
  time?: string;
  description?: string;
  spotifyLink?: string;
  spotifyLyrics?: string;
  image?: {
    webp: string;
    fallback: string;
  };
  hosts?: {
    id: number;
    image: string;
  }[];
};

export const events: EventItem[] = [
  {
    id: 1,
    title: "mental static",
    date: "31/03/25",
    attendees: 35,
    clickable: true,
    timeframe: 'upcoming',
    time: "7:30pm",
    description: `quick hits of obscure knowledge 💚

bring that random wikipedia rabbithole only you seem to know about. weird nature stuff, unsolved mysteries, watershed moments, conspiracy theories, crazy undercover govt ops, cool people etc etc 🌀🌀🌀

wiki page will go up on a projector. exactly two mins for you to brief us. +1 question from the rest of us

limited capacity! tell us what you'd share 🫶🏼`,
    spotifyLink: "https://open.spotify.com/track/0LSLM0zuWRkEYemF7JcfEE?si=EhnHw1mWS1OOC9joykQgOA",
    spotifyLyrics: "surf it scroll it pause it click it cross it crack it ssswitch update it",
    image: {
      webp: "./images/partiful/ms-giphy.webp",
      fallback: "./images/partiful/ms-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/fareeha.jpg' },
      { id: 2, image: '/icons/hosts/1-b975ea56.jpg' },
      { id: 3, image: '/icons/hosts/2-b975ea56.jpg' }
    ]
  },
  {
    id: 2,
    title: "strawberry hour",
    date: "26/03/25",
    attendees: 60,
    clickable: true,
    timeframe: 'upcoming',
    time: "7:00pm",
    description: `👕 pinks reds whites

🍽️ literally just strawberries

one whole hour to celebrate strawberries being in season 😊 🍓 🍓 🍓`,
    spotifyLink: "https://open.spotify.com/track/3Am0IbOxmvlSXro7N5iSfZ",
    spotifyLyrics: "nothing is real...",
    image: {
      webp: "./images/partiful/strawberry-giphy.webp",
      fallback: "./images/partiful/strawberry-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/fareeha.jpg' },
      { id: 2, image: '/icons/hosts/3-64896426.jpg' },
      { id: 3, image: '/icons/hosts/4-64896426.jpg' },
      { id: 4, image: '/icons/hosts/1-b975ea56.jpg' }
    ]
  },
  {
    id: 3,
    title: "blood moon rising.",
    date: "13/03/25",
    attendees: 15,
    clickable: true,
    timeframe: 'upcoming',
    time: "8:00pm",
    description: `to witness the sky's transformation, marvel at cosmic rarity, and remember being small under something ancient.

// layers recommended. the cold is merciless.

missing this will be cosmic treason; your absence will haunt you. 🌑`,
    spotifyLink: "https://www.timeanddate.com/moon/usa/san-francisco",
    spotifyLyrics: "Moon Info",
    image: {
      webp: "./images/partiful/potluck-giphy.webp",
      fallback: "./images/partiful/potluck-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/fareeha.jpg' },
      { id: 2, image: '/icons/hosts/5-64896426.jpg' },
      { id: 3, image: '/icons/hosts/6-64896426.jpg' }
    ]
  },
  {
    id: 4,
    title: "out of office",
    date: "05/03/25",
    attendees: 40,
    clickable: true,
    timeframe: 'upcoming',
    time: "7:30pm",
    description: `light drinks & snacks
cocktail party, russian hill, sunset views 🌉

we know so many interesting people who should know each other! time to make that happen 🩵

agenda
7:30 your arrival (don't be late srsly)
7:45 meet your future collaborators, conspirators, accomplices
8:30 forced connection ritual 🫶🏼 (ice breakers lol)
8:45 artsy/creative/mysterious group photo
9:30 disappear (it's a school night)

dress code: casual, shoes off :)
parking: street, can be limited in the evening

xoxo`,
    spotifyLink: "Russian Hill, San Francisco, CA",
    spotifyLyrics: "light drinks & snacks",
    image: {
      webp: "./images/partiful/office-giphy.webp",
      fallback: "./images/partiful/office-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/7-dd1a51c0.jpg' },
      { id: 2, image: '/icons/hosts/fareeha.jpg' }
    ]
  },
  {
    id: 5,
    title: "threading in",
    date: "20/02/25",
    attendees: 40,
    clickable: true,
    timeframe: 'upcoming',
    time: "7:00pm",
    description: `Another Thursday, another nosh sesh.

Curated for the people in our lives whose eyes sparkle when they talk.

Few things bring us more joy than cooking for others, so there will be lots of beautiful finger foods🤍`,
    spotifyLink: "Potrero Hill, San Francisco, CA",
    spotifyLyrics: "Fareeha",
    image: {
      webp: "./images/partiful/threading-giphy.webp",
      fallback: "./images/partiful/threading-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/1-b975ea56.jpg' },
      { id: 2, image: '/icons/hosts/fareeha.jpg' }
    ]
  },
  {
    id: 6,
    title: "consumer social",
    date: "09/02/25",
    attendees: 10,
    clickable: true,
    timeframe: 'upcoming',
    time: "6:45pm",
    description: `The plan:

we go bowling 🎳
and talk about all our fave apps :)

bring a consumer product hot take. hottest take gets a high five`,
    spotifyLink: "Presidio Bowl",
    spotifyLyrics: "Presidio Bowl",
    image: {
      webp: "./images/partiful/consumer-giphy.webp",
      fallback: "./images/partiful/consumer-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/fareeha.jpg' },
      { id: 2, image: '/icons/hosts/4-64896426.jpg' }
    ]
  },
  {
    id: 7,
    title: "Watercolour",
    date: "19/09/24",
    attendees: 20,
    clickable: true,
    timeframe: 'upcoming',
    time: "6:30pm",
    description: `Watercolour 🎨

Where pigment meets purpose, and vision bleeds into reality. We thrive in the diverse palette of our community.

We wanted to bring some of our favorite people in the city together for an intimate seated dinner, to celebrate each other and to create space for creative community.

You are cordially invited.

dress code: pastels, watercolor washes, artisan details 🪷`,
    spotifyLink: "Bernal Heights, San Francisco, CA",
    spotifyLyrics: "Bernal Heights, San Francisco, CA",
    image: {
      webp: "./images/partiful/watercolour-giphy.webp",
      fallback: "./images/partiful/watercolour-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/8-dd1a51c0.jpg' },
      { id: 2, image: '/icons/hosts/fareeha.jpg' }
    ]
  },
  {
    id: 8,
    title: "Scrumptious.",
    date: "08/08/24",
    attendees: 20,
    clickable: true,
    timeframe: 'upcoming',
    time: "6:30pm",
    description: `honeycrisp. pink lady. sugarbee. ghost apple. Ạ̷̼̭̻͐P̶̳̙̙̉̍̆P̸̰̚L̶̠̯̯̮͊̊Ȇ̴̗̭̝̇̀. belle de boskoop. you name it. we (probably don't) have it.

join us for an evening of unmatched extravagance as we present the ultimate apple tasting experience…

this is luxury at its juiciest. be there or be 🍌

APARTMENT 206`,
    spotifyLink: "Outer Sunset, San Francisco",
    spotifyLyrics: "Outer Sunset, San Francisco",
    image: {
      webp: "./images/partiful/scrumptious-giphy.webp",
      fallback: "./images/partiful/scrumptious-fallback.jpg"
    },
    hosts: [
      { id: 1, image: '/icons/hosts/1-b975ea56.jpg' },
      { id: 2, image: '/icons/hosts/fareeha.jpg' },
      { id: 3, image: '/icons/hosts/9-dd1a51c0.jpg' }
    ]
  }
]; 