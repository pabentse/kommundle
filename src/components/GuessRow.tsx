import {
  computeProximityPercent,
  Direction,
  formatDistance,
  generateSquareCharacters,
  computeYearDifference,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import React, { useCallback, useEffect, useState } from "react";
import CountUp from "react-countup";
import { SettingsData } from "../hooks/useSettings";
import { getYear } from "../domain/countries";
import { useCountry } from "../hooks/useCountry";
import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import "./GuessRow.css";

const DIRECTION_ARROWS: Record<Direction, string> = {
  N: "⬆️",
  NNE: "↗️",
  NE: "↗️",
  ENE: "↗️",
  E: "➡️",
  ESE: "↘️",
  SE: "↘️",
  SSE: "↘️",
  S: "⬇️",
  SSW: "↙️",
  SW: "↙️",
  WSW: "↙️",
  W: "⬅️",
  WNW: "↖️",
  NW: "↖️",
  NNW: "↖️",
};

const countryFlags: { [key: string]: string } = {
  Italy: "🇮🇹",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Spain: "🇪🇸",
  "United Kingdom": "🇬🇧",
  Russia: "🇷🇺",
  Ukraine: "🇺🇦",
  Poland: "🇵🇱",
  Romania: "🇷🇴",
  Netherlands: "🇳🇱",
  Belgium: "🇧🇪",
  Greece: "🇬🇷",
  "Czech Republic": "🇨🇿",
  Portugal: "🇵🇹",
  Sweden: "🇸🇪",
  Hungary: "🇭🇺",
  Belarus: "🇧🇾",
  Austria: "🇦🇹",
  Serbia: "🇷🇸",
  Switzerland: "🇨🇭",
  Bulgaria: "🇧🇬",
  Denmark: "🇩🇰",
  Finland: "🇫🇮",
  Slovakia: "🇸🇰",
  Norway: "🇳🇴",
  Ireland: "🇮🇪",
  Croatia: "🇭🇷",
  Moldova: "🇲🇩",
  "Bosnia and Herzegovina": "🇧🇦",
  Albania: "🇦🇱",
  Lithuania: "🇱🇹",
  "North Macedonia": "🇲🇰",
  Slovenia: "🇸🇮",
  Latvia: "🇱🇻",
  Estonia: "🇪🇪",
  Montenegro: "🇲🇪",
  Luxembourg: "🇱🇺",
  Malta: "🇲🇹",
  Iceland: "🇮🇸",
  Andorra: "🇦🇩",
  Mexico: "🇲🇽",
  Canada: "🇨🇦",
  "United States": "🇺🇸",
  Brazil: "🇧🇷",
  Argentina: "🇦🇷",
  Colombia: "🇨🇴",
  Peru: "🇵🇪",
  China: "🇨🇳",
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  Pakistan: "🇵🇰",
  Bangladesh: "🇧🇩",
  eSwatini: "🇸🇿",
  Afghanistan: "🇦🇫",
  Angola: "🇦🇴",
  Algeria: "🇩🇿",
  Azerbaijan: "🇦🇿",
  Bahrain: "🇧🇭",
  Benin: "🇧🇯",
  Botswana: "🇧🇼",
};

function getDayStringNew() {
  return DateTime.now().toFormat("dd-MM-yyyy");
}

const SQUARE_ANIMATION_LENGTH = 250;
type AnimationState = "NOT_STARTED" | "RUNNING" | "ENDED";

interface GuessRowProps {
  guess?: Guess;
  settingsData: SettingsData;
  countryInputRef?: React.RefObject<HTMLInputElement>;
  countryFeedback?: string | null;
  centuryFeedback?: string | null;
  countryNew?: string | null;
  isGuessCorrect?: boolean;
}

export function GuessRow({
  guess,
  settingsData,
  countryInputRef,
}: GuessRowProps) {
  const { distanceUnit, theme } = settingsData;
  const proximity = guess != null ? computeProximityPercent(guess.distance) : 0;
  const squares = generateSquareCharacters(proximity, theme);
  const dayStringNew = useMemo(getDayStringNew, []);
  //const [country, randomAngle, imageScale] = useCountry(dayStringNew);
  //const correctYear = getYear(country);
  const isGuessCorrect = guess?.isCorrect;
  const isCorrectCentury = guess?.isCorrectCentury;
  const isCorrectCountry = guess?.isCorrectCountry;

  //const yearDifference =
  //guess != null ? computeYearDifference(guess.year, correctYear).yearDiff : 0;
  // comment
  const [animationState, setAnimationState] =
    useState<AnimationState>("NOT_STARTED");
  useEffect(() => {
    if (guess == null) {
      return;
    }

    setAnimationState("RUNNING");
    const timeout = setTimeout(() => {
      setAnimationState("ENDED");
    }, SQUARE_ANIMATION_LENGTH * 6);

    return () => {
      clearTimeout(timeout);
    };
  }, [guess]);

  function getFlagEmoji(country: string) {
    //console.log("pure country from guessrow is: ", country);
    //console.log("isCorrectCountry from guessrow is: ", isCorrectCountry);
    return countryFlags[country] || "";
  }

  const flagEmoji =
    guess && guess.countryNew ? getFlagEmoji(guess.countryNew) : "";

  const handleClickOnEmptyRow = useCallback(() => {
    if (countryInputRef?.current != null) {
      countryInputRef?.current.focus();
    }
  }, [countryInputRef]);

  switch (animationState) {
    case "NOT_STARTED":
      return (
        <div
          onClick={handleClickOnEmptyRow}
          className={`col-span-7 h-8 bg-gray-200 dark:bg-slate-600`}
        />
      );
    case "RUNNING":
      return (
        <>
          <div
            className={`flex text-2xl w-full justify-evenly items-center col-span-6 border-2 h-8`}
          >
            {squares.map((character, index) => (
              <div
                key={index}
                className="opacity-0 animate-reveal"
                style={{
                  animationDelay: `${SQUARE_ANIMATION_LENGTH * index}ms`,
                }}
              >
                {character}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal"></div>
        </>
      );
    case "ENDED":
      return (
        <>
          <div className="flex items-center justify-center border-2 h-8 col-span-6 animate-reveal">
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
              {guess?.name.toUpperCase()}
            </p>
          </div>
          {/* <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal">
            {guess?.countryNew ? flagEmoji : ""}
            {isCorrectCountry ? " ✅" : "❌"}
          </div> */}
          {/* <div
            className="flex items-center justify-center border-2 h-8 col-span-2 animate-reveal"
            //style={{ backgroundColor: isCorrectCentury ? "green" : "red" }}
          >
            {isGuessCorrect
              ? guess?.year
              : isCorrectCentury
              ? "Century ✅"
              : "Century ❌"}
          </div> */}
          <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal animate-pop">
            {isGuessCorrect ? "✅" : "❌"}
          </div>
        </>
      );
  }
}
