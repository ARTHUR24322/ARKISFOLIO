export default async function sitemap() {
  const baseUrl = 'https://arthur-portfolio-v2.vercel.app';

  // Base routes
  const routes = [
    '',
    '/admin/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
