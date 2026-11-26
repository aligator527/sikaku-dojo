/**
 * Deployment-dependent settings. PUBLIC_REPO_URL is set automatically by the
 * GitHub Pages workflow; when empty, "report an error" links are hidden.
 */
export const site = {
  repoUrl: (import.meta.env.PUBLIC_REPO_URL as string | undefined)?.replace(/\/$/, '') ?? '',
};

export function reportIssueUrl(title: string, body: string): string | undefined {
  if (!site.repoUrl) return undefined;
  const params = new URLSearchParams({ title, body, labels: 'content' });
  return `${site.repoUrl}/issues/new?${params.toString()}`;
}
