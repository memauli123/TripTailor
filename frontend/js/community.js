// frontend/js/community.js
const API_URL = 'http://localhost:5000/api/blogs';

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogs();
    
    if (!localStorage.getItem('token')) {
        document.getElementById('blog-form').style.display = 'none';
        document.getElementById('login-prompt').style.display = 'block';
    }
});

document.getElementById('blog-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const blogData = {
        title: document.getElementById('blog-title').value,
        location: document.getElementById('blog-location').value,
        image: document.getElementById('blog-image').value,
        content: document.getElementById('blog-content').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(blogData)
        });
        
        if (res.ok) {
            document.getElementById('blog-form').reset();
            fetchBlogs();
        }
    } catch (err) {
        console.error('Post failed', err);
    }
});

async function fetchBlogs() {
    try {
        const res = await fetch(API_URL);
        const blogs = await res.json();
        const container = document.getElementById('blog-feed');
        container.innerHTML = '';

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = user.id;
        console.log('Current user ID:', currentUserId);

        blogs.forEach(blog => {
            console.log('Blog author ID:', blog.author._id);
            const isAuthor = blog.author._id === currentUserId;
            console.log('Is author:', isAuthor);
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                ${blog.image ? `<img src="${blog.image}" loading="lazy">` : ''}
                <div class="card-content">
                    <h2>${blog.title}</h2>
                    <small>By ${blog.author.username} | 📍 ${blog.location}</small>
                    <p>${blog.content}</p>
                    ${isAuthor ? `<button class="delete-btn" data-id="${blog._id}">Delete</button>` : ''}
                </div>
            `;
            container.appendChild(div);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const blogId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this blog?')) {
                    await deleteBlog(blogId);
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
}

async function deleteBlog(blogId) {
    const token = localStorage.getItem('token');
    console.log('Deleting blog ID:', blogId, 'Token:', token);
    try {
        const res = await fetch(`${API_URL}/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Delete response status:', res.status);
        if (res.ok) {
            fetchBlogs(); // Refresh the feed
        } else {
            const error = await res.json();
            console.log('Delete error:', error);
            alert('Failed to delete blog: ' + (error.msg || 'Unknown error'));
        }
    } catch (err) {
        console.error('Delete failed', err);
        alert('Delete failed: ' + err.message);
    }
}