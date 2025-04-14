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
      { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=32' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=33' }
    ]
  },
  {
    id: 2,
    title: "strawberry hour",
    date: "26/03/25",
    attendees: 63,
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
      { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=34' },
      { id: 5, image: 'https://i.pravatar.cc/100?img=35' },
      { id: 6, image: 'https://i.pravatar.cc/100?img=36' }
    ]
  },
  {
    id: 3,
    title: "blood moon rising",
    date: "13/03/25",
    attendees: 15,
    clickable: true,
    timeframe: 'upcoming',
    time: "8:00pm",
    description: `to witness the sky's transformation,
marvel at cosmic rarity,
and remember being small under something ancient.

// layers recommended. the cold is merciless.

missing this will be cosmic treason;
your absence will haunt you.
🌑`,
    spotifyLink: "https://maps.app.goo.gl/MkcQaTLh5AAbgCvQ9",
    spotifyLyrics: "Moon Info",
    image: {
      webp: "./images/partiful/potluck-giphy.webp",
      fallback: "./images/partiful/potluck-fallback.jpg"
    },
    hosts: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
      { id: 5, image: 'https://i.pravatar.cc/100?img=35' },
      { id: 6, image: 'https://i.pravatar.cc/100?img=36' }
    ]
  },
  {
    id: 4,
    title: "out of office",
    date: "05/03/25",
    attendees: 24,
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
    spotifyLink: "2459 Larkin St APT 9, San Francisco, CA",
    spotifyLyrics: "light drinks & snacks",
    image: {
      webp: "./images/partiful/office-giphy.webp",
      fallback: "./images/partiful/office-fallback.jpg"
    },
    hosts: [
      { id: 7, image: 'https://i.pravatar.cc/100?img=29' },
      { id: 8, image: 'https://i.pravatar.cc/100?img=30' }
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
    spotifyLink: "1395 22nd St Apt 4, San Francisco, CA",
    spotifyLyrics: "Fareeha",
    image: {
      webp: "./images/partiful/threading-giphy.webp",
      fallback: "./images/partiful/threading-fallback.jpg"
    },
    hosts: [
      { id: 9, image: 'https://i.pravatar.cc/100?img=27' },
      { id: 10, image: 'https://i.pravatar.cc/100?img=28' }
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
      { id: 11, image: 'https://i.pravatar.cc/100?img=25' },
      { id: 12, image: 'https://i.pravatar.cc/100?img=26' }
    ]
  },
  {
    id: 7,
    title: "Watercolour",
    date: "19/09/25",
    attendees: 20,
    clickable: true,
    timeframe: 'upcoming',
    time: "6:30pm",
    description: `Watercolour 🎨

Where pigment meets purpose, and vision bleeds into reality. We thrive in the diverse palette of our community.

We wanted to bring some of our favorite people in the city together for an intimate seated dinner, to celebrate each other and to create space for creative community.

You are cordially invited.

dress code: pastels, watercolor washes, artisan details 🪷`,
    spotifyLink: "Baukunst, 433 Cortland Ave, San Francisco, CA 94110",
    spotifyLyrics: "Baukunst, 433 Cortland Ave, San Francisco, CA 94110",
    image: {
      webp: "./images/partiful/watercolour-giphy.webp",
      fallback: "./images/partiful/watercolour-fallback.jpg"
    },
    hosts: [
      { id: 13, image: 'https://i.pravatar.cc/100?img=23' },
      { id: 14, image: 'https://i.pravatar.cc/100?img=24' }
    ]
  }
]; 