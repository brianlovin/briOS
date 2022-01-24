export default {
  id: 'browsers',
  title: 'Use a privacy-first web browser',
  description: `You should use a web browser that protects you from tracking, fingerprinting, and unwanted advertisements.

  Modern browsers have made it simple to transfer your bookmarks and preferences in order to reduce switching pains.
    `,
  apps: [
    {
      name: 'Brave',
      image: 'brave.jpg',
      url: 'https://brave.com/',
      sources: {
        windows: 'https://laptop-updates.brave.com/latest/winx64',
        macos: 'https://laptop-updates.brave.com/latest/osx',
        ios: 'https://geo.itunes.apple.com/us/app/brave-web-browser/id1052879175?mt=8',
        android:
          'https://play.google.com/store/apps/details?id=com.brave.browser&hl=en',
        linux:
          'https://brave-browser.readthedocs.io/en/latest/installing-brave.html#linux',
      },
    },
    {
      name: 'Firefox',
      image: 'firefox.jpg',
      url: 'https://www.mozilla.org/en-US/firefox/',
      sources: {
        windows: 'https://www.mozilla.org/en-US/firefox/',
        macos: 'https://www.mozilla.org/en-US/firefox/',
        ios: 'https://www.mozilla.org/en-US/firefox/mobile/',
        android: 'https://www.mozilla.org/en-US/firefox/mobile/',
        linux: 'https://support.mozilla.org/en-US/kb/install-firefox-linux',
      },
    },
    {
      name: 'Safari',
      image: 'safari.jpg',
      url: 'https://www.apple.com/safari/',
      sources: {
        macos: 'https://www.apple.com/safari/',
        ios: 'https://www.apple.com/safari/',
      },
    },
    {
      name: 'Tor',
      image: 'tor.png',
      url: 'https://www.torproject.org/',
      sources: {
        windows:
          'https://www.torproject.org/download/download-easy.html#windows',
        macos: 'https://www.torproject.org/download/download-easy.html#mac',
        linux: 'https://www.torproject.org/download/download-easy.html#linux',
        android:
          'https://play.google.com/store/apps/details?id=org.torproject.torbrowser_alpha',
      },
    },
    {
      name: 'Vivaldi',
      image: 'vivaldi.png',
      url: 'https://www.vivaldi.com/',
      sources: {
        windows: 'https://vivaldi.com/download/',
        macos: 'https://vivaldi.com/download/',
        linux: 'https://vivaldi.com/download/',
        android: 'https://vivaldi.com/android/',
      },
    },
    {
      name: 'Cliqz',
      image: 'cliqz.png',
      url: 'https://cliqz.com/',
      sources: {
        windows: 'https://cliqz.com/download',
        macos: 'https://cliqz.com/download',
        ios: 'https://itunes.apple.com/de/app/cliqz-browser-suchmaschine/id1065837334?mt=8',
        android:
          'https://play.google.com/store/apps/details?hl=de&id=com.cliqz.browser',
      },
    },
  ],
  resources: [
    {
      name: 'Don’t expect privacy from Chrome',
      url: 'https://www.digitaltrends.com/computing/google-chrome-incognito-mode-tracking/',
    },
    {
      name: 'Google Chrome‘s users take a back seat to its bottom line',
      url: 'https://www.eff.org/deeplinks/2018/11/google-chromes-users-take-back-seat-its-bottom-line',
    },
    {
      name: 'What data of mine does Chrome send to Google?',
      url: 'https://lifehacker.com/5763452/what-data-does-chrome-send-to-google-about-me',
    },
    {
      name: 'Firefox multi-account containers',
      url: 'https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/',
    },
    {
      name: 'How to protect yourself from browser fingerprinting',
      url: 'https://www.comparitech.com/blog/vpn-privacy/what-is-browser-fingerprinting-how-to-protect-yourself/',
    },
    {
      name: 'Browser fingerprinting, and why they are so hard to erase',
      url: 'https://www.networkworld.com/article/2884026/security0/browser-fingerprints-and-why-they-are-so-hard-to-erase.html',
    },
    {
      name: 'Who Tracks Me - Learn about tracking technologies, market structure and data-sharing on the web.',
      url: 'https://whotracks.me/',
    },
  ],
}
