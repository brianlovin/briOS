// @flow
import 'isomorphic-unfetch';
import type { SimplecastEpisode, DesignDetailsPost } from '../types';
import designDetails from './designDetails';

const API_URL = 'https://api.spec.fm';

const fetchUrl = async (url: string): any => {
  try {
    const req = fetch(`${API_URL}/${url}`);
    const res = await req;
    const json = await res.json();
    return json;
  } catch (err) {
    return Promise.resolve();
  }
};

const api = {
  getEpisodes: async (id: ?number): Promise<?Array<?SimplecastEpisode>> =>
    id ? await fetchUrl(`podcasts/${id}/episodes.json`) : [],
  getDesignDetailsFromSlug: (slug: string): ?DesignDetailsPost =>
    designDetails.find(post => post.slug === slug),
};

export default api;
