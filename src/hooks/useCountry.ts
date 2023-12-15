import { useMemo } from "react";
import seedrandom from "seedrandom";
import { countriesWithImage, Country } from "../domain/countries";

//hardcoded countries for each day
const forcedCountries: Record<string, string> = {
  "14-10-2023": "municip5077",
  "22-10-2023": "municip5078",
  "15-12-2023": "municip5079",
  "16-12-2023": "municip5080",
};

export function useCountry(dayString: string): [Country, number, number] {
  const country = useMemo(() => {
    const forcedCountryCode = forcedCountries[dayString];
    const forcedCountry =
      forcedCountryCode != null
        ? countriesWithImage.find(
            (country) => country.code === forcedCountryCode
          )
        : undefined;
    if (forcedCountry) {
      console.log(`Forced country for ${dayString}:`, forcedCountry);
    } else {
      console.log(`No forced country for ${dayString}.`);
    }
    return (
      forcedCountry ??
      countriesWithImage[
        Math.floor(seedrandom.alea(dayString)() * countriesWithImage.length)
      ]
    );
  }, [dayString]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  return [country, randomAngle, imageScale];
}
