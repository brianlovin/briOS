export default {
  id: 'searchEngine',
  title: 'Use a privacy-first search engine',
  description: `You should use a search engine that protects you from tracking, fingerprinting, and unwanted advertisements. DuckDuckGo is a privacy-first search engine that does not store your search history, has strict location and personalization permissions, and publishes regular content teaching people how to be safer on the web.
    `,
  apps: [
    {
      name: 'DuckDuckGo',
      image: 'duckduckgo.jpg',
      url: 'https://duckduckgo.com/',
      sources: {
        windows: 'https://duckduckgo.com',
        macos: 'https://duckduckgo.com',
        ios: 'https://itunes.apple.com/us/app/duckduckgo-search-stories/id663592361?mt=8',
        android:
          'https://play.google.com/store/apps/details?id=com.duckduckgo.mobile.android',
        linux: 'https://duckduckgo.com',
      },
    },
  ],
  resources: [
    {
      name: 'DuckDuckGo Privacy',
      url: 'https://duckduckgo.com/privacy',
    },
    {
      name: 'About DuckDuckGo',
      url: 'https://duckduckgo.com/about',
    },
    {
      name: 'DuckDuckGo: No, we’re not using fingerprinting to track you',
      url: 'https://techcrunch.com/2019/01/07/duckduckgo-browser-fingerprinting/',
    },
    {
      name: 'Everything Google knows about you',
      url: 'https://myactivity.google.com/myactivity',
    },
  ],
}
