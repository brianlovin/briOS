export default {
  id: 'strongDevicePasscode',
  title: 'Create a strong device passcode',
  description: `A four-digit passcode for your phone or other devices is no longer considered secure. You should use a 6+ digit passcode at the very minimum, and for extra security use a 6+ character passcode containing both numbers and letters. TouchID and FaceID should be turned off when traveling internationally.
  
  \n\nYou should enforce a strict lock policy on your devices. Always require a passcode and ensure that a device is not left unattended for more than a minute or two.`,
  resources: [
    {
      name: 'How long it takes to break a passcode',
      url: 'http://fortune.com/2016/03/18/apple-fbi-iphone-passcode-hack/',
    },
    {
      name: 'How to temporarily disable TouchID or FaceID',
      url: 'https://www.iphonelife.com/content/how-to-temporarily-disable-touch-id-or-face-id-your-iphone',
    },
    {
      name: 'Changing your iOS passcode',
      url: 'https://support.apple.com/en-us/HT204060',
    },
    {
      name: 'Changing your Android passcode',
      url: 'https://phandroid.com/2014/03/20/android-101-lock-screen/',
    },
  ],
}
