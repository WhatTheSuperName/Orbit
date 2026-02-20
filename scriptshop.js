let appData = JSON.parse(localStorage.getItem('appData')) || window.appData;

function saveData() {
    localStorage.setItem('appData', JSON.stringify(appData));
}

function showCreateListingModal() {
    document.getElementById('createListingModal').style.display = 'block';
}

function hideCreateListingModal() {
    document.getElementById('createListingModal').style.display = 'none';
    document.getElementById('newListingTitle').value = '';
    document.getElementById('newListingDescription').value = '';
    document.getElementById('newListingPrice').value = '';
}

function createListing() {
    const title = document.getElementById('newListingTitle').value.trim();
    const description = document.getElementById('newListingDescription').value.trim();
    const price = document.getElementById('newListingPrice').value.trim();
    const category = document.getElementById('newListingCategory').value;

    if (!title || !description || !price) {
        alert('Заполните все поля');
        return;
    }

    const newListing = {
        id: appData.marketplaceListings.length + 1,
        title: title,
        description: description,
        price: price,
        seller: appData.currentUser.id,
        category: category,
        createdAt: Date.now()
    };

    appData.marketplaceListings.push(newListing);
    saveData();
    hideCreateListingModal();
    renderListings();
}

function renderListings() {
    const grid = document.getElementById('listingsGrid');
    if (!grid) return;

    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'newest';

    let filteredListings = [...appData.marketplaceListings];

    // Фильтр по поиску
    if (searchQuery) {
        filteredListings = filteredListings.filter(item => 
            item.title.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery)
        );
    }

    // Фильтр по категории
    if (categoryFilter !== 'all') {
        filteredListings = filteredListings.filter(item => item.category === categoryFilter);
    }

    // Сортировка
    filteredListings.sort((a, b) => {
        switch(sortFilter) {
            case 'newest':
                return b.createdAt - a.createdAt;
            case 'oldest':
                return a.createdAt - b.createdAt;
            case 'price_asc':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price_desc':
                return parseFloat(b.price) - parseFloat(a.price);
            default:
                return 0;
        }
    });

    grid.innerHTML = filteredListings.map(item => {
        const seller = appData.users.find(u => u.id === item.seller);
        return `
            <div class="listing-card" onclick="showListingDetail(${item.id})">
                <span class="listing-category">${item.category}</span>
                <h3 class="listing-title">${item.title}</h3>
                <p class="listing-description">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>
                <div class="listing-price">${item.price}</div>
                <div class="listing-seller">
                    <span>${seller ? seller.avatar : '👤'}</span>
                    <span>${seller ? seller.name : 'Неизвестно'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function showListingDetail(listingId) {
    const listing = appData.marketplaceListings.find(l => l.id === listingId);
    if (!listing) return;

    const seller = appData.users.find(u => u.id === listing.seller);
    
    // Создаем модальное окно для детального просмотра
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2>${listing.title}</h2>
            <span class="listing-category">${listing.category}</span>
            <p style="margin: 1rem 0; line-height: 1.6;">${listing.description}</p>
            <div style="font-size: 2rem; color: #4caf50; margin: 1rem 0;">${listing.price}</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: #888;">
                <span>${seller ? seller.avatar : '👤'}</span>
                <span>Продавец: ${seller ? seller.name : 'Неизвестно'}</span>
            </div>
            <button class="contact-seller-btn" onclick="contactSeller(${listing.seller})">
                ✉️ Написать продавцу
            </button>
            <button class="cancel-btn" style="width: 100%; margin-top: 1rem;" onclick="this.closest('.modal').remove()">
                Закрыть
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function contactSeller(sellerId) {
    // Переходим в мессенджер с выбранным продавцом
    localStorage.setItem('selectedContact', sellerId);
    window.location.href = 'messenger.html';
}

function applyFilters() {
    renderListings();
}

document.addEventListener('DOMContentLoaded', () => {
    renderListings();

    document.getElementById('searchInput')?.addEventListener('input', applyFilters);
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    document.getElementById('sortFilter')?.addEventListener('change', applyFilters);

    window.addEventListener('focus', () => {
        appData = JSON.parse(localStorage.getItem('appData')) || appData;
        renderListings();
    });
});
