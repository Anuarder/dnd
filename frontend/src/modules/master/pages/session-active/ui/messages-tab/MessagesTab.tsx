import { ArrowLeft, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactElement, useRef, useState } from 'react';

import type { Message, PlayerThread } from '~entities/session';
import { MOCK_PLAYER_THREADS } from '~entities/session';

function MessageBubble({ message }: { message: Message }): ReactElement {
  const isDm = message.from === 'dm';
  return (
    <div className={`flex ${isDm ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 ${
          isDm
            ? 'bg-primary/80 rounded-tr-sm text-white'
            : 'rounded-tl-sm bg-white/10 text-gray-200'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="mt-0.5 text-right text-xs opacity-50">{message.timestamp}</p>
      </div>
    </div>
  );
}

function ThreadListView({
  threads,
  onSelect,
}: {
  threads: PlayerThread[];
  onSelect: (playerId: string) => void;
}): ReactElement {
  return (
    <motion.div
      className="flex flex-col gap-1"
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
    >
      {threads.map((t) => {
        const lastMessage = t.messages[t.messages.length - 1];
        return (
          <button
            key={t.player_id}
            type="button"
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-left active:bg-white/10"
            onClick={() => onSelect(t.player_id)}
          >
            <span className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {t.player_name.charAt(0).toUpperCase()}
            </span>
            <span className="flex flex-1 flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white">{t.player_name}</span>
              {lastMessage && (
                <span className="truncate text-xs text-gray-400">
                  {lastMessage.from === 'dm' ? 'You: ' : ''}
                  {lastMessage.text}
                </span>
              )}
            </span>
            {t.unread_count > 0 && (
              <span className="bg-primary flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                {t.unread_count}
              </span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

function ChatView({
  thread,
  otherUnreadCount,
  onBack,
  onSend,
}: {
  thread: PlayerThread;
  otherUnreadCount: number;
  onBack: () => void;
  onSend: (playerId: string, text: string) => void;
}): ReactElement {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleSend() {
    if (!input.trim()) {
      return;
    }
    onSend(thread.player_id, input.trim());
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <motion.div
      className="flex h-full flex-col gap-3"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
    >
      {/* Chat header */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white active:bg-white/10"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          {otherUnreadCount > 0 && (
            <span className="bg-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {otherUnreadCount > 9 ? '9+' : otherUnreadCount}
            </span>
          )}
        </button>
        <span className="bg-primary/20 text-primary flex size-8 items-center justify-center rounded-full text-sm font-bold">
          {thread.player_name.charAt(0).toUpperCase()}
        </span>
        <span className="text-sm font-semibold text-white">{thread.player_name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {thread.messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 border-t border-white/10 pt-3">
        <textarea
          value={input}
          rows={1}
          placeholder={`Message ${thread.player_name}...`}
          className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="bg-primary active:bg-primary/80 flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
          onClick={handleSend}
        >
          <Send size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export function MessagesTab(): ReactElement {
  const [threads, setThreads] = useState<PlayerThread[]>(MOCK_PLAYER_THREADS);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const selectedThread = threads.find((t) => t.player_id === selectedPlayerId) ?? null;
  const otherUnreadCount = threads
    .filter((t) => t.player_id !== selectedPlayerId)
    .reduce((sum, t) => sum + t.unread_count, 0);

  function handleSelect(playerId: string) {
    setSelectedPlayerId(playerId);
    setThreads((prev) =>
      prev.map((t) => (t.player_id === playerId ? { ...t, unread_count: 0 } : t))
    );
  }

  function handleBack() {
    setSelectedPlayerId(null);
  }

  function handleSend(playerId: string, text: string) {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setThreads((prev) =>
      prev.map((t) =>
        t.player_id === playerId
          ? {
              ...t,
              messages: [...t.messages, { id: `msg-${Date.now()}`, from: 'dm', text, timestamp }],
            }
          : t
      )
    );
  }

  return (
    <div className="flex h-[60vh] flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedThread ? (
          <ChatView
            key={selectedThread.player_id}
            thread={selectedThread}
            otherUnreadCount={otherUnreadCount}
            onBack={handleBack}
            onSend={handleSend}
          />
        ) : (
          <ThreadListView key="list" threads={threads} onSelect={handleSelect} />
        )}
      </AnimatePresence>
    </div>
  );
}
