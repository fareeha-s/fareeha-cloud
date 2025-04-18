export type NoteItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  timeframe: 'recent' | 'older';
  pinned?: boolean;
  style?: { color?: string };
  locked?: boolean;
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
    content: `
<div style="display: flex; align-items: center;">
  <img src="/icons/apps/kineship.png" alt="Kineship" style="width:60px; height:60px; border-radius: 12px; border: 2px solid #fff; cursor: pointer; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); background: linear-gradient(to bottom, #f8f9fa, #e2e6ea); transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease; margin-top: -10px;" onmouseover="this.style.transform='scale(1.1)'; this.style.background='linear-gradient(to bottom, #e2e6ea, #f8f9fa)'; this.style.boxShadow='0 12px 24px rgba(0, 0, 0, 0.4)';" onmouseout="this.style.transform='scale(1)'; this.style.background='linear-gradient(to bottom, #f8f9fa, #e2e6ea)'; this.style.boxShadow='0 10px 20px rgba(0, 0, 0, 0.3)';" onclick="window.open('https://kineship.com', '_blank')" />
  <span style="font-size: 12px; font-style: italic; margin-left: 15px;">pre-launch</span>
</div>
<b><i>another social app?!</i></b>

This one won't ask you to post — just to notice!

Many social apps connect us by adding more: more invites, more plans, more coordination.

Lately, I've been wondering if there's also something meaningful in adding less, but noticing more.

I find myself drawn to the idea of just allowing our everyday moments to feel more mutual. Our nervous systems register a kind of comfort in this <a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC5137339/' target='_blank' rel='noopener noreferrer' style='text-decoration: underline;'>intentional synchrony</a>.

Choosing the 5pm class instead of 6, visiting the farmers' market when you know your neighbours will be there too. It's subtle, but these moments play a quietly powerful role in reducing loneliness at scale.

Surprisingly, almost none of the platforms we use today are designed around this natural principle. Instead, we're usually just observing each other's lives from a distance.

Kineship doesn't ask you to schedule anything. It simply reveals the overlaps — who else is heading to Pilates today? Spin? Barry's?

By offering these soft cues, I'm hoping it'll be a little easier to say hi, share laughs, linger a bit longer, make plans.

something as simple as a smoothie after class 🫶`, 
    date: "12/04/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 3,
    title: 'apples',
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
    date: '28/03/25',
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 5, 
    title: "dinner tables", 
    content: "", 
    date: "🔒", 
    timeframe: 'older',
    pinned: false,
    locked: true,
    style: { color: 'rgba(128, 128, 128, 0.5)', pointerEvents: 'none' }
  },
  { 
    id: 6, 
    title: "layering a social stack", 
    content: "", 
    date: "", 
    timeframe: 'older',
    locked: true
  }
]; 