// @flow
export type SimplecastEpisode = {
  id: number,
  number: number,
  podcast_id: number,
  guide: string,
  title: string,
  author: string,
  duration: number,
  explicit: boolean,
  published: boolean,
  description: string,
  long_description: string,
  published_at: string,
  audio_file_size: number,
  audio_url: string,
  sharing_url: string,
  images: {
    large: string,
    small: string,
    thumb: string,
  },
  sponsors: Array<?any>,
  error?: string,
};

export type ConfigPodcast = {|
  id: ?number,
  name: string,
  slug: string,
  description: string,
  simplecastId: ?number,
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
|};

export type DesignDetail = {
  title: string,
  description: string,
  media: Array<string>,
};

export type DesignDetailsPost = {
  slug: string,
  title: string,
  description: string,
  createdAt: string,
  details: Array<DesignDetail>,
};

export type GetInitialProps = {
  pathname: string,
  query: any,
  req?: any,
  res?: any,
  jsonPageRes?: any,
  err?: any,
};
