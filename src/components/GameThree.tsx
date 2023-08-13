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
  getAttributes,
  Country,
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
import seedrandom from "seedrandom";

function getDayString() {
  return DateTime.now().toFormat("yyyy-MM-dd");
}

function getDayStringNew() {
  return DateTime.now().toFormat("dd-MM-yyyy");
}

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

export function GameThree({ settingsData }: GameProps) {
  const [currentMetaRound, setCurrentMetaRound] = useState(3); // Or whatever initial value you want
  const { i18n } = useTranslation();
  const dayString = useMemo(getDayString, []);
  const dayStringNew = useMemo(getDayStringNew, []);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const MAX_TRY_COUNT = 2; //Max number of guesses
  const seed = new Date().getDate(); // Using the day of the month as the seed
  const rng = seedrandom(seed.toString());

  const countryInputRef = useRef<HTMLInputElement>(null);
  //const [currentRound, setCurrentRound] = useState(MAX_TRY_COUNT - 1);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [currentRound, setCurrentRound] = usePersistedState<number>(
    `currentRound-${today}`,
    MAX_TRY_COUNT
  );
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
  const getButtonStyle = (attribute: string) => {
    const guess = guessedAttributes.find((g) => g.attribute === attribute);

    if (guess) {
      if (guess.isCorrect) {
        return "bg-green-500 hover:bg-green-600";
      } else {
        return "bg-red-500 hover:bg-red-600";
      }
    } else if (currentRound === 0 && correctAttributes.includes(attribute)) {
      return "bg-green-400 hover:bg-green-500";
    } else {
      return "bg-gray-100 hover:bg-gray-200";
    }
  };

  interface GuessedAttribute {
    attribute: string;
    isCorrect: boolean;
  }

  const [guessedAttributes, setGuessedAttributes] = useState<
    GuessedAttribute[]
  >([]);

  const [attributeOptions, setAttributeOptions] = useState<string[]>(() => {
    const correctAttributes = getAttributes(country);
    const randomAttributeOptions = getRandomAttributes(
      correctAttributes,
      4,
      countries
    );
    const allAttributeOptions = shuffleArray([
      ...correctAttributes,
      ...randomAttributeOptions,
    ]);
    return allAttributeOptions;
  });

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
    guesses[guesses.length - 1]?.isCorrect === true;
  console.log("roundOneEnded value is:", roundOneEnded);
  const [countryFeedback, setCountryFeedback] = useState<string | null>(null);
  const [centuryFeedback, setCenturyFeedback] = useState<string | null>(null);
  const correctYear = getYear(country);
  console.log("Last guess:", guesses[guesses.length - 1]);

  function getRandomAttributes(
    excludedAttributes: string[],
    count: number,
    allCountries: Country[]
  ): string[] {
    const chosenAttributes = new Set<string>();

    while (chosenAttributes.size < count) {
      const randomCountry =
        allCountries[Math.floor(rng() * allCountries.length)];
      const attributesForRandomCountry = getAttributes(randomCountry);

      // Filter out excluded attributes
      const possibleAttributes = attributesForRandomCountry.filter(
        (attr) => !excludedAttributes.includes(attr)
      );

      // We use a random index to get a random attribute from the filtered list
      if (possibleAttributes.length > 0) {
        const randomIndex = Math.floor(rng() * possibleAttributes.length);
        const randomAttribute = possibleAttributes[randomIndex];

        chosenAttributes.add(randomAttribute);
      }
    }

    return Array.from(chosenAttributes);
  }

  function generateAttributeOptions(
    country: Country,
    allCountries: Country[]
  ): string[] {
    // 1. Get the attributes for the `guessedCountry`.
    const correctAttributes = getAttributes(country);

    // 2. Randomly pick four other attributes.
    const randomAttributes = getRandomAttributes(
      correctAttributes,
      4,
      countries
    );

    // 3. Combine the attributes and shuffle them.
    const combinedAttributes = [
      ...correctAttributes,
      ...Array.from(randomAttributes),
    ];
    const shuffledAttributes = shuffleArray(combinedAttributes);

    // 4. Return the shuffled attributes.
    return shuffledAttributes;
  }

  function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(
    null
  );
  const correctAttributes = getAttributes(country);
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const handleAttributeGuess = (guessedAttribute: string) => {
    const isCorrect = correctAttributes.includes(guessedAttribute);

    // Add the guessed attribute to the list of guessed attributes.
    setGuessedAttributes([
      ...guessedAttributes,
      {
        attribute: guessedAttribute,
        isCorrect: isCorrect,
      },
    ]);

    setIsGuessCorrect(isCorrect);
    setCurrentRound(currentRound - 1);

    if (currentRound === 0) {
      // changed from 0 to 1 because we decrement after this check
      if (!isGuessCorrect) {
        // Notify player that the round is over and show the correct answers.
        toast.info(`Round over! Correct answers are highlighted.`, {
          delay: 100,
        });
      }
      // Logic to proceed to the next round or display a game-over screen.
    }
  };

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
        {attributeOptions.map((attribute, index) => (
          <button
            key={index}
            className={`border-2 uppercase m-2 ${getButtonStyle(attribute)}`}
            onClick={() => handleAttributeGuess(attribute)}
          >
            {attribute}
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
            currentRound={2} // Assuming GameTwo.tsx represents round 2
            currentMetaRound={currentMetaRound}
            setCurrentMetaRound={setCurrentMetaRound}
          />
        </>
      )}
    </div>
  );
}
