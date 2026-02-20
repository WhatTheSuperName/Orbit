let data = JSON.parse(localStorage.getItem('orbitData')) || window.orbitData;
let currentTopic = null;

function saveData() {
    localStorage.setItem('orbitData', JSON.stringify(data));
}

function showCreateModal() {
    document.getElementById('createModal').style.display = 'block';
}

function hideCreateModal() {
    document.getElementById('createModal').style.display = 'none';
    document.getElementById('topicTitle').value = '';
    document.getElementById('topicMessage').value = '';
}

function createTopic() {
    const title = document.getElementById('topicTitle').value.trim();
    const msg = document.getElementById('topicMessage').value.trim();
    
    if (!title || !msg) return;

    data.forumTopics.push({
        id: data.forumTopics.length + 1,
        title: title,
        author: data.currentUser.id,
        likes: 0,
        createdAt: Date.now(),
        messages: [{
            id: 1,
            author: data.currentUser.id,
            text: msg,
            likes: 0,
            timestamp: Date.now()
        }]
    });

    saveData();
    hideCreateModal();
    renderTopics();
}

function renderTopics() {
    const list = document.getElementById('topicsList');
    if (!list) return;

    const sorted = [...data.forumTopics].sort((a, b) => b.likes - a.likes);

    list.innerHTML = sorted.map(t => {
        const author = data.users.find(u => u.id === t.author);
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
    const topic = data.forumTopics.find(t => t.id === id);
    if (!topic) return;

    document.getElementById('mainHeader').style.display = 'none';
    document.getElementById('topicsList').style.display = 'none';
    document.getElementById('topicDetail').classList.add('active');

    const author = data.users.find(u => u.id === topic.author);
    
    let html = `
        <h2 style="color: #7c3aed;">${topic.title}</h2>
        <div style="color: #666; margin-bottom: 2rem;">
            ${author ? author.avatar : '👤'} ${author ? author.name : 'Unknown'} • ❤️ ${topic.likes} • 📅 ${new Date(topic.createdAt).toLocaleDateString()}
        </div>
        <div class="posts">
    `;

    topic.messages.forEach(m => {
        const msgAuthor = data.users.find(u => u.id === m.author);
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

    const topic = data.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    topic.messages.push({
        id: topic.messages.length + 1,
        author: data.currentUser.id,
        text: text,
        likes: 0,
        timestamp: Date.now()
    });

    saveData();
    showTopic(topicId);
}

function likeMessage(topicId, messageId) {
    const topic = data.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    const msg = topic.messages.find(m => m.id === messageId);
    if (msg) {
        msg.likes++;
        topic.likes++;
        saveData();
        showTopic(topicId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTopics();
});
