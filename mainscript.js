window.orbitData = {
    users: [
        { id: 1, name: 'ShadowWalker', avatar: '👤', status: 'online' },
        { id: 2, name: 'CyberWizard', avatar: '🧙', status: 'offline' },
        { id: 3, name: 'NightHacker', avatar: '👾', status: 'online' },
        { id: 4, name: 'DigitalArtist', avatar: '🎨', status: 'online' }
    ],
    messages: [
        { id: 1, from: 1, to: 2, text: 'Hey, how are you?', timestamp: Date.now() - 3600000 },
        { id: 2, from: 2, to: 1, text: 'Good, exploring Orbit!', timestamp: Date.now() - 1800000 }
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
        },
        { 
            id: 3, 
            title: 'New tech discussions', 
            author: 3, 
            likes: 8, 
            createdAt: Date.now() - 43200000,
            messages: []
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
        },
        { 
            id: 3, 
            title: 'SEO Optimization', 
            description: 'Top rankings on Google guaranteed.', 
            price: '$150', 
            seller: 3,
            category: 'Marketing',
            createdAt: Date.now() - 43200000
        }
    ],
    currentUser: { id: 1, name: 'ShadowWalker', avatar: '👤' }
};

function updateStats() {
    const userCount = document.getElementById('userCount');
    const topicCount = document.getElementById('topicCount');
    const listingCount = document.getElementById('listingCount');
    
    if (userCount) userCount.textContent = window.orbitData.users.length;
    if (topicCount) topicCount.textContent = window.orbitData.forumTopics.length;
    if (listingCount) listingCount.textContent = window.orbitData.marketplaceListings.length;
}

document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    localStorage.setItem('orbitData', JSON.stringify(window.orbitData));
});
