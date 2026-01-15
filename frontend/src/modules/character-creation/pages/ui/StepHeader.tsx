import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

type StepHeaderProps = {
  steps: string[];
  current: number; // zero-based index
  totalSteps?: number; // optional override for display
  onBack?: () => void;
};

export function StepHeader({ steps, current, totalSteps, onBack }: StepHeaderProps) {
  const navigate = useNavigate();
  const total = totalSteps ?? steps.length;
  const stepNumber = Math.min(Math.max(current + 1, 1), total);
  const percent = Math.round((stepNumber / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between h-10 mb-1">
        <ArrowLeft
          size={18}
          onClick={() => {
            if (current > 0 && typeof onBack === 'function') {
              onBack();
              return;
            }

            navigate('/');
          }}
          className="w-10"
        />


        <div className="flex-1 text-center">
          <div className="text-md font-medium text-white truncate">{steps[current] ?? 'Step'}</div>
        </div>

        <div className="w-10" />
      </div>

      <div className="text-sm text-slate-400 text-left">Step {stepNumber} of {total}</div>

      <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default StepHeader;
