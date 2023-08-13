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
import { Link } from "react-router-dom";
import { useGuesses } from "../hooks/useGuesses";
import { ShareProps } from "./Share";

const START_DATE = DateTime.fromISO("2023-02-24");

interface NextRoundProps extends ShareProps {
  currentRound: number;
  currentMetaRound: number;
  setCurrentMetaRound: React.Dispatch<React.SetStateAction<number>>;
}

export function NextRound({
  guesses,
  dayString,
  settingsData,
  hideImageMode,
  rotationMode,
  currentRound,
  currentMetaRound,
}: NextRoundProps) {
  const { theme } = settingsData;

  // Instantiate the useGuesses hook at the top of the component
  const [, , resetGuesses] = useGuesses(dayString);

  let nextRoundLink = "/round2";
  let buttonText = "Go to round 2!";

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

  if (currentMetaRound === 2) {
    nextRoundLink = "/round3";
    buttonText = "Go to round 3!";
  }
  if (currentMetaRound === 3) {
    nextRoundLink = "/round4";
    buttonText = "Go to round 4!";
  }

  return (
    <Link to={nextRoundLink}>
      <button
        className="border-2 px-4 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full"
        onClick={() => {
          // Reset state
          resetGuesses();
        }}
      >
        {buttonText}
      </button>
    </Link>
  );
}
