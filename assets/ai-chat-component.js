class AIChatComponent {
    constructor(options = {}) {
        this.options = {
            apiUrl: options.apiUrl || 'https://890651.xyz/v1/chat/completions',
            buttonText: options.buttonText || 'Ask',
            buttonIcon: options.buttonIcon || 'assets/ìmages/ai/AI_icon.svg',
            closeIcon: options.closeIcon || 'assets/ìmages/ai/Close_X.png',
            sendIcon: options.sendIcon || 'assets/ìmages/ai/Paper_Plane.svg',
            chatTitle: options.chatTitle || 'AI Assistant',
            welcomeMessage: options.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
            storageKey: options.storageKey || 'aiChatHistory',
            storageTimestampKey: options.storageTimestampKey || 'aiChatHistoryTimestamp',
            firstVisitKey: options.firstVisitKey || 'aiChatFirstVisitTimestamp',
            sessionTimeout: options.sessionTimeout || 45 * 60 * 1000, // 45 minutes
            ...options
        };
        
        this.isChatOpen = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        
        this.init();
    }
    
    async init() {
        document.body.style.overflow = '';
        await this.loadMarkedScript();
        this.createStyles();
        this.createHTML();
        if (this.overlay) this.overlay.style.display = 'none';
        this.bindEvents();
        this.loadConversationHistory();
    }

    loadMarkedScript() {
        return new Promise((resolve, reject) => {
            if (window.marked) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load marked.js'));
            document.head.appendChild(script);
        });
    }
    
    createStyles() {
        if (document.getElementById('ai-chat-styles')) return;
        
        const styles = `
            #ai-button {
                display: flex;
                align-items: stretch;
                gap: 8px;
                padding: 12px 50px;
                border: 2px solid transparent;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                color: #1f2937;
                box-shadow: 0 4px 12px rgba(134, 207, 255, 0.2);
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background:
                    linear-gradient(white, white) padding-box,
                    linear-gradient(45deg, #86CFFF 0%, #C8FB74 100%) border-box;
                background-clip: padding-box, border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            #ai-button:hover {
                box-shadow: 0 6px 20px rgba(134, 207, 255, 0.4);
                color: white;
                box-shadow: inset 0 0 0 1px white;
                background:
                    linear-gradient(45deg, #86CFFF 0%, #C8FB74 100%) padding-box,
                    linear-gradient(45deg, #86CFFF 0%, #C8FB74 100%) border-box;
            }
            
            #ai-button .ai-button-text {
                font-size: 14px;
                font-weight: 600;
                position: relative;
                z-index: 2;
                background: rgb(51, 51, 51);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                transition: color 0.3s;
            }
            
            #ai-button:hover .ai-button-text {
                color: rgb(51, 51, 51);
                background: none;
                -webkit-background-clip: initial;
                background-clip: initial;
            }
            
            #ai-button .ai-button-icon {
                width: 16px;
                height: 16px;
                position: relative;
                z-index: 2;
            }

            #ai-button .ai-button-text,
            #ai-button .ai-button-icon {
                pointer-events: none;
            }

            #chatContainer {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999;
                width: 0;
                overflow: hidden;
                transition: width 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                transform-origin: top right;
            }
            
            .chat-open #chatContainer {
                width: 350px;
            }
            
            #chatHeader {
                background: linear-gradient(90deg, #86CFFF 0%, #C8FB74 100%);
                color: white;
                padding: 10px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chat-header-title {
                font-size: 1.3rem;
                display: flex;
                color:rgb(234, 244, 255);
                margin:0px;
                align-items: center;
                gap: 10px;
            }
            
            #closeChat {
                background: none;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            
            #closeChat:hover {
                background: rgba(255, 255, 255, 0.4);
            }
            
            #chatBody {
                background: white;
                height: 0;
                overflow: hidden;
                transition: height 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                display: flex;
                flex-direction: column;
                border-radius: 0 0 12px 12px;
            }
            
            .chat-open #chatBody {
                height: 450px;
            }
            
            #messages {
                flex: 1;
                color:rgb(73, 73, 73);
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                animation: fadeIn 0.3s ease;
                position: relative;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .ai-message {
                background: #f0f5ff;
                align-self: flex-start;
                border-radius: 18px 18px 18px 4px;
            }
            
            .user-message {
                background: #e3f2fd;
                align-self: flex-end;
                border-radius: 18px 18px 4px 18px;
            }
            
            .message-time {
                font-size: 0.7rem;
                color: #7a8ca5;
                margin-top: 5px;
            }
            
            .ai-message .message-time {
                text-align: left;
            }
            
            .user-message .message-time {
                text-align: right;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 12px 16px;
                background: #f0f5ff;
                border-radius: 18px;
                align-self: flex-start;
                width: fit-content;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: #86CFFF;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-dot:nth-child(1) { animation-delay: 0s; }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-5px); }
            }
            
            .input-area {
                display: flex;
                padding: 15px;
                border-top: 1px solid #e6f0fa;
                gap: 10px;
            }
            
            #userInput {
                flex: 1;
                padding: 12px 18px;
                border: 1px solid #d6e4f0;
                border-radius: 25px;
                font-size: 1rem;
                outline: none;
                transition: border-color 0.3s;
            }
            
            #userInput:focus {
                border-color: #86CFFF;
                box-shadow: 0 0 0 3px rgba(134, 207, 255, 0.2);
            }
            
            #sendBtn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #86CFFF, #C8FB74);
                color: white;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s, opacity 0.3s;
            }
            
            #sendBtn:hover {
                transform: scale(1.05);
                opacity: 0.9;
            }
            /* Overlay for mobile */
            #ai-chat-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(30, 41, 59, 0.45);
                z-index: 998;
                pointer-events: auto;
                transition: opacity 0.3s;
            }
            .chat-open #ai-chat-overlay {
                display: block;
            }
            @media (min-width: 769px) {
                #ai-chat-overlay {
                    display: none !important;
                }
            }
            @media (max-width: 768px) {
                .chat-open #chatContainer {
                    width: 100%;
                    height: 100dvh;
                    top:0;
                    right:0;
                    border-radius: 0;
                    display: flex;
                    flex-direction: column;
                }

                #chatHeader {
                    font-weight: bold;
                    padding: 20px 15px;
                    flex-shrink: 0;
                }

                .chat-open #chatBody {
                    height: 100%;
                    flex-grow: 1;
                }
                
                .input-area {
                    margin-bottom: 0;
                    padding-bottom: calc(15px + env(safe-area-inset-bottom));
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'ai-chat-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    createHTML() {
        // Create AI button
        const aiButton = document.createElement('button');
        aiButton.id = 'ai-button';
        aiButton.innerHTML = `
            <span class="ai-button-text">${this.options.buttonText}</span>
            <img src="${this.options.buttonIcon}" alt="AI" class="ai-button-icon">
        `;
        // Create overlay (for mobile)
        const overlay = document.createElement('div');
        overlay.id = 'ai-chat-overlay';
        document.body.appendChild(overlay);
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chatContainer';
        chatContainer.innerHTML = `
            <div id="chatHeader">
                <span class="chat-header-title">${this.options.chatTitle}</span>
                <button id="closeChat">
                    <img src="${this.options.closeIcon}" alt="Close" style="width: 0.9em; height: 0.9em;">
                </button>
            </div>
            
            <div id="chatBody">
                <div id="messages"></div>
                
                <div class="input-area">
                    <input type="text" id="userInput" placeholder="Type a message...">
                    <button id="sendBtn">
                        <img src="${this.options.sendIcon}" alt="Send" style="width: 1.5em; height: 1.5em;">
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(aiButton);
        document.body.appendChild(chatContainer);
        // Store references
        this.aiButton = aiButton;
        this.chatContainer = chatContainer;
        this.closeChatBtn = document.getElementById('closeChat');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.messages = document.getElementById('messages');
        this.overlay = overlay;
    }
    
    bindEvents() {
        this.aiButton.addEventListener('click', () => this.openChat());
        this.closeChatBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isChatOpen && !this.chatContainer.contains(e.target) && e.target !== this.aiButton) {
                this.closeChat();
            }
        });
    }
    
    loadConversationHistory() {
        const savedHistory = localStorage.getItem(this.options.storageKey);
        const savedTimestamp = localStorage.getItem(this.options.storageTimestampKey);
        const now = Date.now();
        let isValid = false;

        if (savedHistory && savedTimestamp) {
            const age = now - parseInt(savedTimestamp, 10);
            if (age < this.options.sessionTimeout) {
                this.conversationHistory = JSON.parse(savedHistory);
                isValid = true;
            }
        }

        if (!isValid) {
            let firstVisitTimestamp = Date.now();
            localStorage.setItem(this.options.firstVisitKey, firstVisitTimestamp);
            this.conversationHistory = [
                { role: 'assistant', content: this.options.welcomeMessage, timestamp: firstVisitTimestamp }
            ];
            this.saveConversationHistory();
        }

        this.renderMessages();
    }
    
    saveConversationHistory() {
        localStorage.setItem(this.options.storageKey, JSON.stringify(this.conversationHistory));
        localStorage.setItem(this.options.storageTimestampKey, Date.now().toString());
    }
    
    renderMessages() {
        this.messages.innerHTML = '';
        for (const msg of this.conversationHistory) {
            this.addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai', msg.timestamp);
        }
    }
    
    openChat() {
        this.isChatOpen = true;
        document.body.classList.add('chat-open');
        this.aiButton.style.display = 'none';
        // Prevent scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeChat() {
        this.isChatOpen = false;
        document.body.classList.remove('chat-open');
        setTimeout(() => {
            this.aiButton.style.display = '';
            // Restore scroll on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = '';
            }
        }, 400);
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) return;
        
        const now = Date.now();
        this.addMessage(message, 'user', now);
        this.conversationHistory.push({ role: 'user', content: message, timestamp: now });
        this.saveConversationHistory();
        
        this.userInput.value = '';
        this.showTypingIndicator();
        this.isProcessing = true;
        
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.conversationHistory })
            });
            
            this.removeTypingIndicator();
            
            if (!response.ok) {
                throw new Error('API error: ' + response.status);
            }
            
            const data = await response.json();
            let aiText = "Sorry, I couldn't get a response. Please try again.";
            
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                aiText = data.choices[0].message.content;
            }
            
            const aiNow = Date.now();
            this.addMessage(aiText, 'ai', aiNow);
            this.conversationHistory.push({ role: 'assistant', content: aiText, timestamp: aiNow });
            this.saveConversationHistory();
            
        } catch (err) {
            this.removeTypingIndicator();
            this.addMessage('An error occurred. Please try again later.', 'ai', Date.now());
        } finally {
            this.isProcessing = false;
        }
    }
    
    addMessage(text, sender, timestamp) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        let timeString = '';
        if (timestamp) {
            const date = new Date(timestamp);
            timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        let messageContent;
        if (sender === 'ai' && window.marked) {
            messageContent = marked.parse(text);
        } else {
            messageContent = text;
        }
        messageElement.innerHTML = `
            <div>${messageContent}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        this.messages.appendChild(messageElement);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
    
    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('typing-indicator');
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        this.messages.appendChild(typingElement);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Public methods for external control
    open() {
        this.openChat();
    }
    
    close() {
        this.closeChat();
    }
    
    destroy() {
        if (this.aiButton) this.aiButton.remove();
        if (this.chatContainer) this.chatContainer.remove();
        if (this.overlay) this.overlay.remove();
        const styles = document.getElementById('ai-chat-styles');
        if (styles) styles.remove();
    }
}

// Auto-initialize if script is loaded
if (typeof window !== 'undefined') {
    window.AIChatComponent = AIChatComponent;
} 