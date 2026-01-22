import React, { useEffect, useRef, useState } from 'react';
import PlayerSelector from './PlayerSelector';
import MessageItem from './MessageItem';
import InputBox from './InputBox';

type Msg = { id: string; from: string; text: string; time?: string; isMe?: boolean };

const mockedPlayers = [
  { id: 'p1', name: 'Lina', avatar: null },
  { id: 'p2', name: 'Gor', avatar: null },
  { id: 'p3', name: 'Miri', avatar: null },
];

export const LobbyChat: React.FC = () => {
  const [players] = useState(mockedPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(players[0]?.id ?? null);

  const [messages, setMessages] = useState<Msg[]>(() => [
    { id: 'm1', from: 'Lina', text: 'Hi everyone!', time: '19:05', isMe: false },
    { id: 'm2', from: 'You', text: "Hello Lina, welcome!", time: '19:06', isMe: true },
    { id: 'm3', from: 'Gor', text: 'Ready to roll?', time: '19:07', isMe: false },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send(text: string) {
    const msg: Msg = { id: String(Date.now()), from: 'You', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true };
    setMessages((m) => [...m, msg]);
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <PlayerSelector players={players} selectedId={selectedPlayer} onSelect={(id) => setSelectedPlayer(id)} />

      <div className="flex-1 min-h-0 rounded-lg bg-white/2 p-4 flex flex-col">
        <div className="flex-1 min-h-0 overflow-auto flex flex-col gap-3">
          {messages.map((m) => (
            <MessageItem key={m.id} id={m.id} from={m.from} text={m.text} time={m.time} isMe={!!m.isMe} />
          ))}
          <div ref={endRef} />
        </div>

        <div className="mt-4 bg-transparent">
          <InputBox onSend={send} />
        </div>
      </div>
    </div>
  );
};

export default LobbyChat;
