export default {
  id: 'dns',
  title: 'Change your DNS settings to 1.1.1.1 or 9.9.9.9',
  description: `DNS (Domain Name Servers) are the internet's equivalent of a phone book. They translate a name like 'google.com' into an IP address. By default, DNS is slow and insecure. Many internet service providers track and log data that flows through DNS, in some cases reselling this data to advertisers.

  \n\nCloudflare has released a privacy and performance-focused DNS tool that protects your internet traffic from internet service providers and people snooping on public Wi-Fi networks. 1.1.1.1 is faster than the average DNS service as well, making it faster to use the internet.
  \n\nAn alternative to Cloudflare is Quad9, which emphasizes security and privacy in your everyday browsing. It has been launched as a non-profit by the Global Cyber Alliance, IBM and Packet Clearing House, to protect you by blocking known malicious domains, and by not collecting any identifying data on their systems.
    `,
  apps: [
    {
      name: '1.1.1.1',
      image: '1111.jpg',
      url: 'https://www.cloudflare.com/learning/dns/what-is-1.1.1.1/',
      sources: {
        windows: 'https://one.one.one.one/',
        macos: 'https://one.one.one.one/',
        ios: 'https://itunes.apple.com/app/1-1-1-1-faster-internet/id1423538627?mt=8',
        android:
          'https://play.google.com/store/apps/details?id=com.cloudflare.onedotonedotonedotone',
        linux: 'https://one.one.one.one/',
      },
    },
    {
      name: '9.9.9.9',
      image: '9999.jpg',
      url: 'https://www.quad9.net/about/',
      sources: {
        windows: 'https://www.quad9.net/microsoft/',
        macos: 'https://www.quad9.net/apple/',
      },
    },
  ],
  resources: [
    {
      name: 'What is 1.1.1.1?',
      url: 'https://www.cloudflare.com/learning/dns/what-is-1.1.1.1/',
    },
    {
      name: 'Cloudflare launches 1.1.1.1 DNS service that will speed up your internet',
      url: 'https://www.theverge.com/2018/4/1/17185732/cloudflare-dns-service-1-1-1-1',
    },
    {
      name: 'Cloudflare’s privacy-focused 1.1.1.1 is available on phones',
      url: 'https://www.engadget.com/2018/11/11/cloudflare-1-1-1-1-privacy-service-on-phones/',
    },
    {
      name: 'New “Quad9” DNS service blocks malicious domains for everyone',
      url: 'https://arstechnica.com/information-technology/2017/11/new-quad9-dns-service-blocks-malicious-domains-for-everyone/',
    },
    {
      name: 'Quad9, a Public DNS Resolver - with Security',
      url: 'https://labs.ripe.net/Members/stephane_bortzmeyer/quad9-a-public-dns-resolver-with-security/',
    },
    {
      name: 'Cloudflare and Quad9 Aim to Improve DNS',
      url: 'https://tidbits.com/2018/04/20/cloudflare-and-quad9-aim-to-improve-dns/',
    },
  ],
}
