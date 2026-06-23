/**
 * Curated multi-syllable words with kid-friendly chunk splits.
 * `chunks` length is the syllable count used for difficulty filtering.
 */
export const BIG_WORDS = [
  // Easy — 3 syllables
  { word: 'banana', chunks: ['ba', 'na', 'na'] },
  { word: 'tomato', chunks: ['to', 'ma', 'to'] },
  { word: 'animal', chunks: ['an', 'i', 'mal'] },
  { word: 'family', chunks: ['fam', 'i', 'ly'] },
  { word: 'bicycle', chunks: ['bi', 'cy', 'cle'] },
  { word: 'dinosaur', chunks: ['di', 'no', 'saur'] },
  { word: 'umbrella', chunks: ['um', 'brel', 'la'] },
  { word: 'elephant', chunks: ['el', 'e', 'phant'] },
  { word: 'hospital', chunks: ['hos', 'pi', 'tal'] },
  { word: 'pineapple', chunks: ['pine', 'ap', 'ple'] },
  { word: 'chocolate', chunks: ['choc', 'o', 'late'] },
  { word: 'kangaroo', chunks: ['kan', 'ga', 'roo'] },
  // Easy — 4 syllables
  { word: 'butterfly', chunks: ['but', 'ter', 'fly'] },
  { word: 'watermelon', chunks: ['wa', 'ter', 'mel', 'on'] },
  { word: 'celebration', chunks: ['cel', 'e', 'bra', 'tion'] },
  { word: 'adventure', chunks: ['ad', 'ven', 'ture'] },
  { word: 'telephone', chunks: ['tel', 'e', 'phone'] },
  { word: 'vegetable', chunks: ['veg', 'e', 'ta', 'ble'] },
  { word: 'helicopter', chunks: ['hel', 'i', 'cop', 'ter'] },
  { word: 'caterpillar', chunks: ['cat', 'er', 'pil', 'lar'] },
  { word: 'refrigerator', chunks: ['re', 'frig', 'er', 'a', 'tor'] },
  // Medium — 5 syllables
  { word: 'imagination', chunks: ['im', 'ag', 'i', 'na', 'tion'] },
  { word: 'opportunity', chunks: ['op', 'por', 'tu', 'ni', 'ty'] },
  { word: 'multiplication', chunks: ['mul', 'ti', 'pli', 'ca', 'tion'] },
  { word: 'accidentally', chunks: ['ac', 'ci', 'den', 'tal', 'ly'] },
  { word: 'electricity', chunks: ['e', 'lec', 'tric', 'i', 'ty'] },
  { word: 'pronunciation', chunks: ['pro', 'nun', 'ci', 'a', 'tion'] },
  { word: 'encyclopedia', chunks: ['en', 'cy', 'clo', 'pe', 'di', 'a'] },
  { word: 'responsibility', chunks: ['re', 'spon', 'si', 'bil', 'i', 'ty'] },
  // Medium — 6–7 syllables
  { word: 'extraordinary', chunks: ['ex', 'tra', 'or', 'di', 'na', 'ry'] },
  { word: 'communication', chunks: ['com', 'mu', 'ni', 'ca', 'tion'] },
  { word: 'environmental', chunks: ['en', 'vi', 'ron', 'men', 'tal'] },
  { word: 'characteristic', chunks: ['char', 'ac', 'ter', 'is', 'tic'] },
  { word: 'revolutionary', chunks: ['rev', 'o', 'lu', 'tion', 'ar', 'y'] },
  { word: 'individuality', chunks: ['in', 'di', 'vid', 'u', 'al', 'i', 'ty'] },
  { word: 'international', chunks: ['in', 'ter', 'na', 'tion', 'al'] },
  // Hard — 8 syllables
  { word: 'incomprehensibility', chunks: ['in', 'com', 'pre', 'hen', 'si', 'bil', 'i', 'ty'] },
  { word: 'internationalization', chunks: ['in', 'ter', 'na', 'tion', 'al', 'i', 'za', 'tion'] },
  { word: 'uncharacteristically', chunks: ['un', 'char', 'ac', 'ter', 'is', 'ti', 'cal', 'ly'] },
  { word: 'individualization', chunks: ['in', 'di', 'vid', 'u', 'al', 'i', 'za', 'tion'] },
  { word: 'institutionalization', chunks: ['in', 'sti', 'tu', 'tion', 'al', 'i', 'za', 'tion'] },
  { word: 'operationalization', chunks: ['op', 'er', 'a', 'tion', 'al', 'i', 'za', 'tion'] },
  { word: 'unintelligibility', chunks: ['un', 'in', 'tel', 'lig', 'i', 'bil', 'i', 'ty'] },
  // Hard — 9–10 syllables
  { word: 'overcommercialization', chunks: ['o', 'ver', 'com', 'mer', 'cial', 'i', 'za', 'tion'] },
  { word: 'interdisciplinary', chunks: ['in', 'ter', 'dis', 'ci', 'pli', 'nar', 'y'] },
  { word: 'misinterpretation', chunks: ['mis', 'in', 'ter', 'pre', 'ta', 'tion'] },
  { word: 'electrification', chunks: ['e', 'lec', 'tri', 'fi', 'ca', 'tion'] },
  { word: 'personalization', chunks: ['per', 'son', 'al', 'i', 'za', 'tion'] },
  { word: 'deindustrialization', chunks: ['de', 'in', 'dus', 'tri', 'al', 'i', 'za', 'tion'] },
];

const DIFF_RANGES = {
  easy: { min: 3, max: 4 },
  medium: { min: 5, max: 7 },
  hard: { min: 8, max: 10 },
};

export function wordsForDifficulty(difficulty) {
  const range = DIFF_RANGES[difficulty] || DIFF_RANGES.medium;
  return BIG_WORDS.filter((entry) => {
    const count = entry.chunks.length;
    return count >= range.min && count <= range.max;
  });
}
