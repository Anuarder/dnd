import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';

export function DeathSaves(): ReactElement {
  const [successes, setSuccesses] = useState(0);
  const [failures, setFailures] = useState(0);

  function handleToggleSuccess(index: number) {
    setSuccesses((prev) => {
      if (index < prev) {
        return index; // Remove from this index
      }
      return index + 1; // Add up to this index
    });
  }

  function handleToggleFailure(index: number) {
    setFailures((prev) => {
      if (index < prev) {
        return index;
      }
      return index + 1;
    });
  }

  function handleReset() {
    setSuccesses(0);
    setFailures(0);
  }

  const isStabilized = successes >= 3;
  const hasFallen = failures >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-red-300">Death Saving Throws</p>
        <button
          type="button"
          className="text-xs text-gray-500 active:text-gray-300"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {isStabilized ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-green-500/20 py-2 text-center"
        >
          <p className="text-sm font-bold text-green-300">Stabilized!</p>
        </motion.div>
      ) : hasFallen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-red-500/20 py-2 text-center"
        >
          <p className="text-sm font-bold text-red-400">Character has fallen...</p>
        </motion.div>
      ) : null}

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-green-400">Successes</span>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                className={`size-9 rounded-full border-2 transition-colors ${
                  i < successes
                    ? 'border-green-400 bg-green-400/20'
                    : 'border-white/20 bg-transparent active:bg-white/10'
                }`}
                onClick={() => handleToggleSuccess(i)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-red-400">Failures</span>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                className={`size-9 rounded-full border-2 transition-colors ${
                  i < failures
                    ? 'border-red-400 bg-red-400/20'
                    : 'border-white/20 bg-transparent active:bg-white/10'
                }`}
                onClick={() => handleToggleFailure(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
