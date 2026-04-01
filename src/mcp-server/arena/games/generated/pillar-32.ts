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
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Tags. Describe how you would organize and preserve this metadata for long-term access.`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Each letter's digital representation includes: Original File Name, Transcription (text of the letter), Image File Format, Date Received. What metadata schema would you use to represent this information, and why?`,
      (d, r) => `You are archiving a large collection of video game ROMs. Each ROM has the following metadata: ROM Filename, Game Title, Developer, Publisher, Release Year, Genre, Region (e.g., USA, Japan). How would you handle potential conflicts or inconsistencies in this metadata?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_02': textGame({
    prompts: [
      (d, r) => `You've inherited a digital archive of scanned historical photographs. Each photo has the following metadata: filename, scan date, scanner model, resolution, color depth, original physical size. What are the key considerations for ensuring the authenticity and integrity of this metadata?`,
      (d, r) => `A university library is digitizing a collection of scientific research papers. Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle versioning and updates to this metadata over time?`,
      (d, r) => `You are building a long-term digital preservation system for a collection of born-digital art (e.g., interactive installations, net art, digital video).  Metadata includes: title, artist, creation date, file format, file size, software dependencies. What challenges do you anticipate in preserving the meaning and context of this art?`,
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
      (d, r) => `A scientific research project has generated a large dataset of climate model outputs. Metadata includes: model version, simulation parameters (many!), data format, creation date, author. What are the challenges of preserving the reproducibility of this research?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_05': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter speed. How would you use this metadata to create a searchable and accessible archive?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes author, creation date, modification date, file size, file type. What are the legal and ethical considerations related to preserving and providing access to these documents?`,
      (d, r) => `You are building a digital repository for research data.  Datasets are accompanied by metadata including dataset title, author(s), date created, data format, license information, funding sources. How would you ensure the long-term sustainability of this repository?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_06': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Tags. Describe a strategy for automatically extracting and validating metadata from these images.`,
      (d, r) => `You are archiving a collection of early digital documents (Word .doc files) from the 1990s.  The metadata includes: Author, Date Created, Date Modified, Last Saved By, Revision Number. What are the challenges of preserving these documents in their original format?`,
      (d, r) => `You are tasked with archiving a large dataset of scientific research data (sensor readings, experimental results) stored in a custom file format. The metadata includes: Experiment ID, Data Type, Units of Measurement, Calibration Information. How would you ensure that this data remains understandable and usable in the future?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_07': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you handle photos that are missing metadata?`,
      (d, r) => `You are tasked with migrating a large database of scientific research papers from a proprietary format to a more open standard (e.g., Dublin Core). The original database includes a complex metadata schema. What are the key considerations for this migration process?`,
      (d, r) => `Imagine you are building a digital archive for a collection of born-digital art installations. These installations are highly complex, often involving software, video, audio, and interactive elements. How would you document the technical requirements and dependencies of these installations?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_08': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter speed. What are the potential privacy concerns associated with this metadata?`,
      (d, r) => `You are archiving a collection of early digital documents (Word .doc files) from the 1990s.  The files contain author, creation date, last modified date, revision number, and potentially sensitive information. How would you ensure the confidentiality of this information?`,
      (d, r) => `A museum is digitizing its collection of historical textiles. Each textile record currently includes: accession number, title, artist/maker (if known), date of creation (estimated), materials, dimensions. How would you enrich this metadata to provide a more comprehensive understanding of the textiles?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_09': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society. Each photo has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter speed. How would you use this metadata to create a geographic map of the photos?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata options include: author, recipient, date written, place written, paper type, ink color, watermark. What metadata elements are essential for understanding the historical context of these letters?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to facilitate video editing and post-production?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_10': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  The photos are JPEGs, and each has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter speed. What are the limitations of relying solely on EXIF data for long-term preservation?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters. They are creating TIFF images of each letter.  They are considering adding the following metadata: optical character recognition (OCR) text, image resolution, color profile. What are the benefits of including OCR text in the metadata?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word documents, spreadsheets, PDFs) created by a government agency.  These documents contain sensitive information. How would you implement access controls to protect this information?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_11': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you attempt to reconstruct the provenance of these photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has metadata including: author names, publication date, journal title, DOI, abstract, keywords, funding sources. How would you handle papers that have multiple authors or affiliations?`,
      (d, r) => `A museum is digitizing its collection of historical textiles.  Each textile record currently includes: accession number, title, artist/maker (if known), date of creation (estimated), materials, dimensions. How would you use this metadata to create a virtual exhibition?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_12': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Tags. How would you create a backup and disaster recovery plan for this archive?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes: Author, Creation Date, Modification Date, File Size, File Type. What are the challenges of preserving the visual appearance and formatting of these documents over time?`,
      (d, r) => `You are tasked with preserving a large dataset of scientific research data (e.g., sensor readings, experimental results). Metadata includes: Instrument Serial Number, Data Collection Date, Location, Experiment Parameters. How would you ensure the authenticity and integrity of this data?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_13': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. What are the ethical considerations of adding metadata to these photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, publication date. How would you handle conflicting or incomplete metadata?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using now-obsolete software. The files include metadata generated by the software (e.g., brush settings, color palettes, layer information). How would you ensure that this metadata remains understandable and usable in the future?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_14': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Comments. How would you use this metadata to create a searchable database of the photos?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata includes: Sender, Recipient, Date Written, Place Written, Paper Type, Ink Color, Watermark. How would you use this metadata to study the social and cultural history of the period?`,
      (d, r) => `You are archiving a large collection of video game ROMs (read-only memory). Each ROM has the following metadata: ROM Filename, Game Title, Developer, Publisher, Release Year, Genre, Region. How would you handle ROMs that have been modified or hacked?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_15': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you use crowdsourcing to help identify the people and places in the photos?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, Excel, PDFs) created by a government agency.  Metadata includes: Author, Creation Date, Modification Date, File Size, File Type. How would you ensure that these documents are accessible to people with disabilities?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using a now-obsolete software program. The files include metadata about the software version used, the artist's name, and the creation date. How would you address the issue of software obsolescence?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_16': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  The photos are JPEGs, and each has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter speed. What are the advantages and disadvantages of using a relational database to store this metadata?`,
      (d, r) => `You are archiving a collection of born-digital documents (Word, PDF, spreadsheets) created by a government agency.  These documents contain metadata like author, creation date, modification date, file size, file type. How would you ensure the confidentiality of sensitive information contained in these documents?`,
      (d, r) => `You are building a digital repository for scientific research data.  The data includes datasets in various formats (CSV, NetCDF, HDF5) along with associated metadata describing the experiment, data collection methods, and data analysis procedures. How would you ensure the long-term accessibility and usability of this data?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_17': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Comments. How would you use this metadata to create a timeline of events?`,
      (d, r) => `You are archiving a collection of early digital documents (Word .doc files) from the 1990s.  The metadata includes: Author, Date Created, Date Modified, Last Saved By, Revision Number. What are the challenges of migrating these documents to a more modern format?`,
      (d, r) => `You are building a digital library of scientific research papers (PDFs).  Metadata includes: Title, Authors, Abstract, Keywords, DOI, Journal Name, Publication Date, File Size. How would you handle papers that have been retracted or corrected?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_18': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The scanner automatically added metadata like scan date, scanner model, and file size.  The original photos have no identifying information. How would you use facial recognition technology to help identify the people in the photos?`,
      (d, r) => `You are archiving a large dataset of scientific research papers. Each paper has extensive metadata including author affiliations, funding sources, DOI, abstract, keywords, publication date. How would you handle duplicate records or conflicting metadata?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using now-obsolete software. The files include metadata about the software version used, the artist's name, and the creation date. How would you create an emulation environment to allow users to experience this art as it was originally intended?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_19': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates, User Tags. How would you use this metadata to create a virtual tour of the locations where the photos were taken?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters.  Metadata options include: author, recipient, date written, place written, paper type, ink color, watermark. What are the challenges of accurately transcribing and interpreting handwritten metadata?`,
      (d, r) => `You are building a digital asset management system for a film studio. They have a vast library of video footage.  Metadata options include: shot number, scene number, take number, camera angle, lighting setup, audio track. How would you use this metadata to create a searchable index of the footage?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_20': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs with embedded EXIF data. The society wants to be able to search for photos based on the date they were taken. How would you implement this functionality?`,
      (d, r) => `You are tasked with preserving a collection of born-digital documents (Word, PDF, spreadsheets) created by a government agency.  These documents contain sensitive information. What are the best practices for securing this data against unauthorized access?`,
      (d, r) => `You are building a digital repository for a collection of audio recordings (interviews, oral histories).  The recordings are in various formats (WAV, MP3). Metadata includes speaker names, interviewer name, date of interview, location, transcript. How would you ensure the long-term preservation of these audio recordings?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_21': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs with embedded EXIF data. The society wants to be able to search for photos based on the location where they were taken. How would you implement this functionality?`,
      (d, r) => `You are managing a digital library of scientific research papers (PDFs). Each paper has metadata including: title, authors, abstract, publication date, journal name, DOI, keywords, file format. How would you handle papers that have been published in multiple languages?`,
      (d, r) => `You are tasked with preserving a collection of early digital art created using a now-obsolete software package. The files include metadata generated by the software (e.g., brush settings, color palettes, layer information). How would you document the software environment required to run this art?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_22': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. Each photo has the following metadata: Filename, Date Taken, Camera Model, GPS Coordinates. How would you handle photos that have inaccurate or missing GPS coordinates?`,
      (d, r) => `You are managing a digital library of scientific research papers. Each paper has metadata including: Title, Authors, Abstract, Publication Date, Journal Name, DOI, Keywords, Funding Sources. How would you ensure the consistency and accuracy of this metadata?`,
      (d, r) => `You are tasked with preserving a large collection of video game assets (textures, models, sound files, code). Each asset has extensive metadata, including: Creation Date, Last Modified Date, File Size, File Format, Developer. How would you handle assets that are in proprietary file formats?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_23': textGame({
    prompts: [
      (d, r) => `You are archiving a collection of digital photographs from a local historical society. The photos are mostly JPEGs, and the existing metadata includes: filename, date taken, camera model, GPS coordinates. How would you use this metadata to create a map of the locations where the photos were taken?`,
      (d, r) => `You are tasked with migrating a large database of scientific research papers (PDFs) to a new digital repository. The current metadata includes: Title, Author(s), Abstract, DOI, Journal, Keywords, Publication Date. What are the potential risks and challenges of this migration process?`,
      (d, r) => `A museum is digitizing its collection of antique textiles. Each textile has a complex provenance history, documented in a detailed database. The metadata includes: Object ID, Title, Artist/Maker, Date of Creation, Materials, Dimensions, Provenance. How would you ensure the long-term preservation of this provenance information?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_24': textGame({
    prompts: [
      (d, r) => `You've digitized a collection of old family photographs. The digital files include EXIF data (camera settings, date/time, GPS location) and IPTC data (creator, copyright, description). How would you use this metadata to create a family history website?`,
      (d, r) => `A museum is digitizing a collection of historical maps. Each map has associated metadata including: Title, Creator, Date Created, Geographic Coordinates (bounding box), Scale, Projection. How would you ensure the georeferencing accuracy of these maps?`,
      (d, r) => `You are archiving a large dataset of scientific research data (e.g., climate models, genomic sequences). The data includes metadata describing the experiment setup, data processing steps, and data analysis methods. How would you ensure the reproducibility of the research results?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'metadata_preservation_25': textGame({
    prompts: [
      (d, r) => `You've inherited a digital photo archive from a local historical society.  The photos are JPEGs, and each has EXIF data including camera model, date taken, GPS coordinates, aperture, shutter speed. How would you create a system for automatically backing up and restoring this archive?`,
      (d, r) => `A university library is digitizing a collection of 19th-century letters. They are creating TIFF images of the letters and generating OCR text.  They also have information about the sender, recipient, and date of the letter. How would you link the TIFF images to the OCR text and the other metadata?`,
      (d, r) => `You are managing a large database of scientific research data (e.g., climate models, genomic sequences).  The data is stored in a custom file format.  You need to create a metadata schema that is both comprehensive and interoperable. What standards would you consider using?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P32_META = { name: 'Metadata Preservation', icon: '🎯', color: 'text-amber-400', games: Object.keys(P32_EXT) };
