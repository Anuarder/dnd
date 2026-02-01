import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type {
  Attributes,
  CharacterBasicInfo,
  CharacterCreationData,
  CharacterCreationStep,
} from './types';

interface CharacterCreationStore extends CharacterCreationData {
  currentStep: CharacterCreationStep;

  // Actions
  setBasicInfo: (info: CharacterBasicInfo) => void;
  setClass: (classId: string) => void;
  setRace: (raceId: string, subraceId?: string) => void;
  setBackground: (backgroundId: string) => void;
  setAttributes: (attributes: Attributes) => void;
  setSkills: (skills: string[]) => void;
  setEquipment: (presetId: string) => void;
  setSpells: (cantrips: string[], level1Spells: string[]) => void;
  setCurrentStep: (step: CharacterCreationStep) => void;
  resetCharacter: () => void;
  getCharacterData: () => CharacterCreationData;
}

const initialState: CharacterCreationData = {
  basicInfo: null,
  classId: null,
  raceId: null,
  subraceId: null,
  backgroundId: null,
  attributes: null,
  selectedSkills: [],
  equipmentPresetId: null,
  selectedCantrips: [],
  selectedLevel1Spells: [],
};

export const useCharacterCreationStore = create<CharacterCreationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      currentStep: 'basic-info',

      setBasicInfo: (info: CharacterBasicInfo) => {
        set({ basicInfo: info });
      },

      setClass: (classId: string) => {
        set({ classId });
      },

      setRace: (raceId: string, subraceId?: string) => {
        set({ raceId, subraceId: subraceId || null });
      },

      setBackground: (backgroundId: string) => {
        set({ backgroundId });
      },

      setAttributes: (attributes: Attributes) => {
        set({ attributes });
      },

      setSkills: (skills: string[]) => {
        set({ selectedSkills: skills });
      },

      setEquipment: (presetId: string) => {
        set({ equipmentPresetId: presetId });
      },

      setSpells: (cantrips: string[], level1Spells: string[]) => {
        set({ selectedCantrips: cantrips, selectedLevel1Spells: level1Spells });
      },

      setCurrentStep: (step: CharacterCreationStep) => {
        set({ currentStep: step });
      },

      resetCharacter: () => {
        set({ ...initialState, currentStep: 'basic-info' });
      },

      getCharacterData: () => {
        const state = get();
        return {
          basicInfo: state.basicInfo,
          classId: state.classId,
          raceId: state.raceId,
          subraceId: state.subraceId,
          backgroundId: state.backgroundId,
          attributes: state.attributes,
          selectedSkills: state.selectedSkills,
          equipmentPresetId: state.equipmentPresetId,
          selectedCantrips: state.selectedCantrips,
          selectedLevel1Spells: state.selectedLevel1Spells,
        };
      },
    }),
    { name: 'character-creation' }
  )
);
