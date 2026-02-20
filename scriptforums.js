let orbitDB = JSON.parse(localStorage.getItem('orbitDB')) || { users: [], forumTopics: [], currentUser: null };
let currentTopic = null;

function loadData() {
    orbitDB = JSON.parse(localStorage.getItem('orbitDB')) || orbitDB;
    updateNav();
    renderForum();
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

function renderForum() {
    const container = document.getElementById('forumContainer');
    
    if (!orbitDB.currentUser) {
        container.innerHTML = `
            <div class="no-auth">
                <h2>Please login to use Forum</h2>
                <button onclick="window.location.href='main.html'">Go to Login</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="header" id="mainHeader">
            <h1>Forum</h1>
            <button class="create-btn" onclick="showCreateModal()">+ New Topic</button>
        </div>
        <div class="topics" id="topicsList"></div>
        <div class="topic-detail" id="topicDetail">
            <button class="back-btn" onclick="hideDetail()">← Back</button>
            <div id="topicContent"></div>
        </div>
    `;
    
    renderTopics();
}

function showCreateModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'createModal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Topic</h2>
            <input type="text" id="topicTitle" placeholder="Title">
            <textarea id="topicMessage" placeholder="Your message..." rows="5"></textarea>
            <div class="modal-buttons">
                <button class="cancel-btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="save-btn" onclick="createTopic()">Create</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function createTopic() {
    const title = document.getElementById('topicTitle').value.trim();
    const msg = document.getElementById('topicMessage').value.trim();
    
    if (!title || !msg) return;

    orbitDB.forumTopics.push({
        id: orbitDB.forumTopics.length + 1,
        title: title,
        author: orbitDB.currentUser.id,
        likes: 0,
        createdAt: Date.now(),
        messages: [{
            id: 1,
            author: orbitDB.currentUser.id,
            text: msg,
            likes: 0,
            timestamp: Date.now()
        }]
    });

    saveData();
    document.getElementById('createModal').remove();
    renderTopics();
}

function renderTopics() {
    const list = document.getElementById('topicsList');
    if (!list) return;

    const sorted = [...orbitDB.forumTopics].sort((a, b) => b.likes - a.likes);

    list.innerHTML = sorted.map(t => {
        const author = orbitDB.users.find(u => u.id === t.author);
        return `
            <div class="topic" onclick="showTopic(${t.id})">
                <div class="topic-header">
                    <span class="topic-title">${t.title}</span>
                    <span class="topic-likes">❤️ ${t.likes}</span>
                </div>
                <div class="topic-meta">
                    <span>${author ? author.avatar : '👤'} ${author ? author.name : 'Unknown'}</span>
                    <span>📅 ${new Date(t.createdAt).toLocaleDateString()}</span>
                    <span>💬 ${t.messages.length}</span>
                </div>
            </div>
        `;
    }).join('');
}

function showTopic(id) {
    currentTopic = id;
    const topic = orbitDB.forumTopics.find(t => t.id === id);
    if (!topic) return;

    document.getElementById('mainHeader').style.display = 'none';
    document.getElementById('topicsList').style.display = 'none';
    document.getElementById('topicDetail').classList.add('active');

    const author = orbitDB.users.find(u => u.id === topic.author);
    
    let html = `
        <h2 style="color: #7c3aed;">${topic.title}</h2>
        <div style="color: #666; margin-bottom: 2rem;">
            ${author ? author.avatar : '👤'} ${author ? author.name : 'Unknown'} • ❤️ ${topic.likes} • 📅 ${new Date(topic.createdAt).toLocaleDateString()}
        </div>
        <div class="posts">
    `;

    topic.messages.forEach(m => {
        const msgAuthor = orbitDB.users.find(u => u.id === m.author);
        html += `
            <div class="post">
                <div class="post-header">
                    <span>${msgAuthor ? msgAuthor.avatar : '👤'} ${msgAuthor ? msgAuthor.name : 'Unknown'}</span>
                    <span>
                        <button class="like-btn" onclick="likeMessage(${topic.id}, ${m.id})">❤️</button>
                        ${m.likes}
                    </span>
                </div>
                <div>${m.text}</div>
                <div style="color: #444; font-size: 0.8rem; margin-top: 0.5rem;">${new Date(m.timestamp).toLocaleString()}</div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="reply-area">
            <textarea id="replyText" placeholder="Write a reply..."></textarea>
            <button onclick="addReply(${topic.id})">Reply</button>
        </div>
    `;

    document.getElementById('topicContent').innerHTML = html;
}

function hideDetail() {
    currentTopic = null;
    document.getElementById('mainHeader').style.display = 'flex';
    document.getElementById('topicsList').style.display = 'flex';
    document.getElementById('topicDetail').classList.remove('active');
}

function addReply(topicId) {
    const text = document.getElementById('replyText').value.trim();
    if (!text) return;

    const topic = orbitDB.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    topic.messages.push({
        id: topic.messages.length + 1,
        author: orbitDB.currentUser.id,
        text: text,
        likes: 0,
        timestamp: Date.now()
    });

    saveData();
    showTopic(topicId);
}

function likeMessage(topicId, messageId) {
    const topic = orbitDB.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    const msg = topic.messages.find(m => m.id === messageId);
    if (msg) {
        msg.likes++;
        topic.likes++;
        saveData();
        showTopic(topicId);
    }
}

// Auto-refresh every 5 seconds
setInterval(() => {
    if (orbitDB.currentUser) {
        loadData();
        if (currentTopic) showTopic(currentTopic);
    }
}, 5000);

// Initialize
loadData();
