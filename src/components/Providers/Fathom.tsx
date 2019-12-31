import * as React from 'react'
import { trackPageview, setSiteId, load } from 'fathom-client'
import Router from 'next/router'

interface Props {
  children?: any;
}

Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV === 'production') {
    trackPageview()
  }
})

function FathomProvider(props) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      load();
      setSiteId('ONFMHEEY');
      trackPageview();
    }
  }, [])
  return <span {...props} />
}

export default ({ children }: Props) => {
  return (
    <FathomProvider>
      {children}
    </FathomProvider>
  );
}
