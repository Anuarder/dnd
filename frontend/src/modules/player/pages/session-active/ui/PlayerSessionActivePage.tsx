import { MessageSquare, Minus, Plus, Shield, Swords, X } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { type Tab, UiPageHeader, UiTabs } from '~shared/ui';
import { MOCK_CAMPAIGN_DETAIL, MOCK_COMBATANTS } from '~entities/session';

import { InitiativeView } from './initiative-view/InitiativeView';
import { PlayerMessagesView } from './messages-view/PlayerMessagesView';

type TabId = 'character' | 'combat' | 'messages';

const TABS: Tab[] = [
  { id: 'character', label: 'Character', icon: <Shield size={16} /> },
  { id: 'combat', label: 'Combat', icon: <Swords size={16} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
];

const CHARACTER = {
  name: 'Thorin Ironforge',
  characterClass: 'Fighter',
  subclass: 'Battle Master',
  level: 5,
  race: 'Dwarf',
  maxHp: 52,
  ac: 18,
  speed: 25,
  initiative: 2,
  profBonus: 3,
  abilities: [
    { short: 'STR', score: 18, modifier: 4 },
    { short: 'DEX', score: 14, modifier: 2 },
    { short: 'CON', score: 16, modifier: 3 },
    { short: 'INT', score: 10, modifier: 0 },
    { short: 'WIS', score: 12, modifier: 1 },
    { short: 'CHA', score: 8, modifier: -1 },
  ],
  features: [
    { id: 'second-wind', name: 'Second Wind', maxUses: 1 },
    { id: 'action-surge', name: 'Action Surge', maxUses: 1 },
  ],
  superiorityDice: { total: 5, size: 8 },
};

const ALL_CONDITIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Exhaustion',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
];

// ─── Death Saves ────────────────────────────────────────────────────────────

function DeathSavesSection(): ReactElement {
  const [successes, setSuccesses] = useState(0);
  const [failures, setFailures] = useState(0);

  function handleToggleSuccess(index: number) {
    setSuccesses((prev) => (index < prev ? index : index + 1));
  }

  function handleToggleFailure(index: number) {
    setFailures((prev) => (index < prev ? index : index + 1));
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

      {isStabilized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-green-500/20 py-2 text-center"
        >
          <p className="text-sm font-bold text-green-300">Stabilized!</p>
        </motion.div>
      )}
      {hasFallen && !isStabilized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-red-500/20 py-2 text-center"
        >
          <p className="text-sm font-bold text-red-400">Character has fallen...</p>
        </motion.div>
      )}

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

// ─── HP Section ─────────────────────────────────────────────────────────────

function HpSection({
  hp,
  maxHp,
  tempHp,
  onHpChange,
}: {
  hp: number;
  maxHp: number;
  tempHp: number;
  onHpChange: (v: number) => void;
}): ReactElement {
  const [customAmount, setCustomAmount] = useState('');
  const hpPercent = Math.min(100, Math.max(0, (hp / maxHp) * 100));
  const hpColor =
    hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  function applyCustom(sign: 1 | -1) {
    const amount = Number(customAmount);
    if (!amount || isNaN(amount)) {
      return;
    }
    onHpChange(Math.max(0, Math.min(maxHp, hp + sign * amount)));
    setCustomAmount('');
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Hit Points</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
          onClick={() => onHpChange(Math.max(0, hp - 1))}
        >
          <Minus size={20} />
        </button>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-white">{hp}</span>
            <span className="text-base text-gray-500">/ {maxHp}</span>
            {tempHp > 0 && (
              <span className="ml-1 text-sm font-semibold text-blue-400">(+{tempHp} temp)</span>
            )}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${hpColor}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:bg-white/10"
          onClick={() => onHpChange(Math.min(maxHp, hp + 1))}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={customAmount}
          min={1}
          placeholder="Amount"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          onChange={(e) => setCustomAmount(e.target.value)}
        />
        <button
          type="button"
          className="min-h-10 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-sm text-red-400 active:bg-red-500/20"
          onClick={() => applyCustom(-1)}
        >
          Damage
        </button>
        <button
          type="button"
          className="min-h-10 rounded-xl border border-green-500/30 bg-green-500/10 px-3 text-sm text-green-400 active:bg-green-500/20"
          onClick={() => applyCustom(1)}
        >
          Heal
        </button>
      </div>
    </div>
  );
}

// ─── Ability Scores ──────────────────────────────────────────────────────────

function AbilityScoresSection(): ReactElement {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
        Ability Scores
      </p>
      <div className="grid grid-cols-3 gap-2">
        {CHARACTER.abilities.map((ability) => (
          <div
            key={ability.short}
            className="flex flex-col items-center rounded-lg border border-white/5 bg-white/5 py-3"
          >
            <span className="text-xs font-semibold text-gray-400">{ability.short}</span>
            <span className="mt-1 text-xl font-bold text-white">{ability.score}</span>
            <span className="text-sm text-gray-300">
              {ability.modifier >= 0 ? `+${ability.modifier}` : ability.modifier}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Conditions ──────────────────────────────────────────────────────────────

function ConditionsSection({
  conditions,
  onChange,
}: {
  conditions: string[];
  onChange: (conditions: string[]) => void;
}): ReactElement {
  const [showPicker, setShowPicker] = useState(false);
  const available = ALL_CONDITIONS.filter((c) => !conditions.includes(c));

  function addCondition(c: string) {
    onChange([...conditions, c]);
    setShowPicker(false);
  }

  function removeCondition(c: string) {
    onChange(conditions.filter((cond) => cond !== c));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Conditions</p>
        {available.length > 0 && (
          <button
            type="button"
            className="text-xs text-primary active:opacity-70"
            onClick={() => setShowPicker((v) => !v)}
          >
            {showPicker ? 'Cancel' : '+ Add'}
          </button>
        )}
      </div>

      {conditions.length === 0 && !showPicker && (
        <p className="text-sm text-gray-600">None</p>
      )}

      {conditions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {conditions.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1.5 rounded-full bg-red-500/20 py-1 pl-3 pr-1.5 text-xs text-red-300"
            >
              {c}
              <button
                type="button"
                className="flex size-4 items-center justify-center rounded-full bg-red-500/30 active:bg-red-500/50"
                onClick={() => removeCondition(c)}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {showPicker && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-wrap gap-2"
        >
          {available.map((c) => (
            <button
              key={c}
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 active:bg-white/10"
              onClick={() => addCondition(c)}
            >
              {c}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Class Features ──────────────────────────────────────────────────────────

function FeaturesSection(): ReactElement {
  const [featureUses, setFeatureUses] = useState<Record<string, number>>(
    () => Object.fromEntries(CHARACTER.features.map((f) => [f.id, f.maxUses])),
  );
  const [diceUsed, setDiceUsed] = useState(0);
  const { total: totalDice, size: diceSize } = CHARACTER.superiorityDice;
  const availableDice = totalDice - diceUsed;

  function handleToggleFeatureSlot(id: string, slotIndex: number, remaining: number, maxUses: number) {
    const isAvailable = slotIndex < remaining;
    setFeatureUses((prev) => ({
      ...prev,
      [id]: isAvailable ? remaining - 1 : Math.min(maxUses, remaining + 1),
    }));
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
      <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Class Features</p>

      {CHARACTER.features.map((feature) => {
        const remaining = featureUses[feature.id] ?? 0;
        return (
          <div key={feature.id} className="flex items-center gap-3">
            <span className="flex-1 text-sm text-white">{feature.name}</span>
            <div className="flex gap-2">
              {Array.from({ length: feature.maxUses }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`size-7 rounded-full border transition-colors ${
                    i < remaining
                      ? 'border-primary bg-primary/40 active:bg-primary/60'
                      : 'border-white/20 bg-white/5 active:bg-white/10'
                  }`}
                  onClick={() => handleToggleFeatureSlot(feature.id, i, remaining, feature.maxUses)}
                />
              ))}
            </div>
            <span className="min-w-10 text-right text-xs text-gray-500">
              {remaining}/{feature.maxUses}
            </span>
          </div>
        );
      })}

      {/* Superiority Dice */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Superiority Dice (d{diceSize})</span>
          <span className="text-xs text-gray-500">
            {availableDice}/{totalDice}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalDice }, (_, i) => {
            const isAvailable = i < availableDice;
            return (
              <button
                key={i}
                type="button"
                className={`flex size-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${
                  isAvailable
                    ? 'border-primary bg-primary/20 text-primary active:bg-primary/40'
                    : 'border-white/20 bg-white/5 text-gray-600 active:bg-white/10'
                }`}
                onClick={() =>
                  setDiceUsed((prev) => (isAvailable ? prev + 1 : Math.max(0, prev - 1)))
                }
              >
                d{diceSize}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Character Tab ───────────────────────────────────────────────────────────

function CharacterTab(): ReactElement {
  const [hp, setHp] = useState(CHARACTER.maxHp);
  const [conditions, setConditions] = useState<string[]>([]);
  const tempHp = 0;

  const combatStats = [
    { label: 'AC', value: String(CHARACTER.ac) },
    { label: 'Speed', value: `${CHARACTER.speed}ft` },
    {
      label: 'Init',
      value: CHARACTER.initiative >= 0 ? `+${CHARACTER.initiative}` : `${CHARACTER.initiative}`,
    },
    { label: 'Prof', value: `+${CHARACTER.profBonus}` },
  ];

  return (
    <div className="space-y-5">
      {/* Character identity */}
      <div className="flex items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
          <Shield size={28} className="text-gray-300" />
        </div>
        <div>
          <p className="text-base font-bold text-white">{CHARACTER.name}</p>
          <p className="text-sm text-gray-400">
            {CHARACTER.characterClass} ({CHARACTER.subclass}) · Lv.{CHARACTER.level} ·{' '}
            {CHARACTER.race}
          </p>
        </div>
      </div>

      {/* HP */}
      <HpSection hp={hp} maxHp={CHARACTER.maxHp} tempHp={tempHp} onHpChange={setHp} />

      {/* Death saves when HP = 0 */}
      {hp === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <DeathSavesSection />
        </motion.div>
      )}

      {/* Combat stats */}
      <div className="grid grid-cols-4 gap-2">
        {combatStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 py-3"
          >
            <span className="text-lg font-bold text-white">{stat.value}</span>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Ability scores */}
      <AbilityScoresSection />

      {/* Conditions */}
      <ConditionsSection conditions={conditions} onChange={setConditions} />

      {/* Class features */}
      <FeaturesSection />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PlayerSessionActivePage(): ReactElement {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGN_DETAIL;
  const [activeTab, setActiveTab] = useState<TabId>('character');
  const [unreadMessages] = useState(1);

  const tabsWithBadge: Tab[] = TABS.map((t) =>
    t.id === 'messages' && unreadMessages > 0 ? { ...t, count: unreadMessages } : t,
  );

  function handleLeave() {
    navigate(`/player/campaign/${id}`);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 py-6 text-white">
      {/* Session header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between">
          <UiPageHeader title={campaign.name} onBackClick={handleLeave} />
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
              <span className="size-2 animate-pulse rounded-full bg-green-400" />
              Active
            </span>
            {(() => {
              const currentTurn = MOCK_COMBATANTS.find((c) => c.is_current_turn);
              if (!currentTurn) {
                return null;
              }
              const isMyTurn = currentTurn.name === CHARACTER.name;
              return (
                <span className={`text-xs font-medium ${isMyTurn ? 'text-primary' : 'text-gray-400'}`}>
                  {isMyTurn ? 'Your turn!' : `${currentTurn.name}'s turn`}
                </span>
              );
            })()}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
        className="mt-5"
      >
        <UiTabs
          tabs={tabsWithBadge}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />
      </motion.div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mt-5 flex-1 pb-8"
      >
        {activeTab === 'character' && <CharacterTab />}
        {activeTab === 'combat' && <InitiativeView />}
        {activeTab === 'messages' && <PlayerMessagesView />}
      </motion.div>
    </div>
  );
}
