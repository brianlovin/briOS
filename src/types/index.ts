export interface SimplecastEpisode {
  id: number,
  number: number,
  podcast_id: number,
  guide: string,
  title: string,
  author: string,
  duration: number,
  explicit: boolean,
  description: string,
  long_description: string,
  published: boolean,
  published_at: string,
  audio_file_size: number,
  audio_url: string,
  sharing_url: string,
  images: {
    large: string,
    small: string,
    thumb: string,
  },
  error?: string,
};

export interface ConfigPodcast {
  id: number,
  name: string,
  slug: string,
  description: string,
  simplecastId: number,
  artworkUrl: string,
  iTunesUrl: string,
  overcastUrl: string,
  pocketCastsUrl: string,
  rssFeedUrl: string,
  googlePodcastsUrl: string,
  castroUrl: string,
  breakerUrl: string,
  applePodcastId: string,
  twitterUsername: string,
  colors: {
    text: string,
    button: string,
  },
};

export interface DesignDetail {
  title: string,
  description: string,
  media: Array<string>,
};

export interface DesignDetailsPost {
  slug: string,
  title: string,
  description: string,
  createdAt: string,
  details: Array<DesignDetail>,
};

export interface GetInitialProps {
  pathname: string,
  query: any,
  req?: any,
  res?: any,
  jsonPageRes?: any,
  err?: any,
};
