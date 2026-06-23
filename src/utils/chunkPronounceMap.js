/**
 * CHUNK_PRONOUNCE_MAP
 *
 * Maps display chunks (as shown in the UI) to TTS-friendly pronunciations.
 * Based on UK Letters and Sounds phonics phases (Oxford Owl / DfE).
 *
 * Usage:
 *   import { getPronounceable } from './chunkPronounceMap.js';
 *   await speakTextAndWait(getPronounceable(chunk), { rate: 0.85 });
 */

export const CHUNK_PRONOUNCE_MAP = {

    // ─── SHORT VOWELS ──────────────────────────────────────────────────────────
    // TTS tends to read single vowel chunks correctly already,
    // but these override edge cases where it doesn't.
    "a":   "ah",      // short a as in "cat"
    "e":   "eh",      // short e as in "pet"
    "i":   "ih",      // short i as in "sit"  ← the "family" problem: "i" → "eye"
    "o":   "oh",      // short o as in "hot"
    "u":   "uh",      // short u as in "cup"
  
    // ─── LONG VOWELS / SILENT E ────────────────────────────────────────────────
    "a-e": "ay",      // make, game
    "e-e": "ee",      // these, extreme
    "i-e": "iy",      // like, time
    "o-e": "oh",      // home, bone
    "u-e": "yoo",     // rule, flute
  
    // ─── VOWEL DIGRAPHS & TRIGRAPHS ────────────────────────────────────────────
    "ai":  "ay",      // rain, tail
    "ay":  "ay",      // day, play
    "ea":  "ee",      // sea, meat
    "ee":  "ee",      // bee, see
    "ie":  "eye",     // pie, tie
    "igh": "eye",     // high, night
    "oa":  "oh",      // boat, toad
    "oe":  "oh",      // toe, foe
    "oo":  "oo",      // boot, moon (long oo)
    "ou":  "ow",      // cloud, sound
    "ow":  "ow",      // cow, town  (short ow)
    "oi":  "oy",      // coin, oil
    "oy":  "oy",      // toy, boy
    "ue":  "yoo",     // blue, glue
    "ew":  "yoo",     // new, flew
    "aw":  "aw",      // paw, yawn
    "au":  "aw",      // Paul, haul
    "ar":  "ar",      // park, car
    "or":  "or",      // for, fork
    "ur":  "er",      // hurt, fur
    "ir":  "er",      // bird, shirt
    "er":  "er",      // dinner, letter  (schwa/er)
    "ear": "eer",     // dear, year
    "air": "air",     // fair, hair
    "ure": "yoor",    // sure, pure
  
    // ─── CONSONANT DIGRAPHS ────────────────────────────────────────────────────
    "ch":  "ch",      // chip  (TTS usually fine)
    "sh":  "sh",      // shop  (TTS usually fine)
    "th":  "th",      // thin / that  (TTS usually fine)
    "ng":  "ng",      // ring, song
    "qu":  "kw",      // quick, quit
    "ph":  "ff",      // photo, dolphin
    "wh":  "w",       // wheel, whisper
    "hw":  "w",       // alternative spelling of wh
  
    // ─── COMMON SUFFIXES (the biggest TTS problem area) ───────────────────────
    "ly":   "lee",    // family → fam-ee-lee  ← the reported bug
    "le":   "ul",     // little, table
    "el":   "ul",     // camel, tunnel
    "al":   "ul",     // petal, total
    "tion": "shun",   // nation, action
    "sion": "zhun",   // vision, division
    "cian": "shun",   // musician
    "tial": "shul",   // partial, special
    "cial": "shul",   // social, special
    "ture": "cher",   // picture, nature
    "sure": "zher",   // measure, treasure
    "ous":  "us",     // famous, nervous
    "ious": "ee-us",  // various, serious
    "eous": "ee-us",  // gorgeous
    "ful":  "ful",    // careful
    "less": "les",    // careless
    "ness": "nes",    // sadness
    "ment": "munt",   // moment
    "ing":  "ing",    // running
    "ed":   "d",      // jumped (when silent e)
    "er":   "er",     // bigger, runner
    "est":  "est",    // biggest
    "en":   "un",     // golden, frozen
    "on":   "un",     // button, cotton
    "age":  "ij",     // village, cabbage
    "ace":  "us",     // surface, furnace
    "ance": "unts",   // distance, balance
    "ence": "unts",   // sentence, silence
    "ive":  "iv",     // active, creative
    "tion": "shun",   // repetition (duplicate for safety)
  
    // ─── COMMON PREFIXES ───────────────────────────────────────────────────────
    "re":   "ree",    // return, repeat
    "pre":  "pree",   // prefix, prepare
    "un":   "un",     // unhappy
    "dis":  "dis",    // discover
    "mis":  "mis",    // mistake
    "ex":   "ex",     // extra, example
    "in":   "in",     // inside
    "im":   "im",     // impossible
    "com":  "cum",    // computer, complete
    "con":  "kun",    // control, connect
    "pro":  "proh",   // protect, produce
    "de":   "dee",    // decide, describe
    "be":   "bee",    // belong, because
    "per":  "per",    // perhaps, person
    "sub":  "sub",    // subject, subtract
    "super":"sooper", // supermarket
  
    // ─── COMMON SYLLABLE CHUNKS (from typical big-words word lists) ────────────
    "fam":  "fam",
    "ily":  "ih-lee",
    "fa":   "fah",
    "mi":   "mee",
    "tion": "shun",
    "ti":   "tee",
    "tain": "tun",    // mountain, certain
    "ain":  "un",     // mountain → moun-tun
    "ous":  "us",
    "ful":  "ful",
    "ness": "nes",
    "ment": "munt",
    "cal":  "kul",    // medical, musical
    "ical": "ih-kul", // magical, musical
    "ble":  "bul",    // able, table
    "ple":  "pul",    // simple, purple
    "tle":  "tul",    // little, bottle
    "kle":  "kul",    // wrinkle, crinkle
    "gle":  "gul",    // jungle, single
    "fle":  "ful",    // shuffle, ruffle
    "zle":  "zul",    // puzzle, fizzle
    "dge":  "j",      // bridge, hedge
    "tch":  "ch",     // watch, match
    "ck":   "k",      // back, kick
    "ff":   "f",      // off, stuff
    "ll":   "l",      // bell, fall
    "ss":   "s",      // miss, boss
    "zz":   "z",      // buzz, jazz
  
    // ─── SCHWA SOUNDS ─────────────────────────────────────────────────────────
    // Schwa is the unstressed "uh" sound — very common in English
    "a":    "uh",     // about, sofa  (when unstressed — overrides short-a above
                      //  only in context; map lookup is positional so keep both)
    "the":  "thuh",   // unstressed "the"
  };
  
  /**
   * Returns a TTS-friendly pronunciation string for a given chunk.
   * Falls back to the original chunk if no mapping exists.
   *
   * @param {string} chunk - The display chunk (e.g. "ly", "tion", "fam")
   * @returns {string} - The pronunciation hint for TTS (e.g. "lee", "shun", "fam")
   */
  export function getPronounceable(chunk) {
    if (!chunk) return chunk;
    const key = chunk.toLowerCase().trim();
    return CHUNK_PRONOUNCE_MAP[key] ?? chunk;
  }