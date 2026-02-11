interface KhmerYearInfo {
  gregorianYear: number;
  buddhistEra: number;
  animalYear: string;
  animalYearKm: string;
}

// 12-year animal zodiac cycle aligned to Gregorian year
const ANIMALS = [
  { en: "Year of the Monkey",  km: "ឆ្នាំវក" },
  { en: "Year of the Rooster", km: "ឆ្នាំរកា" },
  { en: "Year of the Dog",     km: "ឆ្នាំច" },
  { en: "Year of the Pig",     km: "ឆ្នាំកុរ" },
  { en: "Year of the Rat",     km: "ឆ្នាំជូត" },
  { en: "Year of the Ox",      km: "ឆ្នាំឆ្លូវ" },
  { en: "Year of the Tiger",   km: "ឆ្នាំខាល" },
  { en: "Year of the Rabbit",  km: "ឆ្នាំថោះ" },
  { en: "Year of the Dragon",  km: "ឆ្នាំរោង" },
  { en: "Year of the Snake",   km: "ឆ្នាំម្សាញ់" },
  { en: "Year of the Horse",   km: "ឆ្នាំមមី" },
  { en: "Year of the Goat",    km: "ឆ្នាំមមែ" },
];

/**
 * Calculate Khmer year info from any Gregorian year.
 * No database needed — pure calculation.
 *
 * Buddhist Era = Gregorian + 544
 * Animal cycle = Gregorian year % 12 (aligned so 2016 = Monkey)
 */
export function getKhmerYearInfo(gregorianYear: number): KhmerYearInfo {
  const buddhistEra = gregorianYear + 544;
  const animal = ANIMALS[gregorianYear % 12];

  return {
    gregorianYear,
    buddhistEra,
    animalYear: animal.en,
    animalYearKm: animal.km,
  };
}

/**
 * Get Khmer year info for a range of years.
 */
export function getKhmerYearRange(
  startYear: number,
  endYear: number
): KhmerYearInfo[] {
  const results: KhmerYearInfo[] = [];
  for (let year = startYear; year <= endYear; year++) {
    results.push(getKhmerYearInfo(year));
  }
  return results;
}