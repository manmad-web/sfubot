/**********************************************
 * script.js
 **********************************************/

// Generate a unique session ID for this chat session
const sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

// When user clicks the map button
document.getElementById("map-button").addEventListener("click", function () {
  const chatBox = document.getElementById("chat-box");
  const mapContainer = document.getElementById("map-container");
  const sfuLogo = document.getElementById("sfu-logo");

  // Hide chatbot and logo, show map
  chatBox.style.display = "none";
  sfuLogo.style.display = "none";
  mapContainer.style.display = "block";
});

  
  
  // Theme Toggle
  // document.getElementById("theme-toggle").addEventListener("click", function () {
  //   document.body.classList.toggle("dark-theme");
  //   const isDarkTheme = document.body.classList.contains("dark-theme");
  //   document.getElementById("theme-toggle").textContent = isDarkTheme
  //     ? "🌙"
  //     : "☀️";
  // });
  
  
  // Handle Enter Key Press
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }
  

  function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;
  
    addMessage(userInput, true);
    document.getElementById("user-input").value = "";
  
    const messageList = document.getElementById("messages");
  
    // Check if this query might need real-time data or web search
    const needsRealtime = needsRealtimeData(userInput);
    const needsWebSearch = shouldUseWebSearch(userInput);
    
    // 🦝 Rocco thinking bubble
    const botLoadingBubble = document.createElement("li");
    botLoadingBubble.classList.add("message-with-avatar");
    
    if (needsRealtime) {
      // Show real-time data indicator
      botLoadingBubble.innerHTML = `
        <img src="assets/think.png" class="rocco-avatar" alt="Rocco thinking">
        <div class="bot-text">
          <div class="web-search-indicator">⚡ Fetching real-time data...</div>
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      `;
    } else if (needsWebSearch) {
      // Show web search indicator
      botLoadingBubble.innerHTML = `
        <img src="assets/think.png" class="rocco-avatar" alt="Rocco thinking">
        <div class="bot-text">
          <div class="web-search-indicator">🔍 Searching SFU websites for current information...</div>
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      `;
    } else {
      // Regular thinking bubble
      botLoadingBubble.innerHTML = `
        <img src="assets/think.png" class="rocco-avatar" alt="Rocco thinking">
        <div class="bot-text">
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      `;
    }

    //const chatBox = document.getElementById("chat-box");
    const chatBox = document.getElementById("chat-box");
    const suggestions = document.querySelector(".suggested-questions");

    // Insert bot message above suggested questions
    if (suggestions && suggestions.parentNode === chatBox) {
      chatBox.insertBefore(botLoadingBubble, suggestions);
    } else {
      messageList.appendChild(botLoadingBubble); // fallback
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  
    setTimeout(() => {
      //fetch("https://sfu-ai-chatbot-production.up.railway.app/chat", {
      // fetch("https://sfu-ai-chatbot-production-6037.up.railway.app/chat", {
      fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput, sessionId: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 🦝 Replace with smiling Rocco and actual message
          botLoadingBubble.innerHTML = `
            <div class="message-with-avatar">
              <img src="assets/smile.png" class="rocco-avatar" alt="Rocco smiling">
              <div class="bot-text">${formatMessageContent(data.response)}</div>
            </div>
          `;
          chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch((error) => {
          console.error("Error:", error);
          botLoadingBubble.innerHTML = `
            <div class="message-with-avatar">
              <img src="assets/think.png" class="rocco-avatar" alt="Rocco error">
              <div class="bot-text">Sorry, something went wrong.</div>
            </div>
          `;
        });
    }, 1500);
  }

  function suggest(text, el) {
    const input = document.getElementById("user-input");
    input.value = text;
    input.focus();
  
    // Remove only the clicked suggestion bubble
    if (el) {
      el.style.display = "none";
    }
  }

  // Check if a query should use web search
  function shouldUseWebSearch(message) {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate need for current/dynamic information
    const webSearchKeywords = [
      'professor', 'professors', 'faculty', 'instructor', 'teacher',
      'financial aid', 'scholarship', 'bursary', 'tuition', 'fees',
      'contact', 'phone', 'email', 'address', 'office hours',
      'admission', 'application', 'deadline', 'requirements',
      'current', 'latest', 'recent', 'updated', 'new',
      'events', 'news', 'announcement', 'schedule',
      'campus', 'building', 'location', 'directions',
      'library', 'hours', 'services', 'resources'
    ];
    
    // Check if message contains web search keywords
    return webSearchKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Check if a query needs real-time data
  function needsRealtimeData(message) {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate need for real-time data
    const realtimeKeywords = [
      'weather', 'temperature', 'forecast',
      'news', 'announcement', 'latest',
      'time', 'date', 'what time',
      'schedule', 'timetable', 'class times',
      'library hours', 'library open', 'library closed',
      'events', 'activities', 'what\'s happening'
    ];
    
    // Check if message contains real-time keywords
    return realtimeKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Format message content with proper links and sources
  function formatMessageContent(content) {
    // Convert markdown-style links to HTML
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #007bff; text-decoration: underline;">$1</a>');
    
    // Convert line breaks
    content = content.replace(/\n/g, '<br>');
    
    return content;
  }
  
  
  
  
  
  // Reusable helper to add a chat bubble
  function addMessage(message, isUser) {
    const messageList = document.getElementById("messages");
    const messageItem = document.createElement("li");
    messageItem.textContent = message;
    messageItem.classList.add(isUser ? "user-message" : "bot-message");
    messageList.appendChild(messageItem);
  
    // Scroll the chat box to the bottom
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  

  window.addEventListener("DOMContentLoaded", () => {
    const welcomeMsg = "Welcome! I'm Rocco, your SFU AI assistant. I can help with courses, clubs, real-time data, and more. How can I help you today?";
    const messageList = document.getElementById("messages");
  
    const botWelcome = document.createElement("li");
    botWelcome.classList.add("message-with-avatar");
    botWelcome.innerHTML = `
      <div class="message-with-avatar">
        <img src="assets/smile.png" class="rocco-avatar" alt="Rocco smiling">
        <div class="bot-text">${welcomeMsg}</div>
      </div>
    `;
    messageList.appendChild(botWelcome);
  });
  
