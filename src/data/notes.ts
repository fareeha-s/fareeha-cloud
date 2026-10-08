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

// The "homework" note (AI reading list). Add essays here; each section always lists the
// newest (by publish date) first.
type Reading = { title: string; author: string; url: string; published: string; read: boolean; section?: 'pacing'; kind?: 'podcast' };

const readings: Reading[] = [
  { title: 'Richard Sutton: LLMs are a dead end', author: 'Dwarkesh Podcast', url: 'https://www.dwarkesh.com/p/richard-sutton', published: '2025-09', read: true, kind: 'podcast' },
  { title: 'Andrej Karpathy: AGI is still a decade away', author: 'Dwarkesh Podcast', url: 'https://www.dwarkesh.com/p/andrej-karpathy', published: '2025-10', read: true, kind: 'podcast' },
  { title: 'A Framework for Frontier AI and the Dawning of a New Age', author: 'Demis Hassabis', url: 'https://demishassabis.substack.com/p/a-framework-for-frontier-ai-and-the-dawning-of-a-new-age', published: '2026-07', read: false },
  { title: 'We Must Pace the Frontier', author: 'Dario Amodei', url: 'https://www.darioamodei.com/post/we-must-pace-the-frontier', published: '2026-09', read: true, section: 'pacing' },
  { title: 'The Adolescence of Technology', author: 'Dario Amodei', url: 'https://www.darioamodei.com/essay/the-adolescence-of-technology', published: '2026-01', read: true },
  { title: 'Machines of Loving Grace', author: 'Dario Amodei', url: 'https://www.darioamodei.com/essay/machines-of-loving-grace', published: '2024-10', read: true },
  { title: 'The Gentle Singularity', author: 'Sam Altman', url: 'https://blog.samaltman.com/the-gentle-singularity', published: '2025-06', read: true },
  { title: 'The Bitter Lesson', author: 'Rich Sutton', url: 'http://www.incompleteideas.net/IncIdeas/BitterLesson.html', published: '2019-03', read: true },
  { title: 'Software 2.0', author: 'Andrej Karpathy', url: 'https://karpathy.medium.com/software-2-0-a64152b37c35', published: '2017-11', read: false },
  { title: 'Constitutional AI: Harmlessness from AI Feedback', author: 'Anthropic', url: 'https://arxiv.org/abs/2212.08073', published: '2022-12', read: false },
  { title: 'From AGI to ASI', author: 'Google DeepMind', url: 'https://deepmind.google/research/publications/239142/', published: '2026-06', read: false },
  { title: 'The Future is for Everyone', author: 'Mark Zuckerberg', url: 'https://www.meta.com/thefutureisforeveryone/', published: '2026-08', read: false, section: 'pacing' },
  { title: 'AI 2027', author: 'Daniel Kokotajlo et al.', url: 'https://ai-2027.com', published: '2025-04', read: false },
];

function readingListContent() {
  const newestFirst = (a: Reading, b: Reading) => b.published.localeCompare(a.published);
  const line = (r: Reading) => `${r.read ? '✓' : '○'} ${r.kind === 'podcast' ? '🎧 ' : ''}[${r.title}](${r.url}) · ${r.author}`;
  // "on pacing" leads with Dario's latest, then the rest of that section newest first
  const pacing = readings.filter((r) => r.section === 'pacing')
    .sort((a, b) => Number(b.author === 'Dario Amodei') - Number(a.author === 'Dario Amodei') || newestFirst(a, b))
    .map(line);
  const rest = readings.filter((r) => r.section !== 'pacing');
  const read = rest.filter((r) => r.read).sort(newestFirst).map(line);
  const reading = rest.filter((r) => !r.read).sort(newestFirst).map(line);
  return [
    "AI stuff I've read (✓) + my to-read pile (○)",
    '<span style="font-weight: bold;">on pacing</span>\n' + pacing.join('\n'),
    read.join('\n'),
    reading.join('\n'),
  ].join('\n\n');
}

const allNotes: NoteItem[] = [
  { 
    id: 1, 
    title: "hello world ˚", 
    content: `Hey, I'm Fareeha 🤍  

You might've found me through one of my Partifuls where I made you eat an [apple you'd never heard of](note:3). I feel half the fun of finding something great, is sharing it.

These days, I'm mostly sharing [what I'm learning about superintelligence](note:8), and I just joined [MTS](https://www.mts.now), a team that helps the world make sense of it ✨

<span style="font-weight: bold;">other loves:</span>  
▹ pilates with friends (my app, [Kineship](note:2))
▹ walking [almost anywhere](note:9)
▹ wearing one too many [wearables](note:7) at once

If this feels like your kind of world, [say hi](mailto:fareeha@kineship.com) 💛`,
    date: "",
    timeframe: 'recent',
    pinned: true
  },
  { 
    id: 7, 
    title: "fashion show", 
    content: `A slow-burn project with collaborators across a few countries - think runway, but everything's a little smarter than it looks. It's moving at its own pace.

Date TBD 🩵`,
    date: "24/09/26",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 8, 
    title: "homework", 
    content: readingListContent(),
    date: "25/09/26",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 9, 
    title: "should i have walked.", 
    content: `<a class="note-link-card" href="https://justwalk.fareeha.sh" target="_blank" rel="noopener noreferrer"><span class="note-link-card-text"><span class="note-link-card-title">should i have walked.</span><span class="note-link-card-domain">justwalk.fareeha.sh</span></span><img src="/icons/apps/justwalk-icon.svg" alt="" /></a>The robotaxi said twenty minutes.

It was a perfectly normal estimate when I booked, but by the time the car reached me, it was rush hour and the ETA had crept up to about an hour ‼️😰 It was such a lovely day, too, and I kept watching people stroll past on the sidewalk. I really should have just walked.

So I asked Twitter what I should build from the backseat, and a few people kindly sent over ideas. This is the one I ended up making.

Pop in any ride in San Francisco and it shows you exactly what you missed: every spot along the way, the steps you didn't take, even the weather you skipped (which, this being San Francisco, was probably three different kinds).

I'd walk almost anywhere if I could, but sometimes it genuinely isn't safe. So if your route goes somewhere you shouldn't be on foot, especially at night, it'll let you know and suggest a safer way round.`,
    date: "14/02/26",
    timeframe: 'recent',
    pinned: false
  },
  { 
    id: 2, 
    title: "kineship", 
    content: `<a class="note-link-card" href="https://kineship.com" target="_blank" rel="noopener noreferrer"><span class="note-link-card-text"><span class="note-link-card-title">Kineship</span><span class="note-link-card-domain">kineship.com</span></span><img src="/icons/apps/kineship.png" alt="" /></a>It feels like much of how we connect today involves adding more: more invites, more plans, more coordination.

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
