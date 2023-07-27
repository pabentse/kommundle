import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import {
  computeProximityPercent,
  generateSquareCharacters,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import React from "react";
import { SettingsData } from "../hooks/useSettings";

const START_DATE = DateTime.fromISO("2023-02-24");

interface ShareProps {
  guesses: Guess[];
  dayString: string;
  settingsData: SettingsData;
  hideImageMode: boolean;
  rotationMode: boolean;
}

export function NextRound({
  guesses,
  dayString,
  settingsData,
  hideImageMode,
  rotationMode,
}: ShareProps) {
  const { theme } = settingsData;

  const nextRoundText = useMemo(() => {
    const guessCount =
      guesses[guesses.length - 1]?.distance === 0 ? guesses.length : "X";
    const dayCount = Math.floor(
      Interval.fromDateTimes(START_DATE, DateTime.fromISO(dayString)).length(
        "day"
      )
    );
    const difficultyModifierEmoji = hideImageMode
      ? " "
      : rotationMode
      ? " "
      : "";
    const title = `#Artle #${dayCount} ${guessCount}/6${difficultyModifierEmoji}`;

    const guessString = guesses
      .map((guess) => {
        const percent = computeProximityPercent(guess.distance);
        return generateSquareCharacters(percent, theme).join("");
      })
      .join("\n");

    return [title, guessString, "https://artle.eu"].join("\n");
    //return null;
  }, [dayString, guesses, hideImageMode, rotationMode, theme]);

  return (
    <button className="border-2 px-4 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full">
      {"Go to round 2!"}
    </button>
  );
}
