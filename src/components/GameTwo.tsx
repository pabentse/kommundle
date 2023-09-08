import { DateTime } from "luxon";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  countries,
  getCountryName,
  sanitizeCountryName,
  getMusemName,
  getCityName,
  getArtistName,
  getYear,
  getCountryCountry,
} from "../domain/countries";
import { useGuesses } from "../hooks/useGuesses";
import { CountryInput } from "./CountryInput";
import * as geolib from "geolib";
import { Share } from "./Share";
import { Guesses } from "./Guesses";
import { useTranslation } from "react-i18next";
import { SettingsData } from "../hooks/useSettings";
import { useMode } from "../hooks/useMode";
import { useCountry } from "../hooks/useCountry";
import Modal from "./Modal";
import { GuessRow } from "./GuessRow";
import ConfettiExplosion from "confetti-explosion-react";
import { NextRound } from "./NextRound";

function getDayString() {
  return DateTime.now().toFormat("yyyy-MM-dd");
}

function getDayStringNew() {
  return DateTime.now().toFormat("dd-MM-yyyy");
}

const MAX_TRY_COUNT = 1; //Max number of guesses

interface GameProps {
  settingsData: SettingsData;
  currentMetaRound: number;
  setCurrentMetaRound: React.Dispatch<React.SetStateAction<number>>;
}

const usePersistedState = <T,>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const savedState = window.localStorage.getItem(key);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (err) {
      // If the JSON is malformed or it's an empty document it will fall in this block
      console.error(
        `Error parsing state for key "${key}" from localstorage`,
        err
      );
    }
    return defaultValue; // If no valid data was found, return the default value
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};
function createRNG(seed: number) {
  // LCG parameters from Numerical Recipes
  const m = 2 ** 32;
  const a = 1664525;
  const c = 1013904223;

  return function () {
    seed = (a * seed + c) % m;
    return seed / m; // Normalize to [0, 1)
  };
}
function getWeightedRandomYear(
  correctYear: number,
  years: number[],
  rng: () => number
): number {
  // Calculate weights
  const weights = years.map((year) => 1 / (Math.abs(year - correctYear) + 1));

  // Normalize weights
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  const normalizedWeights = weights.map((weight) => weight / totalWeight);

  // Weighted random selection
  const rand = rng();
  let sum = 0;
  for (let i = 0; i < normalizedWeights.length; i++) {
    sum += normalizedWeights[i];
    if (rand < sum) return years[i];
  }

  return years[years.length - 1]; // Fallback, shouldn't really happen
}

export function GameTwo({ settingsData }: GameProps) {
  const [currentMetaRound, setCurrentMetaRound] = useState(2); // Or whatever initial value you want
  const { i18n } = useTranslation();
  const dayString = useMemo(getDayString, []);
  const dayStringNew = useMemo(getDayStringNew, []);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const [gameLocked, setGameLocked] = useState(false);
  const countryInputRef = useRef<HTMLInputElement>(null);
  //const [currentRoundInTwo, setCurrentRoundInTwo] = useState(MAX_TRY_COUNT - 1);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [currentRoundInTwo, setCurrentRoundInTwo] = usePersistedState<number>(
    `currentRoundInTwo-${today}`,
    MAX_TRY_COUNT
  );

  useEffect(() => {
    // Reset the currentRoundInThree to MAX_TRY_COUNT when a new game round begins
    setCurrentRoundInTwo(MAX_TRY_COUNT);
    // Unlock the game for the new round
    setGameLocked(false);
  }, [currentMetaRound, setCurrentRoundInTwo]);

  const [country, randomAngle, imageScale] = useCountry(dayStringNew);

  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, addGuess, resetGuesses] = useGuesses(dayStringNew);
  useEffect(() => {
    resetGuesses();
  }, [resetGuesses]);

  const [hideImageMode, setHideImageMode] = useMode(
    "hideImageMode",
    dayStringNew,
    settingsData.noImageMode
  );
  const [rotationMode, setRotationMode] = useMode(
    "rotationMode",
    dayString,
    settingsData.rotationMode
  );

  useEffect(() => {
    const imageIndices: number[] = [5, 3, 0];
    for (const i of imageIndices) {
      const img: HTMLImageElement = new Image();
      img.src = `images/countries/${country.code.toLowerCase()}/vector${i}.png`;
    }
  }, [country.code]); // Now `country.code` is in dependency array

  const [isModalOpen, setIsModalOpen] = useState(true);
  //const image = `images/countries/${country.code.toLowerCase()}/vector${currentRoundInTwo}.png`;

  // assuming currentRoundInTwo is of type number
  const roundToImageIndexMapping: { [key in number]: number } = {
    2: 5,
    1: 3,
    0: 0,
  };
  const imageIndex =
    roundToImageIndexMapping[
      currentRoundInTwo as keyof typeof roundToImageIndexMapping
    ];
  const image = `images/countries/${country.code.toLowerCase()}/vector0.png`;
  //const image = `images/countries/${country.code.toLowerCase()}/vector${imageIndex}.png?${new Date().getTime()}`;

  const [isExploding, setIsExploding] = React.useState(false); //For confetti

  useEffect(() => {
    if (isExploding) {
      const timer = setTimeout(() => {
        setIsExploding(false);
      }, 6000); // adjust the delay as needed
      return () => clearTimeout(timer);
    }
  }, [isExploding]);

  const roundOneEnded =
    guesses.length === MAX_TRY_COUNT ||
    //guesses[guesses.length - 1]?.distance === 0;
    guesses[guesses.length - 1]?.isCorrect === true;
  console.log("roundOneEnded value is:", roundOneEnded);
  const [countryFeedback, setCountryFeedback] = useState<string | null>(null);
  const [centuryFeedback, setCenturyFeedback] = useState<string | null>(null);
  const correctYear = getYear(country);
  console.log("Last guess:", guesses[guesses.length - 1]);

  function getRandomYears(excludedYears: number[], count: number): number[] {
    const randomYears = [];
    while (randomYears.length < count) {
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const randomYear = getYear(randomCountry);
      if (!excludedYears.includes(randomYear)) {
        randomYears.push(randomYear);
      }
    }
    return randomYears;
  }

  const randomYears = getRandomYears([correctYear], 3);
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const rng = createRNG(new Date().getDate()); // Using the day of the month as the seed

  // Assuming allYears is a list of all potential years

  let allYears = shuffleArray([correctYear, ...randomYears]);

  const alternatives = [];
  for (let i = 0; i < 3; i++) {
    // To get 3 alternatives
    const year = getWeightedRandomYear(correctYear, allYears, rng);
    alternatives.push(year);
    // Remove the selected year from allYears to avoid repetition
    allYears = allYears.filter((y) => y !== year);
  }
  const getButtonStyle = (year: number) => {
    if (!roundOneEnded) {
      return "bg-opacity-0 hover:bg-gray-500"; // Transparent for the first round
    }

    if (selectedYear === year && isAnswerCorrect) {
      return "bg-green-500"; // Green for correct answer
    } else if (selectedYear === year && !isAnswerCorrect) {
      return "bg-red-500"; // Red for incorrect answer
    } else if (year === correctYear) {
      return "bg-green-500"; // Green for the actual correct answer
    } else {
      return "bg-opacity-0"; // Lighter gray for other answers
    }
  };

  allYears.map((year, index) => <button key={index}>{year}</button>);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  function generateYearOptions(correctYear: number): number[] {
    const yearOptions = new Set<number>();
    yearOptions.add(correctYear); // add the correct year

    while (yearOptions.size < 4) {
      // we want 4 options
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      yearOptions.add(getYear(randomCountry));
    }

    return Array.from(yearOptions);
  }
  //const correctYear = getYear(guessedCountry);
  const yearOptions = useMemo(
    () => shuffleArray(generateYearOptions(correctYear)),
    [correctYear]
  );
  const handleYearGuess = useCallback(
    (selectedYear: number) => {
      setSelectedYear(selectedYear);
      // Create a new guess based on the selected year
      const newGuess = {
        name: currentGuess, // This will be the country name, as previously
        year: selectedYear,
        distance: 0, //placeholder value
        isCorrect: selectedYear === correctYear,
        isCorrectCentury:
          Math.floor(selectedYear / 100) === Math.floor(correctYear / 100),
        // For the other properties, you can set them accordingly or use placeholders
      };

      // Add the new guess to the guesses array
      addGuess(newGuess);

      // Continue with the rest of your logic
      if (selectedYear === correctYear) {
        // logic for correct guess
        setIsGuessCorrect(true);
        setCurrentRoundInTwo(0); // Jump to the last round (last image)
        toast.success("Correct year!", { delay: 100 });
        setIsExploding(true);
        setIsAnswerCorrect(true);
        console.log("Updated guesses array:", guesses);
        console.log("Guess is correct");
      } else {
        // logic for incorrect guess
        setIsAnswerCorrect(false);
        setIsGuessCorrect(false);
        toast.error(`Wrong year!`, { delay: 100 });
        setCurrentRoundInTwo((round) => Math.max(0, round - 1));
        console.log("Guess is wrong");
      }
    },
    [correctYear, setCurrentRoundInTwo, guesses, addGuess, currentGuess]
  );

  useEffect(() => {
    if (
      guesses.length === MAX_TRY_COUNT && //If length of guesses is 6
      guesses[guesses.length - 1].distance > 0 //If the last guess is wrong?
    ) {
      toast.info(getArtistName(i18n.resolvedLanguage, country).toUpperCase(), {
        //If the last guess is wrong, show the correct answer
        autoClose: false,
        delay: 2000,
      });
    }
  }, [country, guesses, i18n.resolvedLanguage]);
  useEffect(() => {
    if (currentRoundInTwo <= 0) {
      // Logic for end of round
      toast.info("Round over! Correct answers are highlighted.", {
        delay: 100,
      });
      // Lock the game
      setGameLocked(true);
    }
  }, [currentRoundInTwo]);
  return (
    <div className="flex-grow flex flex-col mx-2">
      <div className="flex flex-row justify-between">
        <GuessRow
          centuryFeedback={centuryFeedback}
          countryFeedback={countryFeedback}
          settingsData={settingsData}
        />
      </div>

      <div className="my-1">
        <div className="my-1">
          {isModalOpen ? (
            <Modal
              active={isModalOpen}
              image={image}
              onClose={() => setIsModalOpen(false)}
            />
          ) : (
            <img
              className={`max-h-52 m-auto transition-transform duration-700 ease-in cursor-pointer`}
              alt="country to guess"
              src={image}
              onClick={() => setIsModalOpen(true)}
              style={{
                transition: "filter 0.5s ease-in-out",
              }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        {yearOptions.map((year, index) => (
          <button
            key={index}
            className={`border-2 uppercase m-2 ${getButtonStyle(year)}`}
            onClick={() => handleYearGuess(year)}
            disabled={gameLocked}
          >
            {year}
          </button>
        ))}
      </div>

      {roundOneEnded && (
        <>
          {isExploding && (
            <div className="confetti-container">
              <ConfettiExplosion
                force={1}
                duration={3500}
                particleCount={120}
                width={2000}
                height={800}
              />
            </div>
          )}
          <NextRound
            guesses={guesses}
            dayString={dayString}
            settingsData={settingsData}
            hideImageMode={hideImageMode}
            rotationMode={rotationMode}
            currentRound={currentRoundInTwo} // Assuming GameTwo.tsx represents round 2
            currentMetaRound={currentMetaRound}
            setCurrentMetaRound={setCurrentMetaRound}
          />
        </>
      )}
    </div>
  );
}
