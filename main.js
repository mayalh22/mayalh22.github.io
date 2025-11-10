document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error('Failed to load header');

    document.getElementById('header-container').innerHTML = await res.text();

    // Font size setup
    const select = document.getElementById("font-size-select");
    if (select) {
      const savedSize = localStorage.getItem("preferredFontSize");
      if (savedSize) {
        document.documentElement.style.setProperty("--base-font-size", savedSize);
        select.value = savedSize;
      }
      select.addEventListener("change", (e) => {
        const size = e.target.value;
        document.documentElement.style.setProperty("--base-font-size", size);
        localStorage.setItem("preferredFontSize", size);
      });
    }

    highlightActiveNav();
    setupFloatingIcons();
    setupIconInteractions();
    setupLightbox();
    setupDarkMode();
    updateYear();
  } catch (err) {
    console.error('Header load error:', err);
  }
}

function highlightActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-buttons a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === current);
  });
}

function setupFloatingIcons() {
  const headerWrapper = document.querySelector('.header-area') || 
                        document.querySelector('#header') || 
                        document.querySelector('header') || 
                        document.getElementById('header-container');

  const attach = headerWrapper?.querySelector('.header') || headerWrapper;

  if (!attach?.appendChild) {
    console.warn('Could not find a header element to attach icons.');
    return;
  }

  const container = document.createElement('div');
  container.className = 'floating-icons';

  for (let i = 1; i <= 10; i++) {
    const img = document.createElement('img');
    img.src = `assets/shared/icon${i}.png`;
    img.className = `decor-icon icon${i}`;
    img.alt = '';
    img.loading = 'lazy';
    container.appendChild(img);
  }

  attach.appendChild(container);
}

function setupIconInteractions() {
  document.addEventListener('click', e => {
    if (e.target.classList?.contains('decor-icon')) {
      e.target.classList.add('pressed');
      setTimeout(() => e.target.classList.remove('pressed'), 200);
    }
  });
}

function setupLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Image lightbox');
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">×</button>
    <div class="lightbox-content">
      <img src="" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery image';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function setupDarkMode() {
  // Create container for both controls
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'controls-container';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'dark-mode-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
  toggleBtn.textContent = 'D';

  const savedMode = localStorage.getItem('dark-mode');
  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = 'L';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    toggleBtn.textContent = isDark ? 'L' : 'D';
    localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
  });

  controlsContainer.appendChild(toggleBtn);
  document.body.appendChild(controlsContainer);
}

function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}