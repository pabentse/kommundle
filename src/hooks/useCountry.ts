import { useMemo } from "react";
import seedrandom from "seedrandom";
import { countriesWithImage, Country } from "../domain/countries";

//hardcoded countries for each day
const forcedCountries: Record<string, string> = {
  "09-08-2023": "municip5056",
  "10-08-2023": "municip5057",
  "11-08-2023": "municip5058",
  "12-08-2023": "municip5059",
  "13-08-2023": "municip5060",
  "14-08-2023": "municip5061",
  "15-08-2023": "municip5062",
  "16-08-2023": "municip5063",
  "17-08-2023": "municip5064",
  "18-08-2023": "municip5065",
  "19-08-2023": "municip5066",
  "20-08-2023": "municip5067",
  "21-08-2023": "municip5068",
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
