// Visible date line shared by both article layouts and the calculator page.
// Every guide shows when it was first published and when it was last checked;
// "checked" is the later of the last content edit and the last editorial
// review, so a page edited after its review never shows a stale review date.
export interface DatedContent {
  pubDate?: Date;
  updatedDate?: Date;
  reviewedDate?: Date;
}

export function latestDate(...dates: (Date | undefined)[]): Date | undefined {
  return dates
    .filter((date): date is Date => date instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0];
}

export function formatMonthYear(date: Date, month: 'short' | 'long' = 'short'): string {
  return new Intl.DateTimeFormat('en', { month, year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function guideDates(data: DatedContent, month: 'short' | 'long' = 'short') {
  const published = data.pubDate;
  const reviewed = latestDate(data.reviewedDate, data.updatedDate, data.pubDate);
  return {
    published,
    reviewed,
    publishedLabel: published ? `Published ${formatMonthYear(published, month)}` : undefined,
    reviewedLabel: reviewed ? `Reviewed ${formatMonthYear(reviewed, month)}` : undefined,
  };
}
