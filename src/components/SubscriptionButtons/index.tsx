import * as React from 'react';
import { ConfigPodcast } from '../../types';
import { SubscriptionAvatar } from './style';

type Props = {
  podcast: ConfigPodcast,
};

export default function SubscriptionButtons(props: Props) {
  const { podcast } = props;

  return (
    <React.Fragment>
      {podcast.iTunesUrl && (
        <a href={podcast.iTunesUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/podcasts.png"
            alt="Apple Podcasts"
          />
        </a>
      )}

      {podcast.overcastUrl && (
        <a href={podcast.overcastUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/overcast.png"
            alt="Overcast"
          />
        </a>
      )}

      {podcast.pocketCastsUrl && (
        <a
          href={podcast.pocketCastsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SubscriptionAvatar
            src="/static/img/subscription_icons/pocketcasts.png"
            alt="Pocketcasts"
          />
        </a>
      )}

      {podcast.googlePodcastsUrl && (
        <a
          href={podcast.googlePodcastsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SubscriptionAvatar
            src="/static/img/subscription_icons/google-podcasts.png"
            alt="Google Podcasts"
          />
        </a>
      )}

      {podcast.castroUrl && (
        <a href={podcast.castroUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/castro.png"
            alt="Castro"
          />
        </a>
      )}

      {podcast.breakerUrl && (
        <a href={podcast.breakerUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/breaker.png"
            alt="Breakrer"
          />
        </a>
      )}

      {podcast.spotifyUrl && (
        <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/spotify.png"
            alt="Spotify"
          />
        </a>
      )}

      {podcast.rssFeedUrl && (
        <a href={podcast.rssFeedUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/rss.png"
            alt="RSS Feed"
          />
        </a>
      )}

    </React.Fragment>
  );
}
