let orbitDB = JSON.parse(localStorage.getItem('orbitDB')) || { users: [], messages: [], currentUser: null };
let currentChat = null;

function loadData() {
    orbitDB = JSON.parse(localStorage.getItem('orbitDB')) || orbitDB;
    updateNav();
    renderMessenger();
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

function renderMessenger() {
    const container = document.getElementById('messengerContainer');
    
    if (!orbitDB.currentUser) {
        container.innerHTML = `
            <div class="no-auth">
                <h2>Please login to use Messenger</h2>
                <button onclick="window.location.href='main.html'">Go to Login</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>Contacts</h2>
                <input type="text" class="search" placeholder="Search contacts..." id="searchInput">
            </div>
            <div class="contacts" id="contactsList"></div>
        </div>
        <div class="chat">
            <div class="chat-header">
                <h3 id="currentChatName">Select a contact</h3>
            </div>
            <div class="messages" id="messagesList"></div>
            <div class="input-area">
                <input type="text" class="message-input" id="messageInput" placeholder="Type a message...">
                <button class="send-btn" id="sendBtn">Send</button>
            </div>
        </div>
    `;
    
    renderContacts();
    
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchContacts(e.target.value);
    });
    
    const selected = localStorage.getItem('selectedContact');
    if (selected) {
        currentChat = parseInt(selected);
        localStorage.removeItem('selectedContact');
        renderContacts();
        loadMessages();
    }
}

function renderContacts() {
    const list = document.getElementById('contactsList');
    if (!list) return;

    // Get all users that have chatted with current user
    const currentId = orbitDB.currentUser.id;
    const chattedUsers = new Set();
    
    orbitDB.messages.forEach(m => {
        if (m.from === currentId) chattedUsers.add(m.to);
        if (m.to === currentId) chattedUsers.add(m.from);
    });
    
    // Get unread counts
    const unreadCounts = {};
    orbitDB.messages.forEach(m => {
        if (m.to === currentId && !m.read) {
            unreadCounts[m.from] = (unreadCounts[m.from] || 0) + 1;
        }
    });
    
    const contacts = orbitDB.users
        .filter(u => u.id !== currentId && (chattedUsers.has(u.id) || unreadCounts[u.id]))
        .map(u => ({
            ...u,
            unread: unreadCounts[u.id] || 0
        }));

    list.innerHTML = contacts.map(user => `
        <div class="contact ${currentChat === user.id ? 'active' : ''} ${user.unread > 0 ? 'unread' : ''}" data-id="${user.id}">
            <div class="contact-avatar">${user.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${user.name}</div>
                <div class="contact-status ${user.status}">${user.status === 'online' ? '● Online' : '○ Offline'}</div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.contact').forEach(el => {
        el.addEventListener('click', () => {
            currentChat = parseInt(el.dataset.id);
            
            // Mark messages as read
            orbitDB.messages.forEach(m => {
                if (m.to === orbitDB.currentUser.id && m.from === currentChat) {
                    m.read = true;
                }
            });
            saveData();
            
            renderContacts();
            loadMessages();
            const user = orbitDB.users.find(u => u.id === currentChat);
            document.getElementById('currentChatName').textContent = user ? user.name : 'Select a contact';
        });
    });
}

function loadMessages() {
    const container = document.getElementById('messagesList');
    if (!container || !currentChat) return;

    const currentId = orbitDB.currentUser.id;
    const messages = orbitDB.messages.filter(m => 
        (m.from === currentId && m.to === currentChat) ||
        (m.from === currentChat && m.to === currentId)
    ).sort((a, b) => a.timestamp - b.timestamp);

    container.innerHTML = messages.map(m => {
        const sent = m.from === currentId;
        const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="message ${sent ? 'sent' : 'received'}">
                ${m.text}
                <div class="message-time">${time}</div>
            </div>
        `;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !currentChat) return;

    orbitDB.messages.push({
        id: orbitDB.messages.length + 1,
        from: orbitDB.currentUser.id,
        to: currentChat,
        text: text,
        timestamp: Date.now(),
        read: false
    });

    saveData();
    input.value = '';
    loadMessages();
    renderContacts(); // Update unread indicators
}

function searchContacts(query) {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(c => {
        const name = c.querySelector('.contact-name').textContent.toLowerCase();
        c.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
    });
}

// Auto-refresh every 2 seconds
setInterval(() => {
    if (orbitDB.currentUser) {
        loadData();
        if (currentChat) loadMessages();
    }
}, 2000);

// Initialize
loadData();
