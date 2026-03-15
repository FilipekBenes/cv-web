const qs = (selector) => document.querySelector(selector);
const create = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

async function loadData() {
  const response = await fetch('data/cv.yaml');
  const raw = await response.text();
  return JSON.parse(raw);
}

function fillBasics(data) {
  document.title = data.site.title;
  qs('#brandName').textContent = data.personal.name;
  qs('#heroName').textContent = data.personal.name;
  qs('#heroRole').textContent = data.personal.role;
  qs('#heroSummary').textContent = data.personal.tagline;
  qs('#aboutText').textContent = data.personal.summary;
  qs('#currentHeadline').textContent = data.hero.currentHeadline;

  const metaList = qs('#metaList');
  [
    data.personal.location,
    data.personal.birthDate,
    data.personal.email,
    data.personal.phone
  ].forEach((item) => metaList.appendChild(create('li', '', item)));

  qs('#profileImage').src = data.personal.photo;
  qs('#profileImage').alt = `${data.personal.name} — profilová fotografie`;

  qs('#emailBtn').href = `mailto:${data.personal.email}`;
  qs('#githubBtn').href = data.personal.github;
  qs('#linkedinBtn').href = data.personal.linkedin;

  const statGrid = qs('#statGrid');
  data.stats.forEach((stat) => {
    const card = create('div', 'stat-item');
    card.appendChild(create('strong', '', stat.value));
    card.appendChild(create('span', '', stat.label));
    statGrid.appendChild(card);
  });
}

function fillSkills(data) {
  const render = (selector, items) => {
    const root = qs(selector);
    items.forEach((item) => root.appendChild(create('span', 'chip', item)));
  };

  render('#technicalSkills', data.skills.technical);
  render('#softSkills', data.skills.soft);
}

function fillFreelance(data) {
  qs('#freelanceTitle').textContent = data.freelance.title;
  qs('#freelanceDescription').textContent = data.freelance.description;
  qs('#githubLink').href = data.personal.github;
  qs('#linkedinLink').href = data.personal.linkedin;

  const info = qs('#businessInfo');
  data.freelance.items.forEach((item) => {
    info.appendChild(create('dt', '', item.label));
    info.appendChild(create('dd', '', item.value));
  });
}

function renderTimeline(selector, items, mapping) {
  const root = qs(selector);
  items.forEach((item) => {
    const article = create('article', 'timeline-item');
    article.innerHTML = `
      <div class="timeline-meta">${item[mapping.meta]}</div>
      <h3>${item[mapping.title]}</h3>
      <h4>${item[mapping.subtitle]}</h4>
      <p>${item[mapping.description]}</p>
    `;
    root.appendChild(article);
  });
}

function fillLanguages(data) {
  const root = qs('#languageList');
  data.languages.forEach((item) => {
    root.appendChild(create('span', 'language-pill', `${item.name} — ${item.level}`));
  });
}

function fillProjects(data) {
  const root = qs('#projectGrid');
  data.projects.forEach((project) => {
    const article = create('article', 'project-card');
    article.innerHTML = `
      <div class="timeline-meta">${project.period}</div>
      <h3>${project.title}</h3>
      <p><strong>${project.subtitle}</strong></p>
      <p>${project.description}</p>
    `;
    root.appendChild(article);
  });
}

function fillContact(data) {
  qs('#contactTitle').textContent = data.contact.title;
  qs('#contactText').textContent = data.contact.text;

  const root = qs('#contactActions');
  const links = [
    { href: `mailto:${data.personal.email}`, label: 'E-mail' },
    { href: `tel:${data.personal.phone.replace(/\s+/g, '')}`, label: 'Telefon' },
    { href: data.personal.github, label: 'GitHub' },
    { href: data.personal.linkedin, label: 'LinkedIn' }
  ];

  links.forEach((item) => {
    const a = create('a', '', item.label);
    a.href = item.href;
    if (item.href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
    root.appendChild(a);
  });
}

function setupThemeToggle() {
  const toggle = qs('#themeToggle');
  const saved = localStorage.getItem('filip-cv-theme');
  if (saved === 'light') document.body.classList.add('light');

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('filip-cv-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

async function init() {
  try {
    const data = await loadData();
    fillBasics(data);
    fillSkills(data);
    fillFreelance(data);
    renderTimeline('#experienceTimeline', data.experience, {
      meta: 'period',
      title: 'company',
      subtitle: 'role',
      description: 'description'
    });
    renderTimeline('#educationTimeline', data.education, {
      meta: 'period',
      title: 'school',
      subtitle: 'program',
      description: 'description'
    });
    fillLanguages(data);
    fillProjects(data);
    fillContact(data);
    setupThemeToggle();
    setupReveal();
  } catch (error) {
    console.error('Nepodařilo se načíst data CV:', error);
  }
}

init();

document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
