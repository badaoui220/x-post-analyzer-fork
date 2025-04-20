import { MetadataRoute } from 'next';

const baseUrl = 'https://postroast.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // For now, only include the home page.
  // If you add more static or dynamic pages later (e.g., blog posts),
  // you would fetch their paths and add them to the array here.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly', // Using a valid literal type
      priority: 1, // Priority for the home page
    },
    // Add other static pages here if needed, e.g.:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];

  // Example for dynamic pages (if you had a blog):
  // const posts = await fetchBlogPosts(); // Fetch your blog posts
  // const postEntries: MetadataRoute.Sitemap = posts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: 'monthly',
  //   priority: 0.6,
  // }));

  return [
    ...staticPages,
    // ...postEntries, // Add dynamic entries here
  ];
}
