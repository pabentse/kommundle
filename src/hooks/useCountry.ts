import { useMemo } from "react";
import seedrandom from "seedrandom";
import { countriesWithImage, Country } from "../domain/countries";

//hardcoded countries for each day
const forcedCountries: Record<string, string> = {
  "01-01-2024": "municip5088",
  "02-01-2024": "municip5089",
  "03-01-2024": "municip5090",
  "04-01-2024": "municip5091",
  "05-01-2024": "municip5092",
  "06-01-2024": "municip5093",
  "07-01-2024": "municip5094",
  "08-01-2024": "municip5095",
  "09-01-2024": "municip5096",
  "10-01-2024": "municip5097",
  "11-01-2024": "municip5098",
  "12-01-2024": "municip5099",
  "13-01-2024": "municip5100",
  "14-01-2024": "municip5101",
  "15-01-2024": "municip5102",
  "16-01-2024": "municip5103",
  "17-01-2024": "municip5104",
  "18-01-2024": "municip5105",
  "19-01-2024": "municip5106",
  "20-01-2024": "municip5107",
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
