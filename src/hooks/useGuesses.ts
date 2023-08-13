import { useCallback, useState } from "react";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

export function useGuesses(
  dayString: string
): [Guess[], (guess: Guess) => void, () => void] {
  const [guesses, setGuesses] = useState<Guess[]>(
    loadAllGuesses()[dayString] ?? []
  );

  const resetGuesses = useCallback(() => {
    setGuesses([]);
    saveGuesses(dayString, []); // This will clear the entry in local storage
  }, [dayString]);

  const addGuess = useCallback(
    (newGuess: Guess) => {
      const newGuesses = [...guesses, newGuess];

      setGuesses(newGuesses);
      saveGuesses(dayString, newGuesses);

      console.log("Inside useGuesses, updated guesses:", newGuesses);
    },
    [dayString, guesses]
  );

  return [guesses, addGuess, resetGuesses];
}
