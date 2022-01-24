export default {
  id: 'passwordManager',
  title: 'Use a password manager',
  description: `A password manager helps you create a unique password for each online service you use. Having a unique password ensures that if one service you use is hacked, the compromised password won’t allow access to all of your other accounts.

    \n\nAt the very minimum, you should have a unique password for high-value accounts like Google, Apple, email, and banking accounts.
  `,
  apps: [
    {
      name: '1Password',
      image: '1password.jpg',
      url: 'https://1password.com/',
      offer: {
        label: 'Sign up to get 3 months free',
        url: 'https://start.1password.com/sign-up/family?c=SECURELIST-FJN7FIKQ',
      },
      sources: {
        windows: 'https://1password.com/downloads/windows/',
        macos: 'https://1password.com/downloads/mac/',
        ios: 'https://1password.com/downloads/ios/',
        android: 'https://1password.com/downloads/android/',
        linux: 'https://1password.com/downloads/linux/',
      },
    },
    {
      name: 'LastPass',
      image: 'lastpass.jpg',
      url: 'https://www.lastpass.com/',
      sources: {
        windows:
          'https://download.cloud.lastpass.com/windows_installer/lastpass.exe',
        macos:
          'https://itunes.apple.com/us/app/lastpass/id926036361?ls=1&mt=12',
        ios: 'https://itunes.apple.com/us/app/lastpass-password-manager/id324613447',
        android: 'https://lastpass.com/android_market.php',
        linux: 'https://lastpass.com/misc_download2.php',
      },
    },
    {
      name: 'Dashlane',
      image: 'dashlane.jpg',
      url: 'https://www.dashlane.com/',
      sources: {
        windows: 'https://www.dashlane.com/directdownload?target=archive_win',
        macos: 'https://www.dashlane.com/directdownload?target=launcher_macosx',
        ios: 'https://itunes.apple.com/us/app/dashlane-password-manager/id517914548',
        android: 'https://play.google.com/store/apps/details?id=com.dashlane',
        linux:
          'https://support.dashlane.com/hc/en-us/articles/115005432325-Getting-started-with-Dashlane-for-Linux-and-Chromebook',
      },
    },
    {
      name: 'Bitwarden',
      image: 'bitwarden.jpg',
      url: 'https://www.bitwarden.com/',
      sources: {
        windows:
          'https://vault.bitwarden.com/download/?app=desktop&platform=windows',
        macos:
          'https://vault.bitwarden.com/download/?app=desktop&platform=macos',
        ios: 'https://itunes.apple.com/app/bitwarden-free-password-manager/id1137397744?mt=8',
        android:
          'https://play.google.com/store/apps/details?id=com.x8bit.bitwarden',
        linux:
          'https://vault.bitwarden.com/download/?app=desktop&platform=linux',
      },
    },
    {
      name: 'Buttercup',
      image: 'buttercup.png',
      url: 'https://buttercup.pw/',
      sources: {
        windows:
          'https://github.com/buttercup/buttercup-desktop/releases/download/v1.14.0/buttercup-desktop-setup-1.14.0.exe',
        macos:
          'https://github.com/buttercup/buttercup-desktop/releases/download/v1.14.0/Buttercup-1.14.0.dmg',
        ios: 'https://itunes.apple.com/us/app/buttercup-password-manager/id1294001514?ls=1&mt=8',
        android:
          'https://play.google.com/store/apps/details?id=com.buttercup&hl=en',
        linux:
          'https://github.com/buttercup/buttercup-desktop/releases/download/v1.14.0/buttercup-desktop-1.14.0.x86_64.rpm',
      },
    },
    {
      name: 'Avast Passwords',
      image: 'avast-passwords.png',
      url: 'https://www.avast.com/passwords',
      sources: {
        windows: 'https://www.avast.com/passwords#pc',
        macos: 'https://www.avast.com/passwords#mac',
        ios: 'https://www.avast.com/passwords#ios',
        android: 'https://www.avast.com/passwords#android',
      },
    },
    {
      name: 'iCloud Keychain',
      image: 'icloud.png',
      url: 'https://www.icloud.com/',
      sources: {
        macos: 'https://support.apple.com/en-us/HT204085',
        ios: 'https://support.apple.com/en-us/HT204085',
      },
    },
  ],
  resources: [
    {
      name: 'How to use a password manager (and why you really should)',
      url: 'https://www.theverge.com/2017/7/24/15921282/best-password-manager-1password-lastpass-dashlane-how-to',
    },
    {
      name: 'How password managers work and why you should use one',
      url: 'https://motherboard.vice.com/en_us/article/59yv5x/how-password-managers-work-and-why-you-should-use-one',
    },
    {
      name: 'Password managers compared',
      url: 'https://www.howtogeek.com/240255/password-managers-compared-lastpass-vs-keepass-vs-dashlane-vs-1password/',
    },
    {
      name: 'Have I Been Pwned: Find out if your passwords have been hacked',
      url: 'https://haveibeenpwned.com/',
    },
  ],
}
