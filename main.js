document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error('Failed to load header');

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = await res.text();
    } else {
      console.warn('Could not find #header-container. Appending header content to body.');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = await res.text();
      while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
      }
    }

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
    animateFloatingIcons();
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

function animateFloatingIcons() {
  const icons = document.querySelectorAll('.decor-icon');
  
  icons.forEach((icon, index) => {
    const delay = index * 0.1;
    const duration = 3 + Math.random() * 2;
    const distance = 8 + Math.random() * 4;
    const rotation = 2 + Math.random() * 4;
    
    icon.style.animation = `floatIcon ${duration}s ease-in-out ${delay}s infinite`;
    icon.style.setProperty('--float-distance', `${distance}px`);
    icon.style.setProperty('--float-rotation', `${rotation}deg`);
  });
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

  function openLightbox(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Gallery image';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.gallery img')) {
      openLightbox(e.target);
    }
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

  // Move font size control to controls container
  const fontSizeControl = document.querySelector('.font-size-control');
  if (fontSizeControl) {
    controlsContainer.appendChild(fontSizeControl);
  }

  document.body.appendChild(controlsContainer);
}

function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}