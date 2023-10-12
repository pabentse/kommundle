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
  "22-08-2023": "municip5069",
  "23-08-2023": "municip5070",
  "24-08-2023": "municip5071",
  "25-08-2023": "municip5072",
  "26-08-2023": "municip5073",
  "27-08-2023": "municip5074",
  "28-08-2023": "municip5075",
  "29-08-2023": "municip5076",
  "30-08-2023": "municip1103",
  "31-08-2023": "municip1106",
  "01-09-2023": "municip1107",
  "02-09-2023": "municip5041",
  "03-09-2023": "municip5042",
  "04-09-2023": "municip5045",
  "05-09-2023": "municip5046",
  "06-09-2023": "municip5047",
  "07-09-2023": "municip5048",
  "08-09-2023": "municip5049",
  "09-09-2023": "municip5050",
  "10-09-2023": "municip5051",
  "11-09-2023": "municip5052",
  "12-09-2023": "municip5053",
  "13-09-2023": "municip5054",
  "14-09-2023": "municip5055",
  "15-09-2023": "municip5056",
  "16-09-2023": "municip5057",
  "17-09-2023": "municip5058",
  "13-10-2023": "municip5077",
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
