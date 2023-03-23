import React from "react";
import { SettingsData } from "../../hooks/useSettings";
import { Panel } from "./Panel";

interface SettingsProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
}

export function Settings({
  isOpen,
  close,
  settingsData,
  updateSettings,
}: SettingsProps) {
  return (
    <Panel title={"Innstilling"} isOpen={isOpen} close={close}>
      <div className="my-4">
        <div className="flex p-1">
          <select
            id="setting-distanceUnit"
            className="h-8 dark:bg-slate-800"
            value={settingsData.distanceUnit}
            onChange={(e) =>
              updateSettings({ distanceUnit: e.target.value as "km" | "miles" })
            }
          >
            <option value="km">KM</option>
            <option value="miles">Miles</option>
          </select>
          <label
            className="flex-1 ml-2 flex items-center"
            htmlFor="setting-distanceUnit"
          >
            {"Avstandsenhet"}
          </label>
        </div>
        <div className="flex p-1">
          <select
            id="setting-theme"
            className="h-8 dark:bg-slate-800"
            value={settingsData.theme}
            onChange={(e) =>
              updateSettings({ theme: e.target.value as "light" | "dark" })
            }
          >
            <option value="light">Lyst</option>
            <option value="dark">Mørkt</option>
          </select>
          <label
            className="flex-1 ml-2 flex items-center"
            htmlFor="setting-theme"
          >
            {"Tema"}
          </label>
        </div>
      </div>
      <div className="my-4">
        <header className="my-2">
          <h3 className="text-lg font-bold">{"Forvanskere"}</h3>
          <div className="text-sm italic text-gray-500">
            {"Begynner neste dag"}
          </div>
        </header>
        <div className="flex p-1">
          <input
            type="checkbox"
            id="setting-noImage"
            checked={settingsData.noImageMode}
            onChange={(e) => updateSettings({ noImageMode: e.target.checked })}
          />
          <label className="flex-1 ml-2" htmlFor="setting-noImage">
            {"Uten bilder"}
          </label>
        </div>
        <div className="flex p-1">
          <input
            type="checkbox"
            id="setting-rotationMode"
            checked={settingsData.rotationMode}
            onChange={(e) => updateSettings({ rotationMode: e.target.checked })}
          />
          <label className="flex-1 ml-2" htmlFor="setting-rotationMode">
            {"Roter bildene"}
          </label>
        </div>
      </div>
    </Panel>
  );
}
