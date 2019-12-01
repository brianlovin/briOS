 
import * as React from 'react';
import App from 'next/app';
import Fathom from 'fathom-client'
import Providers from '../components/Providers';
import Router from 'next/router'

Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV === 'production') {
    Fathom.trackPageview()
  }
})

function FathomWrapper(props) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Fathom.load();
      Fathom.setSiteId('ONFMHEEY');
      Fathom.trackPageview();
    }
  }, [])
  return <span {...props} />
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <FathomWrapper>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </FathomWrapper>
    );
  }
}

export default MyApp;
