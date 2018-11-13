// @flow
import * as React from 'react';
import type { GetInitialProps } from '../types';
import Home from './index';

class Books extends React.Component<{}> {
  static async getInitialProps({ res }: GetInitialProps) {
    if (res) {
      const cacheAge = 60 * 60 * 24 * 30;
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`);
    }

    return {};
  }

  render() {
    return <Home />;
  }
}

export default Books;
