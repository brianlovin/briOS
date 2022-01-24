export default {
  id: 'email',
  title: 'Use a privacy-first email provider',
  description: `You should use an email provider that doesn’t read your email or gather data about your conversations to target you with ads.
    `,
  apps: [
    {
      name: 'FastMail',
      image: 'fastmail.jpg',
      url: 'https://www.fastmail.com/',
      sources: {
        windows: 'https://www.fastmail.com/',
        macos: 'https://www.fastmail.com/',
        ios: 'https://itunes.apple.com/us/app/fastmail-email-calendar/id931370077',
        android:
          'https://play.google.com/store/apps/details?id=com.fastmail.app',
        linux: 'https://www.fastmail.com/',
      },
    },
    {
      name: 'ProtonMail',
      image: 'protonmail.jpg',
      url: 'https://protonmail.com//',
      sources: {
        windows: 'https://protonmail.com/',
        macos: 'https://protonmail.com/',
        ios: 'https://itunes.apple.com/app/protonmail-encrypted-email/id979659905',
        android:
          'https://play.google.com/store/apps/details?id=ch.protonmail.android',
        linux: 'https://protonmail.com/',
      },
    },
    {
      name: 'SimpleLogin',
      image: 'simplelogin.png',
      url: 'https://simplelogin.io/',
      sources: {
        windows: 'https://simplelogin.io/',
        linux: 'https://simplelogin.io/',
        macos:
          'https://apps.apple.com/us/app/simplelogin/id1494051017?mt=12&fbclid=IwAR0M0nnEKgoieMkmx91TSXrtcScj7GouqRxGgXeJz2un_5ydhIKlbAI79Io',
      },
    },
    {
      name: 'Mailfence',
      image: 'mailfence.png',
      url: 'https://mailfence.com/',
      sources: {
        windows: 'https://mailfence.com',
        macos: 'https://mailfence.com',
        ios: 'https://mailfence.com/m/',
        android: 'https://mailfence.com/m/',
        linux: 'https://mailfence.com',
      },
    },
    {
      name: 'Tutanota',
      image: 'tutanota.jpg',
      url: 'https://tutanota.com/',
      sources: {
        windows: 'https://mail.tutanota.com/desktop/tutanota-desktop-win.exe',
        macos: 'https://mail.tutanota.com/desktop/tutanota-desktop-mac.zip',
        ios: 'https://itunes.apple.com/app/tutanota/id922429609',
        android:
          'https://play.google.com/store/apps/details?id=de.tutao.tutanota',
        linux:
          'https://mail.tutanota.com/desktop/tutanota-desktop-linux.AppImage',
      },
    },
    {
      name: 'Burner Mail',
      image: 'burnermail.jpg',
      url: 'https://burnermail.io/',
      sources: {
        windows: 'https://burnermail.io/',
        macos: 'https://burnermail.io/',
      },
    },
  ],
  resources: [
    {
      name: 'Gmail vs FastMail',
      url: 'https://hiverhq.com/blog/gmail-vs-fastmail-a-blunt-comparison/',
    },
    {
      name: 'Stop the paranoia: it doesn’t matter if Google reads our email',
      url: 'https://www.maxmasnick.com/2012/02/12/gmail_paranoia/',
    },
    {
      name: 'How Google is destroying privacy and collecting your data',
      url: 'https://www.salon.com/2014/02/05/4_ways_google_is_destroying_privacy_and_collecting_your_data_partner/',
    },
    {
      name: 'Privacy-friendly alternatives to Google that don’t track you',
      url: 'https://nomoregoogle.com/',
    },
    {
      name: 'Opt out of global data surveillance programs like PRISM, XKeyscore and Tempora.',
      url: 'https://prism-break.org/en/',
    },
    {
      name: 'Knowledge and tools to protect your privacy against global mass surveillance',
      url: 'https://www.privacytools.io/',
    },
    {
      name: 'We should have a different email for each website',
      url: 'https://simplelogin.io/blog/an-email-for-each-website/',
    },
  ],
}
