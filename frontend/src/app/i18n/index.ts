import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { characterCreate as characterCreateEn } from './locales/en/character-create';
import { characterCreateAttributes } from './locales/en/character-create/attributes-step';
import { characterCreateBackground } from './locales/en/character-create/background-step';
import { characterCreateBasicInfo } from './locales/en/character-create/basic-info-form';
import { characterCreateClassSelection } from './locales/en/character-create/class-selection-form';
import { characterCreateEquipment } from './locales/en/character-create/equipment-step';
import { characterCreateRaceSelection } from './locales/en/character-create/race-selection-form';
import { characterCreateReview } from './locales/en/character-create/review-step';
import { characterCreateSkills } from './locales/en/character-create/skills-step';
import { characterCreateSpells } from './locales/en/character-create/spells-step';
import { characterCreateSubraceSelection } from './locales/en/character-create/subrace-selection-form';
import { characterCreate as characterCreateRu } from './locales/ru/character-create';
import { characterCreateAttributes as characterCreateAttributesRu } from './locales/ru/character-create/attributes-step';
import { characterCreateBackground as characterCreateBackgroundRu } from './locales/ru/character-create/background-step';
import { characterCreateBasicInfo as characterCreateBasicInfoRu } from './locales/ru/character-create/basic-info-form';
import { characterCreateClassSelection as characterCreateClassSelectionRu } from './locales/ru/character-create/class-selection-form';
import { characterCreateEquipment as characterCreateEquipmentRu } from './locales/ru/character-create/equipment-step';
import { characterCreateRaceSelection as characterCreateRaceSelectionRu } from './locales/ru/character-create/race-selection-form';
import { characterCreateReview as characterCreateReviewRu } from './locales/ru/character-create/review-step';
import { characterCreateSkills as characterCreateSkillsRu } from './locales/ru/character-create/skills-step';
import { characterCreateSpells as characterCreateSpellsRu } from './locales/ru/character-create/spells-step';
import { characterCreateSubraceSelection as characterCreateSubraceSelectionRu } from './locales/ru/character-create/subrace-selection-form';

const resources = {
  en: {
    characterCreate: characterCreateEn,
    characterCreateBasicInfo: characterCreateBasicInfo,
    characterCreateClassSelection: characterCreateClassSelection,
    characterCreateRaceSelection: characterCreateRaceSelection,
    characterCreateSubraceSelection: characterCreateSubraceSelection,
    characterCreateBackground: characterCreateBackground,
    characterCreateAttributes: characterCreateAttributes,
    characterCreateSkills: characterCreateSkills,
    characterCreateEquipment: characterCreateEquipment,
    characterCreateSpells: characterCreateSpells,
    characterCreateReview: characterCreateReview,
  },
  ru: {
    characterCreate: characterCreateRu,
    characterCreateBasicInfo: characterCreateBasicInfoRu,
    characterCreateClassSelection: characterCreateClassSelectionRu,
    characterCreateRaceSelection: characterCreateRaceSelectionRu,
    characterCreateSubraceSelection: characterCreateSubraceSelectionRu,
    characterCreateBackground: characterCreateBackgroundRu,
    characterCreateAttributes: characterCreateAttributesRu,
    characterCreateSkills: characterCreateSkillsRu,
    characterCreateEquipment: characterCreateEquipmentRu,
    characterCreateSpells: characterCreateSpellsRu,
    characterCreateReview: characterCreateReviewRu,
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'en',
  ns: [
    'character',
    'characterCreate',
    'characterCreateBasicInfo',
    'characterCreateClassSelection',
    'characterCreateRaceSelection',
    'characterCreateSubraceSelection',
    'characterCreateBackground',
    'characterCreateAttributes',
    'characterCreateSkills',
    'characterCreateEquipment',
    'characterCreateSpells',
    'characterCreateReview',
  ],
  defaultNS: 'character',
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
