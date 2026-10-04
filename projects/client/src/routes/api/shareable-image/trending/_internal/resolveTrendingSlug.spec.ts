import { describe, expect, it, vi } from 'vitest';
import { resolveTrendingSlug } from './resolveTrendingSlug.ts';

const TODAY = new Date('2026-10-04T12:00:00Z');
const YESTERDAY = new Date('2026-10-03T00:00:00Z');

function createBucket(entries: Record<string, string> = {}) {
  const store = new Map(Object.entries(entries));

  return {
    store,
    get: vi.fn((key: string) => {
      const value = store.get(key);
      return Promise.resolve(
        value === undefined ? null : { text: () => Promise.resolve(value) },
      );
    }),
    put: vi.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve(null);
    }),
  };
}

function resolve(
  { bucket, date = TODAY, slugs = ['reacher'] }: {
    bucket: ReturnType<typeof createBucket> | null;
    date?: Date;
    slugs?: string[];
  },
) {
  return resolveTrendingSlug({
    type: 'show',
    date,
    now: TODAY,
    bucket,
    fetchSlugs: () => Promise.resolve(slugs),
  });
}

describe('util: resolveTrendingSlug', () => {
  it('should keep the first pick of the day once the ranking changes', async () => {
    const bucket = createBucket();

    const first = await resolve({ bucket, slugs: ['reacher'] });
    const second = await resolve({ bucket, slugs: ['severance'] });

    expect(first).toBe('reacher');
    expect(second).toBe('reacher');
  });

  it('should store the pick for today', async () => {
    const bucket = createBucket();

    await resolve({ bucket });

    expect(bucket.store.get('images/share/trending/show/2026-10-04.txt'))
      .toBe('reacher');
  });

  it('should not store picks for other days', async () => {
    const bucket = createBucket();

    const slug = await resolve({ bucket, date: YESTERDAY });

    expect(slug).toBe('reacher');
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('should serve a stored pick for an earlier day', async () => {
    const bucket = createBucket({
      'images/share/trending/show/2026-10-03.txt': 'severance',
    });

    expect(await resolve({ bucket, date: YESTERDAY })).toBe('severance');
  });

  it('should pick from the live ranking without a bucket', async () => {
    expect(await resolve({ bucket: null })).toBe('reacher');
  });

  it('should return undefined when nothing is trending', async () => {
    const bucket = createBucket();

    expect(await resolve({ bucket, slugs: [] })).toBeUndefined();
    expect(bucket.put).not.toHaveBeenCalled();
  });
});
