const details = [
  {
    description:
      "When you first launch Shorts, the app immediately asks for notifications permissions. I'm struggling to understand why they prompt for permission here and not much further down the funnel. \r\n\r\nIt's jarring and confusing - at this point in time it's critical for an app to show what kind of value it will provide to a person, not the other way around.",
    title: "Launch",
    media: ["https://videodelivery.net/86ace859b8a9476d9465fc8b9181bf80/downloads/default.mp4"],
  },
  {
    description:
      "See, once you get past the notifications request I can finally start to parse out what this app is and what kind of value it provides. \"Follow people's camera rolls\" sounds interesting, if not a bit on the extreme side of messaging. How will it work? Will I be automatically sharing my camera roll if I sign up?\r\n\r\nI'm a bit hesitant, but continue on through signup.\r\n\r\nAs far as visuals go, Shorts has killed it. But that was no surprise once I realized the [Highlight](http://highlig.ht/) team is behind this product. Clean and simple with a bright and inviting color palette - nicely done.",
    title: "Sign up",
    media: ["https://videodelivery.net/4cea53c43542ce0e804a83d62d6e1b83/downloads/default.mp4"],
  },
  {
    description:
      "The inline validation is nice, but I think the blue bar dropping in from the top is fairly heavy-handed when paired with a lightweight cross in the field.",
    title: "Validation",
    media: ["https://videodelivery.net/9b8202e744f26c7c11ad03a9be002d0c/downloads/default.mp4"],
  },
  {
    description:
      "*Oops, Mrmrs just **had** to message me while I was recording!*\r\n\r\nThe onboarding for shorts is interesting. Once you've entered your name and an optional profile photo you're shown a card-style UI. There's only two buttons on the screen and one of them is to teach me what's up, so I'll go down that road...",
    title: "Onboarding",
    media: ["https://videodelivery.net/e452826828a3c9d9a82a1dfc29cc2289/downloads/default.mp4"],
  },
  {
    description:
      "In this video I'm tapping the skip and share buttons. Lightweight popups help me reverse my decision and also give me feedback about the gestures. At this point I have one big problem: I have no idea what's going to happen when I hit share. I was really hesitant to tap the share button at first...what if my photo goes public? Can anyone see this? Sharing to *where*? \r\n\r\nThose are a lot of high-friction questions this early in the flow. \r\n\r\nI'm not super paranoid about these particular photos, so I move forward...",
    title: "Skip and Share",
    media: ["https://videodelivery.net/c488be585f6eaba17a383a63b1b98c68/downloads/default.mp4"],
  },
  {
    description:
      "It's only by following the onscreen prompt to 'swipe up' that you can finally see your dashboard. This was a really interesting interaction: make your user perform the main action to get to the next view in the app. It's a great way to teach people the gestures and move them through a flow (despite being somewhat confusing - where are the rest of my photos!?).",
    title: "Dashboard",
    media: ["https://videodelivery.net/a3158af64ae3088108dc268053b76117/downloads/default.mp4"],
  },
  {
    description:
      "At the bottom of my dashboard is a sticky prompt to keep sharing. Ironically I can't swipe it up to keep sharing, I have to tap. But at this point I'm getting the hang of the gestures required to use the app.\r\n\r\nIn terms of visuals, I found the transitions of the cards to be quite confusing. They change depending on if you're swiping the card or tapping on the bottom buttons, which is odd considering they are functionally the same. My gut says the team is probably iterating towards a cleaner Tinder-style card where tapping and swiping will move the entire object in a consistent way.",
    title: "Tap v Swipe",
    media: ["https://videodelivery.net/4ffc2529424079e5c9b19dc216960932/downloads/default.mp4"],
  },
  {
    description:
      "One of the best touches in Shorts is the commenting - rather than building a reverse-chronological feed of comments, people can drag and arrange their notes exactly on the parts of the photo that catch their attention. It's a lot of fun to use and feels lightweight enough to encourage lots of engagement.",
    title: "Comments",
    media: ["https://videodelivery.net/bce08eea35f9f83975d340a495f16afd/downloads/default.mp4"],
  },
  {
    description:
      "Tapping on a comment explodes a playful heart, a la Periscope. It's a fun interaction, albeit not that discoverable, which makes it all the more exciting to find!",
    title: "Hearts!",
    media: ["https://videodelivery.net/85b4cb59d8c15bf9688cb5ab103713e3/downloads/default.mp4"],
  },
  {
    description:
      "This is a pattern I first saw in Tinder and has adopted well here. Navigating primary views in the app is a seamless transition - the view title and icons shift/fade accordingly, making the entire dashboard feel cohesive and quickly accessible.\r\n\r\nI thought of doing a post on Tinder a while back to share this pattern; unfortunately that doesn't feel like the best app for video recording :D",
    title: "Navigation",
    media: ["https://videodelivery.net/ddffaedfa292d7966e3f051ebe5c59d0/downloads/default.mp4"],
  },
  {
    description:
      "Just a video looping through how fast the interactions are in Shorts. Really clean transitions, lightweight visuals and fast feedback are all thumbs-up in my book.",
    title: "Interactions",
    media: ["https://videodelivery.net/86c5a4f7df3515cfaf72169276e8b96a/downloads/default.mp4"],
  },
  {
    description:
      "The empty state of the dashboard is smart; it seems like it's surfacing the best possible actions I would want to take, all in one screen. Sharing, inviting, searching...it's all there and super inviting with gorgeous colors.\r\n\r\nMy one qualm is the mix and match of native vs non-native UI. *Adding by username* shows an iOS alert, *finding friends on the app* shows a custom phone number field, and *inviting a friend* opens the iMessages composer. In this case, the *Find Friends* button is the odd-one-out, but the cleanest in terms of visuals and inputs.",
    title: "Native or not",
    media: ["https://videodelivery.net/09c2d54bdc91af0618ccf4235a90308d/downloads/default.mp4"],
  },
  {
    description:
      "For some reason I gave Shorts access to my location; I'm not quite sure why, but that big blue button was so perfectly placed and attention grabbing. Psychology, right?\r\n\r\nIn this discover feed I see a bunch of randoms; I understand that for people with *no* friends, Shorts wants something to show to keep them engaged. But it is *super* weird to be browsing random people's photos in this way - the best way to solve for this is to provide even just the smallest bit of context for why I'm seeing these people. \"2 miles away\" or \"Recommended\" or...anything, really...would help me feel safe and in control of my content. Instead, I'm suddenly concerned about if these people are seeing *my* photos.\r\n\r\nOne detail you'll notice deeper in the video: a longer swipe changes your message from 'like' to 'love' with a playful pop.",
    title: "Discover",
    media: ["https://videodelivery.net/829f9381c3bff786222995ed066055ee/downloads/default.mp4"],
  },
  {
    description:
      "Empty state illustrations are all the rage and Shorts has definitely paid attention. Each of the app's illustrations were done by the talented [Kris Mendoza](https://twitter.com/krismendoza_), so props to him for crafting this beautifully consistent and fun visual style.\r\n\r\nIf you scroll, a hidden surprise awaits. Unfortunately it's cropped if you over-scroll; hopefully they can expand the illustration in order to complete the experience!",
    title: "Empty state",
    media: ["https://videodelivery.net/b2d3d1ca456083c5d8e39d2808dcce4a/downloads/default.mp4"],
  },
  {
    description:
      "I'm sharing the introduction email just to showcase how consistent and clean the branding is for Shorts. I love the gif (although, I'm still struggling to understand what Shorts means...).",
    title: "Email",
    media: ["https://videodelivery.net/54f3cb7825e3d69037e0da0c1a07567f/downloads/default.mp4"],
  },
  {
    description:
      "And one more video of the Shorts website to showcase the product's simplicity and consistency across the board. ",
    title: "Website",
    media: ["https://videodelivery.net/68f21e8623d2d9a312f8ff0f4ad43178/downloads/default.mp4"],
  },
];

export default details;
