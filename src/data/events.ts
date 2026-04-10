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
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/1-b975ea56.jpg' },
      { id: 3, image: './icons/hosts/2-b975ea56.jpg' }
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
      webp: "./images/partiful/sh-giphy.webp",
      fallback: "./images/partiful/sh-giphy.webp"
    },
    hosts: [
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/3-64896426.jpg' },
      { id: 3, image: './icons/hosts/4-64896426.jpg' },
      { id: 4, image: './icons/hosts/1-b975ea56.jpg' }
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
      webp: "./images/partiful/bmr.jpeg",
      fallback: "./images/partiful/bmr.jpeg"
    },
    hosts: [
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/5-64896426.jpg' },
      { id: 3, image: './icons/hosts/6-64896426.jpg' }
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
      webp: "./images/partiful/ti-giphy.webp",
      fallback: "./images/partiful/ti-giphy.webp"
    },
    hosts: [
      { id: 1, image: './icons/hosts/1-b975ea56.jpg' },
      { id: 2, image: './icons/hosts/fareeha.jpg' }
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
      webp: "./images/partiful/cs-giphy.webp",
      fallback: "./images/partiful/cs-giphy.webp"
    },
    hosts: [
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/4-64896426.jpg' }
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

We wanted to bring some of our favorite people in the city together for an intimate seated dinner, to celebrate each other and to create space for creative community.

You are cordially invited.

dress code: pastels, watercolor washes, artisan details 🪷`,
    image: {
      webp: "./images/partiful/w-giphy.webp",
      fallback: "./images/partiful/w-giphy.webp"
    },
    hosts: [
      { id: 1, image: './icons/hosts/8-dd1a51c0.jpg' },
      { id: 2, image: './icons/hosts/fareeha.jpg' }
    ]
  },
  {
    id: 8,
    title: "Scrumptious",
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
      webp: "./images/partiful/s.jpg",
      fallback: "./images/partiful/s.jpg"
    },
    hosts: [
      { id: 1, image: './icons/hosts/1-b975ea56.jpg' },
      { id: 2, image: './icons/hosts/fareeha.jpg' },
      { id: 3, image: './icons/hosts/9-dd1a51c0.jpg' }
    ]
  },
  {
    id: 13,
    title: "for the culture",
    date: "05/04/26",
    attendees: 53,
    clickable: true,
    timeframe: 'past',
    time: "5:30pm",
    description: `hosting a social for those that 'do it for the culture'

inviting friends across fashion, film, philosophy, media, etc.

drinks & light food @ penthouse lounge

dress chic`,
    image: {
      webp: "./images/partiful/ftc.jpeg",
      fallback: "./images/partiful/ftc.jpeg"
    },
    hosts: [
      { id: 1, image: './icons/hosts/12-64896426.avif' },
      { id: 2, image: './icons/hosts/13-64896426.avif' },
      { id: 3, image: './icons/hosts/fareeha.jpg' }
    ]
  },
  {
    id: 12,
    title: "Winter Editorial.",
    date: "22/12/25",
    attendees: 12,
    clickable: true,
    timeframe: 'past',
    time: "2:15pm – 2:45pm",
    description: `👔 Formal. Floor length gowns and suits only.

Dear Family,

As you know, per the family office's directive and in accordance with the trust documents we'll be gathering at the usual place for our annual holiday portrait which must be completed by end of Q4 for regulatory compliance.

I expect everyone in formal attire, floor length gowns and suits only, as this goes to the shareholders by end of Q4. If you're bringing a plus-one they should be prepared to look like they've summered with us for years, we can't have another situation like Thanksgiving which is still being discussed at the club.

I've also arranged for light refreshments though the family office has asked we keep it modest after last year's caviar bill nearly derailed the merger. Again formal attire is mandatory, our counsel has been very clear about maintaining brand consistency across all family assets.

Looking forward to seeing everyone.

- This portrait has been commissioned by the family office and will be displayed in the main residence, the summer house, and distributed to key stakeholders.`,
    spotifyLink: "https://open.spotify.com/track/2gUPyc2cDGKurgULWB8Q2Q?si=Pme9ore3S1KgLXdTee2flQ",
    spotifyLyrics: "Orchestra.",
    image: {
      webp: "./images/partiful/we.gif",
      fallback: "./images/partiful/we.gif"
    },
    hosts: [
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/4-64896426.jpg' }
    ]
  },
  {
    id: 11,
    title: "citrus salon",
    date: "22/03/26",
    attendees: 374,
    clickable: true,
    timeframe: 'past',
    time: "1:00pm – 5:00pm",
    description: `👕 shades of citrus (orange, yellow, whites)

We are hosting another daytime brunch. At some point during brunch, a small citruation will unfold. When it does, you will receive one kumquat. Elsewhere in the room, is a grapefruit.

Your goal is simple. Leave with the grapefruit.

trades are binding… alliances are unenforceable… there are no other rules… or maybe there are… you'll find out

Entry requires citrus attire (orange, yellow, and/or white) 🍊💛

🍋‍🟩🍊🍋`,
    spotifyLink: "https://open.spotify.com/track/7r0EUONfPUZ8SD1vu4ro27?si=iwDbBttnTd6hfboxa4tNig",
    spotifyLyrics: "🕵️",
    image: {
      webp: "./images/partiful/cs.jpeg",
      fallback: "./images/partiful/cs.jpeg"
    },
    hosts: [
      { id: 1, image: './icons/hosts/11-dd1a51c0.jpg' },
      { id: 2, image: './icons/hosts/fareeha.jpg' },
      { id: 3, image: './icons/hosts/10-dd1a51c0.jpg' }
    ]
  },
  {
    id: 4,
    title: "pomegranate garden",
    date: "24/01/26",
    attendees: 279,
    clickable: true,
    timeframe: 'past',
    time: "10:00am – 1:00pm",
    description: `👕 shades of pomegranate (dark reds, pinks, white)

We are hosting a daytime brunch. Pomegranates shall feature prominently, though we shan't disclose precisely how.

Dress code: red (the arils), pink (the shell), and/or white (the pith). Fail to respect this code at your own risk 😊

See you in the garden 🩷✨

🥗🍹🌺
♦️`,
    image: {
      webp: "./images/partiful/pg.gif",
      fallback: "./images/partiful/pg.gif"
    },
    spotifyLink: "https://open.spotify.com/track/4wbPU5OlVziXuElgzFYHt6?si=sPIeOOgOSJSNbe1_FsVv2A",
    spotifyLyrics: "♦️",
    hosts: [
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/10-dd1a51c0.jpg' },
      { id: 3, image: './icons/hosts/11-dd1a51c0.jpg' }
    ]
  },
  {
    id: 10,
    title: "kiwi soirée",
    date: "17/09/25",
    attendees: 189,
    clickable: true,
    timeframe: 'upcoming',
    time: "6:30pm",
    description: `👕 shades of kiwi (greens & browns) 🥝
🎵 styles 💚

🍽️ Literally just kiwis

hello

🥝 you have been cordially invited to kiwi soirée 🥝

✨ we'll have piles of them ready for you
✨ slice, scoop, or (if you dare) bite right in
✨ facts: kiwis have more vitamin c than oranges! they're also linked to better sleep. so technically this is a wellness event 🫶🏼

we're so back baby!!!
🥝🥝🥝🥝🥝✨`,
    spotifyLink: "https://open.spotify.com/track/33SNO8AaciGbNaQFkxvPrW?si=uxvU-h8oS2OyyTz3YKwCOA",
    spotifyLyrics: "styles 💚",
    image: {
      webp: "./images/partiful/ks.webp",
      fallback: "./images/partiful/ks.webp"
    },
    hosts: [
      { id: 1, image: './icons/hosts/fareeha.jpg' },
      { id: 2, image: './icons/hosts/10-dd1a51c0.jpg' },
      { id: 3, image: './icons/hosts/8-dd1a51c0.jpg' }
    ]
  }
]; 