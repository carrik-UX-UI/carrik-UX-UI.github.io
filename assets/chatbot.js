// Portable, embeddable chatbot component
(function() {
  // Default options
  const DEFAULTS = {
    container: 'body',
    workerUrl: '',
    title: 'Chatbot',
    initialMessage: "Hello! I'm a helpful assistant. How can I help you today?",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    height: 500,
    width: 400,
    storageKey: 'cb-chatbot-history',
    floating: true, // always floating widget now
    showFloatingButton: true, // new option to control floating button visibility
    position: 'bottom-right', // can be extended
    iconSvg: `<span class="cb-animated-icon"><svg width="32" height="32" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.57974 4.66099L5.43965 2.08125H6.93392L7.79383 4.66099L10.3736 5.52091V7.01517L7.79383 7.87509L6.93392 10.4548H5.43965L4.57974 7.87509L2 7.01517V5.52091L4.57974 4.66099ZM6.18679 4.82074L5.94949 5.53265L5.4514 6.03074L4.73949 6.26804L5.4514 6.50534L5.94949 7.00343L6.18679 7.71533L6.42409 7.00343L6.92218 6.50534L7.63408 6.26804L6.92218 6.03074L6.42409 5.53265L6.18679 4.82074ZM14.9199 7.08517C14.5654 7.05621 14.1068 7.05559 13.4322 7.05559H12.4872V5.4805H13.4647C14.0987 5.48049 14.6219 5.48048 15.0481 5.5153C15.4908 5.55147 15.8977 5.62909 16.28 5.82385C16.8727 6.12587 17.3546 6.60779 17.6566 7.20053C17.8514 7.58276 17.929 7.98969 17.9652 8.43237C18 8.85858 18 9.38179 18 10.0157V12.758C18 13.392 18 13.9152 17.9652 14.3414C17.929 14.7841 17.8514 15.191 17.6566 15.5732C17.3546 16.166 16.8727 16.6479 16.28 16.9499C15.8977 17.1447 15.4908 17.2223 15.0481 17.2585C14.6219 17.2933 14.0987 17.2933 13.4648 17.2933H13.2995L11.5101 19.3813L10.3141 19.3813L8.52469 17.2933H8.35937C7.72542 17.2933 7.20221 17.2933 6.776 17.2585C6.33332 17.2223 5.92639 17.1447 5.54417 16.9499C4.95142 16.6479 4.4695 16.166 4.16748 15.5732C3.97273 15.191 3.8951 14.7841 3.85893 14.3414C3.82411 13.9152 3.82412 13.392 3.82413 12.758L3.82413 12.1744H5.39923V12.7255C5.39923 13.4001 5.39984 13.8587 5.4288 14.2131C5.45701 14.5584 5.50814 14.735 5.5709 14.8582C5.72191 15.1545 5.96287 15.3955 6.25924 15.5465C6.38242 15.6093 6.55899 15.6604 6.90426 15.6886C7.25873 15.7176 7.71731 15.7182 8.39191 15.7182H9.24922L10.9121 17.6585L12.5749 15.7182H13.4322C14.1068 15.7182 14.5654 15.7176 14.9199 15.6886C15.2651 15.6604 15.4417 15.6093 15.5649 15.5465C15.8613 15.3955 16.1022 15.1545 16.2532 14.8582C16.316 14.735 16.3671 14.5584 16.3953 14.2132C16.4243 13.8587 16.4249 13.4001 16.4249 12.7255V10.0483C16.4249 9.37368 16.4243 8.9151 16.3953 8.56063C16.3671 8.21536 16.316 8.03878 16.2532 7.91561C16.1022 7.61924 15.8613 7.37828 15.5649 7.22727C15.4417 7.16451 15.2651 7.11338 14.9199 7.08517Z" fill="url(#paint0_linear_6_94)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.94785 10.8167L10.4638 9.26881H11.3604L11.8763 10.8167L13.4242 11.3326V12.2292L11.8763 12.7451L11.3604 14.293H10.4638L9.94785 12.7451L8.40001 12.2292V11.3326L9.94785 10.8167Z" fill="url(#paint1_linear_6_94)"/><defs><linearGradient id="paint0_linear_6_94" x1="8.5" y1="17" x2="18.8889" y2="4.30347" gradientUnits="userSpaceOnUse"><stop stop-color="#36749D"/><stop offset="1" stop-color="#B3FC03"/></linearGradient><linearGradient id="paint1_linear_6_94" x1="8.5" y1="17" x2="18.8889" y2="4.30347" gradientUnits="userSpaceOnUse"><stop stop-color="#36749D"/><stop offset="1" stop-color="#B3FC03"/></linearGradient></defs></svg></span>`
  };

  function createStyles(doc, height, width, fontUrl) {
    // Inject font
    if (fontUrl) {
      const fontLink = doc.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = fontUrl;
      doc.head.appendChild(fontLink);
    }
    
    // Inject chatbot CSS
    const cssLink = doc.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'assets/chatbot.css';
    cssLink.id = 'cb-chatbot-styles';
    doc.head.appendChild(cssLink);
    
    // Apply dynamic styles for height and width
    const dynamicStyle = doc.createElement('style');
    dynamicStyle.textContent = `
      .cb-chatbot-container {
        max-width: ${width}px !important;
        height: ${height}px !important;
      }
      .cb-chatbot-container.custom-position {
        position: fixed;
        z-index: 9999;
        /* Remove top/right/left/bottom here, set via JS */
      }
    `;
    doc.head.appendChild(dynamicStyle);
  }

  function createFloatingButton(doc, opts) {
    const btn = doc.createElement('button');
    btn.className = 'cb-floating-btn';
    btn.innerHTML = opts.iconSvg;
    btn.title = 'Open chat';
    return btn;
  }

  function createFloatingChatContainer(doc) {
    const div = doc.createElement('div');
    div.className = 'cb-floating-chat';
    return div;
  }

  function createChatbotUI(doc, opts) {
    // Main container
    const container = doc.createElement('div');
    container.className = 'cb-chatbot-container';
    container.style.position = 'relative';
    container.innerHTML = `
      <button class="cb-close-btn" title="Close">×</button>
      <div class="cb-chatbot-title">${opts.title}</div>
      <div class="cb-chatbot-messages"></div>
      <div class="cb-input-area">
        <input type="text" class="cb-user-input" placeholder="Type your message...">
        <button class="cb-send-button">Send</button>
      </div>
      <div class="cb-status-message"></div>
    `;
    return container;
  }

  function loadHistory(storageKey) {
    try {
      const data = localStorage.getItem(storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }
  function saveHistory(storageKey, history) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (e) {}
  }

  function initChatbot(userOptions = {}) {
    const opts = Object.assign({}, DEFAULTS, userOptions);
    if (!opts.workerUrl) {
      throw new Error('workerUrl is required for the chatbot to function.');
    }
    // Only inject styles once per page
    if (!document.getElementById('cb-chatbot-styles')) {
      createStyles(document, opts.height, opts.width, opts.fontUrl);
    }
    
    // Create overlay for clicking outside to close
    let overlay = document.createElement('div');
    overlay.className = 'cb-overlay';
    document.body.appendChild(overlay);
    
    // Floating widget mode
    let floatingBtn = createFloatingButton(document, opts);
    let floatingChat = createFloatingChatContainer(document);
    document.body.appendChild(floatingBtn);
    document.body.appendChild(floatingChat);
    
    // Hide floating button if showFloatingButton is false
    if (!opts.showFloatingButton) {
      floatingBtn.style.display = 'none';
    }
    
    let chatbotUI = null;
    let chatVisible = false;
    let isResponding = false;
    let isCustomPosition = false;
    // Chat state
    let conversationHistory = loadHistory(opts.storageKey);
    // Show/hide logic
    function showChat(customPosition = false) {
      if (!chatbotUI) {
        chatbotUI = createChatbotUI(document, opts);
        floatingChat.appendChild(chatbotUI);
        setupChatbot(chatbotUI);
      }
      
      isCustomPosition = customPosition;
      
      if (customPosition) {
        floatingChat.classList.add('custom-position');
        overlay.classList.add('active');
      } else {
        floatingChat.classList.remove('custom-position');
        overlay.classList.remove('active');
      }
      
      floatingChat.style.display = 'flex';
      chatbotUI.style.display = 'flex';
      chatVisible = true;
    }
    
    function hideChat() {
      if (chatbotUI) chatbotUI.style.display = 'none';
      floatingChat.style.display = 'none';
      overlay.classList.remove('active');
      isCustomPosition = false;
      chatVisible = false;
    }
    floatingBtn.addEventListener('click', () => {
      if (chatVisible) {
        hideChat();
      } else {
        showChat(false);
      }
    });
    
    // Overlay click handler for closing chat
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        hideChat();
      }
    });
    // Setup chatbot logic
    function setupChatbot(chatbotUI) {
      const chatMessagesDiv = chatbotUI.querySelector('.cb-chatbot-messages');
      const userInput = chatbotUI.querySelector('.cb-user-input');
      const sendButton = chatbotUI.querySelector('.cb-send-button');
      const statusMessageDiv = chatbotUI.querySelector('.cb-status-message');
      const closeBtn = chatbotUI.querySelector('.cb-close-btn');
      // Render history
      chatMessagesDiv.innerHTML = '';
      if (conversationHistory.length > 0) {
        for (const msg of conversationHistory) {
          appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.content);
        }
      } else {
        appendMessage('bot', opts.initialMessage);
      }
      function appendMessage(sender, message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('cb-message-wrapper', sender === 'user' ? 'cb-user-message' : 'cb-bot-message');
        const messageBubble = document.createElement('div');
        messageBubble.className = 'cb-message-bubble';
        messageBubble.textContent = message;
        messageWrapper.appendChild(messageBubble);
        chatMessagesDiv.appendChild(messageWrapper);
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
      }
      function showStatus(message, type = 'info') {
        statusMessageDiv.textContent = message;
        statusMessageDiv.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : '#666');
        setTimeout(() => {
          statusMessageDiv.textContent = '';
        }, 3000);
      }
      async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        appendMessage('user', message);
        userInput.value = '';
        userInput.disabled = true;
        sendButton.disabled = true;
        showStatus('Thinking...');
        conversationHistory.push({ role: 'user', content: message });
        saveHistory(opts.storageKey, conversationHistory);
        try {
          const apiUrl = `${opts.workerUrl}/v1/chat/completions`;
          const payload = { messages: conversationHistory };
          const fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          };
          const response = await fetch(apiUrl, fetchOptions);
          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = response.statusText;
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error ? errorData.error.message : JSON.stringify(errorData);
            } catch (e) {}
            throw new Error(`API Error: ${response.status} - ${errorMessage}`);
          }
          const result = await response.json();
          let botReply = "Sorry, I couldn't get a response. Please try again.";
          if (result.choices && result.choices.length > 0 &&
              result.choices[0].message && result.choices[0].message.content) {
            botReply = result.choices[0].message.content;
          }
          appendMessage('bot', botReply);
          conversationHistory.push({ role: 'assistant', content: botReply });
          saveHistory(opts.storageKey, conversationHistory);
          showStatus('Response received!', 'success');
        } catch (error) {
          appendMessage('bot', `An error occurred. (${error.message || 'Unknown error'})`);
          showStatus('Error communicating with the worker.', 'error');
          if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
            conversationHistory.pop();
            saveHistory(opts.storageKey, conversationHistory);
          }
        } finally {
          userInput.disabled = false;
          sendButton.disabled = false;
          userInput.focus();
        }
      }
      sendButton.addEventListener('click', sendMessage);
      userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          sendMessage();
        }
      });
      closeBtn.addEventListener('click', hideChat);
      userInput.focus();
    }
    // Hide chat on load
    hideChat();
    
    // Return methods for external control
    return {
      show: showChat,
      hide: hideChat,
      showFloatingButton: () => {
        if (floatingBtn) floatingBtn.style.display = 'flex';
      },
      hideFloatingButton: () => {
        if (floatingBtn) floatingBtn.style.display = 'none';
      },
      openChat: () => {
        showChat(false);
      },
      openChatCustom: () => {
        showChat(true);
      }
    };
  }
  // Expose globally
  window.initChatbot = initChatbot;
})(); 