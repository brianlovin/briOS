export default {
  id: 'messagingApps',
  title: 'Use encrypted messaging apps when sharing sensitive information',
  description: `When sharing sensitive information over chat, you should be using a secure, end-to-end encrypted messaging service. End-to-end encryption ensures that only you and your intended recipient are able to view messages. Your messages will appear scrambled (and will be nearly-impossible to unscramble) to anyone else, including app developers and ISPs.
  `,
  apps: [
    {
      name: 'iMessage',
      image: 'imessage.png',
      url: 'https://support.apple.com/explore/messages',
      sources: {
        macos: 'https://support.apple.com/explore/messages',
        ios: 'https://support.apple.com/explore/messages',
      },
    },
    {
      name: 'WhatsApp',
      image: 'whatsapp.jpg',
      url: 'https://www.whatsapp.com/',
      sources: {
        windows: 'https://www.whatsapp.com/download',
        macos: 'https://www.whatsapp.com/download',
        ios: 'http://itunes.apple.com/us/app/whatsapp-messenger/id310633997?mt=8',
        android: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      },
    },
    {
      name: 'Signal',
      image: 'signal.jpg',
      url: 'https://www.signal.org/',
      sources: {
        windows: 'https://www.signal.org/download/',
        macos: 'https://www.signal.org/download/',
        ios: 'https://itunes.apple.com/us/app/signal-private-messenger/id874139669?mt=8',
        android:
          'https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms&referrer=utm_source%3DOWS%26utm_medium%3DWeb%26utm_campaign%3DNav',
        linux: 'https://www.signal.org/download/',
      },
    },
  ],
  resources: [
    {
      name: 'What is end-to-end encryption?',
      url: 'https://www.lifewire.com/what-is-end-to-end-encryption-4028873',
    },
    {
      name: 'Hacker lexicon: end-to-end encryption',
      url: 'https://www.wired.com/2014/11/hacker-lexicon-end-to-end-encryption/',
    },
    {
      name: 'Encrypted messaging isn’t magic',
      url: 'https://www.wired.com/story/encrypted-messaging-isnt-magic/',
    },
    {
      name: 'Why you need a better handle on the WhatsApp, Signal and Telegram apps',
      url: 'https://www.cnet.com/news/you-might-not-really-understand-how-encrypted-messaging-apps-work/',
    },
    {
      name: 'The best and worst encrypted messaging apps',
      url: 'https://gizmodo.com/the-best-and-worst-encrypted-messaging-apps-1782424449',
    },
  ],
}
