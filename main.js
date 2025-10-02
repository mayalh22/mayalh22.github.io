document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load header');
      return res.text();
    })
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      highlightActiveNav();
      setupIconInteractions();
    })
    .catch(err => console.error('Header load error:', err));
});

function highlightActiveNav() {
  const navButtons = document.querySelectorAll('.nav-buttons a button');
  const currentPage = window.location.pathname.split('/').pop();

  navButtons.forEach(button => {
    const link = button.parentElement.getAttribute('href');
    if (link === currentPage) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function setupIconInteractions() {
  const icons = document.querySelectorAll('.decor-icon');

  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transition = 'transform 0.5s ease';
      icon.style.transform = 'rotate(360deg)';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'rotate(0deg)';
    });

    icon.addEventListener('click', () => {
      icon.style.transition = 'transform 0.3s ease';
      icon.style.transform = 'scale(1.3)';
      setTimeout(() => {
        icon.style.transform = 'scale(1)';
      }, 300);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Load header.html as before
  fetch('header.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;

      // Your existing nav active button code here...

      // Inject floating icons dynamically
      const iconsContainer = document.createElement('div');
      iconsContainer.classList.add('floating-icons');

      // You can generate the icon elements programmatically:
      for (let i = 1; i <= 10; i++) {
        const img = document.createElement('img');
        img.src = `assets/shared/icon${i}.png`;
        img.classList.add('decor-icon', `icon${i}`);
        img.alt = ''; // empty alt if decorative
        iconsContainer.appendChild(img);
      }

      document.body.appendChild(iconsContainer);
    })
    .catch(err => console.error('Error loading header:', err));
});
