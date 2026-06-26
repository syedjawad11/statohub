import { getCollection } from 'astro:content';
import type { CalculatorId } from './links';

export interface RelatedCalculator {
  id: CalculatorId;
  title: string;
  description: string;
}

export async function getRelatedCalculators(
  currentSlug: CalculatorId,
  limit = 5,
): Promise<RelatedCalculator[]> {
  const calculators = await getCollection('calculators');
  const standalone = calculators
    .filter((entry) => entry.data.standalone !== false)
    .sort((a, b) => a.id.localeCompare(b.id));

  const current = standalone.find((entry) => entry.id === currentSlug);
  const currentCategory = current?.data.category?.id;

  const sameCategory = standalone.filter(
    (entry) =>
      entry.id !== currentSlug &&
      currentCategory !== undefined &&
      entry.data.category?.id === currentCategory,
  );
  const otherCategory = standalone.filter(
    (entry) =>
      entry.id !== currentSlug &&
      (currentCategory === undefined || entry.data.category?.id !== currentCategory),
  );

  return [...sameCategory, ...otherCategory].slice(0, limit).map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
  }));
}