let data = JSON.parse(localStorage.getItem('orbitData')) || window.orbitData;
let currentChat = null;

function saveData() {
    localStorage.setItem('orbitData', JSON.stringify(data));
}

function renderContacts() {
    const list = document.getElementById('contactsList');
    if (!list) return;

    const currentId = data.currentUser.id;
    const contacts = data.users.filter(u => u.id !== currentId);

    list.innerHTML = contacts.map(user => `
        <div class="contact ${currentChat === user.id ? 'active' : ''}" data-id="${user.id}">
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
            renderContacts();
            loadMessages();
            const user = data.users.find(u => u.id === currentChat);
            document.getElementById('currentChat').textContent = user ? user.name : 'Select a contact';
        });
    });
}

function loadMessages() {
    const container = document.getElementById('messagesList');
    if (!container || !currentChat) return;

    const currentId = data.currentUser.id;
    const messages = data.messages.filter(m => 
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

    data.messages.push({
        id: data.messages.length + 1,
        from: data.currentUser.id,
        to: currentChat,
        text: text,
        timestamp: Date.now()
    });

    saveData();
    input.value = '';
    loadMessages();
}

function searchContacts(query) {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(c => {
        const name = c.querySelector('.contact-name').textContent.toLowerCase();
        c.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    document.querySelector('.search').addEventListener('input', (e) => {
        searchContacts(e.target.value);
    });

    const selected = localStorage.getItem('selectedContact');
    if (selected) {
        currentChat = parseInt(selected);
        localStorage.removeItem('selectedContact');
        renderContacts();
        loadMessages();
    }
});
