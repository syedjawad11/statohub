import { defineCollection, reference, z } from 'astro:content';

const categories = defineCollection({
  type: 'data', // YAML/JSON, no prose body
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().default(0),       // nav ordering
    pillar: reference('articles').optional(), // the hub's flagship article
  }),
});

const articles = defineCollection({
  type: 'content', // MDX - filename = flat slug
  schema: z.object({
    title: z.string(),
    description: z.string(),                    // meta description
    category: reference('categories'),
    primaryKeyword: z.string(),
    keywords: z.array(z.string()).min(1),       // the mapped 6-12 keywords
    phase: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
    calculator: reference('calculators').optional(), // embedded <StatCalc>
    related: z.array(reference('articles')).default([]),
    draft: z.boolean().default(true),           // unfinished articles never ship
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    ogImage: z.string().optional(),
  }),
});

const calculators = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    engine: z.string(),                         // key into src/calc/registry.ts (TASK-003)
    category: reference('categories').optional(),
    standalone: z.boolean().default(true),      // false = embed-only (no /calculators/{slug}/ route)
    chart: z.boolean().default(false),          // true = lazy-load uPlot later
    keywords: z.array(z.string()).default([]),
    // More input types will be added when distribution/inferential calculators land.
    inputs: z
      .array(
        z.object({
          name: z.string(),
          label: z.string(),
          type: z.union([z.literal('numberList'), z.literal('number'), z.literal('select')]),
          options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
          placeholder: z.string().optional(),
          default: z.string().optional(),
        }),
      )
      .default([{ name: 'values', label: 'Values', type: 'numberList' }]),
    precision: z.number().int().default(4),
    resultLabel: z.string().optional(),
    outputLabels: z.record(z.string()).optional(),
  }),
});

export const collections = { categories, articles, calculators };
