document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    
    chatToggle.addEventListener('click', () => {
        chatBox.style.display = (chatBox.style.display === 'none' || chatBox.style.display === '') ? 'block' : 'none';
    });

    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBody = document.getElementById('chatBody');

    const API_KEY = 'AIzaSyBm58ikv0xSLPDZWPC9vVKCy7x3-6zn1y0'; 
    
    // 🚀 FIXED: Upgraded to the new gemini-2.5-flash model
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    let conversationHistory = [
        { "role": "user", "parts": [{ "text": "Hello"}] },
        { "role": "model", "parts": [{ "text": "Hi! I am TechBot, ready to help visitors explore Future Tech."}] }
    ];

    async function sendMessage() {
        const text = userInput.value.trim();
        if (text === '') return;

        appendMessage(text, 'user-msg');
        userInput.value = '';
        conversationHistory.push({ "role": "user", "parts": [{ "text": text }] });

        const typingIndicator = appendMessage("Typing...", 'bot-msg');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: conversationHistory })
            });

            const data = await response.json();
            chatBody.removeChild(typingIndicator);

            if (!response.ok) {
                appendMessage(`🚨 API Error: ${data.error?.message || "Unknown API Issue"}`, 'bot-msg');
                return;
            }

            if (data.candidates && data.candidates.length > 0) {
                const botReply = data.candidates[0].content.parts[0].text;
                appendMessage(botReply, 'bot-msg');
                conversationHistory.push({ "role": "model", "parts": [{ "text": botReply }] });
            }
        } catch (error) {
            chatBody.removeChild(typingIndicator);
            appendMessage(`⚠️ Connection Error: ${error.message}`, 'bot-msg');
        }
    }

    function appendMessage(text, className) {
        const div = document.createElement('p');
        div.className = className;
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight; 
        return div;
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});