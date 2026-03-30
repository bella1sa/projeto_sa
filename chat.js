// --- DADOS DE RECOMENDAÇÃO (CATÁLOGO) ---
const catalogo = [
    { genero: "Fantasia", estilo: "Plot-twist", titulo: "Mistborn: O Império Final", autor: "Brandon Sanderson" },
    { genero: "Fantasia", estilo: "Ação", titulo: "Eragon", autor: "Christopher Paolini" },
    { genero: "Romance", estilo: "Desenvolvimento de personagem", titulo: "Comer, Rezar, Amar", autor: "Elizabeth Gilbert" },
    { genero: "Romance", estilo: "Plot-twist", titulo: "A Garota do Lago", autor: "Charlie Donlea" },
    { genero: "Suspense", estilo: "Ação rápida", titulo: "O Código Da Vinci", autor: "Dan Brown" },
    { genero: "Suspense", estilo: "Plot-twist", titulo: "Garota Exemplar", autor: "Gillian Flynn" },
    { genero: "Ficção Científica", estilo: "Desenvolvimento de personagem", titulo: "Duna", autor: "Frank Herbert" },
    { genero: "Ficção Científica", estilo: "Ação rápida", titulo: "Jogador Nº 1", autor: "Ernest Cline" },
     { genero: "terror", estilo: "assustador", titulo: "Jantar Secreto", autor: "Raphael Montes" },
];

// --- VARIÁVEIS DE DOM ---
const chatMessagesEl = document.getElementById('chat-messages');
const userInputEl = document.getElementById('user-input');
const sendBtnEl = document.getElementById('send-btn');
const savedChatsContainerEl = document.getElementById('saved-chats-container');
const welcomeMessage = "Oi tudo bem? Como posso te ajudar hoje?";

// --- ESTADO ---
let chatState = 0; 
let chatData = { genero: '', estilo: '' };
let currentChatName = 'New Chat';

let allChats = JSON.parse(localStorage.getItem('savedChats')) || [];

// -------------------------------------------
// FUNÇÕES DE INTERFACE
// -------------------------------------------

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', `${sender}-message`);
    div.textContent = text;
    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function loadChatHistory(chatName) {
    const chat = allChats.find(c => c.name === chatName);
    if (!chat) return;

    chatState = 3; // evita reiniciar fluxo
    chatData = { genero: '', estilo: '' };
    currentChatName = chatName;

    chatMessagesEl.innerHTML = chat.history;

    // atualiza botão ativo
    document.querySelectorAll('.chat-item').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.chat-item[data-chat-name="${chatName}"]`);
    if (btn) btn.classList.add('active');
}

function startNewChat() {

    // salva o chat anterior se houver mensagens além da inicial
    if (chatMessagesEl.children.length > 1) {
        saveCurrentChat();
    }

    // ZERA estado
    chatState = 0;
    chatData = { genero: '', estilo: '' };
    currentChatName = "New Chat";

    // Limpa tela e coloca mensagem inicial
    chatMessagesEl.innerHTML = `
        <div class="message bot-message">${welcomeMessage}</div>
    `;

    // Atualiza sidebar
    document.querySelectorAll('.chat-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById('new-chat-btn').classList.add('active');
}

function loadChatList() {
    savedChatsContainerEl.innerHTML = "";

    allChats.forEach(chat => {
        const btn = document.createElement('button');
        btn.classList.add("chat-item");
        btn.textContent = chat.name;
        btn.setAttribute('data-chat-name', chat.name);
        btn.onclick = () => loadChatHistory(chat.name);
        savedChatsContainerEl.appendChild(btn);
    });

    // deixa "New Chat" como ativo ao carregar
    document.getElementById('new-chat-btn').classList.add('active');
}

// -------------------------------------------
// SALVAR CHATS
// -------------------------------------------

function saveCurrentChat() {

    if (currentChatName === "New Chat") {
        const id = allChats.length + 1;
        currentChatName = `Chat ${id}`;

        const chatObj = {
            name: currentChatName,
            history: chatMessagesEl.innerHTML
        };

        allChats.push(chatObj);
        localStorage.setItem('savedChats', JSON.stringify(allChats));
        loadChatList();

    } else {
        const index = allChats.findIndex(c => c.name === currentChatName);
        if (index !== -1) {
            allChats[index].history = chatMessagesEl.innerHTML;
            localStorage.setItem('savedChats', JSON.stringify(allChats));
        }
    }

    document.querySelectorAll('.chat-item').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.chat-item[data-chat-name="${currentChatName}"]`);
    if (btn) btn.classList.add('active');
}

// -------------------------------------------
// LÓGICA DO BOT (INTELIGÊNCIA LOCAL)
// -------------------------------------------

function processUserMessage(message) {
    let botResponse = "";

    switch (chatState) {
        case 0:
            botResponse = "Certo! Para começar, qual gênero literário você mais gosta?";
            chatState = 1;
            break;

        case 1:
            chatData.genero = message.trim();
            botResponse = `Ótimo! E qual estilo você prefere?`;
            chatState = 2;
            break;

        case 2:
            chatData.estilo = message.trim();

            const recomendacoes = catalogo.filter(l =>
                l.genero.toLowerCase().includes(chatData.genero.toLowerCase()) ||
                l.estilo.toLowerCase().includes(chatData.estilo.toLowerCase())
            );

            if (recomendacoes.length > 0) {
                botResponse = "Aqui estão sugestões:\n\n" +
                    recomendacoes.map(l => 
                        `• ${l.titulo} (${l.autor}) — ${l.genero}, ${l.estilo}`
                    ).join("\n") +
                    `\n\n  O chat foi salvo! Clique em 'New Chat' para começar outro.`;
            } else {
                botResponse = "Me desculpe, infelizmente não achei nenhuma combinação exata encontrada, mas recomendo Jantar Secreto do Raphael Montes, com um plot twist extraordinario";
            }

            saveCurrentChat();
            chatState = 3;
            break;

        case 3:
            botResponse = "Clique em **New Chat** para iniciar outra recomendação!";
            break;
    }

    appendMessage(botResponse, "bot");
}

// -------------------------------------------
// ENVIO DE MENSAGEM
// -------------------------------------------

function sendMessage() {
    const msg = userInputEl.value.trim();
    if (!msg) return;

    appendMessage(msg, "user");
    userInputEl.value = "";

    processUserMessage(msg);
}

sendBtnEl.addEventListener("click", sendMessage);

userInputEl.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

document.getElementById("new-chat-btn").addEventListener("click", startNewChat);

window.onload = loadChatList;
