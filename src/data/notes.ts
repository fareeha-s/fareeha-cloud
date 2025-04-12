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
    content: "no, we're not the US. we never should be, and we never will be. thank you next 🤍🤍🤍🤍🤍🍁🍁🍁🍁🍁", 
    date: "05/04/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 2, 
    title: "who am i again?", 
    content: "main quest: building kineship + early days in community at [stealth]. side quests: gala committee heart and stroke foundation, diabetes canada fashion show ", 
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