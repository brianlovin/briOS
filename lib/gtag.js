// @flow
export const GA_TRACKING_ID = 'UA-31162386-1'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  try {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  } catch (err) {
    // dont crash the page if ga fails
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: any) => {
  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  } catch (err) {
    // dont crash the page if ga fails
  }
}


