/**
 * Builds a /projects URL from active filter values.
 * Preserves the param that isn't being changed, so clicking
 * a category while a tag is active keeps both in the URL.
 */
export function buildFilterUrl(category: string | null, tag: string | null): string {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  const qs = params.toString();
  return qs ? `/projects?${qs}` : '/projects';
}
