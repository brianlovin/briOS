export interface SimplecastEpisode {
  id: number
  number: number
  podcast_id: number
  guide: string
  title: string
  author: string
  duration: number
  explicit: boolean
  description: string
  long_description: string
  published: boolean
  published_at: string
  audio_file_size: number
  audio_url: string
  sharing_url: string
  images: {
    large: string
    small: string
    thumb: string
  }
  error?: string
}

export interface ConfigPodcast {
  id: number
  name: string
  slug: string
  description: string
  simplecastId: number
  artworkUrl: string
  iTunesUrl: string
  overcastUrl: string
  pocketCastsUrl: string
  rssFeedUrl: string
  googlePodcastsUrl: string
  castroUrl: string
  breakerUrl: string
  spotifyUrl: string
  applePodcastId: string
  twitterUsername: string
  colors: {
    text: string
    button: string
  }
}

export interface DesignDetail {
  title: string
  description: string
  media: Array<string>
  orientation?: 'landscape'
}

export interface DesignDetailsPost {
  slug: string
  title: string
  description: string
  createdAt: string
  details: Array<DesignDetail>
  tint: string
}

export interface GetInitialProps {
  pathname: string
  query: any
  req?: any
  res?: any
  jsonPageRes?: any
  err?: any
}

export interface Bookmark {
  url: string
  author: string | void
  creator: string | void
  description: string | void
  image: string | void
  site_name: string | void
  title: string | void
  host: string | void
}

export interface BlogPost {
  canonical_url: string | void
  codeinjection_foot: string | void
  codeinjection_head: string | void
  comment_id: string
  created_at: string
  custom_excerpt: string
  excerpt: string
  feature_image: string | void
  featured: boolean
  html: string
  id: string
  meta_description: string | void
  meta_title: string | void
  og_description: string | void
  og_image: string | void
  og_title: string | void
  published_at: string
  reading_time: number
  slug: string
  title: string
  twitter_description: string | void
  twitter_image: string | void
  twitter_title: string | void
  updated_at: string
  url: string
  uuid: string
  visibility: 'public' | 'private'
}
