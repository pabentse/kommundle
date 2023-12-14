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
import { ScoreProvider, useScore } from "./ScoreContext";

const START_DATE = DateTime.fromISO("2023-02-24");

export interface ShareProps {
  guesses: Guess[];
  dayString: string;
  settingsData: SettingsData;
  hideImageMode: boolean;
  rotationMode: boolean;
}

export function Share({
  guesses,
  dayString,
  settingsData,
  hideImageMode,
  rotationMode,
}: ShareProps) {
  const { theme } = settingsData;

  const { score, setScore } = useScore(); // Get the score from the context (global score)

  const shareText = useMemo(() => {
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
    const stars = "⭐️".repeat(score); // Create a string of stars based on the score
    const title = `#Artle #${dayCount} ${stars} ${score}/5`;

    const guessString = guesses
      .map((guess) => {
        const percent = computeProximityPercent(guess.distance);
        return generateSquareCharacters(percent, theme).join("");
      })
      .join("\n");

    return [title, guessString, "https://artle.eu"].join("\n");
  }, [dayString, guesses, hideImageMode, rotationMode, theme, score]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() =>
        toast(
          "The result has been copied to your clipboard, share it with your friends!"
        )
      }
      options={{
        format: "text/plain",
      }}
    >
      <button className="border-2 px-4 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full">
        {"Share"}
      </button>
    </CopyToClipboard>
  );
}
