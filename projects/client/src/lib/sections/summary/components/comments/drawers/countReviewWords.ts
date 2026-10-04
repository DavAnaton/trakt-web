// Languages that don't separate words with whitespace — each character is
// roughly one morpheme, so we count them individually in the fallback path.
const CjkPattern =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const wordPattern = /[\p{L}\p{N}]+/gu;

// The editor stores markdown: spoiler tags and mention link targets would
// otherwise count as words the reader never sees.
const spoilerTagPattern = /\[\/?spoiler\]/gi;
const linkTargetPattern = /\]\([^)]*\)/g;

const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'word' })
  : null;

function toReadableText(review: string): string {
  return review
    .replace(spoilerTagPattern, ' ')
    .replace(linkTargetPattern, ']');
}

function countWithSegmenter(
  review: string,
  segmenter: Intl.Segmenter,
): number {
  return [...segmenter.segment(review)]
    .filter((segment) => segment.isWordLike)
    .length;
}

function countWithoutSegmenter(review: string): number {
  const cjkCharacters = review.match(CjkPattern)?.length ?? 0;
  const remaining = review.replace(CjkPattern, ' ');
  const words = remaining.match(wordPattern)?.length ?? 0;
  return cjkCharacters + words;
}

export function countReviewWords(review: string): number {
  const text = toReadableText(review);

  return segmenter
    ? countWithSegmenter(text, segmenter)
    : countWithoutSegmenter(text);
}
