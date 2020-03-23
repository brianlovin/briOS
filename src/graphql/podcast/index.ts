import fetch from 'isomorphic-unfetch'
import { SimplecastEpisode } from '../../types';

export async function getEpisodes() {
  return await fetch('https://spec.fm/api/podcasts/1034/episodes')
    .then(res => {
      return res.json();
    })
    .then(res => {
      const episodes = res.filter((ep: SimplecastEpisode) => !!ep.published);
      return episodes.slice(0, 5)
    })
}

export default {
  id: 1034,
  name: 'Design Details',
  slug: 'design-details',
  description: 'A weekly conversation about design process and culture',
  simplecastId: 1034,
  artworkUrl: '/static/img/shows/designdetails.jpg',
  iTunesUrl: 'https://geo.itunes.apple.com/ca/podcast/feed/id947191070',
  overcastUrl: 'https://overcast.fm/itunes947191070',
  pocketCastsUrl: 'http://pca.st/itunes/947191070',
  rssFeedUrl: 'http://simplecast.fm/podcasts/1034/rss',
  spotifyUrl: 'https://open.spotify.com/show/7kAx8RJce757LXVoX2FIpf?si=u_EJ07bBQKC-86Ypqhyn0A',
  googlePodcastsUrl:
    'https://play.google.com/music/m/Iyvjpq3k44ux2azsmvlxe3cc5by?t=Design_Details',
  castroUrl: 'https://castro.fm/itunes/947191070',
  breakerUrl: 'https://www.breaker.audio/design-details',
  applePodcastId: '947191070',
  twitterUsername: 'designdetailsfm',
  colors: {
    text: '#3D7B79',
    button: '#499290',
  },
}