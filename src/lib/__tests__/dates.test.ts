import { describe, expect, it } from 'vitest';
import { formatMonthYear, guideDates, latestDate } from '../dates';

describe('guideDates', () => {
  it('shows the published date and the later of the review and update dates', () => {
    const dates = guideDates({
      pubDate: new Date('2026-06-30'),
      updatedDate: new Date('2026-09-20'),
      reviewedDate: new Date('2026-09-09'),
    });

    expect(dates.publishedLabel).toBe('Published Jun 2026');
    expect(dates.reviewedLabel).toBe('Reviewed Sep 2026');
    expect(dates.reviewed).toEqual(new Date('2026-09-20'));
  });

  it('falls back to the publication date when a page has never been edited or reviewed', () => {
    const dates = guideDates({ pubDate: new Date('2026-07-05') }, 'long');

    expect(dates.publishedLabel).toBe('Published July 2026');
    expect(dates.reviewedLabel).toBe('Reviewed July 2026');
  });

  it('renders nothing for a page with no dates', () => {
    expect(guideDates({})).toEqual({
      published: undefined,
      reviewed: undefined,
      publishedLabel: undefined,
      reviewedLabel: undefined,
    });
  });

  it('formats in UTC so a midnight date never slips into the previous month', () => {
    expect(formatMonthYear(new Date('2026-08-01T00:00:00.000Z'))).toBe('Aug 2026');
    expect(latestDate(undefined, new Date('2026-01-01'), new Date('2026-03-01'))).toEqual(new Date('2026-03-01'));
  });
});
