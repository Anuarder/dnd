import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Shield, Sword } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { EQUIPMENT_PRESETS } from '~modules/character/model/mock-data';
import type { EquipmentPreset } from '~modules/character/model/types';

interface EquipmentStepProps {
  classId: string;
  onNext: (data: { equipmentPresetId: string }) => void;
}

const gradientStyle = {
  backgroundImage: 'linear-gradient(152deg,rgba(127, 19, 236, 1) 18%, rgba(216, 180, 254, 1) 49%)',
};

type EquipmentFormData = { equipmentPresetId: string };

export function EquipmentStep({ classId, onNext }: EquipmentStepProps) {
  const { t } = useTranslation('characterCreateEquipment');

  const equipmentSchema = useMemo(
    () => z.object({ equipmentPresetId: z.string().min(1, t('validation.required')) }),
    [t]
  );

  const { handleSubmit, setValue, watch } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      equipmentPresetId: '',
    },
  });

  const equipmentPresetId = watch('equipmentPresetId');
  const presets = EQUIPMENT_PRESETS[classId] || [];
  const selectedPreset = presets.find((p) => p.id === equipmentPresetId) || null;

  function handlePresetSelect(preset: EquipmentPreset): void {
    setValue('equipmentPresetId', preset.id);
  }

  function onSubmit(data: EquipmentFormData): void {
    toast.dismiss();
    onNext(data);
  }

  function onInvalid(): void {
    toast.dismiss();
    toast.error(t('toast.selectionTitle'), {
      description: t('toast.selectionDescription'),
    });
  }

  if (presets.length === 0) {
    return (
      <div className="px-4 text-center text-white">
        <p>{t('noPresets')}</p>
      </div>
    );
  }

  return (
    <form className="space-y-6 px-4 pb-6" onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2 className="font-display gap-2 text-3xl font-bold">
          <span>{t('titleLine1')}</span>{' '}
          <span className="bg-clip-text text-transparent" style={gradientStyle}>
            {t('titleLine2')}
          </span>
        </h2>

        <p className="mt-2 text-white/60">{t('description')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="space-y-4"
      >
        {presets.map((preset, index) => (
          <motion.button
            key={preset.id}
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
            className={`w-full rounded-xl border p-5 text-left transition-all duration-200 ease-out active:scale-[0.98] ${
              selectedPreset?.id === preset.id
                ? 'border-primary/50 bg-primary/20 shadow-primary/20 shadow-lg'
                : 'border-white/10 bg-white/5 backdrop-blur-sm'
            }`}
            onClick={() => handlePresetSelect(preset)}
          >
            <span className="flex items-start justify-between">
              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    {index === 0 ? (
                      <Shield size={24} className="text-primary" />
                    ) : (
                      <Sword size={24} className="text-primary" />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{preset.name}</span>
                      {selectedPreset?.id === preset.id && <Check size={20} className="text-primary" />}
                    </span>
                    <span className="mt-1 text-sm text-white/60">{preset.description}</span>
                  </span>
                </span>

                <span className="mt-4 block">
                  <span className="text-xs font-semibold text-white/50 uppercase">
                    {t('includesLabel')}
                  </span>
                  <span className="mt-2 flex flex-col gap-1">
                    {preset.items.map((item) => (
                      <span key={item} className="flex items-center gap-2 text-sm text-white/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </span>
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        type="submit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="group bg-primary shadow-primary/30 sticky bottom-6 w-full overflow-hidden rounded-full py-4 font-semibold text-white shadow-lg transition-all duration-200 ease-out active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {t('continue')}
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-active:translate-x-1"
          />
        </span>
      </motion.button>
    </form>
  );
}
