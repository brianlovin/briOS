import { extendSEO, defaultSEO } from './seo'

const routes = {
  home: {
    label: 'Home',
    path: '/',
    seo: defaultSEO,
  },
  about: {
    label: 'About',
    path: '/about',
    seo: extendSEO({
      title: 'About',
      url: 'about',
    }),
  },
  projects: {
    label: 'Projects',
    path: '/projects',
    seo: extendSEO({
      title: 'Projects',
      description: 'What I’m working on.',
      url: 'projects',
    }),
  },
  writing: {
    label: 'Writing',
    path: '/writing',
    seo: extendSEO({
      title: 'Writing',
      description: 'Thinking out loud about software design and development.',
      image: 'meta/overthought.png',
      url: 'writing',
    }),
  },
  hn: {
    label: 'Hacker News',
    path: '/hn',
    seo: extendSEO({
      title: 'Hacker News',
      description: 'My personal Hacker News reader.',
      image: 'meta/hn.png',
      url: 'hn',
    }),
  },
  bookmarks: {
    label: 'Bookmarks',
    path: '/bookmarks',
    seo: extendSEO({
      title: 'Bookmarks',
      description: 'Internet things, saved for later.',
      image: 'meta/bookmarks.png',
      url: 'bookmarks',
    }),
  },
  appDissection: {
    label: 'App Dissection',
    path: '/app-dissection',
    seo: extendSEO({
      title: 'App Dissection',
      description: 'In-depth design explorations.',
      image: 'meta/app-dissection.png',
      url: 'app-dissection',
    }),
  },
  ama: {
    label: 'Ask Me Anything',
    path: '/ama',
    seo: extendSEO({
      title: 'Ask Me Anything',
      description: 'Answering questions, just for fun.',
      image: 'meta/ama.png',
      url: 'ama',
    }),
  },
  login: {
    label: 'Login',
    path: '/login',
    seo: extendSEO({
      title: 'Login',
      description: 'What do you think you’re doing?',
      url: 'login',
    }),
  },
  security: {
    label: 'Security Checklist',
    path: '/security',
    seo: extendSEO({
      title: 'Security Checklist',
      description: 'Tools and resources for staying safe on the internet.',
      image: 'meta/security.png',
      url: 'security',
    }),
  },
  stack: {
    label: 'Stack',
    path: '/stack',
    seo: extendSEO({
      title: 'Stack',
      description: 'My favorite tools and software.',
      image: 'meta/stack.png',
      url: 'stack',
    }),
  },
  startupJobs: {
    label: 'Startup Jobs',
    path: '/startups',
    seo: extendSEO({
      title: 'Startup Jobs',
      description: 'Connecting great designers with growing startups.',
      image: 'meta/startups.png',
      url: 'startups',
    }),
  },
}

export default routes
