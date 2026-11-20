// Leonida Trophy Field Guide: an offline tracker for the 55 GTA VI trophies.
// Progress lives only in this browser (localStorage). The guide fetches nothing
// over the network: the only request it makes is for its own data/trophies.json.
const KEY = 'gta6-trophy-guide-progress';
const BANNER_KEY = 'gta6-trophy-guide-banner';

const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const $ = (id) => document.getElementById(id);
const cardsEl = $('cards');
const countEl = $('count');
const emptyEl = $('empty');
const progressFill = $('progress-fill');
const progressText = $('progress-text');
const gradeProgress = $('grade-progress');
const searchEl = $('search');
const gradeEl = $('grade');
const kindEl = $('kind');
const earnedOnlyEl = $('earned-only');
const missableOnlyEl = $('missable-only');
const spoilerEl = $('spoiler');
const bannerEl = $('missable-banner');

let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]').filter((n) => Number.isInteger(n)));
} catch {
  earned = new Set();
}

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function gradeLabel(grade) {
  return grade[0].toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  return { story: 'Story', progress: 'Progress', activities: 'Activities', strangers: 'Strangers', collectibles: 'Collectibles', robbery: 'Robbery', money: 'Money', misc: 'Miscellaneous' }[kind] ?? kind;
}

function state() {
  return {
    view: params.get('view') === 'roadmap' ? 'roadmap' : 'checklist',
    grade: gradeEl.value,
    kind: kindEl.value,
    q: searchEl.value.trim().toLowerCase(),
    earnedOnly: earnedOnlyEl.checked,
    missableOnly: missableOnlyEl.checked,
    spoiler: spoilerEl.checked,
    open: Number(params.get('open') ?? 0) || 0,
  };
}

function syncUrl() {
  const next = new URLSearchParams();
  const s = state();
  if (s.view === 'roadmap') next.set('view', 'roadmap');
  if (s.grade !== 'all') next.set('grade', s.grade);
  if (s.kind !== 'all') next.set('kind', s.kind);
  if (s.q) next.set('q', s.q);
  if (s.earnedOnly) next.set('earned', '1');
  if (s.missableOnly) next.set('missable', '1');
  if (s.spoiler) next.set('spoiler', 'on');
  if (s.open) next.set('open', String(s.open));
  history.replaceState(null, '', next.toString() ? `?${next}` : location.pathname);
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.id)).length;
  const pct = Math.round((done / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done} of ${total} earned · ${pct}%`;
  gradeProgress.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const group = trophies.filter((t) => t.grade === grade);
    const got = group.filter((t) => earned.has(t.id)).length;
    const span = document.createElement('span');
    span.innerHTML = '';
    const label = document.createElement('b');
    label.textContent = gradeLabel(grade);
    span.append(label, document.createTextNode(` ${got}/${group.length}`));
    gradeProgress.append(span);
  }
}

function cardFor(t, spoilerOn) {
  const isEarned = earned.has(t.id);
  const hidden = spoilerOn && t.kinds.includes('story') && !isEarned;
  const card = document.createElement('article');
  card.className = 'card' + (isEarned ? ' earned' : '');
  card.dataset.id = String(t.id);

  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${hidden ? 'this story trophy' : t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    save();
    render();
  });
  const title = document.createElement('div');
  title.className = 'card-title';
  const h3 = document.createElement('h3');
  h3.textContent = hidden ? 'Story trophy — hidden until earned' : t.name;
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = hidden ? 'Spoiler-free mode hides this trophy until you earn it.' : t.description;
  title.append(h3, desc);
  head.append(box, title);
  card.append(head);

  const badges = document.createElement('div');
  badges.className = 'badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge ${t.grade}`;
  gradeBadge.textContent = gradeLabel(t.grade);
  badges.append(gradeBadge);
  for (const kind of t.kinds) {
    const b = document.createElement('span');
    b.className = 'badge kind';
    b.textContent = kindLabel(kind);
    badges.append(b);
  }
  if (t.missable) {
    const b = document.createElement('span');
    b.className = 'badge missable';
    b.textContent = 'Missable';
    badges.append(b);
  }
  card.append(badges);

  const details = document.createElement('details');
  if (state().open === t.id) details.open = true;
  const summary = document.createElement('summary');
  summary.textContent = hidden ? 'Guide hidden until earned' : 'How to get it';
  details.append(summary);
  const guide = document.createElement('div');
  guide.className = 'guide';
  if (hidden) {
    const p = document.createElement('p');
    p.className = 'spoiler-hidden';
    p.textContent = 'Spoiler-free mode hides this story trophy until you earn it. Turn the mode off to read the guide, or tick the box once you have it.';
    guide.append(p);
  } else {
    for (const paragraph of t.guide.split('\n\n')) {
      const p = document.createElement('p');
      p.textContent = paragraph;
      guide.append(p);
    }
  }
  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.append(document.createTextNode('Sources: '));
  t.sources.forEach((s, i) => {
    if (i > 0) sources.append(document.createTextNode(' · '));
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.label;
    a.rel = 'noopener';
    sources.append(a);
  });
  guide.append(sources);
  details.append(guide);
  card.append(details);
  return card;
}

function render() {
  const s = state();
  const shown = trophies.filter((t) => {
    if (s.grade !== 'all' && t.grade !== s.grade) return false;
    if (s.kind !== 'all' && !t.kinds.includes(s.kind)) return false;
    if (s.earnedOnly && !earned.has(t.id)) return false;
    if (s.missableOnly && !t.missable) return false;
    if (s.q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${t.kinds.join(' ')}`.toLowerCase();
      if (!hay.includes(s.q)) return false;
    }
    return true;
  });
  cardsEl.replaceChildren();
  for (const t of shown) cardsEl.append(cardFor(t, s.spoiler));
  const earnedShown = shown.filter((t) => earned.has(t.id)).length;
  countEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earnedShown} earned in this view`;
  emptyEl.hidden = shown.length > 0;
  renderProgress();
  syncUrl();
}

function setTab(view) {
  const isRoadmap = view === 'roadmap';
  $('tab-checklist').classList.toggle('active', !isRoadmap);
  $('tab-roadmap').classList.toggle('active', isRoadmap);
  $('tab-checklist').setAttribute('aria-selected', String(!isRoadmap));
  $('tab-roadmap').setAttribute('aria-selected', String(isRoadmap));
  $('view-checklist').hidden = isRoadmap;
  $('view-roadmap').hidden = !isRoadmap;
  params.set('view', view);
  syncUrl();
}

$('tab-checklist').addEventListener('click', () => setTab('checklist'));
$('tab-roadmap').addEventListener('click', () => setTab('roadmap'));

for (const el of [searchEl, gradeEl, kindEl, earnedOnlyEl, missableOnlyEl, spoilerEl]) {
  el.addEventListener('input', render);
}

$('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ earned: [...earned].sort((x, y) => x - y), exported: new Date().toISOString().slice(0, 10) })], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const next = new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= trophies.length));
    earned = next;
    save();
    render();
  } catch {
    alert('That file is not a progress export from this guide.');
  }
  e.target.value = '';
});

$('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies? This cannot be undone.')) {
    earned = new Set();
    save();
    render();
  }
});

if (localStorage.getItem(BANNER_KEY) === '1' || params.get('banner') === 'off') {
  bannerEl.hidden = true;
}
$('banner-dismiss').addEventListener('click', () => {
  bannerEl.hidden = true;
  localStorage.setItem(BANNER_KEY, '1');
});

// Apply the starting state from the URL, then render once.
if (params.get('view') === 'roadmap') setTab('roadmap');
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('kind')) kindEl.value = params.get('kind');
if (params.get('q')) searchEl.value = params.get('q');
if (params.get('earned') === '1') earnedOnlyEl.checked = true;
if (params.get('missable') === '1') missableOnlyEl.checked = true;
if (params.get('spoiler') === 'on') spoilerEl.checked = true;
render();
