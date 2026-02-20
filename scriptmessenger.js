let appData = JSON.parse(localStorage.getItem('appData')) || window.appData;
let currentChat = null;

function saveData() {
    localStorage.setItem('appData', JSON.stringify(appData));
}

function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;

    const currentUserId = appData.currentUser.id;
    const contacts = appData.users.filter(user => user.id !== currentUserId);

    contactsList.innerHTML = contacts.map(user => `
        <div class="contact-item ${currentChat === user.id ? 'active' : ''}" data-user-id="${user.id}">
            <div class="contact-avatar">${user.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${user.name}</div>
                <div class="contact-status ${user.status}">${user.status === 'online' ? '🟢 В сети' : '⚫ Не в сети'}</div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            currentChat = parseInt(item.dataset.userId);
            renderContacts();
            loadMessages();
            
            const contact = appData.users.find(u => u.id === currentChat);
            document.getElementById('currentChatName').textContent = contact ? contact.name : 'Выберите контакт';
        });
    });
}

function loadMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer || !currentChat) return;

    const currentUserId = appData.currentUser.id;
    const messages = appData.messages.filter(msg => 
        (msg.from === currentUserId && msg.to === currentChat) ||
        (msg.from === currentChat && msg.to === currentUserId)
    ).sort((a, b) => a.timestamp - b.timestamp);

    messagesContainer.innerHTML = messages.map(msg => {
        const isSent = msg.from === currentUserId;
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="message ${isSent ? 'sent' : 'received'}">
                ${msg.text}
                <div class="message-time">${time}</div>
            </div>
        `;
    }).join('');

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !currentChat) return;

    const newMessage = {
        id: appData.messages.length + 1,
        from: appData.currentUser.id,
        to: currentChat,
        text: text,
        timestamp: Date.now()
    };

    appData.messages.push(newMessage);
    saveData();
    
    input.value = '';
    loadMessages();
}

function searchContacts(query) {
    const contacts = document.querySelectorAll('.contact-item');
    contacts.forEach(contact => {
        const name = contact.querySelector('.contact-name').textContent.toLowerCase();
        if (name.includes(query.toLowerCase())) {
            contact.style.display = 'flex';
        } else {
            contact.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    document.querySelector('.search-contacts').addEventListener('input', (e) => {
        searchContacts(e.target.value);
    });

    window.addEventListener('focus', () => {
        appData = JSON.parse(localStorage.getItem('appData')) || appData;
        renderContacts();
        loadMessages();
    });
});
