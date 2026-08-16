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
