// frontend/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleAuth = document.getElementById('toggle-auth');
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username');
    const modalTitle = document.getElementById('modal-title');
    const authSubmit = document.getElementById('auth-submit');

    let isLogin = true;

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    if (toggleAuth) {
        toggleAuth.addEventListener('click', () => {
            isLogin = !isLogin;
            if (isLogin) {
                modalTitle.innerText = 'Login';
                usernameInput.style.display = 'none';
                usernameInput.removeAttribute('required');
                authSubmit.innerText = 'Login';
                toggleAuth.innerHTML = `Don't have an account? <span>Sign up</span>`;
            } else {
                modalTitle.innerText = 'Sign Up';
                usernameInput.style.display = 'block';
                usernameInput.setAttribute('required', 'true');
                authSubmit.innerText = 'Sign Up';
                toggleAuth.innerHTML = `Already have an account? <span>Login</span>`;
            }
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = usernameInput.value;

            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email, password } : { username, email, password };

            try {
                const res = await fetch(`http://localhost:5000${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    loginModal.style.display = 'none';
                    window.location.reload();
                } else {
                    alert(data.msg || 'Authentication failed');
                }
            } catch (err) {
                console.error('Auth error', err);
                alert('Server error. Please try again later.');
            }
        });
    }
});