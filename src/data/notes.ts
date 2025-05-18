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
    content: `Hey, I\'m Fareeha ✨

I love watching people light up around each other - my compass seems to keep pointing that way.

I\'m building [Kineship](note:2), a social layer for workouts. The north star is to design tech that [centres human longevity](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.717164/full).

<span style="font-weight: bold;">things i love:</span>  
▹ taking forever to [set a table](app:partiful)
▹ giving people [apples](note:3) they didn\'t ask for 
▹ keeping my Oura <a href="javascript:void(0)" class="custom-pink-link" onclick="event.stopPropagation(); window.openNoteWithId(7);">happy</a> 🫶

If this feels like your kind of world, I\'d love to [hear from you.](mailto:fareeha@kineship.com)`,
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
  
  <div style="margin-left: 8px; line-height: 1;">
    <span style="font-size: 12px; font-style: italic; display: block; line-height: 1; margin-bottom: 0; padding: 0;">pre-launch</span>
    <a href="https://www.instagram.com/loiaccelerator/" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: #FFE7EA; text-decoration: none; transition: color 0.15s ease-in-out, text-shadow 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; display: block; line-height: 1; margin-top: -2px; padding: 0;" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)';">LOI Accelerator</a>
  </div>
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
    date: '01/05/25',
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 7,
    title: "oura",
    content: "Checking in with my Oura ring.",
    date: '03/05/25',
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