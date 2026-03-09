import { type ReactElement, useState } from 'react';

export function NotesTab(): ReactElement {
  const [notes, setNotes] = useState('');

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">DM Notes (private)</p>
      <textarea
        value={notes}
        rows={14}
        placeholder="Write your session notes here... Only you can see this."
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-primary/40 focus:outline-none"
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
}
