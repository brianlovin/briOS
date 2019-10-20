 
import * as React from 'react';
import * as Sentry from '@sentry/browser';

const SENTRY_PUBLIC_DSN = 'https://36dc16f06aff44a3b91d0a6196f2b1fa@sentry.io/1318162';


export default class SentryProvider extends React.Component{
  constructor(props) {
    super(props);

    Sentry.init({ dsn: SENTRY_PUBLIC_DSN });
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.configureScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
    });
    Sentry.captureException(error);

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  componentDidMount() {
    Sentry.init({
      dsn: 'https://b92b29b696884e5798e161962eac36de@sentry.io/1318151',
    });
  }

  render() {
    const { children } = this.props
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    )
  }
} 