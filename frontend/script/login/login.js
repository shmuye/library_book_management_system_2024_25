const API_URL = 'http://localhost:3000/books'; // Base URL for book-related endpoints
const AUTH_URL = 'http://localhost:3000/auth'; // Base URL for authentication endpoints

function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const name = email.split('@')[0];
    const userRole = email.includes('admin.com') ? 'ADMIN' : 'USER';

    if (!email || !password) {
        showMessage('Please fill in both fields.', 'danger');
        return;
    }

    const userCredentials = { email, password, name, userRole };
    
    fetch(`${AUTH_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCredentials),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.access_token);
        window.location.href = './home.html';
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(error.message, 'danger');
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `alert alert-${type}`;
        messageDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
});

// Example of an authenticated request
function fetchBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Missing token. Please log in again.', 'danger');
        return;
    }

    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to fetch books');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Books:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(error.message, 'danger');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
});