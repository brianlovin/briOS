// @flow
import * as React from 'react';
import type { SimplecastEpisode } from '../../types';

export const defaultPlayerContext = {
  trackQueue: [],
  isPlaying: false,
  displaySubscriptions: false,
  progress: 0,

  // add functions to provide flow types to downstream consumers
  // although all actual function logic is implemented in pages/_app.js
  // via class methods and state handlers
  // eslint-disable-next-line
  addTrackToQueue: (episode: SimplecastEpisode) => {},
  clearQueue: () => {},
  pause: () => {},
  play: () => {},
  scrub: () => {},
  onProgress: () => {},
  onTrackEnded: () => {},
};

// $FlowIssue
export default React.createContext(defaultPlayerContext);
