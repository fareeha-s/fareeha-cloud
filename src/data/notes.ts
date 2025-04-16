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
    title: "hello world!", 
    content: `<span style="font-weight: bold;">my north star</span> 
a future where our social framework is optimized for human longevity 🔆

<span style="font-weight: bold;">building</span>
▹ [kineship](note:2)
▹ early community architect @ <span style="color: rgba(255, 255, 255, 0.5);">stealth</span> [($1M pre-seed via HF0)](https://www.hf0.com/)

<span style="font-weight: bold;">contributing</span>
▹ [gala committee](video:https://youtu.be/VMxSzVREUgY), heart and stroke foundation
▹ [fashion show committee](video:https://youtu.be/vXCGUXAQfOs?si=JUGWTpF-NB_2DE3a), diabetes canada
▹ [hosting](app:partiful) with my favourite people!
 `,
    date: "15/04/25",
    timeframe: 'recent',
    pinned: true
  },
  { 
    id: 2, 
    title: "kineship", 
    content: "inspired by the mission to reshape social culture to embrace longevity", 
    date: "12/04/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 3, 
    title: "on dinner tables", 
    content: "observations on how we socialize", 
    date: "02/04/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 4, 
    title: "apples", 
    content: "sugarbee - 10/10, pink lady - 9/10, honeycrisp - 7/10", 
    date: "28/03/25",
    timeframe: 'recent',
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