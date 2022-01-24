export default {
  id: 'twoFactor',
  title: 'Use two-factor authentication',
  description: `Two-factor authentication (2FA) adds an extra layer of security on top of passwords. It ensures that someone logging into an account is who they say they are by requiring an extra piece of information besides the account password.
    
    \n\nThis extra information is usually either something you know, something you have, or something you are - for example, a biometric signal like FaceID.
    
    \n\n**You should not use your phone number as a two-factor method.**
    
    \n\nAt minimum 2FA should be installed on accounts that can lock you out of other accounts: e.g. a Google account, email applications, an Apple ID, and financial accounts. For stronger security, ensure that 2FA is enabled on every service you use that supports it.

    \n\n**Note:** Using an all-in-one solution like 1Password for both password management *and* 2FA creates a single point of failure. Take this into account when picking your 2FA client. Be sure to back-up any recovery codes given to you during the 2FA setup processes, otherwise you risk locking yourself out of your accounts.
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
      name: 'Authy',
      image: 'authy.jpg',
      url: 'https://authy.com/',
      sources: {
        windows: 'https://authy.com/download/',
        macos: 'https://authy.com/download/',
        ios: 'https://itunes.apple.com/us/app/authy/id494168017',
        android:
          'https://play.google.com/store/apps/details?id=com.authy.authy',
      },
    },
    {
      name: 'Google Authenticator',
      image: 'google-authenticator.jpg',
      url: 'https://www.google.com/landing/2step/',
      sources: {
        ios: 'https://itunes.apple.com/us/app/google-authenticator/id388497605',
        android:
          'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_us',
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
      name: 'Microsoft Authenticator',
      image: 'microsoft_authenticator_80.png',
      url: 'https://www.microsoft.com/en-us/account/authenticator',
      sources: {
        ios: 'https://itunes.apple.com/app/microsoft-authenticator/id983156458',
        android:
          'https://play.google.com/store/apps/details?id=com.azure.authenticator',
      },
    },
    {
      name: 'YubiKey',
      image: 'yubico.jpg',
      url: 'https://www.yubico.com/',
    },
  ],
  resources: [
    {
      name: 'What is two-factor authentication?',
      url: 'https://authy.com/what-is-2fa/',
    },
    {
      name: 'Two-factor authentication: a little goes a long way',
      url: 'https://securityintelligence.com/two-factor-authentication-a-little-goes-a-long-way/',
    },
    {
      name: 'So hey, you should stop using texts for two-factor authentication',
      url: 'https://www.wired.com/2016/06/hey-stop-using-texts-two-factor-authentication/',
    },
    {
      name: 'List of websites and whether or not they support 2FA.',
      url: 'https://twofactorauth.org/',
    },
    {
      name: 'Step-by-step instructions on enabling 2FA',
      url: 'https://www.turnon2fa.com/',
    },
    {
      name: 'List of websites and whether or not they support One Time Passwords (OTP) or Universal 2nd Factor (U2F)',
      url: 'https://www.dongleauth.info/',
    },
  ],
}
