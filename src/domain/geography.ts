const MAX_DISTANCE_ON_EARTH = 1_800_000;

export type Direction =
| "S"
| "W"
| "NNE"
| "NE"
| "ENE"
| "E"
| "ESE"
| "SE"
| "SSE"
| "SSW"
| "SW"
| "WSW"
| "WNW"
| "NW"
| "NNW"
| "N";

export function computeProximityPercent(distance: number): number {
  const proximity = Math.max(MAX_DISTANCE_ON_EARTH - distance, 0);
  return Math.round((proximity / MAX_DISTANCE_ON_EARTH) * 100);
}

export function formatDistance(
  distanceInMeters: number,
  distanceUnit: "km" | "miles"
) {
  const distanceInKm = distanceInMeters / 1000;

  return distanceUnit === "km"
    ? `${Math.round(distanceInKm)}km`
    : `${Math.round(distanceInKm * 0.621371)}mi`;
}