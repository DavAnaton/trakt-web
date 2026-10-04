import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { pickDailyEntry } from './pickDailyEntry.ts';

type SlugStore = {
  get: (key: string) => Promise<{ text: () => Promise<string> } | null>;
  put: (key: string, value: string) => Promise<unknown>;
};

type ResolveTrendingSlugProps = {
  type: MediaType;
  date: Date;
  now: Date;
  bucket: SlugStore | Nil;
  fetchSlugs: () => Promise<ReadonlyArray<string>>;
};

const toDay = (date: Date) => date.toISOString().slice(0, 10);

export async function resolveTrendingSlug(
  { type, date, now, bucket, fetchSlugs }: ResolveTrendingSlugProps,
): Promise<string | undefined> {
  const day = toDay(date);
  const key = `images/share/trending/${type}/${day}.txt`;

  const stored = await bucket?.get(key);
  if (stored) return await stored.text();

  const slug = pickDailyEntry({ entries: await fetchSlugs(), date });
  if (!slug || !bucket || day !== toDay(now)) return slug;

  await bucket.put(key, slug);
  return slug;
}
