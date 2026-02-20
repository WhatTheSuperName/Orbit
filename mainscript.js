// Глобальное хранилище данных
window.appData = {
    users: [
        { id: 1, name: 'Теневой_Странник', avatar: '👤', status: 'online' },
        { id: 2, name: 'Кибер_Мудрец', avatar: '🧙', status: 'offline' },
        { id: 3, name: 'Ночной_Хакер', avatar: '👾', status: 'online' },
        { id: 4, name: 'Цифровой_Художник', avatar: '🎨', status: 'online' }
    ],
    messages: [
        { id: 1, from: 1, to: 2, text: 'Привет, как дела?', timestamp: Date.now() - 3600000 },
        { id: 2, from: 2, to: 1, text: 'Отлично, осваиваю темную сеть!', timestamp: Date.now() - 1800000 }
    ],
    forumTopics: [
        { 
            id: 1, 
            title: 'Как защитить свою анонимность?', 
            author: 1, 
            likes: 15, 
            createdAt: Date.now() - 86400000,
            messages: [
                { id: 1, author: 2, text: 'Используй VPN и Tor', likes: 5, timestamp: Date.now() - 86000000 },
                { id: 2, author: 3, text: 'Не забывай про приватные браузеры', likes: 3, timestamp: Date.now() - 85000000 }
            ]
        },
        { 
            id: 2, 
            title: 'Лучшие цифровые услуги 2024', 
            author: 2, 
            likes: 25, 
            createdAt: Date.now() - 172800000,
            messages: [
                { id: 3, author: 1, text: 'Дизайн и разработка сейчас в топе', likes: 8, timestamp: Date.now() - 170000000 }
            ]
        },
        { 
            id: 3, 
            title: 'Обсуждение новых технологий', 
            author: 3, 
            likes: 8, 
            createdAt: Date.now() - 43200000,
            messages: []
        }
    ],
    marketplaceListings: [
        { 
            id: 1, 
            title: 'Разработка Telegram ботов', 
            description: 'Создам бота любой сложности. Python, aiogram.', 
            price: '100$', 
            seller: 1,
            category: 'Разработка',
            createdAt: Date.now() - 172800000
        },
        { 
            id: 2, 
            title: 'Дизайн логотипов и айдентика', 
            description: 'Уникальный дизайн для вашего проекта. 3 варианта.', 
            price: '80$', 
            seller: 2,
            category: 'Дизайн',
            createdAt: Date.now() - 86400000
        },
        { 
            id: 3, 
            title: 'SEO продвижение сайтов', 
            description: 'Выведу ваш сайт в топ. Гарантия качества.', 
            price: '150$', 
            seller: 3,
            category: 'Маркетинг',
            createdAt: Date.now() - 43200000
        }
    ],
    currentUser: { id: 1, name: 'Теневой_Странник', avatar: '👤' }
};

// Обновление статистики на главной
function updateStats() {
    const userCount = document.getElementById('userCount');
    const topicCount = document.getElementById('topicCount');
    const listingCount = document.getElementById('listingCount');
    
    if (userCount) userCount.textContent = window.appData.users.length;
    if (topicCount) topicCount.textContent = window.appData.forumTopics.length;
    if (listingCount) listingCount.textContent = window.appData.marketplaceListings.length;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    localStorage.setItem('appData', JSON.stringify(window.appData));
});
