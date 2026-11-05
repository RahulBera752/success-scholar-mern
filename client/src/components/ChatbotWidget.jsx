import { useState, useEffect, useRef } from 'react';
import { api, getToken } from '../api.js';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I’m the Success Scholar assistant. Ask me about our website, registration, courses, internships, or your own account.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setMessages(current => [
      ...current,
      {
        role: 'user',
        content: message,
      },
    ]);

    setInput('');
    setLoading(true);

    try {
      const result = await api('/chatbot', {
        method: 'POST',
        body: { message },
        auth: Boolean(getToken()),
      });

      if (!result?.answer) {
        throw new Error(
          result?.message || 'The assistant could not generate an answer.'
        );
      }

      setMessages(current => [
        ...current,
        {
          role: 'assistant',
          content: result.answer,
        },
      ]);
    } catch (error) {
      console.error('Chatbot frontend error:', error);

      let errorMessage = error.message || '';

      if (
        errorMessage.includes('Request failed') ||
        errorMessage.includes('Network Error')
      ) {
        errorMessage =
          'The chatbot could not connect to the AI service. Please try again shortly.';
      }

      setMessages(current => [
        ...current,
        {
          role: 'assistant',
          content:
            errorMessage ||
            'Sorry, the assistant is temporarily unavailable. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-chatbot-root">
      {open && (
        <section
          className="ss-chatbot-panel"
          aria-label="Success Scholar chatbot"
          aria-busy={loading}
        >
          <header className="ss-chatbot-header">
            <div>
              <strong>Success Scholar Assistant</strong>
              <small>Website help & account questions</small>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div
            className="ss-chatbot-messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`ss-chatbot-message ${
                  message.role === 'user'
                    ? 'ss-chatbot-user'
                    : 'ss-chatbot-assistant'
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="ss-chatbot-message ss-chatbot-assistant ss-chatbot-thinking">
                <span className="ss-chatbot-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="ss-chatbot-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask your question..."
              maxLength={2000}
              aria-label="Type your question"
              autoComplete="off"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
            >
              {loading ? 'Wait...' : 'Send'}
            </button>
          </form>

          <p className="ss-chatbot-note">
            Never share passwords, OTPs, or payment PINs in chat.
          </p>
        </section>
      )}

      <button
        type="button"
        className="ss-chatbot-toggle"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
      >
        {open ? '×' : '💬'}
      </button>

      <style>{`
        .ss-chatbot-root {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 9999;
          font-family: inherit;
        }

        .ss-chatbot-toggle {
          width: 58px;
          height: 58px;
          border: 0;
          border-radius: 50%;
          background: #5b3df5;
          color: #fff;
          font-size: 27px;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(0,0,0,.22);
        }

        .ss-chatbot-panel {
          width: min(360px, calc(100vw - 32px));
          height: min(500px, calc(100vh - 110px));
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: #fff;
          color: #172033;
          box-shadow: 0 14px 45px rgba(0,0,0,.2);
        }

        .ss-chatbot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px 16px;
          background: #5b3df5;
          color: #fff;
        }

        .ss-chatbot-header div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .ss-chatbot-header strong {
          font-size: 16px;
        }

        .ss-chatbot-header small {
          opacity: .85;
          font-size: 11px;
        }

        .ss-chatbot-header button {
          border: 0;
          background: transparent;
          color: #fff;
          font-size: 26px;
          cursor: pointer;
        }

        .ss-chatbot-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          background: #f8f9fc;
          scroll-behavior: smooth;
        }

        .ss-chatbot-message {
          max-width: 88%;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .ss-chatbot-assistant {
          align-self: flex-start;
          background: #fff;
          border: 1px solid #e8eaf0;
        }

        .ss-chatbot-user {
          align-self: flex-end;
          background: #5b3df5;
          color: #fff;
        }

        .ss-chatbot-thinking {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5b3df5;
        }

        .ss-chatbot-dots {
          display: inline-flex;
          gap: 3px;
        }

        .ss-chatbot-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #5b3df5;
          animation: ss-chatbot-bounce 1s infinite ease-in-out;
        }

        .ss-chatbot-dots span:nth-child(2) {
          animation-delay: .15s;
        }

        .ss-chatbot-dots span:nth-child(3) {
          animation-delay: .3s;
        }

        @keyframes ss-chatbot-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: .5;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .ss-chatbot-form {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #e8eaf0;
        }

        .ss-chatbot-form input {
          min-width: 0;
          flex: 1;
          padding: 10px 11px;
          border: 1px solid #d9dce5;
          border-radius: 9px;
          outline: none;
          font: inherit;
          font-size: 13px;
        }

        .ss-chatbot-form input:focus {
          border-color: #5b3df5;
        }

        .ss-chatbot-form button {
          padding: 0 14px;
          border: 0;
          border-radius: 9px;
          background: #5b3df5;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .ss-chatbot-form button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .ss-chatbot-note {
          margin: 0;
          padding: 0 12px 10px;
          color: #6b7280;
          font-size: 10px;
        }

        @media(max-width: 480px) {
          .ss-chatbot-root {
            right: 12px;
            bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
}