// Source:
// Countries with long/lat => https://developers.google.com/public-data/docs/canonical/countries_csv
// Countries images => https://github.com/djaiss/mapsicon

export const countryCodesWithImage = [
  "municip5046",
  "municip5045",
  "municip1103",
  "municip1106",
  "municip5042",
  "municip5041", //scream
  "municip5047", //earring
  "municip5048", //botticelli
  "municip5049",
  "municip5050",
  "municip5051",
  "municip5052",
  "municip5053",
  "municip5054",
  "municip5055",
  "municip5056",
  "municip5057",
  "municip5058",
  "municip5059",
  "municip5060",
  "municip5061",
  "municip5062",
  "municip5063",
];

export interface Country {
  country: any;
  code: string;
  latitude: number;
  longitude: number;
  name: string;
  museum: string;
  location: string;
  artist: string;
  year: number;
}

export const countries = [
  {
    code: "municip5046",
    latitude: 48.860294,
    longitude: 2.338629,
    year: 1503,
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    location: "Paris",
    country: "France",
    museum: "Musée du Louvre",
  },
  {
    code: "municip5045",
    latitude: 45.464664,
    longitude: 9.18854,
    year: 1495,
    name: "The Last Supper",
    artist: "Leonardo da Vinci",
    location: "Milan",
    country: "Italy",
    museum: "Santa Maria delle Grazie",
  },
  {
    code: "municip1103",
    latitude: 40.761509,
    longitude: -73.978271,
    year: 1889,
    name: "The Starry Night",
    artist: "Vincent van Gogh",
    location: "New York City",
    country: "Netherlands",
    museum: "Museum of Modern Art",
  },
  {
    code: "municip1106",
    latitude: 48.210033,
    longitude: 16.363449,
    year: 1907,
    name: "The Kiss",
    artist: "Gustav Klimt",
    location: "Vienna",
    country: "Austria",
    museum: "Österreichische Galerie Belvedere",
  },
  {
    code: "municip5042",
    latitude: 40.416775,
    longitude: -3.7037,
    year: 1533,
    name: "The Ambassadors",
    artist: "Hans Holbein the Younger",
    location: "Madrid",
    country: "Spain",
    museum: "Museo Reina Sofía",
  },
  {
    code: "municip5042",
    latitude: 40.416775,
    longitude: -3.7037,
    year: 1937,
    name: "Guernica",
    artist: "Pablo Picasso",
    location: "Madrid",
    country: "Spain",
    museum: "Museo Reina Sofía",
  },
  {
    code: "municip5041",
    latitude: 59.911491,
    longitude: 10.757933,
    year: 1893,
    name: "The Scream",
    artist: "Edvard Munch",
    location: "Oslo",
    country: "Norway",
    museum: "Munch Museum",
  },
  {
    code: "municip5047",
    latitude: 52.078663,
    longitude: 4.288788,
    year: 1665,
    name: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    location: "The Hague",
    country: "Netherlands",
    museum: "Mauritshuis",
  },
  {
    code: "municip5048",
    latitude: 43.7678,
    longitude: 11.2559,
    year: 1486,
    name: "The Birth of Venus",
    artist: "Sandro Botticelli",
    location: "Florence",
    country: "Italy",
    museum: "Uffizi Gallery",
  },
  {
    code: "municip5049",
    latitude: 40.4138,
    longitude: -3.6928,
    year: 1656,
    name: "Las Meninas",
    artist: "Diego Velázquez",
    location: "Madrid",
    country: "Spain",
    museum: "Museo del Prado",
  },
  {
    code: "municip5050",
    latitude: 41.9029,
    longitude: 12.4534,
    year: 1508,
    name: "Creation of Adam",
    artist: "Michelangelo",
    location: "Vatican City",
    country: "Italy",
    museum: "Sistine Chapel",
  },
  {
    code: "municip5051",
    longitude: 4.8854,
    latitude: 52.3702,
    year: 1642,
    name: "The Night Watch",
    artist: "Rembrandt",
    location: "Amsterdam",
    country: "Netherlands",
    museum: "Rijksmuseum",
  },
  {
    code: "municip5052",
    longitude: -73.9776,
    latitude: 40.7615,
    year: 1931,
    name: "The Persistence of Memory",
    artist: "Salvador Dalí",
    location: "New York City",
    country: "Spain",
    museum: "Museum of Modern Art",
  },
  {
    code: "municip5053",
    longitude: 2.3206,
    latitude: 48.861,
    year: 1904,
    name: "The Thinker",
    artist: "Auguste Rodin",
    location: "Paris",
    country: "France",
    museum: "Musée Rodin",
  },
  {
    code: "municip5054",
    longitude: -73.9776,
    latitude: 40.7615,
    year: 1962,
    name: "Campbell's Soup Cans",
    artist: "Andy Warhol",
    location: "New York City",
    country: "United States",
    museum: "Museum of Modern Art",
  },
  {
    code: "municip5055",
    longitude: -99.1332,
    latitude: 19.4326,
    year: 1940,
    name: "Self-Portrait with Thorn Necklace and Hummingbird",
    artist: "Frida Kahlo",
    location: "Mexico City",
    country: "Mexico",
    museum: "Museo Dolores Olmedo",
  },
  {
    code: "municip5056",
    longitude: 139.6917,
    latitude: 35.6895,
    year: 1830,
    name: "The Great Wave off Kanagawa",
    artist: "Hokusai",
    location: "Tokyo",
    country: "Japan",
    museum: "Tokyo National Museum",
  },
  {
    code: "municip5057",
    longitude: -73.9776,
    latitude: 40.7615,
    year: 1909,
    name: "The Dance",
    artist: "Henri Matisse",
    location: "New York City",
    country: "France",
    museum: "Museum of Modern Art",
  },
  {
    code: "municip5058",
    longitude: -118.2437,
    latitude: 34.0522,
    year: 1929,
    name: "The Treachery of Images",
    artist: "René Magritte",
    location: "Los Angeles",
    country: "Belgium",
    museum: "Los Angeles County Museum of Art",
  },
  {
    code: "municip5059",
    longitude: -73.9776,
    latitude: 40.7615,
    year: 1911,
    name: "I and the Village",
    artist: "Marc Chagall",
    location: "New York City",
    country: "Belarus",
    museum: "Museum of Modern Art",
  },
  {
    code: "municip5060",
    name: "The School of Athens",
    artist: "Raphael",
    location: "Vatican City",
    country: "Italy",
    museum: "Apostolic Palace",
    year: 1511,
    latitude: 41.9029,
    longitude: 12.4534,
  },
  {
    code: "municip5061",
    name: "Pietà",
    artist: "Michelangelo",
    location: "Vatican City",
    country: "Italy",
    museum: "St. Peter's Basilica",
    year: 1499,
    latitude: 41.9029,
    longitude: 12.4534,
  },
  {
    code: "municip5062",
    name: "Yellow-Red-Blue",
    artist: "Wassily Kandinsky",
    location: "Paris",
    country: "Russia",
    museum: "Musee National d'Art Moderne",
    year: 1925,
    latitude: 48.860294,
    longitude: 2.338629,
  },
  {
    code: "municip5063",
    name: "The Third of May 1808",
    artist: "Francisco Goya",
    location: "Madrid",
    country: "Spain",
    museum: "Museo del Prado",
    year: 1814,
    latitude: 40.416775,
    longitude: -3.7037,
  },
];

export const countriesWithImage = countries.filter((c) =>
  countryCodesWithImage.includes(c.code.toLowerCase())
);

export function getCountryName(language: string, country: Country) {
  return country.name;
}

export function getMusemName(language: string, country: Country) {
  return country.museum;
}

export function getArtistName(language: string, country: Country) {
  return country.artist;
}

export function getCityName(language: string, country: Country) {
  return country.location;
}

export function getCountryCountry(country: Country) {
  return country.country;
}

export function sanitizeCountryName(countryName: string): string {
  return countryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[- '()]/g, "")
    .toLowerCase();
}

export function getYear(country: Country) {
  return country.year; //type: number
}
