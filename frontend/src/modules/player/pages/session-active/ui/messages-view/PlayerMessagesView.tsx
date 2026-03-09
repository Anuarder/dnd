import { Send } from 'lucide-react';
import { type ReactElement, useState } from 'react';

import type { Message } from '~entities/session';
import { MOCK_PLAYER_MESSAGES } from '~entities/session';

function MessageBubble({ message }: { message: Message }): ReactElement {
  const isPlayer = message.from === 'player';
  return (
    <div className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
          isPlayer
            ? 'rounded-tr-sm bg-primary/80 text-white'
            : 'rounded-tl-sm bg-white/10 text-gray-200'
        }`}
      >
        {!isPlayer && (
          <p className="mb-1 text-xs font-semibold text-gray-400">Dungeon Master</p>
        )}
        <p className="text-sm">{message.text}</p>
        <p className="mt-0.5 text-right text-xs opacity-50">{message.timestamp}</p>
      </div>
    </div>
  );
}

export function PlayerMessagesView(): ReactElement {
  const [messages, setMessages] = useState<Message[]>(MOCK_PLAYER_MESSAGES);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) {
      return;
    }
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, from: 'player', text: input.trim(), timestamp },
    ]);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[60vh] flex-col gap-3">
      <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
        Private messages with DM
      </p>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="flex items-end gap-2 border-t border-white/10 pt-3">
        <textarea
          value={input}
          rows={1}
          placeholder="Message to DM..."
          className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white active:bg-primary/80"
          onClick={handleSend}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
