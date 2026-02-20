let appData = JSON.parse(localStorage.getItem('appData')) || window.appData;
let currentTopicId = null;

function saveData() {
    localStorage.setItem('appData', JSON.stringify(appData));
}

function showCreateTopicModal() {
    document.getElementById('createTopicModal').style.display = 'block';
}

function hideCreateTopicModal() {
    document.getElementById('createTopicModal').style.display = 'none';
    document.getElementById('newTopicTitle').value = '';
    document.getElementById('newTopicContent').value = '';
}

function createTopic() {
    const title = document.getElementById('newTopicTitle').value.trim();
    const content = document.getElementById('newTopicContent').value.trim();
    
    if (!title || !content) {
        alert('Заполните все поля');
        return;
    }

    const newTopic = {
        id: appData.forumTopics.length + 1,
        title: title,
        author: appData.currentUser.id,
        likes: 0,
        createdAt: Date.now(),
        messages: [{
            id: 1,
            author: appData.currentUser.id,
            text: content,
            likes: 0,
            timestamp: Date.now()
        }]
    };

    appData.forumTopics.push(newTopic);
    saveData();
    hideCreateTopicModal();
    renderTopics();
}

function renderTopics() {
    const topicsList = document.getElementById('topicsList');
    if (!topicsList) return;

    const sortedTopics = [...appData.forumTopics].sort((a, b) => b.likes - a.likes);

    topicsList.innerHTML = sortedTopics.map(topic => {
        const author = appData.users.find(u => u.id === topic.author);
        const messageCount = topic.messages.length;
        const lastMessage = topic.messages[topic.messages.length - 1];
        const lastActivity = lastMessage ? new Date(lastMessage.timestamp).toLocaleDateString() : new Date(topic.createdAt).toLocaleDateString();

        return `
            <div class="topic-card" onclick="showTopicDetail(${topic.id})">
                <div class="topic-header">
                    <h3 class="topic-title">${topic.title}</h3>
                    <div class="topic-likes">❤️ ${topic.likes}</div>
                </div>
                <div class="topic-meta">
                    <span class="topic-author">${author ? author.avatar : '👤'} ${author ? author.name : 'Неизвестно'}</span>
                    <span>📅 ${new Date(topic.createdAt).toLocaleDateString()}</span>
                    <span>💬 ${messageCount} сообщений</span>
                    <span>🕐 ${lastActivity}</span>
                </div>
            </div>
        `;
    }).join('');
}

function showTopicDetail(topicId) {
    currentTopicId = topicId;
    const topic = appData.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    document.querySelector('.topics-list').style.display = 'none';
    document.querySelector('.forums-header').style.display = 'none';
    document.getElementById('topicDetail').classList.add('active');

    const author = appData.users.find(u => u.id === topic.author);
    
    let html = `
        <h2 style="color: #bb86fc; margin-bottom: 1rem;">${topic.title}</h2>
        <div style="color: #888; margin-bottom: 2rem;">
            <span>${author ? author.avatar : '👤'} ${author ? author.name : 'Неизвестно'}</span>
            <span style="margin-left: 1rem;">❤️ ${topic.likes}</span>
            <span style="margin-left: 1rem;">📅 ${new Date(topic.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="topic-posts">
    `;

    topic.messages.forEach(msg => {
        const msgAuthor = appData.users.find(u => u.id === msg.author);
        html += `
            <div class="post-item">
                <div class="post-header">
                    <div class="post-author">
                        <span>${msgAuthor ? msgAuthor.avatar : '👤'}</span>
                        <span>${msgAuthor ? msgAuthor.name : 'Неизвестно'}</span>
                    </div>
                    <div class="post-likes">
                        <button class="like-btn" onclick="likeMessage(${topic.id}, ${msg.id})">❤️</button>
                        <span>${msg.likes}</span>
                    </div>
                </div>
                <div class="post-content">
                    ${msg.text}
                </div>
                <div style="color: #666; font-size: 0.8rem; margin-top: 0.5rem;">
                    ${new Date(msg.timestamp).toLocaleString()}
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="reply-input">
            <textarea id="replyText" placeholder="Написать сообщение..."></textarea>
            <button onclick="addReply(${topicId})">Ответить</button>
        </div>
    `;

    document.getElementById('topicDetailContent').innerHTML = html;
}

function hideTopicDetail() {
    currentTopicId = null;
    document.querySelector('.topics-list').style.display = 'flex';
    document.querySelector('.forums-header').style.display = 'flex';
    document.getElementById('topicDetail').classList.remove('active');
}

function addReply(topicId) {
    const replyText = document.getElementById('replyText').value.trim();
    if (!replyText) return;

    const topic = appData.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    const newMessage = {
        id: topic.messages.length + 1,
        author: appData.currentUser.id,
        text: replyText,
        likes: 0,
        timestamp: Date.now()
    };

    topic.messages.push(newMessage);
    saveData();
    showTopicDetail(topicId);
}

function likeMessage(topicId, messageId) {
    const topic = appData.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    const message = topic.messages.find(m => m.id === messageId);
    if (message) {
        message.likes++;
        topic.likes++;
        saveData();
        showTopicDetail(topicId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTopics();
    
    window.addEventListener('focus', () => {
        appData = JSON.parse(localStorage.getItem('appData')) || appData;
        renderTopics();
    });
});
