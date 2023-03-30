import { useEffect, useState } from "react";

function loadAllModeValues(modeName: string): Record<string, boolean> {
  const storedModeValues = localStorage.getItem(modeName);
  return storedModeValues != null ? JSON.parse(storedModeValues) : {};
}

export function useMode(
  modeName: string,
  dayStringNew: string,
  defaultValue: boolean
): [boolean, (modeValue: boolean) => void] {
  const [modeValue, setModeValue] = useState<boolean>(
    loadAllModeValues(modeName)[dayStringNew] ?? defaultValue
  );

  useEffect(() => {
    const allModeValues = loadAllModeValues(modeName);
    localStorage.setItem(
      modeName,
      JSON.stringify({
        ...allModeValues,
        [dayStringNew]: modeValue,
      })
    );
  }, [dayStringNew, modeName, modeValue]);

  return [modeValue, setModeValue];
}
