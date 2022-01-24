export default {
  id: 'carrierPin',
  title: 'Set up a mobile carrier PIN',
  description: `SIM hijacking is a process where a hacker socially engineers or bribes a mobile carrier to transfer your phone number to a SIM card they own.

  \n\nIf you use text messages as a two-factor authentication method, this gives hackers the ability to bypass 2FA and in most cases the ability to reset your passwords completely.

  \n\nYou should enable a carrier security PIN. This PIN will be used before a carrier can make changes to your SIM cards or mobile account settings.`,
  resources: [
    {
      name: 'SIM swap attacks and what you need to know',
      url: 'https://www.dailydot.com/debug/sim-swap-attacks/',
    },
    {
      name: 'SIM hijacking explained',
      url: 'https://www.pandasecurity.com/mediacenter/security/sim-hijacking-explained/',
    },
    {
      name: 'Verizon FAQ',
      url: 'https://www.verizonwireless.com/support/account-pin-faqs/',
    },
    {
      name: 'AT&T FAQ',
      url: 'https://www.att.com/esupport/article.html#!/wireless/KM1049472',
    },
    {
      name: 'T-Mobile FAQ',
      url: 'https://support.t-mobile.com/docs/DOC-37477',
    },
  ],
}
