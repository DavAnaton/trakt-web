import { MIN_REVIEW_WORDS } from './constants.ts';
import { countReviewWords } from './countReviewWords.ts';

export function isReviewValid(review: string): boolean {
  return countReviewWords(review) >= MIN_REVIEW_WORDS;
}
