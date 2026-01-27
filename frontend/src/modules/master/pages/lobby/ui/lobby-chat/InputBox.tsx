import React, { useState } from 'react';

type Props = {
  onSend: (text: string) => void;
};

export const InputBox: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <div className="mt-2 flex w-full items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Write a message..."
        className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400"
      />
      <button
        type="button"
        onClick={handleSend}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white"
      >
        Send
      </button>
    </div>
  );
};

export default InputBox;
