const API_URL = 'http://localhost:5000/api/explore'; 

let currentQuery = '';
let currentType = 'all';
let currentCity = '';
let currentCategory = '';

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn'); 
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const cityFilter = document.getElementById('city-filter');
    const categoryTags = document.querySelectorAll('.category-tag');

    // Initial fetch
    fetchResults();

    if(searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentQuery = searchInput.value;
            fetchResults();
        });
    }

    typeFilter.addEventListener('change', () => {
        currentType = typeFilter.value;
        fetchResults();
    });

    cityFilter.addEventListener('change', () => {
        currentCity = cityFilter.value;
        fetchResults();
    });

    // Category tag filtering
    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            categoryTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentCategory = tag.dataset.category;
            currentType = 'monuments'; // Set type to monuments for categories
            fetchResults();
        });
    });

    // Load cities for filter
    loadCities();
});

async function loadCities() {
    try {
        const response = await fetch(`${API_URL}/cities`);
        const cities = await response.json();
        const cityFilter = document.getElementById('city-filter');
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading cities:', error);
    }
}

async function fetchResults() {
    try {
        let url = API_URL;
        const params = new URLSearchParams();
        if (currentQuery) params.append('query', currentQuery);
        if (currentType !== 'all') params.append('type', currentType);
        if (currentCity) params.append('city', currentCity);
        if (currentCategory) params.append('category', currentCategory);
        if (params.toString()) url += '?' + params.toString();

        const response = await fetch(url);
        const data = await response.json();
        
        displayResults(data, currentType);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(data, type) {
    const container = document.getElementById('results-container'); 
    if (!container) return;
    container.innerHTML = '';

    let items = [];
    if (type === 'restaurants' || type === 'all') {
        items = items.concat(data.restaurants || []);
    }
    if (type === 'monuments' || type === 'all') {
        items = items.concat(data.monuments || []);
    }

    if(!items || items.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'card';
        const isLoggedIn = localStorage.getItem('token');
        
        if (item.Name) { // restaurant
            el.innerHTML = `
                <h3>${item.Name}</h3>
                <p><strong>City:</strong> ${item.City}</p>
                <p><strong>Location:</strong> ${item.Location}</p>
                <p><strong>Cuisine:</strong> ${item.Cuisine ? item.Cuisine.join(', ') : ''}</p>
                <p><strong>Rating:</strong> ${item.Rating} ⭐ (${item.Votes} votes)</p>
                <p><strong>Cost:</strong> ₹${item.Cost}</p>
                ${isLoggedIn ? '<button class="save-btn" data-type="restaurant" data-id="' + item._id + '">Save</button>' : ''}
            `;
        } else if (item.name) { // monument
            el.innerHTML = `
                <img src="${item.imageurl}" alt="${item.name}" style="width:100%; height:auto; max-height:200px; object-fit:cover;">
                <h3>${item.name}</h3>
                <p><strong>City:</strong> ${item.city}, ${item.state}</p>
                <p><strong>Type:</strong> ${item.type} - ${item.significance}</p>
                <p><strong>Rating:</strong> ${item.reviewrating} ⭐</p>
                <p><strong>Fee:</strong> ₹${item.entrancefee}</p>
                <p><strong>Time Needed:</strong> ${item.timeneeded}</p>
                <a href="${item.googlemapslink}" target="_blank">View on Maps</a>
                ${isLoggedIn ? '<button class="save-btn" data-type="monument" data-id="' + item._id + '">Save</button>' : ''}
            `;
        }
        container.appendChild(el);
    });

    // Add event listeners to save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', handleSave);
    });
}

async function handleSave(event) {
    const btn = event.target;
    const type = btn.dataset.type;
    const id = btn.dataset.id;
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please login to save destinations');
        return;
    }

    if (type !== 'monument' && type !== 'restaurant') {
        alert('Only monuments and restaurants can be saved currently');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/explore/save/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            btn.textContent = 'Saved';
            btn.disabled = true;
            btn.style.background = '#28a745';
        } else {
            alert('Failed to save destination');
        }
    } catch (error) {
        console.error('Error saving destination:', error);
        alert('Error saving destination');
    }
}