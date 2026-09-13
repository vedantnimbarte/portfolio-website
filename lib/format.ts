// Coarse "updated Nmo ago" bucket for repo timestamps. Used by the project modal
// and the knowledge index.
export const relativeTime = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 30) return 'this month';
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};
