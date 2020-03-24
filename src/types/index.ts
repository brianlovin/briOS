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
