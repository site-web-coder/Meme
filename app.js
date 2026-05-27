// ─────────────────────────────────────────
//  MEMEPLEX · app.js
// ─────────────────────────────────────────

// ── CURSOR ──────────────────────────────
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
  cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  cur2.style.left = cx + 'px'; cur2.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
})();

document.addEventListener('mousedown', () => { cur.style.transform = 'translate(-50%,-50%) scale(1.6)'; });
document.addEventListener('mouseup', () => { cur.style.transform = 'translate(-50%,-50%) scale(1)'; });

// ── PARTICLE CANVAS ──────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.4 + 0.1;
    const hues = ['232,197,71','255,77,77','0,212,255','200,245,58'];
    this.color = hues[Math.floor(Math.random() * hues.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());
(function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  // draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(232,197,71,${0.06 * (1 - dist / 90)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
})();

// ── MARQUEE ──────────────────────────────
const marqueeItems = [
  '🐸 Pepe the Frog','💀 Doomscrolling','😂 Touch Grass',
  '🔥 This Is Fine','🧀 Gouda Content','💅 No Cap Fr','🐕 Such Wow',
  '👁️ Side-Eye Chloe','📈 Stonks Only Go Up','🌽 It\'s Corn',
  '🎻 Woman Yelling At Cat','🤌 Chefs Kiss','🦁 RIP Harambe','🥺 Pleading Face',
];
const mi = document.getElementById('marqueeInner');
[...marqueeItems, ...marqueeItems].forEach(item => {
  const el = document.createElement('div');
  el.className = 'marquee-item';
  el.innerHTML = `${item}<span class="marquee-dot"></span>`;
  mi.appendChild(el);
});

// ── COUNTER ANIMATION ────────────────────
const counters = [
  { id: 'cnt1', target: 55, suffix: 'M+', prefix: '' },
  { id: 'cnt2', target: 1976, suffix: '', prefix: '' },
  { id: 'cnt3', target: 48, suffix: '%', prefix: '' },
  { id: 'cnt4', target: 7, suffix: 'days', prefix: '' },
];
function animCount(el, start, end, suffix, dur = 1600) {
  const s = performance.now();
  const run = t => {
    const p = Math.min((t - s) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (end - start) * ease) + suffix;
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counters.forEach(c => {
      const el = document.getElementById(c.id);
      if (!el) return;
      const start = c.target === 1976 ? 1900 : 0;
      animCount(el, start, c.target, c.suffix);
    });
    cntObs.disconnect();
  });
}, { threshold: 0.4 });
const defSection = document.querySelector('.def-section');
if (defSection) cntObs.observe(defSection);

// ── SCROLL REVEAL ────────────────────────
const srObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 80);
      srObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

// ── TIMELINE DATA ────────────────────────
const tlData = [
  {
    year: '1976', era: 'The Origin',
    title: 'THE WORD IS BORN',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/640px-Above_Gotham.jpg',
    desc: 'Richard Dawkins coins "meme" in The Selfish Gene to describe units of cultural transmission.',
    long: 'Richard Dawkins needed a word for cultural transmission — ideas, tunes, fashions — that spread like biological genes but through imitation. He combined the Greek "mimeme" with "gene." He could not have imagined where this word would go. Dawkins himself has expressed mixed feelings about what the internet did to his concept — he meant it as a scientific term, not a name for funny dog photos.',
    examples: ['The Selfish Gene', 'Memetics', 'Cultural Evolution', 'Evolutionary Biology']
  },
  {
    year: '1996', era: 'Pre-Social Era',
    title: 'DANCING BABY',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Spinning-beach-ball-mac.png/480px-Spinning-beach-ball-mac.png',
    desc: 'The first viral internet meme — a 3D-animated baby doing the cha-cha. Spread via email before social media existed.',
    long: 'Created in 1996 by Michael Girard as a 3D animation demo, the "Baby Cha-Cha" became the internet\'s first major meme. It spread across bulletin boards, newsgroups, and email chains. Ally McBeal even featured it. The pre-social era proved a timeless truth: if it\'s weird enough, it spreads. No algorithm required — just human impulse to share something inexplicably delightful.',
    examples: ['Dancing Baby', 'Hamster Dance', 'All Your Base Are Belong To Us', 'Badger Badger Mushroom']
  },
  {
    year: '2003', era: 'Image Macro Era',
    title: 'THE LOLcat ERA',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Doge_meme.jpg/480px-Doge_meme.jpg',
    desc: 'I Can Has Cheezburger launches. Impact font + misspelled captions dominate. The grammar of internet humor is established.',
    long: 'LOLcats defined the "classic meme" format: photo + Impact font + deliberate misspelling = comedy. Sites like 4chan, Something Awful, and I Can Has Cheezburger were the distribution channels. This era established the visual grammar of internet humor that still exists today. The Impact font became so synonymous with memes it\'s practically a historical artifact.',
    examples: ['I Can Has Cheezburger', 'Ceiling Cat', 'O RLY Owl', 'Fail Blog', 'Rickrolling', 'Lolrus']
  },
  {
    year: '2008', era: 'Reddit Age',
    title: 'RAGE COMICS',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Trollface_non-free.png/480px-Trollface_non-free.png',
    desc: 'Stick figure comics with expressive faces conquer Reddit. Forever Alone, Trollface, Me Gusta — universal emotional grammar.',
    long: 'Reddit became the epicenter of meme culture during the Rage Comics era. The simple stick-figure panels with expressive faces democratized meme creation — anyone could tell relatable stories. This period birthed the "relatable meme" as a genre and proved that emotional resonance, not technical skill, was the key ingredient. Forever Alone became a whole personality.',
    examples: ['Trollface', 'Forever Alone', 'Me Gusta', 'Y U NO', 'Derpina', 'Cereal Guy', 'Are You Serious']
  },
  {
    year: '2012', era: 'The Golden Age',
    title: 'DOGE & GRUMPY CAT',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Doge_meme.jpg/640px-Doge_meme.jpg',
    desc: 'Memes achieve peak mainstream saturation. Grumpy Cat gets a movie. Brands desperately try to speak internet.',
    long: 'The Golden Age produced memes that transcended the internet: Doge\'s broken English went mainstream, Grumpy Cat (Tardar Sauce) earned over $100 million, Distracted Boyfriend became a stock photo. Brands desperately tried to "do memes." This era proved memes were a genuine cultural force — and exposed a permanent truth: corporations cannot authentically participate in meme culture, only imitate it badly.',
    examples: ['Doge', 'Grumpy Cat', 'Distracted Boyfriend', 'Success Kid', 'Bad Luck Brian', 'Overly Attached Girlfriend']
  },
  {
    year: '2016', era: 'Absurdist Wave',
    title: 'THE SURREAL ERA',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Surreal_meme_template.jpg/640px-Surreal_meme_template.jpg',
    desc: 'The internet retreats into deliberate nonsense. Deep-fried images, multi-layer irony, memes about memes.',
    long: 'As memes became mainstream, the internet retreated into deliberate absurdism. "Surreal memes" deconstructed the format. References stacked on references. "Deep Fried" images with extreme compression artifacts and multi-layered irony dominated. Memes-about-memes. This era was the internet\'s immune response — refusing to be understood by outsiders. The more corporate the mainstream became, the more chaotic the underground went.',
    examples: ['Big Chungus', 'Tide Pod Challenge', 'Is This a Pigeon?', 'They Did Surgery on a Grape', 'Coffin Dance', 'E']
  },
  {
    year: '2019', era: 'TikTok Mutation',
    title: 'VIDEO TAKES OVER',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Social_media_apps.jpg/640px-Social_media_apps.jpg',
    desc: 'TikTok redefines memes as sounds and formats. Sea Shanty TikTok, Corn Kid, audio remixes — the format mutates completely.',
    long: 'TikTok fundamentally changed what a meme could be. Now they were sounds, dances, green-screen reactions, and duets. A meme was no longer just an image — it was an audio clip remixed across millions of videos. The Ratatouille Musical, Sea Shanty TikTok, and Corn Kid showed memes could be wholesome, collaborative, long-form, and community-driven. A new era of participatory culture.',
    examples: ['Sea Shanty TikTok', 'Corn Kid', 'POV Videos', 'Among Us', 'Berries and Cream', 'NPC Streaming']
  },
  {
    year: '2023', era: 'AI Age',
    title: 'THE AI TAKEOVER',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/ChatGPT_logo.svg/480px-ChatGPT_logo.svg.png',
    desc: 'AI-generated memes and deepfakes blur authenticity. NPC culture, AI Presidents, and a new question: what is real?',
    long: 'AI entered the meme chat. Midjourney, DALL-E, and GPT-4 enabled anyone to generate images in seconds. "NPC streaming" went viral. AI Presidents playing video games racked up millions of views. Deepfake culture raised new questions about authenticity. The Balenciaga Pope became a watershed moment: a fake image believed by millions. The meme has fully detached from reality, and nobody agrees if that\'s good or terrifying.',
    examples: ['NPC Streaming', 'AI Pope Puffer', 'Balenciaga Pope', 'Grimace Shake', 'Rizz', 'Delulu is the Solulu']
  }
];

// ── RENDER TIMELINE ──────────────────────
const tlTrack = document.getElementById('tlTrack');
tlData.forEach(item => {
  const card = document.createElement('div');
  card.className = 'tl-card';
  card.innerHTML = `
    <div class="tl-year">${item.year}</div>
    <img class="tl-img" src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'"/>
    <div class="tl-era">${item.era}</div>
    <div class="tl-title">${item.title}</div>
    <div class="tl-desc">${item.desc}</div>
    <div class="tl-more">Read more <span class="tl-more-arrow">→</span></div>
  `;
  card.addEventListener('click', () => openModal(item));
  tlTrack.appendChild(card);
});

// ── GALLERY DATA ─────────────────────────
const galleryData = [
  {
    name: 'Doge', year: '2013', cat: 'classic',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Doge_meme.jpg/480px-Doge_meme.jpg',
    desc: '"Wow. Such meme. Very viral." The Shiba Inu that launched a thousand crypto coins and a new broken grammar.'
  },
  {
    name: 'This Is Fine', year: '2013', cat: 'reaction',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Spinning-beach-ball-mac.png/480px-Spinning-beach-ball-mac.png',
    desc: 'A dog sipping coffee as the world burns. Became the definitive symbol of millennial dissociation.'
  },
  {
    name: 'Distracted Boyfriend', year: '2017', cat: 'format',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Is_this_a_pigeon.png/640px-Is_this_a_pigeon.png',
    desc: 'A single stock photo became the universal format for human hypocrisy, consumerism, and every political argument.'
  },
  {
    name: 'Grumpy Cat', year: '2012', cat: 'classic',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Doge_meme.jpg/480px-Doge_meme.jpg',
    desc: 'Tardar Sauce earned over $100M in brand deals. No meme has crossed from internet to boardroom faster.'
  },
  {
    name: 'Rickroll', year: '2007', cat: 'viral',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Rickrolling_-_We%27re_No_Strangers_To_Love.jpg/480px-Rickrolling_-_We%27re_No_Strangers_To_Love.jpg',
    desc: 'The bait-and-switch prank that never got old. Rick Astley himself is in on it now. 1.4B YouTube views and counting.'
  },
  {
    name: 'Woman Yelling at Cat', year: '2019', cat: 'format',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Social_media_apps.jpg/480px-Social_media_apps.jpg',
    desc: 'Real Housewives meets Smudge the Cat. Two unrelated images combined to become every disagreement, ever.'
  },
  {
    name: 'Drake Pointing', year: '2015', cat: 'format',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Doge_meme.jpg/480px-Doge_meme.jpg',
    desc: 'Disapproval panel. Approval panel. Still the most replicated two-panel format six years after going viral.'
  },
  {
    name: 'Harambe', year: '2016', cat: 'viral',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/480px-Above_Gotham.jpg',
    desc: 'A gorilla. A child. A zoo. An entire year of unified internet grief. "Dicks out for Harambe" entered the lexicon.'
  },
  {
    name: 'Corn Kid', year: '2022', cat: 'viral',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Social_media_apps.jpg/480px-Social_media_apps.jpg',
    desc: '"It\'s corn! A big lump with knobs." Tariq remains unbothered. The internet adopted him as its son.'
  },
  {
    name: 'Is This a Pigeon?', year: '2011', cat: 'format',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Is_this_a_pigeon.png/640px-Is_this_a_pigeon.png',
    desc: 'A 1991 anime screenshot became the definitive format for mistaking one thing for another. Extremely flexible template.'
  },
  {
    name: 'Ice Bucket Challenge', year: '2014', cat: 'viral',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/480px-Above_Gotham.jpg',
    desc: 'Raised $220M for ALS research. Proof that meme culture, when directed well, can literally fund scientific breakthroughs.'
  },
  {
    name: 'Hide the Pain Harold', year: '2011', cat: 'classic',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Doge_meme.jpg/480px-Doge_meme.jpg',
    desc: 'Stock model András Arató\'s strained smile became universal "I\'m fine (I\'m not fine)" energy. He fully embraced it.'
  },
];

// ── RENDER GALLERY ───────────────────────
const memeGrid = document.getElementById('memeGrid');
const filterBar = document.getElementById('filterBar');
const filterCats = ['all', 'classic', 'reaction', 'format', 'viral'];

filterCats.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'filt' + (cat === 'all' ? ' active' : '');
  btn.textContent = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
  btn.dataset.cat = cat;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.meme-card').forEach(c => {
      c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
    });
  });
  filterBar.appendChild(btn);
});

galleryData.forEach(m => {
  const card = document.createElement('div');
  card.className = 'meme-card sr';
  card.dataset.cat = m.cat;
  card.innerHTML = `
    <div class="meme-tag">${m.cat}</div>
    <img class="meme-thumb" src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.style.background='#1a1a22';this.style.minHeight='220px'"/>
    <div class="meme-overlay"></div>
    <div class="meme-info">
      <div class="meme-meta">
        <span class="meme-cat">${m.cat}</span>
        <span class="meme-year">${m.year}</span>
      </div>
      <div class="meme-name">${m.name}</div>
      <div class="meme-desc">${m.desc}</div>
    </div>
  `;
  srObs.observe(card);
  memeGrid.appendChild(card);
});

// ── IMPACT DATA ──────────────────────────
const impactData = [
  { num: '$88B', label: 'Peak Dogecoin Cap', title: 'Economics', body: 'Dogecoin, a joke currency, hit $88 billion market cap. GameStop\'s $28B short squeeze was organised via Reddit memes. Meme stocks are now a legitimate financial category tracked by Wall Street.' },
  { num: '220M', label: 'ALS Research Dollars', title: 'Medicine', body: 'The 2014 Ice Bucket Challenge raised over $220 million for ALS research, funding a significant breakthrough in understanding the disease. A meme directly accelerated science.' },
  { num: '48%', label: 'Gen Z News via Memes', title: 'Media', body: 'Nearly half of Gen Z learn about current events through meme formats on social media. News organisations now compete with meme accounts for information authority.' },
  { num: '7yrs', label: 'New Words in Dictionary', title: 'Language', body: '"Vibe," "slay," "no cap," "bussin," and "based" originated in meme culture and entered the Oxford Dictionary. Memes are reshaping linguistics faster than any previous media format.' },
  { num: '∞', label: 'Political Movements', title: 'Politics', body: 'From Pepe\'s controversial adoption to election memes — internet culture directly influenced Brexit messaging, the 2016 US election, and protest movements worldwide. Memes are propaganda now.' },
  { num: '100+', label: 'Museum Collections', title: 'Art', body: 'Museums now archive memes. "Distracted Boyfriend" sold as fine art. The Smithsonian catalogues internet culture. Meme formats are studied in academic papers and MFA programmes.' },
];

const impactGrid = document.getElementById('impactGrid');
impactData.forEach((item, i) => {
  const card = document.createElement('div');
  card.className = 'impact-card sr sr-d' + (i % 3 + 1);
  card.innerHTML = `
    <div class="impact-num">${item.num}</div>
    <div class="impact-label">${item.label}</div>
    <h3>${item.title}</h3>
    <p>${item.body}</p>
  `;
  srObs.observe(card);
  impactGrid.appendChild(card);
});

// ── GENERATOR ────────────────────────────
const templates = [
  { emoji: '🐸', label: 'Pepe' },
  { emoji: '🐕', label: 'Doge' },
  { emoji: '🔥', label: 'Fine' },
  { emoji: '💀', label: 'Dead' },
  { emoji: '😤', label: 'Troll' },
  { emoji: '🧑‍💻', label: 'Harold' },
  { emoji: '👁️', label: 'Chloe' },
  { emoji: '🤌', label: 'Chef' },
  { emoji: '🌽', label: 'Corn' },
];

let selTmpl = templates[0];
const tmplRow = document.getElementById('tmplRow');

templates.forEach((t, i) => {
  const btn = document.createElement('button');
  btn.className = 'tmpl-btn' + (i === 0 ? ' sel' : '');
  btn.textContent = t.emoji;
  btn.title = t.label;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tmpl-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    selTmpl = t;
    updatePreview();
  });
  tmplRow.appendChild(btn);
});

function updatePreview() {
  const top = document.getElementById('topTxt').value.toUpperCase() || 'WHEN YOU';
  const bot = document.getElementById('botTxt').value.toUpperCase() || 'AND IT WORKS';
  document.getElementById('mPreviewTop').textContent = top;
  document.getElementById('mPreviewBot').textContent = bot;
  const em = document.getElementById('mPreviewEmoji');
  em.style.animation = 'none';
  void em.offsetWidth;
  em.textContent = selTmpl.emoji;
  em.style.animation = 'float 4s ease-in-out infinite';
}

document.getElementById('topTxt').addEventListener('input', updatePreview);
document.getElementById('botTxt').addEventListener('input', updatePreview);
document.getElementById('genBtn').addEventListener('click', updatePreview);

const rTops = ['WHEN YOU', 'POV:', 'ME WHEN', 'NOBODY:', 'MY BRAIN AT 3AM', 'SOCIETY:', 'MY WALLET:', 'BOOMERS:'];
const rBots = ['AND IT WORKS', 'STONKS 📈', 'THIS IS FINE 🔥', 'PLEASE SEND HELP', 'BASED 🗿', 'NO CAP FR', 'I UNDERSTOOD THAT REFERENCE', 'EVERY. SINGLE. TIME.'];

document.getElementById('randBtn').addEventListener('click', () => {
  const rt = templates[Math.floor(Math.random() * templates.length)];
  document.querySelectorAll('.tmpl-btn').forEach((b, i) => b.classList.toggle('sel', templates[i] === rt));
  selTmpl = rt;
  document.getElementById('topTxt').value = rTops[Math.floor(Math.random() * rTops.length)];
  document.getElementById('botTxt').value = rBots[Math.floor(Math.random() * rBots.length)];
  updatePreview();
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = `${document.getElementById('mPreviewTop').textContent}\n${selTmpl.emoji}\n${document.getElementById('mPreviewBot').textContent}\n\n— MEMEPLEX 🏛️`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.innerHTML = '📋 Copy meme text', 2000);
  });
});

// ── QUIZ ─────────────────────────────────
const quizData = [
  {
    q: 'Richard Dawkins coined the word "meme" in which year?',
    opts: ['1986', '1976', '1966', '1996'],
    correct: 1,
    fact: 'In "The Selfish Gene" (1976), Dawkins described memes as units of cultural transmission. He combined the Greek "mimeme" with "gene." He\'s since expressed mixed feelings about what the internet did to his concept.'
  },
  {
    q: 'What is widely considered the first viral internet meme?',
    opts: ['LOLcats', 'Rickroll', 'Dancing Baby', 'Hamster Dance'],
    correct: 2,
    fact: 'The "Dancing Baby" (1996) was created as a 3D animation software demo. It spread via email chains and appeared in Ally McBeal — the internet\'s first truly viral phenomenon, pre-dating social media.'
  },
  {
    q: 'Doge\'s iconic broken-English captions use which font?',
    opts: ['Comic Sans', 'Impact', 'Helvetica', 'Arial'],
    correct: 0,
    fact: 'Comic Sans was a deliberate choice — its childlike quality perfectly matched the stream-of-consciousness "wow such grammar" voice of Doge. A genius design accident.'
  },
  {
    q: 'Dogecoin reached what approximate peak market cap in 2021?',
    opts: ['$8 billion', '$44 billion', '$88 billion', '$120 billion'],
    correct: 2,
    fact: 'At its peak in May 2021, Dogecoin\'s market cap hit ~$88 billion. A meme coin started as a joke in 2013 became more valuable than most Fortune 500 companies.'
  },
  {
    q: 'The "Woman Yelling at Cat" meme — who is the woman?',
    opts: ['Taylor Armstrong (RHOBH)', 'Wendy Williams', 'Kim Kardashian', 'Lisa Vanderpump'],
    correct: 0,
    fact: 'Taylor Armstrong from Real Housewives of Beverly Hills was photographed during an emotional moment in 2011. The cat is Smudge, who hates vegetables. Neither knew they\'d become immortal.'
  },
  {
    q: 'Which platform fundamentally shifted memes from images to audio?',
    opts: ['Instagram', 'Twitter', 'TikTok', 'YouTube'],
    correct: 2,
    fact: 'TikTok\'s audio-first algorithm transformed memes into remixable sounds and video formats. A meme is now as likely to be an audio clip as a static image — a fundamental format shift.'
  },
  {
    q: 'The Ice Bucket Challenge raised money for research into:',
    opts: ['Multiple Sclerosis', 'Parkinson\'s Disease', 'ALS (Lou Gehrig\'s Disease)', 'Alzheimer\'s Disease'],
    correct: 2,
    fact: 'The 2014 Ice Bucket Challenge raised over $220 million for ALS research worldwide, funding a significant scientific breakthrough. Memes can literally save lives.'
  },
  {
    q: '"This Is Fine" — the burning room dog — was created by:',
    opts: ['Matt Furie', 'KC Green', 'Ryan Pagelow', 'John McNamee'],
    correct: 1,
    fact: 'KC Green published the strip in his webcomic "Gunshow" in 2013. The full comic goes further: the dog keeps insisting it\'s fine as it slowly melts. Extremely relatable.'
  },
];

let qIndex = 0, score = 0, qAnswered = false;

function renderQuiz() {
  const body = document.getElementById('quizBody');
  const progBar = document.getElementById('qProgBar');
  const progText = document.getElementById('quiz-prog-text') || document.getElementById('qProgText');

  if (qIndex >= quizData.length) {
    renderResult();
    return;
  }

  const q = quizData[qIndex];
  const pct = (qIndex / quizData.length) * 100;
  if (progBar) progBar.style.width = pct + '%';
  if (progText) progText.textContent = `Question ${qIndex + 1} of ${quizData.length}`;

  qAnswered = false;
  body.innerHTML = `
    <div class="quiz-q-num">Question ${qIndex + 1} / ${quizData.length}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-opts">
      ${q.opts.map((o, i) => `<button class="qopt" data-i="${i}">${o}</button>`).join('')}
    </div>
    <div class="quiz-fact" id="qFact">${q.fact}</div>
    <div class="quiz-next" id="qNext">
      <button class="btn-primary" id="qNextBtn" style="width:100%">
        ${qIndex === quizData.length - 1 ? 'See My Score →' : 'Next Question →'}
      </button>
    </div>
  `;

  document.querySelectorAll('.qopt').forEach(btn => {
    btn.addEventListener('click', () => {
      if (qAnswered) return;
      qAnswered = true;
      const chosen = parseInt(btn.dataset.i);
      if (chosen === q.correct) score++;
      document.querySelectorAll('.qopt').forEach((b, i) => {
        b.disabled = true;
        if (i === q.correct) b.classList.add('correct');
        if (i === chosen && chosen !== q.correct) b.classList.add('wrong');
      });
      document.getElementById('qFact').classList.add('show');
      document.getElementById('qNext').classList.add('show');
    });
  });

  document.getElementById('qNextBtn').addEventListener('click', () => {
    qIndex++;
    renderQuiz();
  });
}

function renderResult() {
  const body = document.getElementById('quizBody');
  const pct = Math.round((score / quizData.length) * 100);
  document.getElementById('qProgBar').style.width = '100%';
  const titles = [
    [0, 'Boomer Energy 👴', 'You\'ve clearly been using the internet for email only. Respect the commitment.'],
    [3, 'Lurker Status 👀', 'You\'ve scrolled past a few memes in your time. There\'s hope.'],
    [5, 'Chronically Online 🖥️', 'You know your memes. Your sleep schedule, however, does not know you.'],
    [7, 'Meme Archaeologist 🏛️', 'You understand the internet at a cellular level. Please seek help.'],
    [8, 'You ARE the Meme 🏆', 'Touch. Grass. Immediately. You are the algorithm now.'],
  ];
  const result = [...titles].reverse().find(t => score >= t[0]);
  body.innerHTML = `
    <div class="quiz-result show">
      <div class="result-big">${score}/${quizData.length}</div>
      <div style="font-family:var(--ff-cond);font-size:.65rem;letter-spacing:.25em;color:rgba(244,240,232,0.4);margin-bottom:.75rem">${pct}% MEME LITERACY</div>
      <div class="result-tag">${result[1]}</div>
      <div class="result-msg">${result[2]}</div>
      <button class="btn-primary" onclick="qIndex=0;score=0;renderQuiz()" style="margin:0 auto">
        Try Again →
      </button>
    </div>
  `;
}
renderQuiz();

// ── MODAL ────────────────────────────────
const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');

function openModal(item) {
  document.getElementById('mImg').src = item.img;
  document.getElementById('mEra').textContent = item.era + ' · ' + item.year;
  document.getElementById('mTitle').textContent = item.title;
  document.getElementById('mBody').textContent = item.long;
  document.getElementById('mChips').innerHTML = item.examples.map(e => `<span class="chip">${e}</span>`).join('');
  modalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', closeModal);
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal() {
  modalBg.classList.remove('open');
  document.body.style.overflow = '';
}

// ── NAV SCROLL EFFECT ─────────────────────
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.style.background = window.scrollY > 80
    ? 'rgba(8,8,12,0.95)'
    : 'rgba(8,8,12,0.7)';
});

// ── KONAMI EASTER EGG ─────────────────────
const kc = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  if (e.key === kc[ki]) { ki++; if (ki === kc.length) { ki = 0; triggerEgg(); } }
  else ki = 0;
});
function triggerEgg() {
  const o = document.createElement('div');
  o.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(8,8,12,0.97);backdrop-filter:blur(20px);cursor:none;';
  o.innerHTML = `
    <div style="font-size:5rem;margin-bottom:1rem">🏆</div>
    <div style="font-family:Anton,sans-serif;font-size:4rem;background:linear-gradient(135deg,#e8c547,#ff4d4d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.5rem">KONAMI CODE</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;letter-spacing:.3em;color:rgba(244,240,232,0.4);text-transform:uppercase;margin-bottom:2rem">You are a true internet archaeologist</div>
    <div style="font-size:4rem;letter-spacing:1rem">🐸💀😂🔥🥺</div>
    <div style="font-family:'DM Sans',sans-serif;font-size:.75rem;color:rgba(244,240,232,0.2);margin-top:2rem">click anywhere to close</div>
  `;
  o.addEventListener('click', () => o.remove());
  document.body.appendChild(o);
}

// ── CONSOLE EASTER EGG ───────────────────
console.log('%c🐸 MEMEPLEX', 'font-size:2.5rem;font-weight:bold;color:#e8c547;font-family:Anton,sans-serif');
console.log('%cYou found the console. Certified chronically online.', 'color:#ff4d4d;font-size:1rem');
console.log('%cTry the Konami Code on the page for a surprise 👀', 'color:#c8f53a;font-size:.85rem');
