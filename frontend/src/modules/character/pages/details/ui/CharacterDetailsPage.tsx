import { Backpack, BookOpen, Clock, Minus, Plus, Sword, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router';

import { type Tab, UiPageHeader, UiTabs } from '~shared/ui';

import { AbilityScores } from './ability-scores';
import { CharacterHeader } from './character-header';
import { CombatPanel } from './combat-panel';
import { DeathSaves } from './death-saves';
import { EquipmentPanel } from './equipment-panel';
import { HistoryPanel } from './history-panel';
import { SkillsPanel } from './skills-panel';
import { SpellsPanel } from './spells-panel';

const CHARACTER_MAX_HP = 48;

const characterData = {
  name: 'Arator',
  characterClass: 'Paladin',
  race: 'Human',
  level: 5,
  background: 'Folk Hero',
  alignment: 'Lawful Good',
  ac: 18,
  speed: 30,
  initiative: 2,
  proficiencyBonus: 3,
  abilities: [
    { name: 'Strength', short: 'STR', score: 16, modifier: 3 },
    { name: 'Dexterity', short: 'DEX', score: 12, modifier: 1 },
    { name: 'Constitution', short: 'CON', score: 14, modifier: 2 },
    { name: 'Intelligence', short: 'INT', score: 10, modifier: 0 },
    { name: 'Wisdom', short: 'WIS', score: 13, modifier: 1 },
    { name: 'Charisma', short: 'CHA', score: 15, modifier: 2 },
  ],
  skills: [
    { name: 'Athletics', modifier: 6, proficient: true },
    { name: 'Insight', modifier: 4, proficient: true },
    { name: 'Persuasion', modifier: 5, proficient: true },
    { name: 'Religion', modifier: 3, proficient: true },
    { name: 'Intimidation', modifier: 2, proficient: false },
    { name: 'Medicine', modifier: 1, proficient: false },
  ],
  savingThrows: [
    { name: 'Strength', modifier: 3, proficient: false },
    { name: 'Dexterity', modifier: 1, proficient: false },
    { name: 'Constitution', modifier: 2, proficient: false },
    { name: 'Intelligence', modifier: 0, proficient: false },
    { name: 'Wisdom', modifier: 4, proficient: true },
    { name: 'Charisma', modifier: 5, proficient: true },
  ],
  spells: {
    slots: {
      1: { max: 4, used: 2 },
      2: { max: 2, used: 1 },
    },
    list: [
      { level: 0, name: 'Light', prepared: true },
      { level: 0, name: 'Sacred Flame', prepared: true },
      { level: 1, name: 'Bless', prepared: true },
      { level: 1, name: 'Cure Wounds', prepared: true },
      { level: 1, name: 'Divine Favor', prepared: true },
      { level: 2, name: 'Lesser Restoration', prepared: true },
      { level: 2, name: 'Zone of Truth', prepared: false },
    ],
  },
  features: [
    { name: 'Divine Sense', uses: { current: 3, max: 3 } },
    { name: 'Lay on Hands', uses: { current: 25, max: 25 } },
    {
      name: 'Divine Smite',
      description: 'Deal extra radiant damage',
    },
  ],
};

const TABS: Tab[] = [
  {
    id: 'skills',
    label: 'Skills',
    icon: <Users size={16} />,
  },
  {
    id: 'combat',
    label: 'Combat',
    icon: <Sword size={16} />,
  },
  {
    id: 'spells',
    label: 'Spells',
    icon: <BookOpen size={16} />,
  },
  {
    id: 'equipment',
    label: 'Equipment',
    icon: <Backpack size={16} />,
  },
  {
    id: 'history',
    label: 'History',
    icon: <Clock size={16} />,
  },
];

function HpQuickActions({
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
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  function applyCustom(sign: 1 | -1) {
    const amount = Number(customAmount);
    if (!amount || isNaN(amount)) {
      return;
    }
    onHpChange(Math.max(0, Math.min(maxHp, hp + sign * amount)));
    setCustomAmount('');
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
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
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
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

export function CharacterDetailsPage(): ReactElement {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(TABS[0]?.id ?? 'skills');
  const [hp, setHp] = useState(42);
  const tempHp = 0;

  function onBackClick() {
    navigate('/player');
  }

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-4 py-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <UiPageHeader
          title="Character"
          description="Character details"
          onBackClick={onBackClick}
        />
      </motion.div>

      <div className="mt-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
        >
          <CharacterHeader
            name={characterData.name}
            race={characterData.race}
            characterClass={characterData.characterClass}
            level={characterData.level}
            background={characterData.background}
            alignment={characterData.alignment}
          />
        </motion.div>

        {/* F18: HP Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
        >
          <HpQuickActions hp={hp} maxHp={CHARACTER_MAX_HP} tempHp={tempHp} onHpChange={setHp} />
        </motion.div>

        {/* F20: Death Saves (visible when HP = 0) */}
        {hp === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <DeathSaves />
          </motion.div>
        )}

        {/* Compact stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
          className="grid grid-cols-4 gap-2"
        >
          {[
            { label: 'AC', value: String(characterData.ac) },
            { label: 'Speed', value: `${characterData.speed}ft` },
            {
              label: 'Init',
              value:
                characterData.initiative >= 0
                  ? `+${characterData.initiative}`
                  : `${characterData.initiative}`,
            },
            { label: 'Prof', value: `+${characterData.proficiencyBonus}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 py-3"
            >
              <span className="text-lg font-bold text-white">{stat.value}</span>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
        >
          <AbilityScores abilities={characterData.abilities} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
        >
          <UiTabs
            tabs={TABS}
            activeTab={activeTab}
            className="no-scrollbar flex-nowrap overflow-x-auto"
            onChange={setActiveTab}
          />
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {activeTab === 'skills' && (
            <SkillsPanel skills={characterData.skills} savingThrows={characterData.savingThrows} />
          )}

          {activeTab === 'combat' && (
            <CombatPanel
              features={characterData.features}
              speed={characterData.speed}
              proficiencyBonus={characterData.proficiencyBonus}
            />
          )}

          {activeTab === 'spells' && <SpellsPanel spells={characterData.spells} />}

          {/* F17: Enhanced Equipment Panel */}
          {activeTab === 'equipment' && <EquipmentPanel />}

          {/* F16: Change Log / History */}
          {activeTab === 'history' && <HistoryPanel />}
        </motion.div>
      </div>
    </div>
  );
}
