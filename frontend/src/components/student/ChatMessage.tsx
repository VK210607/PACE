// src/components/student/ChatMessage.tsx
// Individual chat bubble — user or assistant.

import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white
          ${isUser ? 'bg-maroon-800' : 'bg-navy-800'}`}
      >
        {isUser
          ? <User className="h-3.5 w-3.5" />
          : <Bot  className="h-3.5 w-3.5" />
        }
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed
          ${isUser
            ? 'bg-maroon-800 text-white rounded-tr-none'
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-card'
          }
          ${message.isStreaming ? 'cursor-blink' : ''}
        `}
      >
        {message.content || (
          // Typing indicator while content is empty and still streaming
          <span className="flex items-center gap-1 py-0.5">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </span>
        )}
      </div>
    </div>
  );
}
