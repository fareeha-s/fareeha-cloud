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
    title: "who am i again?", 
    content: `__main quest__
-> building [kineship](https://kineship.com)

__side/<span class="opacity-50">prior</span> quests__
-> early community architect @ [stealth], [$1M pre-seed via HF0](https://www.hf0.com/)
<span class="opacity-50">-> _tessel, a social matching experience in vancouver & toronto_
-> _medbridge, health tech for south side chicago_
-> _[gala](https://www.heartandstrokegala.ca/2024-highlights) committee - heart and stroke foundation_
-> _[fashion show](https://crm2.diabetes.ca/site/SPageServer?pagename=2025_pumpcoutu) committee - diabetes canada_</span>

__mission__
-> enable health focused human interactions

__vision__
-> longevity achieved for all humans

__things i love__
-> workout classes
-> music with guitars
-> night bikes around sf with my friends :)
-> apples`,
    date: "17/03/25",
    timeframe: 'older',
    pinned: true
  },
  { 
    id: 2, 
    title: "why kineship", 
    content: "inspired by the mission to reshape social culture to embrace longevity", 
    date: "25/03/25",
    timeframe: 'older',
    pinned: false
  },
  { 
    id: 3, 
    title: "on dinner tables", 
    content: "observations on how we socialize", 
    date: "12/01/25",
    timeframe: 'older',
    pinned: false
  },
  { 
    id: 4, 
    title: "apples...", 
    content: "sugarbee - 10/10, pink lady - 9/10, honeycrisp - 7/10", 
    date: "01/01/25",
    timeframe: 'older',
    pinned: false
  },
  { 
    id: 5, 
    title: "canada", 
    content: "no, we're not the US. we never should be, and we never will be. sorry and thank you 🤍🤍🤍🤍🤍🍁🍁🍁🍁🍁", 
    date: "05/04/25",
    timeframe: 'recent',
    pinned: false
  }
]; 