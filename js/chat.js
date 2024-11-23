// Chat functionality
class Chat {
    constructor(isIncognito = false) {
        this.messageContainer = document.querySelector('.message-container');
        this.messageInput = document.querySelector('.message-input');
        this.sendButton = document.querySelector('.send-button');
        this.token = localStorage.getItem('token');
        this.isIncognito = isIncognito;
        this.setupEventListeners();
        if (!this.isIncognito) {
            this.loadChatHistory();
        } else {
            this.appendMessage("Hello! I'm your anonymous NalediAI companion. Feel free to share anything - this conversation is private and won't be saved.", true);
        }
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async loadChatHistory() {
        try {
            const response = await fetch(API_ENDPOINTS.CHAT_HISTORY, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            if (response.ok && data.history) {
                data.history.forEach(msg => this.appendMessage(msg.message, msg.is_bot));
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.appendMessage('Error loading chat history. Please refresh the page.', true);
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Clear input
        this.messageInput.value = '';

        // Append user message
        this.appendMessage(message, false);
        this.scrollToBottom();

        try {
            const response = await fetch(API_ENDPOINTS.CHAT_SEND, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ 
                    message,
                    incognito: this.isIncognito
                })
            });

            const data = await response.json();
            if (response.ok && data.response) {
                this.appendMessage(data.response, true);
            } else {
                throw new Error(data.message || 'Error sending message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.appendMessage('Sorry, I encountered an error. Please try again later.', true);
        } finally {
            this.scrollToBottom();
        }
    }

    appendMessage(message, isBot) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot' : 'user'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message;
        
        messageDiv.appendChild(contentDiv);
        this.messageContainer.appendChild(messageDiv);
    }

    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.chat-container')) {
        // Check if we're on the incognito chat page
        const isIncognito = window.location.pathname.includes('incognito-chat');
        new Chat(isIncognito);
    }
});
