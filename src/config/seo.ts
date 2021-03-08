export const baseUrl = 'https://brianlovin.com'
export const baseEmail = 'hi@brianlovin.com'

export const defaultSEO = {
  title: 'Brian Lovin',
  description:
    'Product designer, podcaster, and writer, living in San Francisco. Currently building native mobile apps at GitHub.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    site_name: 'Brian Lovin',
    images: [
      {
        url: `${baseUrl}/static/meta/og-image.png`,
        alt: 'Brian Lovin',
      },
    ],
  },
  twitter: {
    handle: '@brian_lovin',
    site: '@brian_lovin',
    cardType: 'summary_large_image',
  },
}

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function extendSEO(options: SEOProps) {
  const images = options.image
    ? [{ url: `${baseUrl}/static/${options.image}` }]
    : defaultSEO.openGraph.images

  return {
    ...defaultSEO,
    ...options,
    url: `${baseUrl}/${options.url}`,
    openGraph: {
      ...defaultSEO.openGraph,
      images,
      url: `${baseUrl}/${options.url}`,
    },
  }
}
