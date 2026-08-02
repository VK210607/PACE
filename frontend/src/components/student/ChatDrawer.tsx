// src/components/student/ChatDrawer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Sliding chat panel.
// Consumes the /api/chat/query endpoint — standard single-shot JSON response.
// Backend returns: { "reply": "The full AI response string." }

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import type { ChatMessage } from '../../types';
import ChatMessageComponent from './ChatMessage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

let messageIdCounter = 0;
function nextId() { return String(++messageIdCounter); }

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello! I\'m your College AI Assistant. I can answer questions about exams, events, workshops, and announcements. What would you like to know?',
};

export default function ChatDrawer({ isOpen, onClose }: Props) {
  const [messages, setMessages]   = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input,    setInput]      = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const query = input.trim();
    if (!query || isSending) return;

    setInput('');
    setIsSending(true);

    // Add user message immediately
    const userMsg: ChatMessage = { id: nextId(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);

    // Add placeholder assistant message (shows typing indicator while waiting)
    const assistantId = nextId();
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '', isStreaming: true };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const token = localStorage.getItem('access_token');

      // Build conversation history from the current messages state.
      // At this point in execution, React state still holds the messages
      // BEFORE the setMessages calls above resolved, so `messages` is the
      // prior history — it does NOT yet include the new userMsg or the
      // empty placeholder assistantMsg.
      //
      // Steps:
      //   1. Filter out any message with empty content (safety net for
      //      any stale placeholder that may linger in state).
      //   2. Strip UI-only keys (id, isStreaming) — send only role + content.
      //   3. Append the new user turn at the end.
      const history = messages
        .filter((m) => m.content.trim() !== '')
        .map(({ role, content }) => ({ role, content }));

      history.push({ role: 'user' as const, content: query });

      const response = await fetch('/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Standard single-shot JSON parse — backend returns { "reply": "..." }
      const data = await response.json() as { reply: string };

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: data.reply, isStreaming: false }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: 'Sorry, I encountered an error. Please try again.',
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [input, isSending]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-40 flex flex-col w-full max-w-sm
                    bg-white border-l border-gray-200 shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="AI Chat Assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-maroon-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15">
              <Bot className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">College AI Assistant</p>
              <p className="text-xs text-maroon-200">Powered by Gemini · RAG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer banner */}
        <div className="px-4 py-2 border-b bg-amber-50 border-amber-100">
          <p className="text-xs text-amber-700">
            ⚠️ This assistant only answers from verified college records. Always confirm critical dates with your department.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <ChatMessageComponent key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about exams, events, workshops..."
              disabled={isSending}
              className="flex-1 text-sm input-field"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="flex items-center justify-center flex-shrink-0 text-white transition-colors rounded-md h-9 w-9 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
