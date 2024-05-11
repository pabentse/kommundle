import { useMemo } from "react";
import seedrandom from "seedrandom";
import { countriesWithImage, Country } from "../domain/countries";

//hardcoded countries for each day
const forcedCountries: Record<string, string> = {
  "11-05-2024": "municip5100",
  "12-05-2024": "municip5128",
  "13-05-2024": "municip5127",
  "14-05-2024": "municip5126",
  "15-05-2024": "municip5125",
  "16-05-2024": "municip5124",
  "17-05-2024": "municip5123",
  "18-05-2024": "municip5122",
  "19-05-2024": "municip5121",
  "20-05-2024": "municip5120",
  "21-05-2024": "municip5119",
  "22-05-2024": "municip5118",
  "23-05-2024": "municip5117",
  "24-05-2024": "municip5116",
  "25-05-2024": "municip5115",
  "26-05-2024": "municip5114",
  "27-05-2024": "municip5113",
  "28-05-2024": "municip5112",
  "29-05-2024": "municip5111",
  "30-05-2024": "municip5110",
  "31-05-2024": "municip5109",
  "01-06-2024": "municip5108",
  "02-06-2024": "municip5107",
  "03-06-2024": "municip5106",
  "04-06-2024": "municip5105",
  "05-06-2024": "municip5104",
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
