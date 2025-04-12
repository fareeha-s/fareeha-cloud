export type NoteItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  timeframe: 'recent' | 'older';
  pinned?: boolean;
};

export const notes: NoteItem[] = [
  { 
    id: 1, 
    title: "canada", 
    content: "no, we're not the US. we never should be, and we never will be. sorry and thank you 🤍🤍🤍🤍🤍🍁🍁🍁🍁🍁", 
    date: "05/04/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 2, 
    title: "who am i again?", 
    content: `__main quest__
-> building [kineship](https://kineship.com)

__side quests__
+ early community architect @ [stealth], $1M pre-seed
+ [gala committee](https://www.heartandstrokegala.ca/2024-highlights), heart and stroke foundation
+ [fashion show committee](https://crm2.diabetes.ca/site/SPageServer?pagename=2025_pumpcoutu), diabetes canada

__mission__
+ connect people in healthy ways

__vision__
+ longevity achieved for all humans

__things i love__
+ workout classes
+ music
+ biking around sf with my friends`,
    date: "17/03/25",
    timeframe: 'older',
    pinned: true
  },
  { 
    id: 3, 
    title: "how we socialize", 
    content: "strong connections lead to longer, healthier lives.", 
    date: "25/03/25",
    timeframe: 'older',
    pinned: false
  },
  { 
    id: 4, 
    title: "apples...", 
    content: "sugarbee - 10/10, pink lady - 9/10, honeycrisp - 7/10", 
    date: "12/03/25",
    timeframe: 'older',
    pinned: false
  },
  { 
    id: 5, 
    title: "intentionality", 
    content: "in everything", 
    date: "12/02/25",
    timeframe: 'older',
    pinned: false
  },
  { 
    id: 6, 
    title: "on dinner tables", 
    content: "the answer to friendmaking", 
    date: "12/01/25",
    timeframe: 'older',
    pinned: false
  }
]; 