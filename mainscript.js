// Global database
let orbitDB = {
    users: [],
    messages: [],
    forumTopics: [],
    marketplaceListings: [],
    currentUser: null
};

// Load data from server (localStorage for demo)
function loadData() {
    const saved = localStorage.getItem('orbitDB');
    if (saved) {
        orbitDB = JSON.parse(saved);
    } else {
        // Initial data
        orbitDB = {
            users: [
                { id: 1, name: 'ShadowWalker', password: '123', avatar: '👤', status: 'online', joined: Date.now() - 86400000 },
                { id: 2, name: 'CyberWizard', password: '123', avatar: '🧙', status: 'offline', joined: Date.now() - 172800000 },
                { id: 3, name: 'NightHacker', password: '123', avatar: '👾', status: 'online', joined: Date.now() - 259200000 }
            ],
            messages: [
                { id: 1, from: 1, to: 2, text: 'Hey, how are you?', timestamp: Date.now() - 3600000, read: true },
                { id: 2, from: 2, to: 1, text: 'Good, exploring Orbit!', timestamp: Date.now() - 1800000, read: true }
            ],
            forumTopics: [
                { 
                    id: 1, 
                    title: 'How to stay anonymous online?', 
                    author: 1, 
                    likes: 15, 
                    createdAt: Date.now() - 86400000,
                    messages: [
                        { id: 1, author: 2, text: 'Use VPN and Tor browser', likes: 5, timestamp: Date.now() - 86000000 },
                        { id: 2, author: 3, text: 'Dont forget about private mode', likes: 3, timestamp: Date.now() - 85000000 }
                    ]
                },
                { 
                    id: 2, 
                    title: 'Best digital services 2024', 
                    author: 2, 
                    likes: 25, 
                    createdAt: Date.now() - 172800000,
                    messages: [
                        { id: 3, author: 1, text: 'Web development is booming', likes: 8, timestamp: Date.now() - 170000000 }
                    ]
                }
            ],
            marketplaceListings: [
                { 
                    id: 1, 
                    title: 'Telegram Bot Development', 
                    description: 'Custom bots for any purpose. Python, aiogram.', 
                    price: '$100', 
                    seller: 1,
                    category: 'Development',
                    createdAt: Date.now() - 172800000
                },
                { 
                    id: 2, 
                    title: 'Logo Design', 
                    description: 'Unique brand identity design. 3 concepts.', 
                    price: '$80', 
                    seller: 2,
                    category: 'Design',
                    createdAt: Date.now() - 86400000
                }
            ],
            currentUser: null
        };
        saveData();
    }
    updateUI();
}

function saveData() {
    localStorage.setItem('orbitDB', JSON.stringify(orbitDB));
}

// Auth functions
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'authModal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Welcome to Orbit</h2>
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                <button class="tab-btn active" onclick="showLoginForm()">Login</button>
                <button class="tab-btn" onclick="showRegisterForm()">Register</button>
            </div>
            <div id="authForm">
                <input type="text" id="authName" placeholder="Username">
                <input type="password" id="authPassword" placeholder="Password">
                <button class="save-btn" onclick="login()" id="authAction">Login</button>
            </div>
            <button class="cancel-btn" onclick="closeModal()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showLoginForm() {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('authForm').innerHTML = `
        <input type="text" id="authName" placeholder="Username">
        <input type="password" id="authPassword" placeholder="Password">
        <button class="save-btn" onclick="login()">Login</button>
    `;
}

function showRegisterForm() {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('authForm').innerHTML = `
        <input type="text" id="authName" placeholder="Username">
        <input type="password" id="authPassword" placeholder="Password">
        <button class="save-btn" onclick="register()">Register</button>
    `;
}

function login() {
    const name = document.getElementById('authName').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    
    const user = orbitDB.users.find(u => u.name === name && u.password === password);
    if (user) {
        orbitDB.currentUser = user;
        user.status = 'online';
        saveData();
        closeModal();
        updateUI();
    } else {
        alert('Invalid credentials');
    }
}

function register() {
    const name = document.getElementById('authName').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    
    if (!name || !password) {
        alert('Please fill all fields');
        return;
    }
    
    if (orbitDB.users.find(u => u.name === name)) {
        alert('Username already exists');
        return;
    }
    
    const newUser = {
        id: orbitDB.users.length + 1,
        name: name,
        password: password,
        avatar: ['👤', '🧙', '👾', '🎨', '🦊', '🐉'][Math.floor(Math.random() * 6)],
        status: 'online',
        joined: Date.now()
    };
    
    orbitDB.users.push(newUser);
    orbitDB.currentUser = newUser;
    saveData();
    closeModal();
    updateUI();
}

function logout() {
    if (orbitDB.currentUser) {
        orbitDB.currentUser.status = 'offline';
        orbitDB.currentUser = null;
        saveData();
        updateUI();
    }
}

function closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.remove();
}

// Update UI based on login status
function updateUI() {
    const navLinks = document.getElementById('navLinks');
    const features = document.getElementById('featuresSection');
    
    if (orbitDB.currentUser) {
        navLinks.innerHTML = `
            <span class="user-name">${orbitDB.currentUser.avatar} ${orbitDB.currentUser.name}</span>
            <a href="messenger.html">Messenger</a>
            <a href="forum.html">Forum</a>
            <a href="shop.html">Market</a>
            <button class="logout-btn" onclick="logout()">Logout</button>
        `;
        
        features.innerHTML = `
            <a href="messenger.html" class="feature-card">
                <div class="feature-icon">💬</div>
                <div class="feature-title">Messenger</div>
                <div class="feature-desc">Chat with ${orbitDB.users.length - 1} other users</div>
            </a>
            <a href="forum.html" class="feature-card">
                <div class="feature-icon">📢</div>
                <div class="feature-title">Forum</div>
                <div class="feature-desc">${orbitDB.forumTopics.length} topics to discuss</div>
            </a>
            <a href="shop.html" class="feature-card">
                <div class="feature-icon">🛒</div>
                <div class="feature-title">Marketplace</div>
                <div class="feature-desc">${orbitDB.marketplaceListings.length} digital services</div>
            </a>
        `;
    } else {
        navLinks.innerHTML = `
            <button class="logout-btn" onclick="showLoginModal()">Login / Register</button>
        `;
        
        features.innerHTML = `
            <div class="feature-card" onclick="showLoginModal()">
                <div class="feature-icon">💬</div>
                <div class="feature-title">Messenger</div>
                <div class="feature-desc">Login to chat with others</div>
            </div>
            <div class="feature-card" onclick="showLoginModal()">
                <div class="feature-icon">📢</div>
                <div class="feature-title">Forum</div>
                <div class="feature-desc">Login to join discussions</div>
            </div>
            <div class="feature-card" onclick="showLoginModal()">
                <div class="feature-icon">🛒</div>
                <div class="feature-title">Marketplace</div>
                <div class="feature-desc">Login to buy and sell</div>
            </div>
        `;
    }
    
    document.getElementById('userCount').textContent = orbitDB.users.length;
    document.getElementById('topicCount').textContent = orbitDB.forumTopics.length;
    document.getElementById('listingCount').textContent = orbitDB.marketplaceListings.length;
}

// Add modal styles
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: #121212;
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid #2a2a2a;
        max-width: 400px;
        width: 90%;
    }
    
    .modal-content h2 {
        color: #7c3aed;
        margin-bottom: 1.5rem;
    }
    
    .modal-content input {
        width: 100%;
        padding: 1rem;
        margin-bottom: 1rem;
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 8px;
        color: #fff;
    }
    
    .tab-btn {
        flex: 1;
        padding: 0.8rem;
        background: #1e1e1e;
        border: 1px solid #333;
        color: #fff;
        cursor: pointer;
        border-radius: 8px;
    }
    
    .tab-btn.active {
        background: #7c3aed;
        border-color: #7c3aed;
    }
    
    .save-btn {
        width: 100%;
        padding: 1rem;
        background: #7c3aed;
        border: none;
        border-radius: 8px;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        margin: 1rem 0;
    }
    
    .cancel-btn {
        width: 100%;
        padding: 0.8rem;
        background: #2a2a2a;
        border: none;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Initialize
loadData();
