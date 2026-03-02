import { Backpack, BookOpen, Sword, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router';

import { type Tab, UiPageHeader, UiTabs } from '~shared/ui';

import { AbilityScores } from './ability-scores';
import { CharacterHeader } from './character-header';
import { CombatPanel } from './combat-panel';
import { CombatStats } from './combat-stats';
import { EquipmentPanel } from './equipment-panel';
import { SkillsPanel } from './skills-panel';
import { SpellsPanel } from './spells-panel';

const characterData = {
  name: 'Аратор',
  characterClass: 'Паладин',
  race: 'Человек',
  level: 5,
  background: 'Народный герой',
  alignment: 'Законно-добрый',
  hp: {
    current: 42,
    max: 48,
    temp: 0,
  },
  ac: 18,
  speed: 30,
  initiative: 2,
  proficiencyBonus: 3,
  abilities: [
    { name: 'Сила', short: 'СИЛ', score: 16, modifier: 3 },
    { name: 'Ловкость', short: 'ЛОВ', score: 12, modifier: 1 },
    { name: 'Телосложение', short: 'ТЕЛ', score: 14, modifier: 2 },
    { name: 'Интеллект', short: 'ИНТ', score: 10, modifier: 0 },
    { name: 'Мудрость', short: 'МДР', score: 13, modifier: 1 },
    { name: 'Харизма', short: 'ХАР', score: 15, modifier: 2 },
  ],
  skills: [
    { name: 'Атлетика', modifier: 6, proficient: true },
    { name: 'Проницательность', modifier: 4, proficient: true },
    { name: 'Убеждение', modifier: 5, proficient: true },
    { name: 'Религия', modifier: 3, proficient: true },
    { name: 'Запугивание', modifier: 2, proficient: false },
    { name: 'Медицина', modifier: 1, proficient: false },
  ],
  savingThrows: [
    { name: 'Сила', modifier: 3, proficient: false },
    { name: 'Ловкость', modifier: 1, proficient: false },
    { name: 'Телосложение', modifier: 2, proficient: false },
    { name: 'Интеллект', modifier: 0, proficient: false },
    { name: 'Мудрость', modifier: 4, proficient: true },
    { name: 'Харизма', modifier: 5, proficient: true },
  ],
  equipment: [
    'Длинный меч +1',
    'Щит',
    'Латный доспех',
    'Святой символ',
    'Набор путешественника',
    'Лечебное зелье (3 шт.)',
  ],
  spells: {
    slots: {
      1: { max: 4, used: 2 },
      2: { max: 2, used: 1 },
    },
    list: [
      { level: 0, name: 'Свет', prepared: true },
      { level: 0, name: 'Священное пламя', prepared: true },
      { level: 1, name: 'Благословение', prepared: true },
      { level: 1, name: 'Лечение ран', prepared: true },
      { level: 1, name: 'Божественное благоволение', prepared: true },
      { level: 2, name: 'Малое восстановление', prepared: true },
      { level: 2, name: 'Зона истины', prepared: false },
    ],
  },
  features: [
    { name: 'Божественное чувство', uses: { current: 3, max: 3 } },
    { name: 'Наложение рук', uses: { current: 25, max: 25 } },
    {
      name: 'Божественная кара',
      description: 'Дополнительный урон излучением',
    },
  ],
};

const TABS: Tab[] = [
  {
    id: 'skills',
    label: 'Навыки',
    icon: <Users size={16} />,
  },
  {
    id: 'combat',
    label: 'Бой',
    icon: <Sword size={16} />,
  },
  {
    id: 'spells',
    label: 'Заклинания',
    icon: <BookOpen size={16} />,
  },
  {
    id: 'equipment',
    label: 'Снаряжение',
    icon: <Backpack size={16} />,
  },
];

export function CharacterDetailsPage(): ReactElement {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(TABS[0]?.id ?? 'skills');

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
          description="Подробности вашего персонажа"
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
        >
          <CombatStats
            hp={characterData.hp}
            ac={characterData.ac}
            initiative={characterData.initiative}
          />
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
            onChange={setActiveTab}
            className="no-scrollbar flex-nowrap overflow-x-auto"
          />
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {activeTab === 'skills' && (
            <SkillsPanel
              skills={characterData.skills}
              savingThrows={characterData.savingThrows}
            />
          )}

          {activeTab === 'combat' && (
            <CombatPanel
              features={characterData.features}
              speed={characterData.speed}
              proficiencyBonus={characterData.proficiencyBonus}
            />
          )}

          {activeTab === 'spells' && <SpellsPanel spells={characterData.spells} />}

          {activeTab === 'equipment' && <EquipmentPanel equipment={characterData.equipment} />}
        </motion.div>
      </div>
    </div>
  );
}
