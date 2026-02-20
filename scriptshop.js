let orbitDB = JSON.parse(localStorage.getItem('orbitDB')) || { users: [], marketplaceListings: [], currentUser: null };

function loadData() {
    orbitDB = JSON.parse(localStorage.getItem('orbitDB')) || orbitDB;
    updateNav();
    renderShop();
}

function saveData() {
    localStorage.setItem('orbitDB', JSON.stringify(orbitDB));
}

function updateNav() {
    const nav = document.getElementById('navLinks');
    if (orbitDB.currentUser) {
        nav.innerHTML = `
            <span class="user-name">${orbitDB.currentUser.avatar} ${orbitDB.currentUser.name}</span>
            <a href="main.html">Home</a>
            <a href="messenger.html">Messenger</a>
            <a href="forum.html">Forum</a>
            <a href="shop.html">Market</a>
        `;
    } else {
        nav.innerHTML = `<a href="main.html">Home</a>`;
    }
}

function renderShop() {
    const container = document.getElementById('shopContainer');
    
    if (!orbitDB.currentUser) {
        container.innerHTML = `
            <div class="no-auth">
                <h2>Please login to use Marketplace</h2>
                <button onclick="window.location.href='main.html'">Go to Login</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="header">
            <h1>Marketplace</h1>
            <button class="create-btn" onclick="showCreateModal()">+ New Listing</button>
        </div>
        <div class="filters">
            <input type="text" class="filter-input" id="searchInput" placeholder="Search...">
            <select class="filter-select" id="categoryFilter">
                <option value="all">All Categories</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
            </select>
        </div>
        <div class="grid" id="listingsGrid"></div>
    `;
    
    renderListings();
    
    document.getElementById('searchInput').addEventListener('input', renderListings);
    document.getElementById('categoryFilter').addEventListener('change', renderListings);
}

function showCreateModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'createModal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create Listing</h2>
            <input type="text" id="title" placeholder="Title">
            <textarea id="description" placeholder="Description" rows="4"></textarea>
            <input type="text" id="price" placeholder="Price (e.g. $100)">
            <select id="category">
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
            </select>
            <div class="modal-buttons">
                <button class="cancel-btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="save-btn" onclick="createListing()">Create</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function createListing() {
    const title = document.getElementById('title').value.trim();
    const desc = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value.trim();
    const cat = document.getElementById('category').value;

    if (!title || !desc || !price) return;

    orbitDB.marketplaceListings.push({
        id: orbitDB.marketplaceListings.length + 1,
        title: title,
        description: desc,
        price: price,
        seller: orbitDB.currentUser.id,
        category: cat,
        createdAt: Date.now()
    });

    saveData();
    document.getElementById('createModal').remove();
    renderListings();
}

function renderListings() {
    const grid = document.getElementById('listingsGrid');
    if (!grid) return;

    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';

    let filtered = orbitDB.marketplaceListings.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search) || 
                             item.description.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = filtered.map(item => {
        const seller = orbitDB.users.find(u => u.id === item.seller);
        return `
            <div class="card" onclick="showDetail(${item.id})">
                <span class="category">${item.category}</span>
                <div class="title">${item.title}</div>
                <div class="desc">${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}</div>
                <div class="price">${item.price}</div>
                <div class="seller">
                    <span>${seller ? seller.avatar : '👤'}</span>
                    <span>${seller ? seller.name : 'Unknown'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function showDetail(id) {
    const item = orbitDB.marketplaceListings.find(l => l.id === id);
    if (!item) return;

    const seller = orbitDB.users.find(u => u.id === item.seller);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2>${item.title}</h2>
            <span class="category">${item.category}</span>
            <p style="margin: 1rem 0; line-height: 1.6;">${item.description}</p>
            <div class="detail-price">${item.price}</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #666;">
                <span>${seller ? seller.avatar : '👤'}</span>
                <span>Seller: ${seller ? seller.name : 'Unknown'}</span>
            </div>
            <button class="contact-btn" onclick="contactSeller(${item.seller})">
                Message Seller
            </button>
            <button class="cancel-btn" style="width: 100%; margin-top: 1rem;" onclick="this.closest('.modal').remove()">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function contactSeller(sellerId) {
    localStorage.setItem('selectedContact', sellerId);
    window.location.href = 'messenger.html';
}

// Auto-refresh every 5 seconds
setInterval(() => {
    if (orbitDB.currentUser) {
        loadData();
        renderListings();
    }
}, 5000);

// Initialize
loadData();
