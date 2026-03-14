// frontend/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    const token = localStorage.getItem('token');
    const authNav = document.getElementById('auth-nav');
    const profileLink = document.getElementById('profile-link');
    
    if (token) {
        if (authNav) {
            authNav.innerHTML = `<a href="#" id="logout-btn">Logout</a>`;
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
        if (profileLink) {
            profileLink.style.display = 'inline-block';
        }
    }

    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    
        lastScrollTop = scrollTop;
    });

    // Load trending destinations
    loadTrendingDestinations();
});

async function loadTrendingDestinations() {
    console.log('Loading trending destinations');
    try {
        const response = await fetch('http://localhost:5000/api/explore/top-cities');
        console.log('Response status:', response.status);
        if (!response.ok) {
            console.error('Response not ok:', response.statusText);
            return;
        }
        const cities = await response.json();
        console.log('Fetched cities:', cities);
        const container = document.getElementById('trending-container');
        console.log('Container:', container);
        if (!container) {
            console.error('Container not found');
            return;
        }

        cities.forEach(city => {
            const imageUrl = city.imageurl || 'https://via.placeholder.com/300x150?text=No+Image';
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${city.city}">
                <div class="card-content">
                    <h3>${city.city}</h3>
                    <p>Average Rating: ${city.avgRating.toFixed(1)} ⭐</p>
                    <p>${city.count} attractions</p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading trending destinations:', error);
    }
}