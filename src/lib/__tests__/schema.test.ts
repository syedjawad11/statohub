import { describe, expect, it } from 'vitest';
import {
  articleSchema,
  editorialTeamRef,
  faqPageSchema,
  organizationSchema,
  webPageSchema,
  EDITORIAL_TEAM,
} from '../schema';

describe('faqPageSchema', () => {
  it('maps FAQ items to schema.org questions and answers in input order', () => {
    expect(
      faqPageSchema([
        { question: 'What is a confidence interval?', answer: 'A range of plausible values.' },
        { question: 'What does 95% mean?', answer: 'It describes the procedure coverage.' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a confidence interval?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A range of plausible values.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does 95% mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It describes the procedure coverage.',
          },
        },
      ],
    });
  });

  it('throws for an empty FAQ item list', () => {
    expect(() => faqPageSchema([])).toThrow('FAQPage schema requires at least one item.');
  });

  it('preserves the input count and maps the Nth question to the Nth answer', () => {
    const items = [
      { question: 'First question?', answer: 'First answer.' },
      { question: 'Second question?', answer: 'Second answer.' },
      { question: 'Third question?', answer: 'Third answer.' },
    ];

    const schema = faqPageSchema(items);
    const nthItem = 1;

    expect(schema.mainEntity).toHaveLength(items.length);
    expect(schema.mainEntity[nthItem]).toMatchObject({
      name: items[nthItem].question,
      acceptedAnswer: { text: items[nthItem].answer },
    });
  });
});

describe('editorial team and organization schema', () => {
  const site = new URL('https://statohub.com/');

  it('models the byline as one Organization that points at /about/', () => {
    expect(editorialTeamRef(site)).toEqual({
      '@type': 'Organization',
      '@id': 'https://statohub.com/#editorial-team',
      name: EDITORIAL_TEAM.name,
      description: EDITORIAL_TEAM.description,
      url: 'https://statohub.com/about/',
      parentOrganization: { '@id': 'https://statohub.com/#organization' },
    });
    expect(EDITORIAL_TEAM.name).toBe('Statohub Editorial Team');
  });

  it('publishes the contact address, contact page and editorial policy on the Organization', () => {
    const schema = organizationSchema(site);

    expect(schema.email).toBe(EDITORIAL_TEAM.email);
    expect(schema.publishingPrinciples).toBe('https://statohub.com/editorial-policy/');
    expect(schema.contactPoint).toMatchObject({
      '@type': 'ContactPoint',
      email: EDITORIAL_TEAM.email,
      url: 'https://statohub.com/contact/',
    });
    expect(schema).not.toHaveProperty('sameAs');
  });

  it('never emits a Person: article and calculator authors are the team Organization', () => {
    const article = articleSchema(
      { id: 'variance', headline: 'Variance', description: 'd', datePublished: new Date('2026-06-30') },
      site,
    );
    const page = webPageSchema(
      { id: 'mean', name: 'Mean', description: 'd', datePublished: new Date('2026-06-25'), dateModified: '2026-09-20' },
      site,
    );

    expect(article.author).toMatchObject({ '@type': 'Organization', name: EDITORIAL_TEAM.name });
    expect(article.datePublished).toBe('2026-06-30T00:00:00.000Z');
    expect(page.author).toMatchObject({ '@type': 'Organization', name: EDITORIAL_TEAM.name });
    expect(page).toMatchObject({ datePublished: '2026-06-25T00:00:00.000Z', dateModified: '2026-09-20' });
    expect(JSON.stringify([article, page])).not.toContain('"Person"');
  });
});
