module.exports = {
  swcMinify: true,
  resolve: {
    fallback: {
      fs: false,
    },
  },
  images: {
    domains: [
      'pbs.twimg.com',
      'abs.twimg.com',
      'overthought.ghost.io',
      'imagedelivery.net',
    ],
  },
  async redirects() {
    return [
      {
        source: '/uses',
        destination: '/stack',
        permanent: true,
      },
      {
        source: '/design-details',
        destination: '/app-dissection',
        permanent: true,
      },
      {
        source: '/design-details/:slug',
        destination: '/app-dissection/:slug',
        permanent: true,
      },
      {
        source: '/journal',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/overthought',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/overthought/:slug',
        destination: '/writing/:slug',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/',
        permanent: true,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/channel/UC-esBYEUGQ6iK1wmw76f5MA',
        permanent: true,
        basePath: false,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/brian_lovin',
        permanent: true,
        basePath: false,
      },
      {
        source: '/github',
        destination: 'https://github.com/brianlovin',
        permanent: true,
        basePath: false,
      },
      {
        source: '/figma',
        destination: 'https://figma.com/@brian',
        permanent: true,
        basePath: false,
      },
      {
        source: '/mastadon',
        destination: 'https://mastodon.cloud/@brian',
        permanent: true,
        basePath: false,
      },
    ]
  },
}
