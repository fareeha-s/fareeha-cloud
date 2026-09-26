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
  // Kept in the file but left off the site (e.g. waiting on something to go live)
  hidden?: boolean;
};

// The "ai reading list" note. Add essays here; each section always lists the
// newest (by publish date) first.
type Reading = { title: string; author: string; url: string; published: string; read: boolean };

const readings: Reading[] = [
  { title: 'The Adolescence of Technology', author: 'Dario Amodei', url: 'https://www.darioamodei.com/essay/the-adolescence-of-technology', published: '2026-01', read: true },
  { title: 'Machines of Loving Grace', author: 'Dario Amodei', url: 'https://www.darioamodei.com/essay/machines-of-loving-grace', published: '2024-10', read: true },
  { title: 'The Gentle Singularity', author: 'Sam Altman', url: 'https://blog.samaltman.com/the-gentle-singularity', published: '2025-06', read: true },
  { title: 'The Bitter Lesson', author: 'Rich Sutton', url: 'http://www.incompleteideas.net/IncIdeas/BitterLesson.html', published: '2019-03', read: true },
  { title: 'Software 2.0', author: 'Andrej Karpathy', url: 'https://karpathy.medium.com/software-2-0-a64152b37c35', published: '2017-11', read: false },
  { title: 'Constitutional AI: Harmlessness from AI Feedback', author: 'Anthropic', url: 'https://arxiv.org/abs/2212.08073', published: '2022-12', read: false },
  { title: 'From AGI to ASI', author: 'Google DeepMind', url: 'https://deepmind.google/research/publications/239142/', published: '2026-06', read: false },
  { title: 'The Future is for Everyone', author: 'Mark Zuckerberg', url: 'https://about.fb.com/news/2026/08/the-future-is-for-everyone/', published: '2026-08', read: false },
  { title: 'AI 2027', author: 'Daniel Kokotajlo et al.', url: 'https://ai-2027.com', published: '2025-04', read: false },
];

function readingListContent() {
  const newestFirst = (a: Reading, b: Reading) => b.published.localeCompare(a.published);
  const line = (r: Reading) => `${r.read ? '✓' : '○'} [${r.title}](${r.url}) · ${r.author}`;
  const read = readings.filter((r) => r.read).sort(newestFirst).map(line);
  const reading = readings.filter((r) => !r.read).sort(newestFirst).map(line);
  return [
    "AI stuff I've read (✓) + my to-read pile (○)",
    read.join('\n'),
    reading.join('\n'),
    'send me your favourite 🩵',
  ].join('\n\n');
}

const allNotes: NoteItem[] = [
  { 
    id: 1, 
    title: "hello world ˚", 
    content: `Hey, I'm Fareeha <span class="kineship-mark" aria-label="Kineship"></span>  

You might've found me through one of my [Partifuls](app:partiful), where I made you eat something.

I love watching people light up around each other - my compass seems to keep pointing that way.

Beyond hosting, [I'm joining a team](https://www.mts.now) that spotlights and supports the people building AGI. Genuinely think it's the most important thing happening right now. I also built [Kineship](note:2), an app for working out with your friends.

<span style="font-weight: bold;">things I love:</span>  
▹ taking forever to [set a table](app:partiful)
▹ giving people [apples](note:3) they didn't ask for 
▹ wearing one too many wearables at once

If this feels like your kind of world, I'd love to [hear from you](mailto:fareeha@kineship.com) 💛`,
    date: "",
    timeframe: 'recent',
    pinned: true
  },
  { 
    id: 7, 
    title: "fashion show", 
    content: `A slow-burn project with collaborators across a few countries, so it's moving at its own pace.

Date TBD 🩵`,
    date: "24/09/26",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 8, 
    title: "ai reading list", 
    content: readingListContent(),
    date: "25/09/26",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 9, 
    title: "should i have walked.", 
    // Hidden until the app is working again; then add a link back
    hidden: true,
    content: `<img src="./images/notes/should-i-have-walked.webp" alt="should i have walked. homepage" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); margin-bottom: 6px;" />
I was in a robotaxi for a long ride across the city, barely moving in traffic, on a beautiful day, and realised I could've just walked it in about an hour. So I made this.

Tell it where you got picked up and where you got dropped off, and it shows you everything you rode straight past: the coffee spots, the murals, the good trees. Plus what the walk would've done for you.

It also knows walking isn't always the right call. If the route goes somewhere that doesn't feel great on foot, especially after dark, it tells you, and offers a safer way around.

Made in the backseat of a robotaxi 🤍`,
    date: "20/09/26",
    timeframe: 'recent',
    pinned: false
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
  }
];

export const notes: NoteItem[] = allNotes.filter((note) => !note.hidden);
