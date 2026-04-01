import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
function has(s: string, words: string[]): boolean {
  const l = s.toLowerCase();
  return words.some(w => l.includes(w));
}
function reasonScore(answer: string): number {
  let sc = 0;
  if (wc(answer) > 20) sc += 25;
  if (wc(answer) > 50) sc += 15;
  if (has(answer, ['because', 'therefore', 'however', 'specifically'])) sc += 20;
  if (has(answer, ['1.', '2.', '3.', 'step', 'first'])) sc += 15;
  if (new Set(answer.split(/\s+/)).size > 15) sc += 25;
  return clamp(sc);
}

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
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Tags. Describe how you would organize and preserve this metadata for long-term access.`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Each letter's digital representation includes: Original File Name, Transcription (text of the letter), Image File Format, Date Received. What metadata schema would you use to represent this information, and why?`,
      (d, r) => `You are archiving a large collection of video game ROMs. Each ROM has the following metadata: ROM Filename, Game Title, Developer, Publisher, Release Year, Genre, Region. How would you handle potential conflicts or inconsistencies in this metadata?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_02': textGame({
    prompts: [
      (d, r) => `You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, original physical size. What key considerations for ensuring the authenticity and integrity of this metadata?`,
      (d, r) => `A university library is digitizing a collection of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle versioning and updates to this metadata over time?`,
      (d, r) => `You are archiving a collection of born-digital art (images, videos, interactive installations).  Metadata includes: title, artist, creation date, file format, file size, software dependencies. What challenges do you anticipate in preserving the meaning and context of this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_03': textGame({
    prompts: [
      (d, r) => `You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, original physical size. Discuss the importance of using controlled vocabularies and standardized metadata formats.`,
      (d, r) => `A scientific dataset contains measurements from a series of environmental sensors. The metadata includes: sensor ID, timestamp, latitude, longitude, altitude, sensor type, measurement units. How would you ensure the interoperability of this metadata with other datasets?`,
      (d, r) => `You are archiving a collection of born-digital art pieces (images, videos, interactive installations).  The metadata includes: title, artist, creation date, file format, file size, software dependencies. What strategies would you use to address the issue of bit rot and data corruption?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_04': textGame({
    prompts: [
      (d, r) => `You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, original physical size. Explain the concept of metadata provenance and why it is important.`,
      (d, r) => `You are managing a digital library of audio recordings of oral histories.  Metadata includes: recording date, interviewer, interviewee, location, transcript (full text), key topics discussed. How would you handle sensitive or confidential information contained in the transcripts?`,
      (d, r) => `A scientific research project has generated a large dataset of climate model outputs. Metadata includes: model version, simulation parameters (many!), data format, creation date, author, funding sources. What are the challenges of preserving the reproducibility of this research?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_05': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS Coordinates, User Tags. Describe how you would organize and preserve this metadata for long-term access.`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes author, creation date, modification date, file size. What are the legal and ethical considerations related to preserving and providing access to these documents?`,
      (d, r) => `You are building a long-term digital preservation system for a collection of born-digital art (e.g., interactive installations, net art, digital video).  Metadata includes: title, artist, creation date, file format, file size, software dependencies. What challenges do you anticipate in preserving the meaning and context of this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_06': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. Describe a strategy for automatically extracting and validating metadata from these images.`,
      (d, r) => `You are archiving a collection of born-digital documents (Word .doc files) from the 1990s.  The metadata includes: Author, Date Created, Date Modified, Revision Number, File Size. What are the challenges of preserving these documents in their original format?`,
      (d, r) => `You are tasked with archiving a large collection of video game ROMs (read-only memory). Each ROM has the following metadata: ROM Filename, Game Title, Developer, Publisher, Release Year, Genre, Region. How would you handle potential conflicts or inconsistencies in this metadata?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_07': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. Each photo has EXIF data including camera model, date taken, GPS Coordinates, aperture, shutter speed. What are the potential privacy concerns associated with this metadata?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes: Author, Creation Date, Modification Date, File Size, File Type. How would you ensure the confidentiality of this information?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to facilitate video editing and post-production?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_08': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you create a backup and disaster recovery plan for this archive?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes: Author, Creation Date, Modification Date, File Size, File Type. What are the best practices for securing this data against unauthorized access?`,
      (d, r) => `You are tasked with preserving a collection of born-digital art (e.g., interactive installations, net art, digital video).  Metadata includes: title, artist, creation date, file format, file size, software dependencies. What challenges do you anticipate in preserving the meaning and context of this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_09': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The digital files include EXIF data (camera settings, date/time, GPS location) and IPTC data (creator, copyright, description). How would you use this metadata to create a family history website?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to study the social and cultural history of the period?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_10': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you use crowdsourcing to help identify the people and places in the photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle papers that have been retracted or corrected?`,
      (d, r) => `You are tasked with preserving a collection of born-digital art created using a now-obsolete software package. The files include metadata about the software version used, the artist's name, and the creation date. How would you create an emulation environment to allow users to experience this art as it was originally intended?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_11': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a timeline of events?`,
      (d, r) => `You are archiving a collection of 19th-century letters.  Metadata options include: author, recipient, date written, place written, paper type, ink color, watermark. What are the challenges of accurately transcribing and interpreting handwritten metadata?`,
      (d, r) => `You are building a digital repository for a collection of scientific research data (e.g., climate models, genomic sequences).  The data is stored in a custom file format.  Metadata includes: experiment ID, data type, units of measurement, calibration information. How would you ensure the authenticity and integrity of this data?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_12': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. What are the ethical considerations of adding metadata to these photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, publication date. How would you handle conflicting or incomplete metadata?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using a now-obsolete software package. The files include metadata about the software version used, the artist's name, and the creation date. How would you document the software environment required to run this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_13': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a virtual tour of the locations where the photos were taken?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to create a searchable database of the letters?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_14': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The digital files include EXIF data (camera settings, date/time, GPS location) and IPTC data (creator, copyright, description). How would you use this metadata to create a family history website?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to study the social and cultural history of the period?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_15': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you use crowdsourcing to help identify the people and places in the photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle papers that have been retracted or corrected?`,
      (d, r) => `You are tasked with preserving a collection of born-digital art created using now-obsolete software. The files include metadata about the software version used, the artist's name, and the creation date. How would you create an emulation environment to allow users to experience this art as it was originally intended?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_16': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a timeline of events?`,
      (d, r) => `You are archiving a collection of 19th-century letters.  Metadata options include: author, recipient, date written, place written, paper type, ink color, watermark. What are the challenges of accurately transcribing and interpreting handwritten metadata?`,
      (d, r) => `You are building a digital repository for a collection of scientific research data (e.g., climate models, genomic sequences).  The data is stored in a custom file format.  Metadata includes: experiment ID, data type, units of measurement, calibration information. How would you ensure the authenticity and integrity of this data?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_17': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. What are the ethical considerations of adding metadata to these photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, publication date. How would you handle conflicting or incomplete metadata?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using a now-obsolete software package. The files include metadata about the software version used, the artist's name, and the creation date. How would you document the software environment required to run this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_18': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a virtual tour of the locations where the photos were taken?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to create a searchable database of the letters?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_19': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs, and the existing metadata includes: filename, date taken, camera model, GPS coordinates. How would you use this metadata to create a searchable database of the photos?`,
      (d, r) => `You are tasked with migrating a large database of scientific research papers (PDFs) to a new digital repository. The current metadata includes: Title, Author(s), Abstract, DOI, Journal, Keywords, Publication Date. What are the potential risks and challenges of this migration process?`,
      (d, r) => `A museum is digitizing its collection of historical textiles. Each textile has a complex provenance history, documented in a detailed database. The metadata includes: Object ID, Title, Artist/Maker, Date of Creation, Materials, Dimensions, Provenance. How would you ensure the long-term preservation of this provenance information?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_20': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The digital files include EXIF data (camera settings, date/time, GPS location) and IPTC data (creator, copyright, description). How would you use this metadata to create a family history website?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to study the social and cultural history of the period?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_21': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you use crowdsourcing to help identify the people and places in the photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle papers that have been retracted or corrected?`,
      (d, r) => `You are tasked with preserving a collection of born-digital art created using now-obsolete software. The files include metadata about the software version used, the artist's name, and the creation date. How would you create an emulation environment to allow users to experience this art as it was originally intended?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_22': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a timeline of events?`,
      (d, r) => `You are archiving a collection of 19th-century letters.  Metadata options include: author, recipient, date written, place written, paper type, ink color, watermark. What are the challenges of accurately transcribing and interpreting handwritten metadata?`,
      (d, r) => `You are building a digital repository for a collection of scientific research data (e.g., climate models, genomic sequences).  The data is stored in a custom file format.  Metadata includes: experiment ID, data type, units of measurement, calibration information. How would you ensure the authenticity and integrity of this data?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_23': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. What are the ethical considerations of adding metadata to these photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, publication date. How would you handle conflicting or incomplete metadata?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using a now-obsolete software package. The files include metadata about the software version used, the artist's name, and the creation date. How would you document the software environment required to run this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_24': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a virtual tour of the locations where the photos were taken?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to create a searchable database of the letters?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_25': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs, and the existing metadata includes: filename, date taken, camera model, GPS coordinates. How would you use this metadata to create a searchable database of the photos?`,
      (d, r) => `You are tasked with migrating a large database of scientific research papers (PDFs) to a new digital repository. The current metadata includes: Title, Author(s), Abstract, DOI, Journal, Keywords, Publication Date. What are the potential risks and challenges of this migration process?`,
      (d, r) => `A museum is digitizing its collection of historical textiles. Each textile has a complex provenance history, documented in a detailed database. The metadata includes: Object ID, Title, Artist/Maker, Date of Creation, Materials, Dimensions, Provenance. How would you ensure the long-term preservation of this provenance information?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_26': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The digital files include EXIF data (camera settings, date/time, GPS location) and IPTC data (creator, copyright, description). How would you use this metadata to create a family history website?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to study the social and cultural history of the period?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_27': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you use crowdsourcing to help identify the people and places in the photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle papers that have been retracted or corrected?`,
      (d, r) => `You are tasked with preserving a collection of born-digital art created using now-obsolete software. The files include metadata about the software version used, the artist's name, and the creation date. How would you create an emulation environment to allow users to experience this art as it was originally intended?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_28': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a timeline of events?`,
      (d, r) => `You are archiving a collection of 19th-century letters.  Metadata options include: author, recipient, date written, place written, paper type, ink color, watermark. What are the challenges of accurately transcribing and interpreting handwritten metadata?`,
      (d, r) => `You are building a digital repository for a collection of scientific research data (e.g., climate models, genomic sequences).  The data is stored in a custom file format.  Metadata includes: experiment ID, data type, units of measurement, calibration information. How would you ensure the authenticity and integrity of this data?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_29': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. What are the ethical considerations of adding metadata to these photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, publication date. How would you handle conflicting or incomplete metadata?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using a now-obsolete software package. The files include metadata about the software version used, the artist's name, and the creation date. How would you document the software environment required to run this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_30': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you use this metadata to create a virtual tour of the locations where the photos were taken?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: sender, recipient, date written, place written, paper type, ink color, watermark. How would you use this metadata to create a searchable database of the letters?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P32_META = { name: 'Metadata Preservation', icon: '🎯', color: 'text-amber-400', games: Object.keys(P32_EXT) };
