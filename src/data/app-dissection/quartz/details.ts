const details = [
  {
    description:
      "Let’s start: Quartz has created one of the most unique onboarding experiences I’ve ever seen. No splash screen. No signup or login flow. Instead, the app “talks” to you and guides you through a lightweight setup to turn on notifications and explains how to adjust your settings.\r\n\r\nThere’s no chrome to be seen here, which at first felt foreign and out of place. It’s one of the rare times that it feels appropriate to break the HIG and truly bury settings and preferences in favor of creating a 100% immersive UI.\r\n\r\nThere’s one thing that I can’t quite get comfortable with, however: the fake typing indicator, while enjoyable the first 2-3 times, is way too robotic and stale. For first-time use, it helps to set the context that this is a conversational app, but after seeing several articles it slows down the flow of information. The timing is metronomic, which doesn’t work out when the bubbles contain varying lengths of text.\r\n\r\nTwo nitpicks: First, every messaging app on iOS has chat bubbles appear from bottom to top. Here they appear from left to right. It seems that this should be fixed for one key reason: in a conversational app, the messages come from the keyboard and user’s input, thus moving up. In Quartz, the off-screen left of the app contains settings, so the mental model here is that the messages are coming from the settings. It’d be great to see the AI bubbles be consistent with the blue bubble’s movement.\r\n\r\nSecond, I wish the bubbles didn’t have static border radii. Messenger and iMessage both do a good job of handling stacked bubbles that adjust their corners to resemble a cohesive unit of text. I imagine that QZ will polish this out in an update.",
    title: "Open the app",
    media: ["https://videodelivery.net/7eb2440a3c8d76e247704de836bd913c/downloads/default.mp4"],
  },
  {
    description:
      "Nicely done, Quartz: teach users how to use the app by having them actually complete the functions themselves. It’s clever and helps users build momentum in the onboarding experience.\r\n\r\nIt has become standard user experience practice to tell people that you’re going to ask them for notification permission before the popup appears. Quartz handles this nicely by explaining why notifications are useful. Opting in or out is totally fair game, but that emoji in the confirmation option is oh-so enticing.",
    title: "Teaching",
    media: ["https://videodelivery.net/28ebf674ac6c5424e35078c705bd2d9c/downloads/default.mp4"],
  },
  {
    description:
      "One more time: let the user know what’s about to happen. I really don’t understand why there’s a need for the 2-3 second typing indicator delay before throwing the notifications permission popup, it breaks the experience.\r\n\r\nIn the same step, Quartz explains how to adjust your settings. The emoji in this bit of text almost feels confusing, since it’s not pointing to anything. But since it’s coupled with the copy telling me to swipe, I can buy that this will be understandable for people. Again the lack of app chrome means that settings and preferences are totally hidden, so it’s best to explain this one piece of navigation before the user gets started.",
    title: "Permissions",
    media: ["https://videodelivery.net/74fc4f27218707f8d3c61c8aa281e2e2/downloads/default.mp4"],
  },
  {
    description:
      "This is the step of the onboarding where Quartz breaks expectations and injects some serious personality into the app. Instead of forcing me to get my first news story, I get a second option that gives me no indication of what’s about to happen. But I tapped anyways.\r\n\r\nThe copywriting here is on point, and the animated GIF is a nice touch. One nitpick: it broke the experience to have an option to continue forward while the image was still buffering.",
    title: "Personality",
    media: ["https://videodelivery.net/917c3fca351e4dc939ba9b431b12fd67/downloads/default.mp4"],
  },
  {
    description:
      "Alright this is the good stuff: actually using the app to get news. The copywriting here is on point – the actions I can take are contextually related to the article I was shown. Quartz gives me the headline and high level points of interest, with a small blue arrow to let me read more. This right here is probably enough for most people to fall in love: I don’t have to wade through walls of text to get what’s important; Quartz does it for me. If I want more, I can have it, but it’s not forced upon me.\r\n\r\nIn this video we also get a demonstration of how all-over this AI is. An article about Scalia’s passing, straight to a story about Berlin’s concert hall being draped with life preservers. If you want diversity and spontaneity, this is great, but I’m left feeling like Quartz is just shooting in the dark to keep me hooked.",
    title: "News",
    media: ["https://videodelivery.net/84653208775068a954bf3b2c1310ecf7/downloads/default.mp4"],
  },
  {
    description:
      "A quick look at the settings: the use of emojis here is amazing because they map to the emojis you get in push notifications. I can immediately know from the push what category of article it is, and whether it’s worth reading more about. Quartz also uses this space wisely to upsell other uses (the Apple Watch experience, for example).\r\n\r\nAgain: copywriting here is on point. More apps need to take note – telling your user why they would want something on or off builds trust and primes them for future interactions.",
    title: "Settings",
    media: ["https://videodelivery.net/568244cab65cf7cca68ec330e33af272/downloads/default.mp4"],
  },
  {
    description:
      "Oh man, this is good. I’m only 3 articles into this thing and Quartz gives me an emoji as an action. I have no clue what it means. I don’t know what to expect. But I can take a guess (since it seems related to the headline above) and tap this little robot emoji. I get a few bits of information back, broken into bite-sized, multi-media chunks.\r\n\r\nThe GIF at the end is just icing on the cake: again, bringing in personality and delight makes me want to keep finding more stories. It also breaks the mental model that news has to be all business and no play.",
    title: "Delight",
    media: ["https://videodelivery.net/ec4f6df488a6ca05f8d48e5a2f6e16c8/downloads/default.mp4"],
  },
  {
    description:
      "This video demonstrates one area where I think Quartz falls a bit flat: the static, repetitive nature of the faux typing indicator breaks the experience. I’m quickly skimming through articles and the visual effects are slowing me down considerably. I understand that the animation timing is meant to do two things: first, give me time to read each bubble; second, attempting to maintain the illusion of conversation. I just can’t help but feel that the static timing is quite slow and will be frustrating whenever someone encounters a series of articles they don’t care about.",
    title: "Speed reading",
    media: ["https://videodelivery.net/ab5b17be61e4fd084ba210e563f15a48/downloads/default.mp4"],
  },
  {
    description:
      "Here’s the other weird thing about Quartz: you run out of stories. My mental model was that I could go on forever, slowly digging through the archives of time to older stories. It turns out that Quartz only surfaces the most timely news, which means that you will, in fact, run out of articles. The way Quartz handles this is amazing – a playful bit of copy, a GIF, and naturally, an inline ad.\r\n\r\nOf course the ads are going to be here, and Quartz could have been much more aggressive with their display. But by keeping the format as part of my conversation the banner feels natural and inviting. Ads like this are the future (although in time they will become more personalized): native, inline and unobtrusive.",
    title: "Ads and delight",
    media: ["https://videodelivery.net/565636de4a4981e177b90d1ebdf4c965/downloads/default.mp4"],
  },
  {
    description:
      "When I ran out of stories I closed the app then immediately re-opened it to see if it would try and repopulate anything or surface another method of engagement. It turns out Quartz has implemented some amazing product thinking to produce this empty state interaction pattern: when there are no more stories, the app explains why and offers a small bit of fun activity to help avoid disappointment or frustration. I’m sure that this also builds a strong emotional connection to the app, because there’s never any doubt that you’ll at least get something fun whenever you open the product.",
    title: "Quiz",
    media: ["https://videodelivery.net/ca8f76945ab6121176c3ca473a436727/downloads/default.mp4"],
  },
  {
    description:
      "And back we go to our out-of-news state. The copywriting here is phenomenal. It’s not too pushy, not overly friendly; it’s professional and concise, clear and obvious. Well done to the team that pulled this together.",
    title: "Return to empty",
    media: ["https://videodelivery.net/9d40b08427b18ab811efdf028f37cdf4/downloads/default.mp4"],
  },
];

export default details;
