document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error('Failed to load header');

    document.getElementById('header-container').innerHTML = await res.text();

    highlightActiveNav();
    setupFloatingIcons();
    setupIconInteractions();
    setupLightbox();

    const y = new Date().getFullYear();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = y;
  } catch (err) {
    console.error('Header load error:', err);
  }
}

function highlightActiveNav() {
  const current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-buttons a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === current)
  );
}

function setupFloatingIcons() {
  const frag = document.createDocumentFragment();

  for (let i = 1; i <= 10; i++) {
    const img = document.createElement('img');
    img.src = `assets/shared/icon${i}.png`;
    img.className = `decor-icon icon${i}`;
    img.alt = '';
    frag.appendChild(img);
  }

  const container = document.createElement('div');
  container.className = 'floating-icons';
  container.appendChild(frag);

  const headerWrapper =
    document.querySelector('.header-area') ||
    document.querySelector('#header') ||
    document.querySelector('header') ||
    document.getElementById('header-container');

  const attach = headerWrapper?.querySelector('.header') || headerWrapper;

  if (attach?.appendChild) {
    attach.appendChild(container);
  } else {
    console.warn('Could not find a header element to attach icons; icons were not added.');
  }
}

function setupIconInteractions() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.classList && t.classList.contains('decor-icon')) {
      t.classList.add('pressed');
      setTimeout(() => t.classList.remove('pressed'), 200);
    }
  });
}

function setupLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">×</button>
    <div class="lightbox-content">
      <img src="" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupLightbox();
});