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
▹ to design a social stack intentionally calibrated for human longevity 

<span style="font-weight: bold;">building</span>
▹ [kineship](note:2)
▹ early community architect at <span style="color: rgba(255, 255, 255, 0.65);">stealth</span> <a href="https://www.hf0.com/" target="_blank" rel="noopener noreferrer" style="color: rgba(255, 255, 255, 0.65); text-decoration: underline; text-decoration-color: rgba(255,255,255,0.65);">($1M pre-seed via HF0)</a>

<span style="font-weight: bold;">contributing</span>
▹ [gala committee](video:https://youtu.be/VMxSzVREUgY), heart and stroke foundation
▹ [fashion show committee](video:https://youtu.be/vXCGUXAQfOs?si=JUGWTpF-NB_2DE3a), diabetes canada
▹ [hosting](app:partiful) with my favourite people 🫶
 `,
    date: "15/04/25",
    timeframe: 'recent',
    pinned: true
  },
  { 
    id: 2, 
    title: "kineship", 
    content: `<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 16px;">
  <div style="width: 48px; height: 48px; border-radius: 10px; background-color: rgba(98, 190, 156, 0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.12); border: 1px solid rgba(255, 255, 255, 0.1);">
    <img src="./icons/apps/kineship.png" alt="Kineship" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
  </div>
  <div style="font-size: 16px; color: white; font-weight: 400;"><a href="https://kineship.com" target="_blank" rel="noopener noreferrer" style="color: white; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">kineship.com</a></div>
</div>

the kineship app shares your workout calendar with your circles. the underlying principle is to help increase behavioural synchrony between you and your community - which is a key driver of longevity!`, 
    date: "12/04/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 4, 
    title: "apples", 
    content: `sugarbee - 10/10
    pink lady - 9/10
    pinata - 9/10
    ambrosia - 8.5/10
    fuji - 7.5/10
    honeycrisp - 7/10
    gala - 6.5/10
    red delicious - 2/10
    
    to try:
    black diamond
    gravenstein
    calville blanc d'hiver`, 
    date: "28/03/25",
    timeframe: 'recent',
    pinned: false
  }
]; 