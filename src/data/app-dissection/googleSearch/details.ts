const details = [
  {
    description:
      "Launching the Google app makes it immediately clear what level of polish and interactivity we can expect from the interface. Quick transitions, snappy – yet bouncy – animations and clear movement all add up to create a wonderful first app experience.",
    title: "Launching",
    media: ["https://videodelivery.net/875b6ad6b30646d3ab9c858560004d50/downloads/default.mp4"],
  },
  {
    description:
      "You’ll have to pardon my recording software here for the black screen-flash. In real life, the animation when tapping into the search bar is smooth and seamless, responsive to your touch.\r\n\r\nI love how Google embraces this sense of movement to help users feel a relative place, or position, within the app. Even when canceling the search, the original app interface slides effortlessly back into view.",
    title: "Searching",
    media: ["https://videodelivery.net/4373f9882d6f46c32b0b356f5b54e511/downloads/default.mp4"],
  },
  {
    description:
      "Here’s another example of the smooth interface change when tapping on the ‘voice search’ icon. We get a nice teaser of the soon-to-be-standard Material design pattern as well with the radiating circle on button-tap. If you have a keen eye, you’ll also notice the way the search bar is lifted slightly off the background when tapped, creating a sense of depth and responsiveness.",
    title: "Voice search",
    media: ["https://videodelivery.net/8a00dc5211a743423da7a3d416f00483/downloads/default.mp4"],
  },
  {
    description:
      "In this video, I’m signed out of the app – near the bottom we’re shown a teaser for Google Now. Tapping on the teaser brings up a beautiful splash view, guiding users to watch the introductory video. I love the way the background (colorful and playful – so Google) starts to scroll in the background, bringing life to what could easily have been a boring, lifeless view.",
    title: "Google Now introduction",
    media: ["https://videodelivery.net/9b9e6b376f6118451659cbf2d0716ea2/downloads/default.mp4"],
  },
  {
    description:
      "I grabbed this video after first signing into the app – notice the delay here for the Google Now cards loading in. While I’m sure there’s quite a lot of data-fetching magic happening in the background, the staggered movement at the bottom of the screen helps to draw the users eyes and help guide them to explore the app.",
    title: "Pulling in cards",
    media: ["https://videodelivery.net/54994a2af1f4c6f2864c5415d7a3b794/downloads/default.mp4"],
  },
  {
    description:
      "I can’t get enough of this one – scrolling down into the Google Now view creates this beautiful transition with so much subtle movement (but not in a distracting way) and helps the users know that they’re in a separate segment of the app. [Brent Couchman](https://www.flickr.com/photos/brentcouchman/) took the time to dig up [all the possible illustrations](http://forum.xda-developers.com/showpost.php?p=37322378&postcount=98) that Google uses (hint: they change them out based on the time of day and user location!)",
    title: "Scrolling to Now",
    media: ["https://videodelivery.net/c499dea67ec13570781c0d83481d836b/downloads/default.mp4"],
  },
  {
    description: "Here’s the same illustration recorded in the evening:",
    title: "In the evening",
    media: ["https://videodelivery.net/ec7362b007965edbbab7e791bc55334d/downloads/default.mp4"],
  },
  {
    description:
      "As it should be, scrolling back up provides the same seamless transition and experience for users.",
    title: "In reverse",
    media: ["https://videodelivery.net/a6a4dba462385acded821a39ac906afd/downloads/default.mp4"],
  },
  {
    description:
      "This is good. Really good.\r\n\r\nFirst thing: I love the animation on the pointer finger when the app is setting your reminder. Such a small touch, but feels so much better than a stock loading indicator.\r\n\r\nSecond: It’s worth paying close attention to the way Google makes the reminders interface with the rest of the app, especially Google Now. They consistently guide users with motion and transitions so that users have a sense of place within the content, and have extra context about the type of content they’ve just created (a new Google Now card).",
    title: "Setting a reminder",
    media: ["https://videodelivery.net/c3a2cd74f1f12564a341c7f5bf191454/downloads/default.mp4"],
  },
  {
    description:
      "This animation isn’t quite as smooth as we might have expected, but it’s a nice touch nonetheless. Tapping the information icon on a card flips it around, revealing the back and some additional text. One thing to note here is that the back of the card is a dark grey – for some reason this feels quite natural, and works with a user’s mental model of front vs. back.",
    title: "Card information",
    media: ["https://videodelivery.net/fd635f6141b020752da88b0e464c3908/downloads/default.mp4"],
  },
  {
    description:
      "And of course, dismissing a card is so damn fun. I really appreciate how responsive and reactive the other elements within the app are once a card has been dismissed. Everything is clearly interrelated and provides a wonderful sense of cohesiveness.",
    title: "Dismissing a card",
    media: ["https://videodelivery.net/6ae25d49759683a5c2e3fe81465861ab/downloads/default.mp4"],
  },
  {
    description:
      "These are the dark corners of your app – the little-used, often-overlooked interactions that 99% of users will never see or experience. But Google’s designers tackled them anyways – here, refreshing the cards provides a smooth transition and loading-in effect. The consistency across the app is so enjoyable, especially when you see the same design care placed into these lesser-known features.",
    title: "Refreshing the cards",
    media: ["https://videodelivery.net/38aa11636f07841bbeb13564731d25fc/downloads/default.mp4"],
  },
  {
    description:
      "Opening a browser link from a Google Now card pulls in a tab – I love the way it bounces lightly off the left side of the screen. At the risk of sounding like a broken record, it’s worth noting again here the attention placed on creating spatial-awareness in the app. It’s clear that the browser is simply a “layer” of the app – not a whole new view on its own.\r\n\r\nThis is especially useful once you dismiss the browser tab. It quickly falls off the bottom of the screen, returning you to the previous view.",
    title: "Opening/dismissing the browser",
    media: ["https://videodelivery.net/955a50b0636dbc0e188151fb1f37bf06/downloads/default.mp4"],
  },
  {
    description:
      "You can also swipe a browser tab to the right and have it hold onto the right edge of the screen. This allows you to scroll back through your other Google Now cards and still keep your place:",
    title: "Opening/dismissing continued",
    media: ["https://videodelivery.net/57b1f3e450469a091763848f9ed1b154/downloads/default.mp4"],
  },
  {
    description:
      "As you scroll through the image search, the background fades to black and the navigation slides away. I love the emphasis here on the content, and adding the black background does a wonderful job of creating an immersive lightroom effect. Scrolling back up, of course, reverses the animation and reveals the search bar once more.",
    title: "Scrolling images",
    media: ["https://videodelivery.net/251fa4909694a0d5c5a254adca8bd965/downloads/default.mp4"],
  },
  {
    description:
      "Pull to refresh? Nah – pull to return. That’s the Google way, in this view at least. Pulling down on the screen creates a slick pull-to-refresh-style animation that drops you back at the app’s main view.",
    title: "Pull back to home",
    media: ["https://videodelivery.net/7e2989f6cdbebbfc1bdca9fb00001f45/downloads/default.mp4"],
  },
];

export default details;
