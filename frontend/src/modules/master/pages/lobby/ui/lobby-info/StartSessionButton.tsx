import React from 'react';

type Props = {
  onStart: () => void;
};

export const StartSessionButton: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="mt-4">
      <button
        onClick={onStart}
        className="w-full rounded-xl bg-primary px-4 py-3 text-white font-semibold shadow-md hover:bg-primary/90"
      >
        Start session
      </button>
    </div>
  );
};

export default StartSessionButton;
