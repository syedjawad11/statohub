import { describe, expect, it } from 'vitest';
import { faqPageSchema } from '../schema';

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
});
