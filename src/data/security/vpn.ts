export default {
  id: 'vpn',
  title: 'Use a VPN',
  description: `A VPN, or virtual private network, is a useful tool to secure an internet connection. It guarantees that data you are sending and receiving is encrypted, preventing people from snooping on your traffic.

  \n\nYou should use a VPN provider that you trust to not harvest and re-sell your data. The best VPNs often charge a monthly subscription - this is a good thing because it means their business model is not reliant upon reselling your data to advertisers.
    `,
  apps: [
    {
      name: 'IVPN',
      image: 'ivpn.jpg',
      url: 'https://www.ivpn.net/',
      sources: {
        windows: 'https://www.ivpn.net/apps-windows',
        macos: 'https://www.ivpn.net/apps-macos',
        ios: 'https://www.ivpn.net/apps-ios',
        android: 'https://www.ivpn.net/apps-android',
        linux: 'https://www.ivpn.net/setup/gnu-linux-terminal.html',
      },
    },
    {
      name: 'Encrypt.me',
      image: 'encrypt-me.jpg',
      url: 'https://encrypt.me/',
      sources: {
        windows: 'https://app.encrypt.me/transition/download/windows/latest/',
        macos: 'https://app.encrypt.me/transition/download/osx/latest/',
        ios: 'https://itunes.apple.com/us/app/encrypt-me/id473835722?ls=1&mt=8',
        android:
          'https://play.google.com/store/apps/details?id=com.stackpath.cloak',
      },
    },
    {
      name: 'ExpressVPN',
      image: 'expressvpn.jpg',
      url: 'https://www.expressvpn.com/',
      offer: {
        label: 'Get 30 days free',
        url: 'https://www.expressrefer.com/refer-friend?referrer_id=44490458&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard',
      },
      sources: {
        windows: 'https://www.expressvpn.com/vpn-software/vpn-windows',
        macos: 'https://www.expressvpn.com/vpn-software/vpn-mac',
        ios: 'https://www.expressvpn.com/vpn-software/vpn-ios',
        android: 'https://www.expressvpn.com/vpn-software/vpn-android',
        linux:
          'https://www.expressvpn.com/support/vpn-setup/manual-config-for-linux-with-openvpn/',
      },
    },
    {
      name: 'NordVPN',
      image: 'nordvpn.jpg',
      url: 'https://nordvpn.com/',
      sources: {
        windows: 'https://nordvpn.com/download/windows/',
        macos: 'https://nordvpn.com/download/mac/',
        ios: 'https://nordvpn.com/download/ios/',
        android: 'https://nordvpn.com/download/android/',
        linux: 'https://nordvpn.com/tutorials/linux/',
      },
    },
    {
      name: 'ProtonVPN',
      image: 'protonvpn.jpg',
      url: 'https://www.protonvpn.com/',
      sources: {
        windows: 'https://protonvpn.com/download/',
        macos: 'https://protonvpn.com/download/',
        ios: 'https://itunes.apple.com/us/app/protonvpn-fast-secure-vpn/id1437005085',
        android:
          'https://play.google.com/store/apps/details?id=ch.protonvpn.android',
        linux: 'https://protonvpn.com/download/#dl-clients',
      },
    },
    {
      name: 'Private Internet Access',
      image: 'privateinternetaccess.jpg',
      url: 'https://www.privateinternetaccess.com/',
      sources: {
        windows:
          'https://www.privateinternetaccess.com/installer/x/download_installer_win/64',
        macos:
          'https://www.privateinternetaccess.com/installer/x/download_installer_osx',
        ios: 'https://itunes.apple.com/us/app/private-internet-access-anonymous/id955626407?mt=8&uo=6&at=1001l3Gx&ct=web',
        android:
          'https://play.google.com/store/apps/details?id=com.privateinternetaccess.android&hl=en',
        linux:
          'https://www.privateinternetaccess.com/installer/x/download_installer_linux',
      },
    },
    {
      name: 'PureVPN',
      image: 'purevpn.jpg',
      url: 'https://www.purevpn.com/',
      sources: {
        windows: 'https://www.purevpn.com/download/windows-vpn',
        macos: 'https://www.purevpn.com/download/mac-vpn',
        ios: ' https://www.purevpn.com/download/ios-vpn',
        android: 'https://www.purevpn.com/download/android-vpn',
        linux: 'https://www.purevpn.com/download/linux-vpn',
      },
    },
    {
      name: 'Guardian Firewall',
      image: 'guardian.png',
      url: 'https://guardianapp.com',
      sources: {
        ios: 'https://itunes.apple.com/us/app/guardian-firewall/id1363796315',
      },
    },
  ],
  resources: [
    {
      name: 'Why you should be using a VPN',
      url: 'https://lifehacker.com/5940565/why-you-should-start-using-a-vpn-and-how-to-choose-the-best-one-for-your-needs',
    },
    {
      name: 'What is a VPN and why you need one',
      url: 'https://www.pcmag.com/article/352757/you-need-a-vpn-and-heres-why',
    },
    {
      name: 'Why you should use a VPN on a public Wi-Fi network',
      url: 'https://www.macworld.com/article/3322951/security/why-you-should-use-a-vpn-on-a-public-wi-fi-network.html',
    },
    {
      name: 'A detailed VPN provider comparison chart',
      url: 'https://thatoneprivacysite.net/vpn-comparison-chart/',
    },
  ],
}
