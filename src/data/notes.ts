export type NoteItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  timeframe: 'recent' | 'older';
  pinned?: boolean;
  style?: { 
    color?: string;
    pointerEvents?: 'none' | 'auto';
  };
  locked?: boolean;
};

export const notes: NoteItem[] = [
  { 
    id: 1, 
    title: "hello world 🧭", 
    content: `Hey, I'm Fareeha ✨

I love watching people light up around each other - my compass seems to keep pointing that way.

I'm building [Kineship](note:2)<span style="color: rgba(255, 255, 255, 0.65); font-size: 0.85em;"> (<a href="https://loi.ac/labs" target="_blank" rel="noopener noreferrer" style="color: rgba(255, 255, 255, 0.65); text-decoration: underline; text-decoration-color: rgba(255,255,255,0.65);">loi labs</a>)</span>, a social layer for workouts. The north star is to design tech that [centres human longevity](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.717164/full).

<span style="font-weight: bold;">in line with that:</span>
▹ early experience designer at <span style="color: rgba(255, 255, 255, 0.65);">stealth</span> <span style="font-size: 0.85em;"><a href="https://www.hf0.com/" target="_blank" rel="noopener noreferrer" style="color: rgba(255, 255, 255, 0.65); text-decoration: underline; text-decoration-color: rgba(255,255,255,0.65);">($1M pre-seed, HF0)</a></span>
▹ social design in health & community <span style="color: rgba(255, 255, 255, 0.65); font-size: 0.85em;">([tessel](https://fareeha-s.github.io/Tessel/), [h&amp;s gala](video:https://youtu.be/VMxSzVREUgY), [dc fashion show](video:https://youtu.be/vXCGUXAQfOs?si=JUGWTpF-NB_2DE3a), [vfc](https://impact.ventureforcanada.ca/2023/programs/fellowship-alumni))</span>
▹ winning team, healthcare innovation [<span style="color: rgba(255, 255, 255, 0.65); font-size: 0.85em;">(mit bc x harvard med)</span>](video:https://youtu.be/u6_jdJ7YRXM?si=svadyVmXGiPOjPVR)

<span style="font-weight: bold;">things i love:</span>  
▹ taking forever to [set a table](app:partiful)
▹ giving people [apples](note:3) they didn't ask for 
▹ chasing sunsets on two wheels 🫶

If this feels like your kind of world, I'd love to [hear from you.](app:socials)`,
    date: "15/04/25",
    timeframe: 'recent',
    pinned: true
  },
  { 
    id: 2, 
    title: "kineship", 
    content: `
<div style="display: flex; align-items: center;">
  <img src="/icons/apps/kineship.png" alt="Kineship" style="width:60px; height:60px; border-radius: 12px; border: 2px solid #fff; cursor: pointer; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset; background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f8f9fa, #e2e6ea); transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); margin-top: -10px;" 
    onmouseover="this.style.transform='scale(1.05)'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%), linear-gradient(to bottom, #e2e6ea, #f8f9fa)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.25), 0 0 2px rgba(255, 255, 255, 0.6) inset';"
    onmouseout="this.style.transform='scale(1)'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f8f9fa, #e2e6ea)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset';"
    ontouchstart="this.style.transform='scale(0.97)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.15), 0 0 1px rgba(255, 255, 255, 0.3) inset'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f0f0f0, #e0e0e0)';"
    ontouchend="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f8f9fa, #e2e6ea)';"
    onclick="window.open('https://kineship.com', '_blank')" />
  
  <!-- External link indicator between logo and text -->
  <div 
    style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: rgba(0,0,0,0.45); border-radius: 9px; margin-left: 6px; margin-right: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.15); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); cursor: pointer; transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);" 
    onclick="window.open('https://kineship.com', '_blank')" 
    ontouchstart="this.style.transform='scale(0.9)'; this.style.backgroundColor='rgba(0,0,0,0.65)';"
    ontouchend="this.style.transform='scale(1)'; this.style.backgroundColor='rgba(0,0,0,0.45)';"
    onmouseover="this.style.transform='scale(1.1)'; this.style.backgroundColor='rgba(0,0,0,0.65)';"
    onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='rgba(0,0,0,0.45)';">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: white; stroke-width: 2.5;">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  </div>
  
  <span style="font-size: 12px; font-style: italic;">pre-launch</span>
</div> 
It feels like much of how we connect today involves adding more: more invites, more plans, more coordination.

Lately, I’ve been wondering if there might be a kind of closeness that fits into our day as it is.

Like when you swap your usual 6pm class for the 5, because your friend’s going to that one. Or wandering to the farmers’ market the same time as your neighbours... your day suddenly feels a touch warmer.

It might seem small, but psychologists call it <a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC5137339/' target='_blank' rel='noopener noreferrer' style='text-decoration: underline;'>intentional synchrony</a>, a natural human principle rooted in our nervous systems. These overlaps are tied to lower loneliness, better regulation, and long-term wellbeing - core to how we rebuild connection at scale.

Surprisingly, almost none of the social platforms we use today are designed to support this. Instead, they often keep us observing each other’s lives from a distance.

Kineship is meant to embrace a gentler kind of togetherness. It doesn’t ask you to schedule anything or make a plan. It simply shows you when your paths could align—spin, pilates, Barry’s, whatever your thing is. Some soft cues toward shared presence, and a bit more everyday serendipity.

I'm hoping it makes it just a little easier to say hi, share laughs, linger a bit longer. Even with people you often see around, but don't quite know (yet!) As simple as a smoothie after class 🫶
    `,
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
    title: "dinner tables...", 
    content: "", 
    date: "", 
    timeframe: 'older',
    pinned: false,
    locked: true,
    style: { color: 'rgba(128, 128, 128, 0.5)', pointerEvents: 'none' }
  },
  { 
    id: 6, 
    title: "layering a social stack...", 
    content: "", 
    date: "", 
    timeframe: 'older',
    locked: true
  }
]; 