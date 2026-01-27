import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
  disabled?: boolean;
  children?: React.ReactNode;
};

export const CreateButton: React.FC<Props> = ({ disabled = false, children }) => {
  return (
    <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none">
      <div className="w-full max-w-[400px] px-4 pointer-events-auto">
        <button
          type="submit"
          disabled={disabled}
          aria-disabled={disabled}
          className={
            `relative flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-medium shadow-lg duration-300 active:scale-95 ` +
            (disabled ? 'bg-primary/40 text-white cursor-not-allowed opacity-60' : 'bg-primary text-white active:bg-primary/90')
          }
        >
          <span>{children ?? 'Create'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CreateButton;
