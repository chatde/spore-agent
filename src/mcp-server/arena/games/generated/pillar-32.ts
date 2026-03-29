// Auto-generated — Pillar 32: Metadata Preservation (25 games)
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function has(s: string, words: string[]): boolean { const l = s.toLowerCase(); return words.some(w => l.includes(w)); }
function reasonScore(answer: string): number { let sc = 0; if (wc(answer) > 20) sc += 25; if (wc(answer) > 50) sc += 15; if (has(answer, ['because','therefore','however','specifically'])) sc += 20; if (has(answer, ['1.','2.','3.','step','first'])) sc += 15; if (new Set(answer.split(/\s+/)).size > 15) sc += 25; return clamp(sc); }

function textGame(cfg: { prompts: ((d: number, r: number) => string)[]; score: (answer: string, d: number) => number; deadline?: number; }): GameEngine {
  return {
    generateConfig: (d) => ({ difficulty: Math.max(1, Math.min(10, d)) }),
    startRound: (match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt => {
      const r = (match.round_data?.length ?? 0) + 1;
      const d = challenge.difficulty ?? 3;
      return { round_number: r, prompt: cfg.prompts[(r - 1) % cfg.prompts.length](d, r), deadline_seconds: cfg.deadline ?? 120 };
    },
    scoreSubmission: async (match: ArenaMatch, challenge: ArenaChallenge, submission: unknown): Promise<ScoreResult> => {
      const answer = typeof submission === 'string' ? submission : (submission as Record<string, unknown>)?.answer as string ?? JSON.stringify(submission);
      const d = challenge.difficulty ?? 3;
      const score = clamp(cfg.score(answer || '', d));
      const rn = (match.round_data?.length ?? 0) + 1;
      return { score, feedback: `Score: ${score}/100`, round_complete: true, game_complete: rn >= 3, updated_round_data: [...(match.round_data || []), { score, answer: (answer || '').slice(0, 200) }] };
    },
  };
}


export const P32_EXT: Record<string, GameEngine> = {
  'metadata_preservation_01': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User T`,
      (d, r) => `{'round': 2, 'challenge': "A university library is digitizing a collection of 19th-century letters.  Each letter's digital representation includes: Original File Name, Transcription (text of the lette`,
      (d, r) => `{'round': 3, 'challenge': "You are archiving a large collection of video game ROMs. Each ROM has the following metadata: ROM Filename, Game Title, Developer, Publisher, Release Year, Genre, Region (e.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_02': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, ori`,
      (d, r) => `{'round': 2, 'challenge': 'You are managing a digital library of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords,`,
      (d, r) => `{'round': 3, 'challenge': 'You are building a long-term digital preservation system for a collection of born-digital art (e.g., interactive installations, net art, digital video).  Metadata includes: `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_03': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, ori`,
      (d, r) => `{'round': 2, 'challenge': 'A scientific dataset contains measurements from a series of environmental sensors. The metadata includes: sensor ID, timestamp, latitude, longitude, altitude, sensor type, m`,
      (d, r) => `{'round': 3, 'challenge': 'You are archiving a collection of born-digital art pieces (images, videos, interactive installations).  The metadata includes: title, artist, creation date, file format, fil`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_04': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, ori`,
      (d, r) => `{'round': 2, 'challenge': "You are managing a digital library of audio recordings of oral histories.  Metadata includes: recording date, interviewer, interviewee, location, transcript (full text), key`,
      (d, r) => `{'round': 3, 'challenge': 'A scientific research project has generated a large dataset of climate model outputs. Metadata includes: model version, simulation parameters (many!), data format, creation `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_05': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter spe`,
      (d, r) => `{'round': 2, 'challenge': "You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes author, creation date, modification date, fil`,
      (d, r) => `{'round': 3, 'challenge': "You are building a digital repository for research data.  Datasets are accompanied by metadata including dataset title, author(s), date created, data format, license informa`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_06': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User T`,
      (d, r) => `{'round': 2, 'challenge': "You are archiving a collection of early digital documents (Word .doc files) from the 1990s.  The metadata includes: Author, Date Created, Date Modified, Last Saved By, Revis`,
      (d, r) => `{'round': 3, 'challenge': "You are tasked with archiving a large dataset of scientific research data (sensor readings, experimental results) stored in a custom file format. The metadata includes: Expe`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_07': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are archiving a collection of digital photographs from a local historical society. Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordin`,
      (d, r) => `{'round': 2, 'challenge': "You are tasked with migrating a large database of scientific research papers from a proprietary format to a more open standard (e.g., Dublin Core). The original database inc`,
      (d, r) => `{'round': 3, 'challenge': 'Imagine you are building a digital archive for a collection of born-digital art installations. These installations are highly complex, often involving software, video, audio`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_08': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter spe`,
      (d, r) => `{'round': 2, 'challenge': 'You are archiving a collection of early digital documents (Word .doc files) from the 1990s.  The files contain author, creation date, last modified date, revision number, an`,
      (d, r) => `{'round': 3, 'challenge': 'A museum is digitizing a collection of audio recordings of oral histories. Each recording has metadata including speaker names, interviewer name, date of interview, location`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_09': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter spe`,
      (d, r) => `{'round': 2, 'challenge': "A university library is digitizing a collection of 19th-century letters.  Metadata options include: author, recipient, date written, date received, place written, place rece`,
      (d, r) => `{'round': 3, 'challenge': "You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take n`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_10': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  The photos are JPEGs, and each has EXIF data including camera model, date taken, GPS coordinates, `,
      (d, r) => `{'round': 2, 'challenge': "A university library is digitizing a collection of 19th-century letters. They are creating TIFF images of each letter.  They are considering adding the following metadata: o`,
      (d, r) => `{'round': 3, 'challenge': 'You are archiving a large collection of born-digital documents (Word documents, spreadsheets, PDFs) created by a government agency.  These documents contain sensitive inform`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_11': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no `,
      (d, r) => `{'round': 2, 'challenge': 'You are archiving a large dataset of scientific research papers. Each paper has metadata including: author names, publication date, journal title, DOI, abstract, keywords, f`,
      (d, r) => `{'round': 3, 'challenge': "A museum is digitizing its collection of historical textiles.  Each textile record currently includes: accession number, title, artist/maker (if known), date of creation (es`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_12': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User T`,
      (d, r) => `{'round': 2, 'challenge': "You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes: Author, Creation Date, Modification Date, Fi`,
      (d, r) => `{'round': 3, 'challenge': "You are tasked with preserving a complex dataset of scientific research data (e.g., sensor readings, experimental results). Metadata includes: Instrument Serial Number, Data`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_13': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no `,
      (d, r) => `{'round': 2, 'challenge': 'You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, p`,
      (d, r) => `{'round': 3, 'challenge': 'You are tasked with preserving a collection of early digital art created using now-obsolete software. The files include metadata generated by the software (e.g., brush setti`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_14': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User C`,
      (d, r) => `{'round': 2, 'challenge': 'A university library is digitizing a collection of 19th-century letters.  Metadata includes: Sender, Recipient, Date Written, Place Written, Paper Type, Ink Color, Watermark`,
      (d, r) => `{'round': 3, 'challenge': 'You are archiving a large collection of born-digital video game assets (textures, models, sound files, code). Metadata includes: File Name, File Size, Creation Date, Last Mo`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_15': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no `,
      (d, r) => `{'round': 2, 'challenge': "You are archiving a large dataset of scientific research papers. Each paper has metadata including: Author, Title, Abstract, Publication Date, Journal, DOI, Keywords, Fundin`,
      (d, r) => `{'round': 3, 'challenge': "You are tasked with preserving a collection of early digital art created using a now-obsolete software program. The files include metadata like creation date, software versi`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_16': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  The photos are JPEGs, and each has EXIF data including camera model, date taken, GPS coordinates, `,
      (d, r) => `{'round': 2, 'challenge': "You are archiving a collection of born-digital documents (Word, PDF, spreadsheets) created by a government agency.  These documents contain metadata like author, creation da`,
      (d, r) => `{'round': 3, 'challenge': 'You are building a digital repository for scientific research data.  The data includes datasets in various formats (CSV, NetCDF, HDF5) along with associated metadata describ`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_17': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User C`,
      (d, r) => `{'round': 2, 'challenge': "You are archiving a collection of early digital documents (Word .doc files) from the 1990s.  The metadata includes: Author, Date Created, Date Modified, Last Saved By, Revis`,
      (d, r) => `{'round': 3, 'challenge': "You are building a digital library of scientific research papers (PDFs).  Metadata includes: Title, Authors, Abstract, Keywords, DOI, Journal Name, Publication Date, File Si`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_18': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no `,
      (d, r) => `{'round': 2, 'challenge': 'You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, p`,
      (d, r) => `{'round': 3, 'challenge': "You are tasked with preserving a collection of early digital art created using now-obsolete software. The files include metadata about the software version used, the artist'`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_19': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User T`,
      (d, r) => `{'round': 2, 'challenge': "A university library is digitizing a collection of 19th-century letters.  Each letter is scanned and has the following metadata: Scan Filename, Date of Letter (if discernibl`,
      (d, r) => `{'round': 3, 'challenge': 'You are archiving a large collection of video game ROMs (read-only memory). Each ROM has the following metadata: ROM Filename, Game Title, Developer, Publisher, Release Year`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_20': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs with embedded EXIF data. The society wants to be able to s`,
      (d, r) => `{'round': 2, 'challenge': 'You are tasked with preserving a collection of born-digital documents (Word, PDF, spreadsheets) created by a government agency.  These documents contain sensitive informatio`,
      (d, r) => `{'round': 3, 'challenge': 'You are building a digital repository for a collection of audio recordings (interviews, oral histories).  The recordings are in various formats (WAV, MP3). Metadata includes`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_21': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs with embedded EXIF data. The society wants to be able to s`,
      (d, r) => `{'round': 2, 'challenge': 'You are managing a digital library of scientific research papers (PDFs). Each paper has associated metadata including author(s), publication date, journal, DOI, abstract, ke`,
      (d, r) => `{'round': 3, 'challenge': 'You are tasked with archiving a large collection of born-digital art created using a now-obsolete software package. The files include the artwork itself, along with project `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_22': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are archiving a collection of digital photographs from a local historical society. Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordin`,
      (d, r) => `{'round': 2, 'challenge': "You are managing a digital library of scientific research papers. Each paper has metadata including: Title, Authors, Abstract, Publication Date, Journal Name, DOI, Keywords,`,
      (d, r) => `{'round': 3, 'challenge': "You are tasked with preserving a large collection of born-digital video game assets (textures, models, sound files, code). Each asset has extensive metadata, including: Crea`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_23': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs, and the existing metadata includes: filename, date taken `,
      (d, r) => `{'round': 2, 'challenge': "You are tasked with migrating a large database of scientific research papers (PDFs) to a new digital repository. The current metadata includes: Title, Author(s), Abstract, D`,
      (d, r) => `{'round': 3, 'challenge': "A museum is digitizing its collection of antique textiles. Each textile has a complex provenance history, documented in a detailed database. The metadata includes: Object ID`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_24': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've digitized a collection of old family photographs. The digital files include EXIF data (camera settings, date/time, GPS location) and IPTC data (creator, copyright, de`,
      (d, r) => `{'round': 2, 'challenge': "A museum is digitizing a collection of historical maps. Each map has associated metadata including: Title, Creator, Date Created, Geographic Coordinates (bounding box), Scal`,
      (d, r) => `{'round': 3, 'challenge': 'You are archiving a large dataset of scientific research data (e.g., climate models, genomic sequences). The data includes metadata describing the experiment setup, data pro`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_25': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You've inherited a digital photo archive from a local historical society.  The photos are JPEGs, and each has EXIF data including camera model, date taken, GPS coordinates, `,
      (d, r) => `{'round': 2, 'challenge': "A university library is digitizing a collection of 19th-century letters. They are creating TIFF images of the letters and generating OCR text.  They also have information ab`,
      (d, r) => `{'round': 3, 'challenge': 'You are managing a large database of scientific research data (e.g., climate models, genomic sequences).  The data is stored in a custom file format.  You need to create a m`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P32_META = { name: 'Metadata Preservation', icon: '🎯', color: 'text-amber-400', games: Object.keys(P32_EXT) };