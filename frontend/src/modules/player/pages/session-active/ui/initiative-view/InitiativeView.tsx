import { motion } from 'motion/react';
import { type ReactElement } from 'react';

import { MOCK_COMBATANTS } from '~entities/session';

const MY_CHARACTER_NAME = 'Thorin Ironforge'; // Mock: current player's character

export function InitiativeView(): ReactElement {
  const combatants = MOCK_COMBATANTS;
  const round = 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Initiative Order</p>
        <span className="text-xs text-gray-500">Round {round}</span>
      </div>

      {combatants.map((combatant, index) => {
        const isMyTurn = combatant.is_current_turn;
        const isMe = combatant.name === MY_CHARACTER_NAME;

        return (
          <motion.div
            key={combatant.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              isMyTurn
                ? 'border-primary/60 bg-primary/10'
                : isMe
                  ? 'border-blue-500/30 bg-blue-500/5'
                  : 'border-white/5 bg-white/5'
            }`}
          >
            {isMyTurn && (
              <span className="size-2 shrink-0 rounded-full bg-primary animate-pulse" />
            )}
            {!isMyTurn && (
              <span className={`size-2 shrink-0 rounded-full ${isMe ? 'bg-blue-400' : 'bg-gray-700'}`} />
            )}

            <span className="flex w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 py-1 text-sm font-bold text-white">
              {combatant.initiative}
            </span>

            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium text-white">
                {combatant.name}
                {isMe && (
                  <span className="ml-2 text-xs font-normal text-blue-400">(you)</span>
                )}
              </span>
              {combatant.type === 'npc' && combatant.hp !== undefined && (
                <span className="text-xs text-gray-500">
                  HP {combatant.hp}/{combatant.max_hp}
                </span>
              )}
            </span>

            {isMyTurn && (
              <span className="text-xs font-semibold text-primary">Your turn!</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
