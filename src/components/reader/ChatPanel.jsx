import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { sendChatMessage } from '../../api/aiService';
import './chatpanel.css';

/**
 * Chat panel — "Ask Buhari" AI tutor.
 * Uses historyRef to persist chat between bottom sheet open/close.
 */
export default function ChatPanel({ materialId, historyRef }) {
  const [messages, setMessages] = useState(historyRef.current || []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef(null);

  // Sync with ref
  useEffect(() => {
    historyRef.current = messages;
  }, [messages, historyRef]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const response = await sendChatMessage(
        materialId,
        userMsg.content,
        messages,
        (chunk) => setStreamingText(chunk)
      );

      setMessages(prev => [...prev, response]);
      setStreamingText('');
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && !isTyping && (
          <div className="chat-empty">
            <span className="chat-empty-icon">🤖</span>
            <h3 className="chat-empty-title">Ask Buhari anything</h3>
            <p className="chat-empty-text">
              I can explain concepts from your material, answer questions, or help you study.
            </p>
            <div className="chat-suggestions">
              {[
                'What is crystal field theory?',
                'Explain CFSE in simple terms',
                'Give me a summary',
              ].map(q => (
                <button
                  key={q}
                  className="chat-suggestion"
                  onClick={() => setInput(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg chat-msg--${msg.role}`}>
            {msg.role === 'assistant' && <span className="chat-msg-avatar">🤖</span>}
            <div className="chat-msg-bubble">
              <p className="chat-msg-text">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isTyping && streamingText && (
          <div className="chat-msg chat-msg--assistant">
            <span className="chat-msg-avatar">🤖</span>
            <div className="chat-msg-bubble">
              <p className="chat-msg-text">{streamingText}<span className="chat-cursor" /></p>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && !streamingText && (
          <div className="chat-msg chat-msg--assistant">
            <span className="chat-msg-avatar">🤖</span>
            <div className="chat-msg-bubble chat-typing">
              <span className="chat-dot" />
              <span className="chat-dot" />
              <span className="chat-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-wrap">
        <textarea
          className="chat-input"
          placeholder="Ask Buhari a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          rows={1}
          style={{ minHeight: '24px', maxHeight: '120px' }}
        />
        <button
          className="chat-send"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
