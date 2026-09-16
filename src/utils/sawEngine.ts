import { Package } from '../types';
import { mockPackages } from '../data/mockPackages';
import { mockQuestions, QuestionMock } from '../data/mockQuestions';

export interface CalculatedPackageResult {
  packageId: string;
  pkg: Package;
  rawScore: number;
  normalizedScore: number; // percentage e.g. 92.5
  rank: number;
  breakdown: {
    criteriaName: string;
    weight: number;
    optionText: string;
    score: number;
    weightedContribution: number;
  }[];
}

export interface RecommendationCalculationResult {
  topPackage: CalculatedPackageResult;
  alternatives: CalculatedPackageResult[];
  allRanked: CalculatedPackageResult[];
}

/**
 * Menghitung rekomendasi paket makeup menggunakan metode Simple Additive Weighting (SAW)
 * Formula: Skor = Σ (bobot * (nilai / nilai_maksimal))
 */
export const calculateSAWRecommendation = (
  userAnswers: Record<string, string>,
  questions: QuestionMock[] = mockQuestions,
  packages: Package[] = mockPackages
): RecommendationCalculationResult => {
  const packageIds = packages.map(p => p.id);
  const packageMap = new Map(packages.map(p => [p.id, p]));

  // Inisialisasi skor untuk tiap paket
  const scoresPerPackage: Record<string, {
    totalRawWeighted: number;
    breakdown: CalculatedPackageResult['breakdown'];
  }> = {};

  packageIds.forEach(id => {
    scoresPerPackage[id] = {
      totalRawWeighted: 0,
      breakdown: []
    };
  });

  // Iterasi 10 kriteria pertanyaan
  questions.forEach(q => {
    const selectedOptionId = userAnswers[q.id];
    const option = q.options.find(o => o.id === selectedOptionId) || q.options[0];
    const weightFraction = q.weight / 100; // misal 20% -> 0.20

    packageIds.forEach(pkgId => {
      // Nilai kesesuaian jawaban terhadap paket ini (1 - 4)
      const score = (option.scores as Record<string, number>)[pkgId] ?? 1;
      
      // Normalisasi SAW: nilai / max_score (skala 1-4, max = 4)
      const normalizedValue = score / 4;
      const weightedScore = weightFraction * normalizedValue;

      scoresPerPackage[pkgId].totalRawWeighted += weightedScore;
      scoresPerPackage[pkgId].breakdown.push({
        criteriaName: q.criteriaName,
        weight: q.weight,
        optionText: option.text,
        score,
        weightedContribution: weightedScore * 100
      });
    });
  });

  // Buat array hasil dan urutkan ranking dari skor tertinggi
  const ranked: CalculatedPackageResult[] = packageIds
    .map(pkgId => {
      const pkg = packageMap.get(pkgId)!;
      const raw = scoresPerPackage[pkgId].totalRawWeighted;
      const percentage = Math.round(raw * 1000) / 10; // e.g. 87.5%

      return {
        packageId: pkgId,
        pkg,
        rawScore: raw,
        normalizedScore: percentage,
        rank: 0,
        breakdown: scoresPerPackage[pkgId].breakdown
      };
    })
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return {
    topPackage: ranked[0],
    alternatives: ranked.slice(1),
    allRanked: ranked
  };
};
