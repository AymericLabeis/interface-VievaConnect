const data = {
  contacts: [
    { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/40?img=1' },
    { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/40?img=2' },
    { id: 3, name: 'Chloé', avatar: 'https://i.pravatar.cc/40?img=3' },
    { id: 4, name: 'Aymeric', avatar: 'https://www.gravatar.com/avatar/?d=mp&f=y' }
  ],
  messages: {
    1: [
      { sender: 'received', text: 'Salut, ça va ?', date: '2025-05-12 14:30', unread: true },
      { sender: 'sent', text: 'Oui, et toi ?', date: '2025-05-12 14:32' },
      { sender: 'received', text: 'Super, merci !', date: '2025-05-12 14:35', unread: true }
    ],
    2: [
      { sender: 'received', text: 'Tu as vu le match hier ?', date: '2025-05-11 20:10' },
      { sender: 'sent', text: 'Pas encore, je le regarde ce soir.', date: '2025-05-11 20:15' }
    ],
    3: [
      { sender: 'received', text: 'Bon anniversaire !', date: '2025-05-10 09:00' }
    ],
    4: [
      { sender: 'received', text: 'Tu as vu le match hier ?', date: '2025-05-11 20:10' },
      { sender: 'sent', text: 'Pas encore, je le regarde ce soir.', date: '2025-05-11 20:15' }
    ]
  }
};

// Sélecteurs
const contactListEl = document.getElementById('contactList');
const messagesEl = document.getElementById('messages');
const inputAreaEl = document.getElementById('inputArea');
const inputEl = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendButton');

let activeContactId = null;

// Affichage des contacts
function renderContacts() {
  contactListEl.innerHTML = '';
  data.contacts.forEach(c => {
    const msgs = data.messages[c.id] || [];
    const unreadCount = msgs.filter(m => m.sender === 'received' && m.unread).length;

    const div = document.createElement('div');
    div.classList.add('listContact');
    // Pas besoin d'ajouter 'unread-message' ici, c'est pour le badge uniquement

    div.innerHTML = `
      <div  style="position: relative; display: inline-block;">
        <img src="${c.avatar}" alt="Avatar de ${c.name}">
        ${unreadCount > 0 ? `<div class="unread-message">${unreadCount}</div>` : ''}
      </div>
      <h3 class="contactName mb-0">${c.name}</h3>
    `;

    div.onclick = () => selectContact(c.id);
    contactListEl.appendChild(div);
  });
}




// Sélection d'un contact
function selectContact(id) {
  activeContactId = id;

  // Marquer les messages comme lus
  data.messages[id].forEach(m => {
    if (m.sender === 'received') m.unread = false;
  });

  renderMessages(id);
  inputAreaEl.style.display = 'flex';
  inputEl.focus();
}

// Affichage des messages
function renderMessages(contactId) {
  messagesEl.innerHTML = '';
  data.messages[contactId].forEach(renderMessage);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Création d’un message
function renderMessage({ sender, text, date }) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.innerHTML = `<div>${text}</div><div class="last-date">${date}</div>`;
  messagesEl.appendChild(msg);
}

// Envoi message
sendBtn.addEventListener('click', () => {
  const text = inputEl.value.trim();
  if (!text || activeContactId === null) return;

  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const msg = { sender: 'sent', text, date };

  data.messages[activeContactId].push(msg);
  renderMessage(msg);

  inputEl.value = '';
  messagesEl.scrollTop = messagesEl.scrollHeight;
  inputEl.focus();
});

// Entrée = envoyer
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    sendBtn.click();
    e.preventDefault();
  }
});

// Init
renderContacts();

