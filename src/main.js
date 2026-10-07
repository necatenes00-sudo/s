import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
function replaceSymbols(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.parentElement?.closest('script, style, textarea')) continue;
    if (/[↗↘↑↓✳]/.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
  }
  const paths = {
    '↗': 'M5 19 19 5M5 5h14v14',
    '↘': 'm5 5 14 14M5 19h14V5',
    '↑': 'M12 21V3m-7 7 7-7 7 7',
    '↓': 'M12 3v18m-7-7 7 7 7-7',
    '✳': 'M12 1v22M1 12h22M4 4l16 16M4 20 20 4',
  };
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.nodeValue.split(/([↗↘↑↓✳])/)) {
      if (!paths[part]) { fragment.append(document.createTextNode(part)); continue; }
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('class', 'inline-icon');
      icon.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', paths[part]);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', part === '✳' ? '2.3' : '1.4');
      icon.append(path);
      fragment.append(icon);
    }
    node.replaceWith(fragment);
  }
}
replaceSymbols();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const header = document.querySelector('.header');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.inert = !open;
  header.classList.toggle('menu-is-open', open);
  document.body.classList.toggle('modal-open', open);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
  if (event.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
    const last = mobileMenu.querySelector('a:last-of-type');
    if (event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); menuButton.focus();
    }
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

function updateClock() {
  document.querySelector('#local-time').textContent = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 60_000);
document.querySelector('#year').textContent = new Date().getFullYear();

gsap.to('.scroll-progress', {
  width: '100%', ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true },
});
if (!reducedMotion) {
  gsap.from('.hero-copy > *', { y: 25, duration: 0.85, stagger: 0.1, ease: 'power3.out' });
  gsap.utils.toArray('[data-reveal]').forEach(element => {
    gsap.from(element, { y: 35, autoAlpha: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
  });
  gsap.utils.toArray('.project-image img').forEach(element => {
    gsap.fromTo(element, { scale: 1.09, yPercent: -3 }, { scale: 1.02, yPercent: 0, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
  });
}

const projects = {
  luma: { title: 'Luma®', subtitle: 'Bakımın yeni doğası.', category: 'MARKA & DİJİTAL', description: 'Doğadan ilham alan bir cilt bakım markası için sade, duyusal ve zamansız bir dünya. Lavanta tonları, yumuşak formlar ve rafine tipografi; ambalajdan dijital deneyime uzanan tutarlı bir kimlikte buluşuyor.', scope: 'Marka kimliği, ambalaj, UI/UX', color: '#ded7ed' },
  forma: { title: 'Forma®', subtitle: 'Mekânın ötesinde.', category: 'WEB DENEYİMİ', description: 'Mimarlığı yalnızca bir yapı olarak değil, bir his olarak ele alan dijital konsept. Heykelsi geometriler, doğal tonlar ve cömert boşluklar; projelerin nefes aldığı bir portfolyo deneyimi yaratıyor.', scope: 'Sanat yönetimi, web tasarımı', color: '#c6c6a7' },
  volt: { title: 'Volt®', subtitle: 'Frekansını değiştir.', category: 'SANAT YÖNETİMİ', description: 'Müziğin enerjisini görsel bir dile dönüştüren festival kimliği. Cesur renkler, ritmik tipografi ve hareket hissi veren formlar; fiziksel ve dijital mecralarda aynı frekansta buluşuyor.', scope: 'Görsel kimlik, kampanya, motion', color: '#ff684d' },
};

const dialogReturnFocus = new WeakMap();
function openDialog(dialog) {
  setMenu(false);
  dialogReturnFocus.set(dialog, document.activeElement);
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) {
      document.body.classList.remove('modal-open');
      dialogReturnFocus.get(dialog)?.focus({ preventScroll: true });
    }
  });
});
const projectDialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.project;
  const project = projects[key];
  const projectImage = button.querySelector('img').getAttribute('src');
  const content = document.querySelector('.project-dialog-content');
  content.innerHTML = `<div class="project-dialog-image" style="background:${project.color}"><img src="${projectImage}" alt="${project.title} görsel tasarım konsepti" width="1200" height="900"></div><div class="project-dialog-copy"><p class="eyebrow">${project.category} / KONSEPT ÇALIŞMA</p><h2 id="project-dialog-title">${project.title} — ${project.subtitle}</h2><p class="project-dialog-description">${project.description}</p><div class="project-dialog-meta"><div><strong>KAPSAM</strong>${project.scope}</div><div><strong>YIL</strong>2026</div><div><strong>TÜR</strong>Stüdyo konsepti</div></div><button class="text-link project-contact">Sizin markanız için de düşünelim <span>↗</span></button></div>`;
  replaceSymbols(content);
  content.querySelector('.project-contact').addEventListener('click', () => {
    projectDialog.close();
    openDialog(document.querySelector('#contact-dialog'));
  });
  openDialog(projectDialog);
}));

const contactDialog = document.querySelector('#contact-dialog');
document.querySelectorAll('#open-contact, #open-contact-secondary').forEach(button => button.addEventListener('click', () => openDialog(contactDialog)));
const form = document.querySelector('#contact-form');
let brief = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  brief = `DEMİR DIGITAL — PROJE ÖZETİ\n\nAd: ${data.get('name').trim()}\nE-posta: ${data.get('email').trim()}\nİhtiyaç: ${data.get('service')}\n\nProje hakkında:\n${data.get('message').trim()}\n\nBu özet tarayıcıda hazırlandı. Bilgiler bir sunucuya gönderilmedi.\n`;
  document.querySelector('#brief-preview').textContent = brief;
  form.hidden = true;
  form.style.display = 'none';
  document.querySelector('#brief-result').hidden = false;
  document.querySelector('#download-brief').focus();
});
document.querySelector('#download-brief').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob(['\uFEFF', brief], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'demir-digital-proje-ozeti.txt';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.querySelector('#edit-brief').addEventListener('click', () => {
  document.querySelector('#brief-result').hidden = true;
  form.hidden = false;
  form.style.removeProperty('display');
  form.elements.name.focus();
});

document.querySelectorAll('.service').forEach(details => details.addEventListener('toggle', () => {
  ScrollTrigger.refresh();
}));

// Load the GPU scene separately so navigation and content are usable immediately.
import('./scene.js').then(({ initScene }) => initScene(reducedMotion)).catch(() => {
  document.querySelector('.hero-art').dataset.renderer = 'fallback';
});
