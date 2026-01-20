import React from 'react';

type Props = {
  id: string;
  text: string;
  from: string;
  time?: string;
  isMe?: boolean;
};

export const MessageItem: React.FC<Props> = ({ text, from, time, isMe = false }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] break-words rounded-lg px-3 py-2 text-sm ${
          isMe ? 'bg-primary text-white' : 'bg-white/5 text-slate-200'
        }`}
      >
        <div className="font-medium text-xs opacity-80">{isMe ? 'You' : from}</div>
        <div className="mt-1">{text}</div>
        {time && <div className="mt-1 text-right text-[10px] opacity-60">{time}</div>}
      </div>
    </div>
  );
};

export default MessageItem;
