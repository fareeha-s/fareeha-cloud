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
    title: "hello world ˚", 
    content: `Hey, I'm Fareeha ✨  

You might've found me through one of my Partifuls where I made you eat something. 

Beyond hosting, I'm with an AI lab exploring a new class of infrastructure for agent builders. I also built [Kineship](note:2), a social layer for workouts.

In Autumn 2026, I'll be producing a fashion show. It's very specific. More on this soon 🩵 

<span style="font-weight: bold;">things I love:</span>  
▹ taking forever to [set a table](app:partiful)
▹ giving people [apples](note:3) they didn't ask for 
▹ keeping my Oura ring happy 🫶

If this feels like your kind of world, I'd love to [hear from you.](mailto:fareeha@kineship.com)`,
    date: "",
    timeframe: 'recent',
    pinned: true
  },
  { 
    id: 2, 
    title: "kineship", 
    content: `
<div style="display: flex; align-items: center; margin-bottom: 0px; padding-bottom: 0px;">
  <img src="/icons/apps/kineship-expand.png" alt="Kineship" style="width: 60px; height: 60px; margin-top: -15px; border-radius: 12px; border: 2px solid #fff; cursor: pointer; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset; background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f8f9fa, #e2e6ea); transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);" 
    onmouseover="this.style.transform='scale(1.05)'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%), linear-gradient(to bottom, #e2e6ea, #f8f9fa)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.25), 0 0 2px rgba(255, 255, 255, 0.6) inset';"
    onmouseout="this.style.transform='scale(1)'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f8f9fa, #e2e6ea)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset';"
    ontouchstart="this.style.transform='scale(0.97)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.15), 0 0 1px rgba(255, 255, 255, 0.3) inset'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f0f0f0, #e0e0e0)';"
    ontouchend="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset'; this.style.background='linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, #f8f9fa, #e2e6ea)';"
    onclick="window.open('https://kineship.com', '_blank')" />
</div> 
It feels like much of how we connect today involves adding more: more invites, more plans, more coordination.

Lately, I\'ve been wondering if there might be a kind of closeness that fits into our day as it is.

Like when you swap your usual 6pm class for the 5, because your friend\'s going to that one. Or wandering to the farmers\' market the same time as your neighbours... your day suddenly feels a touch warmer.

It might seem small, but I\'ve learned that researchers have documented <a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC5137339/' target='_blank' rel='noopener noreferrer' class='custom-pink-link'>intentional synchrony</a> as a natural human principle rooted in our nervous systems. These overlaps are tied to lower loneliness, better regulation, and long-term wellbeing - all core to how we can rebuild connection at scale.

Surprisingly, almost none of the social platforms we use today are designed to support this. Instead, they often keep us observing each other\'s lives from a distance.

The aim for Kineship is to embrace a gentler kind of togetherness. It doesn\'t ask you to schedule anything or make a plan. It simply shows you when your paths could align—spin, pilates, Barry\'s, whatever your thing is. Some soft cues toward shared presence, and a bit more everyday serendipity.

I\'m hoping it makes it just a little easier to say hi, share laughs, linger a bit longer. Even with people you often see around, but don\'t quite know (yet!) As simple as a smoothie after class 😊
    `,
    date: "02/05/25",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 3,
    title: 'apples',
    content: `sugarbee - 10/10
    lucy glo - 9.5/10
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
    date: '15/12/24',
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 4,
    title: 'projects',
    content: `▹ systems design for boutique wellness spaces [infra mapping, product integration](https://silicon-divan-443.notion.site/Retention-System-Design-for-Boutique-Fitness-1f7a4827ee3380599df9c1afc31689f1)

▹ social design in health & community ([tessel](https://fareeha-s.github.io/Tessel/), [vfc](https://impact.ventureforcanada.ca/2023/programs/fellowship-alumni), [h&s gala](https://youtu.be/VMxSzVREUgY), [dc fashion show](https://youtu.be/vXCGUXAQfOs?si=JUGWTpF-NB_2DE3a))

▹ winning team, healthcare innovation ([mit bc x harvard med](https://silicon-divan-443.notion.site/MedBridge-235a4827ee33804b8a05c087946d7a80))

▹ policy work on the ethical implications of AI on youth ([united nations x mbc](https://www.youtube.com/watch?v=6vqmUHDibTI&t=600s))

▹ ice/breakers ([#3 on ProductHunt](https://www.producthunt.com/products/icebreakers-2?launch=icebreakers-b45694ac-4bea-4ec9-870f-67a447107f26))`,
    date: '29/12/24',
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
    title: "a blueprint for social longevity...", 
    content: "", 
    date: "", 
    timeframe: 'older',
    locked: true
  }
]; 