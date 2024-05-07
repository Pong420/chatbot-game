import { MetadataRoute } from 'next';

const url = (pathname = '') => 'https://chatbot-games.vercel.app' + pathname;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: url(),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1
    },
    {
      url: url('/docs'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: url('/posts'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    }
  ];
}
