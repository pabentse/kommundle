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
import ConfettiExplosion from "react-confetti-explosion";

function getDayString() {
  return DateTime.now().toFormat("yyyy-MM-dd");
}

function getDayStringNew() {
  return DateTime.now().toFormat("dd-MM-yyyy");
}

const MAX_TRY_COUNT = 6; //Max number of guesses

interface GameProps {
  settingsData: SettingsData;
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

export function Game({ settingsData }: GameProps) {
  const [currentGuessGlobal, setCurrentGuessGlobal] = useState("");
  const { i18n } = useTranslation();
  const dayString = useMemo(getDayString, []);
  const dayStringNew = useMemo(getDayStringNew, []);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);

  const countryInputRef = useRef<HTMLInputElement>(null);
  //const [currentRound, setCurrentRound] = useState(MAX_TRY_COUNT - 1);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [currentRound, setCurrentRound] = usePersistedState<number>(
    `currentRound-${today}`,
    MAX_TRY_COUNT - 1
  );

  const [country, randomAngle, imageScale] = useCountry(dayStringNew);

  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, addGuess] = useGuesses(dayStringNew);
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
    for (let i = 0; i <= 5; i++) {
      const img = new Image();
      img.src = `images/countries/${country.code.toLowerCase()}/vector${i}.png`;
    }
  }, [country]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const image = `images/countries/${country.code.toLowerCase()}/vector${currentRound}.png`;

  const [isExploding, setIsExploding] = React.useState(false); //For confetti

  useEffect(() => {
    if (isExploding) {
      const timer = setTimeout(() => {
        setIsExploding(false);
      }, 6000); // adjust the delay as needed
      return () => clearTimeout(timer);
    }
  }, [isExploding]);

  const gameEnded =
    guesses.length === MAX_TRY_COUNT ||
    guesses[guesses.length - 1]?.distance === 0;

  const [countryFeedback, setCountryFeedback] = useState<string | null>(null);
  const [centuryFeedback, setCenturyFeedback] = useState<string | null>(null);
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const guessedCountry = countries.find(
        (country) =>
          sanitizeCountryName(getArtistName(i18n.resolvedLanguage, country)) ===
          sanitizeCountryName(currentGuess)
      );

      if (guessedCountry == null) {
        //If the guess is wrong
        toast.error("Unknown artist");
        return;
      }
      const newGuess = {
        //This is the guess that is added to the list of guesses
        name: currentGuess,
        artist: getArtistName(i18n.resolvedLanguage, guessedCountry),
        distance: geolib.getDistance(guessedCountry, country),
        direction: geolib.getCompassDirection(guessedCountry, country),
        year: getYear(guessedCountry),
        isCorrect: false, //initially set to false
        isCorrectCentury: false,
        isCorrectCountry: false,
        countryNew: guessedCountry.country,
      };

      addGuess(newGuess);
      setCurrentGuess("");

      if (newGuess.artist === getArtistName(i18n.resolvedLanguage, country)) {
        //If the guess is correct
        //^Denne har jeg endret fra newGuess.country til newGuess.artist
        newGuess.isCorrect = true; //update isCorrect to true
        newGuess.isCorrectCountry = true;
        newGuess.isCorrectCentury = true;
        setIsGuessCorrect(true);
        setCurrentRound(0); //Jump to the last round (last image)
        toast.success("Well done!", { delay: 2000 });
        setIsExploding(true);
      } else {
        //If the guess is wrong
        newGuess.isCorrect = false;
        setIsGuessCorrect(false);
        //console.log("guessedCountry is: ", guessedCountry);
        console.log("guessedCountry.country is: ", guessedCountry.country);
        //console.log("typeof guessedCountry.country is:", typeof guessedCountry.country);
        //console.log("typeof getartistname i18n country is: ", typeof getArtistName(i18n.resolvedLanguage, country));
        console.log("print getCountryName: ", getCountryCountry(country));
        if (guessedCountry.country === getCountryCountry(country)) {
          newGuess.isCorrectCountry = true;
        } else {
          newGuess.isCorrectCountry = false;
        }
        if (
          Math.floor(guessedCountry.year / 100) ===
          Math.floor(country.year / 100)
        ) {
          newGuess.isCorrectCentury = true;
        } else {
          newGuess.isCorrectCentury = false;
        }

        if (
          Math.floor(guessedCountry.year / 100) ===
          Math.floor(country.year / 100)
        ) {
          setCenturyFeedback("Correct century!");
        } else {
          setCenturyFeedback(null);
        }
        setCurrentRound((round) => Math.max(0, round - 1)); //Jump to the next round (next image)
      }
    },
    [addGuess, country, currentGuess, i18n.resolvedLanguage, setCurrentRound]
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

  return (
    <div className="flex-grow flex flex-col mx-2">
      <div className="flex flex-row justify-between">
        <GuessRow
          centuryFeedback={centuryFeedback}
          countryFeedback={countryFeedback}
          settingsData={settingsData}
        />
      </div>
      {hideImageMode && !gameEnded && (
        <button
          className="border-2 uppercase my-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() => setHideImageMode(false)}
        >
          {"Vis på kart"}
        </button>
      )}
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
              className={`max-h-52 m-auto transition-transform duration-700 ease-in ${
                hideImageMode && !gameEnded ? "h-0" : "h-full"
              } cursor-pointer`}
              alt="country to guess"
              src={image}
              onClick={() => setIsModalOpen(true)}
              style={{
                transition: "filter 0.5s ease-in-out",
              }}
            />
          )}
        </div>
        {/* <img
          className={`max-h-52 m-auto transition-transform duration-700 ease-in ${
            hideImageMode && !gameEnded ? "h-0" : "h-full"
          }`}
          alt="country to guess"
          src={`images/countries/${country.code.toLowerCase()}/vector${currentRound}.png`}
          style={{
            transition: "filter 0.5s ease-in-out",
          }}
        /> */}
      </div>
      {rotationMode && !hideImageMode && !gameEnded && (
        <button
          className="border-2 uppercase mb-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() => setRotationMode(false)}
        >
          {"Ikke rotér"}
        </button>
      )}
      <Guesses
        rowCount={MAX_TRY_COUNT}
        guesses={guesses}
        settingsData={settingsData}
        countryInputRef={countryInputRef}
      />
      <div className="my-2">
        {gameEnded ? (
          <>
            {isExploding && (
              <div className="confetti-container">
                {/* <ConfettiExplosion
                  force={1}
                  duration={6000}
                  particleCount={200}
                  width={2500}
                /> */}
              </div>
            )}
            <Share
              guesses={guesses}
              dayString={dayString}
              settingsData={settingsData}
              hideImageMode={hideImageMode}
              rotationMode={rotationMode}
            />
            <a
              className="underline w-full text-center block mt-4"
              href={`https://www.google.com/maps?q=${getMusemName(
                i18n.resolvedLanguage,
                country
              )},%20${getCityName(i18n.resolvedLanguage, country)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {"Show on Google Maps"}
            </a>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <CountryInput
                inputRef={countryInputRef}
                currentGuess={currentGuess}
                setCurrentGuess={setCurrentGuess}
              />
              <button
                className="border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
                type="submit"
              >
                🎨 {"Guess"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
