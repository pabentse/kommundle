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
import { get } from "http";

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
const seed = new Date().getDate(); // Using the day of the month as the seed
const rng = seedrandom(seed.toString());

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

export function GameThree({ settingsData }: GameProps) {
  const [currentMetaRound, setCurrentMetaRound] = useState(3); // Or whatever initial value you want
  const { i18n } = useTranslation();
  const dayString = useMemo(getDayString, []);
  const dayStringNew = useMemo(getDayStringNew, []);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const MAX_TRY_COUNT = 2; //Max number of guesses

  const countryInputRef = useRef<HTMLInputElement>(null);
  //const [currentRoundInThree, setcurrentRoundInThree] = useState(MAX_TRY_COUNT - 1);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [gameLocked, setGameLocked] = useState(false);
  const [currentRoundInThree, setcurrentRoundInThree] =
    usePersistedState<number>(`currentRoundInThree-${today}`, MAX_TRY_COUNT);

  useEffect(() => {
    // Reset the currentRoundInThree to MAX_TRY_COUNT when a new game round begins
    setcurrentRoundInThree(MAX_TRY_COUNT);
    // Unlock the game for the new round
    setGameLocked(false);
  }, [currentMetaRound, setcurrentRoundInThree]);

  console.log("currentRoundInThree in beginning", currentRoundInThree);
  console.log("currentMetaRound in beginning", currentMetaRound);
  console.log("gameLocked in beginning", gameLocked);

  const [country, randomAngle, imageScale] = useCountry(dayStringNew);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, addGuess, resetGuesses] = useGuesses(dayStringNew);
  useEffect(() => {
    resetGuesses();
  }, [resetGuesses]);

  const correctAttributes = getAttributes(country);

  // Example usage:
  const correctAttribute = "Italian Renaissance";
  const randomAttribute = "High Renaissance"; // This should be excluded
  const anotherRandomAttribute = "Post-Modernism"; // This should not be excluded

  const [attributeOptions, setAttributeOptions] = useState<string[]>([]);
  useEffect(() => {
    const exceptionalTerms = ["Art", "Feminist", "Pop", "Abstract"]; // Add terms that should be exceptions

    const shouldExclude = (
      attribute: string,
      correctAttribute: string
    ): boolean => {
      const attributeTokens = attribute.split(" ");
      const correctAttributeTokens = correctAttribute.split(" ");

      for (const token of attributeTokens) {
        // Check if the token is an exceptional term
        if (exceptionalTerms.includes(token)) {
          continue;
        }

        // If token is in correctAttributeTokens but isn't a special term like "Post-Modernism"
        if (correctAttributeTokens.includes(token) && !token.includes("-")) {
          return true;
        }
      }
      return false;
    };
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
        const possibleAttributes = attributesForRandomCountry.filter((attr) => {
          // Check exclusion against all correct attributes
          return !excludedAttributes.some((correctAttr) =>
            shouldExclude(attr, correctAttr)
          );
        });

        // We use a random index to get a random attribute from the filtered list
        if (possibleAttributes.length > 0) {
          const randomIndex = Math.floor(rng() * possibleAttributes.length);
          const randomAttribute = possibleAttributes[randomIndex];

          chosenAttributes.add(randomAttribute);
        }
      }

      return Array.from(chosenAttributes);
    }

    const randomAttributeOptions = getRandomAttributes(
      correctAttributes,
      4,
      countries
    );

    const allAttributeOptions = [
      ...correctAttributes,
      ...randomAttributeOptions,
    ];

    const shuffledAttributeOptions = shuffleArray(allAttributeOptions);
    setAttributeOptions(shuffledAttributeOptions);
    console.log(shouldExclude(randomAttribute, correctAttribute)); // Output: true
    console.log(shouldExclude(anotherRandomAttribute, correctAttribute)); // Output: false
  }, [country, correctAttributes]);

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
  useEffect(() => {
    if (currentRoundInThree <= 0) {
      // Logic for end of round
      toast.info("Round over! Correct answers are highlighted.", {
        delay: 100,
      });
      // Lock the game
      setGameLocked(true);
    }
  }, [currentRoundInThree]);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const getButtonStyle = (attribute: string) => {
    const guess = guessedAttributes.find((g) => g.attribute === attribute);

    if (guess) {
      if (guess.isCorrect) {
        return "bg-green-500 hover:bg-green-600";
      } else {
        return "bg-red-500 hover:bg-red-600";
      }
    } else if (
      currentRoundInThree === 0 &&
      correctAttributes.includes(attribute)
    ) {
      return "bg-green-300 hover:bg-green-500";
    } else {
      return "bg-opacity-0 hover:bg-gray-500";
    }
  };

  type GuessedAttribute = {
    attribute: string;
    isCorrect: boolean;
  };
  const [guessedAttributes, setGuessedAttributes] = useState<
    GuessedAttribute[]
  >([]);

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

  function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleAttributeGuess = (guessedAttribute: string) => {
    const isCorrect = correctAttributes.includes(guessedAttribute);

    setGuessedAttributes([
      ...guessedAttributes,
      { attribute: guessedAttribute, isCorrect },
    ]);

    setcurrentRoundInThree(currentRoundInThree - 1);
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
        <GuessRow settingsData={settingsData} />
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
            disabled={gameLocked} // Disable the button when the game is locked
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
            currentRound={currentRoundInThree} // Assuming GameTwo.tsx represents round 2
            currentMetaRound={currentMetaRound}
            setCurrentMetaRound={setCurrentMetaRound}
          />
        </>
      )}
    </div>
  );
}
