// frontend/js/profile.js
document.addEventListener('DOMContentLoaded', () => {
    loadSavedDestinations();
});

async function loadSavedDestinations() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            displaySavedDestinations(user.savedDestinations);
        }
    } catch (error) {
        console.error('Error loading saved destinations:', error);
    }
}

function displaySavedDestinations(destinations) {
    const container = document.getElementById('saved-items-container');
    if (!container) return;

    container.innerHTML = '';

    if (!destinations || destinations.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; color: gray;">You haven\'t saved anything yet.</p>';
        return;
    }

    destinations.forEach(destination => {
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
            <img src="${destination.imageurl}" alt="${destination.name}" style="width:100%; height:auto; max-height:200px; object-fit:cover;">
            <h3>${destination.name}</h3>
            <p><strong>City:</strong> ${destination.city}, ${destination.state}</p>
            <p><strong>Type:</strong> ${destination.type} - ${destination.significance}</p>
            <p><strong>Rating:</strong> ${destination.reviewrating} ⭐</p>
            <p><strong>Fee:</strong> ₹${destination.entrancefee}</p>
            <p><strong>Time Needed:</strong> ${destination.timeneeded}</p>
            <a href="${destination.googlemapslink}" target="_blank">View on Maps</a>
            <button class="unsave-btn" data-id="${destination._id}">Unsave</button>
        `;
        container.appendChild(el);
    });

    // Add event listeners to unsave buttons
    document.querySelectorAll('.unsave-btn').forEach(btn => {
        btn.addEventListener('click', handleUnsave);
    });
}

async function handleUnsave(event) {
    const btn = event.target;
    const id = btn.dataset.id;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:5000/api/explore/save/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Remove the card from the UI
            btn.closest('.card').remove();
            // Reload to update the list
            loadSavedDestinations();
        } else {
            alert('Failed to unsave destination');
        }
    } catch (error) {
        console.error('Error unsaving destination:', error);
        alert('Error unsaving destination');
    }
}