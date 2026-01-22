import React from 'react';
import SettingsForm from './SettingsForm';

export const LobbySettings: React.FC = () => {
  function handleSave(data: any) {
    console.log('Save lobby settings', data);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <SettingsForm onSave={handleSave} />
      </div>
    </div>
  );
};

export default LobbySettings;
