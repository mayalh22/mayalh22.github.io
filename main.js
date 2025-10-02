document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load header');
            return res.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            highlightActiveNav();
            setupFloatingIcons();
            setupIconInteractions();
        })
        .catch(err => console.error('Header load error:', err));
});

function highlightActiveNav() {
    const navButtons = document.querySelectorAll('.nav-buttons a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navButtons.forEach(linkElement => {
        const link = linkElement.getAttribute('href');
        if (link === currentPage) {
            linkElement.classList.add('active');
        } else {
            linkElement.classList.remove('active');
        }
    });
}
function setupFloatingIcons() {
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('floating-icons');

    for (let i = 1; i <= 10; i++) {
        const img = document.createElement('img');
        img.src = `assets/shared/icon${i}.png`;
        img.classList.add('decor-icon', `icon${i}`);
        img.alt = '';
        iconsContainer.appendChild(img);
    }
    const headerWrapper = document.querySelector('.header-area');
    if (headerWrapper) {
        headerWrapper.appendChild(iconsContainer);
    } else {
        document.body.appendChild(iconsContainer);
        console.error('Could not find .header-area to attach icons.');
    }
}
function setupIconInteractions() {
    const icons = document.querySelectorAll('.decor-icon');

    icons.forEach(icon => {

        icon.addEventListener('click', () => {
            icon.style.transition = 'transform 200ms ease';
            icon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
        });
    });
}