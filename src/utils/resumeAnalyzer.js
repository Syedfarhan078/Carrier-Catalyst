import { skillsDatabase, assessmentMap, careerPaths } from '../data/skillsData';
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ─── PDF Text Extraction ──────────────────────────────────────────────────────

/**
 * Extract all text content from a PDF file using pdf.js (pdfjs-dist)
 * @param {File} file - The PDF File object from an input element
 * @returns {Promise<string>} - Full text content of the PDF
 */
export const extractTextFromPDF = async (file) => {
  // Dynamically import pdfjs-dist to keep bundle lean
  const pdfjsLib = await import('pdfjs-dist');

  // Point worker to the CDN-hosted worker script
  // This avoids webpack/vite worker configuration complexity
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

// ─── Skill Detection ──────────────────────────────────────────────────────────

/**
 * Scan extracted resume text and return detected skills with metadata
 * Uses word-boundary aware matching to avoid false positives (e.g. "R" in "React")
 * @param {string} resumeText
 * @returns {Array<{name, category, weight}>}
 */
export const detectSkills = (resumeText) => {
  const lowerText = resumeText.toLowerCase();

  return skillsDatabase.filter((skill) => {
    const skillLower = skill.name.toLowerCase();

    // For short skills (≤2 chars like "R", "C#"), use word boundary
    if (skillLower.length <= 2) {
      const regex = new RegExp(`\\b${escapeRegex(skillLower)}\\b`, 'i');
      return regex.test(resumeText);
    }

    return lowerText.includes(skillLower);
  });
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─── Assessment Recommendations ───────────────────────────────────────────────

/**
 * Generate recommended assessments from detected skills
 * Returns at most 6 assessments, prioritised by skill weight
 */
export const generateAssessments = (detectedSkills) => {
  const recommended = [];

  // Sort by weight descending so highest-priority skills appear first
  const sorted = [...detectedSkills].sort((a, b) => b.weight - a.weight);

  for (const skill of sorted) {
    if (assessmentMap[skill.name]) {
      recommended.push({ skill: skill.name, ...assessmentMap[skill.name] });
      if (recommended.length >= 6) break;
    }
  }

  return recommended;
};

// ─── Skill Gap Analysis ───────────────────────────────────────────────────────

/**
 * Compute skill gap for a given career path
 * @param {string} pathName - Key from careerPaths
 * @param {Array} detectedSkills
 * @returns {{ matchScore, present, missingRequired, missingPreferred }}
 */
export const analyzeSkillGap = (pathName, detectedSkills, careerPathsData) => {
  const path = careerPathsData[pathName];
  if (!path) return null;

  const detectedNames = new Set(detectedSkills.map((s) => s.name.toLowerCase()));

  const present         = [...path.required, ...path.preferred].filter(s => detectedNames.has(s.toLowerCase()));
  const missingRequired = path.required.filter(s => !detectedNames.has(s.toLowerCase()));
  const missingPreferred= path.preferred.filter(s => !detectedNames.has(s.toLowerCase()));

  const totalRequired = path.required.length;
  const metRequired   = path.required.filter(s => detectedNames.has(s.toLowerCase())).length;
  const matchScore    = totalRequired > 0 ? Math.round((metRequired / totalRequired) * 100) : 0;

  return { matchScore, present, missingRequired, missingPreferred };
};

// ─── Resume Score ─────────────────────────────────────────────────────────────

/**
 * Calculate an overall resume strength score (0-100)
 */
export const calculateResumeScore = (detectedSkills, resumeText) => {
  if (detectedSkills.length === 0) return 0;

  const skillScore    = Math.min(detectedSkills.length * 4, 50);   // up to 50 pts
  const categoryCount = new Set(detectedSkills.map(s => s.category)).size;
  const diversityScore= Math.min(categoryCount * 6, 30);           // up to 30 pts
  const lengthScore   = Math.min(Math.floor(resumeText.length / 300), 20); // up to 20 pts

  return Math.min(skillScore + diversityScore + lengthScore, 100);
};