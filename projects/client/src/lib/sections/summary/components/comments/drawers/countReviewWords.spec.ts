import { describe, expect, it } from 'vitest';
import { countReviewWords } from './countReviewWords.ts';

describe('countReviewWords', () => {
  it('should count nothing in an empty review', () => {
    expect(countReviewWords('')).toBe(0);
  });

  it('should count plain words', () => {
    expect(countReviewWords('one two three')).toBe(3);
  });

  it('should ignore markdown emphasis markers', () => {
    expect(countReviewWords('**one** _two_ three')).toBe(3);
  });

  it('should not count spoiler tags as words', () => {
    expect(countReviewWords('one [spoiler]two[/spoiler] three')).toBe(3);
  });

  it('should count a mention by its name, not its link', () => {
    expect(
      countReviewWords('loved [Keanu Reeves](/people/keanu-reeves) here'),
    ).toBe(4);
  });
});
