import { useCallback, useState } from 'react';
import { SettingsContext } from './settingsContextValue.js';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from '../utils/settingsStorage.js';

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => getSettings());

  const updateSetting = useCallback((key, value) => {
    setSettings((previous) => {
      const next = { ...previous, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = { ...DEFAULT_SETTINGS };
    saveSettings(defaults);
    setSettings(defaults);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
