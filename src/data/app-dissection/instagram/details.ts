const details = [
  {
    description:
      "Let’s start nice and simple – this is probably one of my favorite pieces of the Instagram app. When you scroll the top menu bar gets out of the way, scaling nicely back into the distance.\r\n\r\nI could see an argument both ways for adding the same treatment to the bottom tab bar, but I suppose a focus on UX might mean keeping the bar perma-present.",
    title: "Menu bar",
    media: ["https://videodelivery.net/c6ec2cbef5f119f6b56d9badfaac0aa1/downloads/default.mp4"],
  },
  {
    description:
      "If you press + hold the search icon in the bottom toolbar it will spring you straight to the search input. It’s a nice way to save users an extra tap, but more importantly it means people don’t have to readjust their hands in order to tap the search bar. It’s the small things, everyone.",
    title: "Quick search",
    media: ["https://videodelivery.net/e53fb338fc64fefeda4de7e4337d22b8/downloads/default.mp4"],
  },
  {
    description:
      "Don’t underestimate how far subtle touch responses can go to make a UI feel great. In this case the follow buttons bounce and scale ever so slightly on-press which gives users a nice tactile response and feeling of depth.",
    title: "Bouncy buttons",
    media: ["https://videodelivery.net/b0f6e48780475b2db5669d5940dd2bfd/downloads/default.mp4"],
  },
  {
    description:
      "Of course, if you’re going to make certain buttons behave and interact with user touch in a certain way, you better make sure the pattern is consistent app-wide! Nice touch here!\r\n\r\nI’d also like to mention that from a growth perspective, Instagram’s “Suggested” people to follow is insanely powerful. I’ve probably followed 100+ people through this rabbit hole of follow->discover->follow. It’s a crazy powerful loop – I wish they could share more about how impactful this design pattern has been for engagement!",
    title: "Button consistency",
    media: ["https://videodelivery.net/1afdf4f9fd138e9750771536e2739cb2/downloads/default.mp4"],
  },
  {
    description:
      "Protip: If you tap + hold on a username in the comments thread it will open up a comment form pre-filled with that person’s username. This is one of the most subtle interaction patterns I’ve found. But once you find it there’s no going back to the old way of replying.",
    title: "Quick comment",
    media: ["https://videodelivery.net/c30ec70c28186fee624a9f3e1156bfcf/downloads/default.mp4"],
  },
  {
    description:
      "When you’re in the photo-taking mode you can either tap the video icon or swipe to the left to switch modes. I quite enjoy the way a shutter closes and expands during the transition here; while there are definitely benefits of having UI feedback like this, I also wonder if they had to do this for some technical reason – anyone know?",
    title: "Photo to video",
    media: ["https://videodelivery.net/926b14c809f6225d4809417b74911942/downloads/default.mp4"],
  },
  {
    description:
      "Super subtle, this detail. There’s a tiny flashing sliver of white on the progress bar when you’re not taking a photo. I think that this is a nod to old camcorders that would have a flashing “standby” circle on the screen. Nice touch!",
    title: "Beep...beep",
    media: ["https://videodelivery.net/e0f28e94672a962e145ed323a96b567b/downloads/default.mp4"],
  },
  {
    description:
      "If you try to tap the record button a tooltip pops up to guide you through the proper interaction: press + hold to record. I can see this being a tricky one because Instagram is trying to introduce a somewhat-counterintuitive design pattern here.\r\n\r\nIn the iOS camera, tapping the record button, well, records things. But here, Instagram is trying to show users that they can actually stitch together multiple clips together by pressing + holding at the right moments. I can’t quite remember if Insta has a walkthrough for this feature when you first use the app, but regardless it feels like the tooltip here does a fine job of helping users to adjust their expectations.",
    title: "Tooltip",
    media: ["https://videodelivery.net/ddc9010fe0a232e024f83f7e6170431c/downloads/default.mp4"],
  },
  {
    description:
      "If you record a clip, the camera icon suddenly turns into a delete icon. It requires a second confirmation tap to actually delete the video, turning both the icon and the progress bar red as fair warning to the user.\r\n\r\nI think at some point I’ll do a comparison post here of how different apps handle video recording (thinking Vine, Twitter and Instagram right off the bat). It would be cool to compare some of these subtle UX flows which can result in a totally different feeling during the recording process. It seems that different apps are arriving at different conclusions for how this style of video recording should work (Twitter’s is especially impressive).",
    title: "Deleting a video",
    media: ["https://videodelivery.net/625869715bb939fce6e6720b1b0f77e7/downloads/default.mp4"],
  },
  {
    description:
      "Nothing too crazy here, but I do like the pulsing focus rings when you tap somewhere in the viewport while taking a photo! For whatever reason the pulsing ring feels slightly too fast for my taste – it seems to have an entirely different energy from every other transition/animation throughout the app. I wonder what it would feel like with a slightly more lethargic pulse?",
    title: "Tap to focus",
    media: ["https://videodelivery.net/2ca5b1adb5934b25653b2de6bc741359/downloads/default.mp4"],
  },
  {
    description:
      "If you press and hold on a photo while you’re editing and applying filters, you can quickly compare your current edits to the original shot. If you’re in a specific tool, in this case saturation, pressing and holding on the photo will compare your photo with and without that specific tool.",
    title: "Toggle edits",
    media: ["https://videodelivery.net/4917aa116a1cdf2d5cd4952b1d412ebd/downloads/default.mp4"],
  },
  {
    description:
      "In one of the more recent updates Instagram introduced a way to reorder and hide different filters so that people could save time whenever they consistently use a handful of favorite filters. The interaction here is really nice and feels super crisp to use.\r\n\r\nMy only thought on ways to improve this would be to add some sort of feedback when hiding a filter: Where does it go? Can I get it back? Do I have to drag it exactly onto the ‘hide’ square, or is there breathing room?",
    title: "Rearranging filters",
    media: ["https://videodelivery.net/df5ef67a6a397e219f74219f050f8f33/downloads/default.mp4"],
  },
  {
    description:
      "Here’s a subtle one, but I think this adds a lot to the editing experience in Instagram: When you are customizing a photo with a specific tool or filter, it doesn’t instantly apply that change to the photo. Instead it quickly flashes your original and then animates the slider to offer a quick glimpse into the direction (and intensity) of change.",
    title: "Adding a filter",
    media: ["https://videodelivery.net/fa2061eec00f66d84acd5794c88e5735/downloads/default.mp4"],
  },
  {
    description:
      "I had to sit here and watch this video about 20 times before I felt like I understood everything going on. There’s quite a lot of subtle motion going on here that adds a whole lot of life and interactivity to the tagging view on Instagram. The small things – like a semi-transparent background when searching for users, to the springy pop of a tag when it’s dismissed – all come together to make this feel so good; well done Instagram!",
    title: "Tagging",
    media: ["https://videodelivery.net/075e7710651953f09ece5c917031034a/downloads/default.mp4"],
  },
  {
    description:
      "I was hesitant to even include this one here because I figured most people have used this feature before. But hey, +1 for thoroughness right?\r\n\r\nWhen you’re about to publish a photo you can tap on the thumbnail in the composer to get one last look to make sure everything looks good. I use this feature every time I post something to Instagram as a last-second check to make sure I’m happy with the photo.",
    title: "Double-check",
    media: ["https://videodelivery.net/27959cec7c0da7b19452c951dbf008f5/downloads/default.mp4"],
  },
  {
    description:
      "It’s 2015 and most apps are finally getting good at this, but I can’t stress enough: continuity in app navigation is crucial to helping people understand where they are and where they’re going within a set of views or flows. Instagram does a supreme job here of reversing their way through the photo editing flow if a user decides to backtrack.",
    title: "Reverse",
    media: ["https://videodelivery.net/368f9ce198eeb40e46b32d129a950274/downloads/default.mp4"],
  },
  {
    description:
      "Protip number two: press + hold on the camera icon to jump straight to your camera roll. I have to admit I only discovered this interaction this morning while hunting down different design details, but this will be my new default way of adding photos to Instagram. Save one tap and make a user feel clever in the process? That’s a win in my books.",
    title: "Quick camera roll",
    media: ["https://videodelivery.net/922b243c91d1b12ccbc3506ab9e612ca/downloads/default.mp4"],
  },
  {
    description:
      "When you’re logged out, the welcome view background slowly ebbs and shifts colors over time. This happens quite slowly, and I admittedly almost missed it the first time I was logging in/out.\r\n\r\nOver the years I can recount at least 3 different Instagram welcome views – each one has had a completely different feel and style. This latest one is certainly playful, but for whatever reason it just doesn’t quite feel in line with Instagram’s overall aesthetic anywhere else in the app or on the web. If anyone at Instagram is up for sharing the decision behind this new color-blob-changer, I’d love to learn more!",
    title: "Welcome",
    media: ["https://videodelivery.net/da5e799d2bf4e116014bd6bad0da8075/downloads/default.mp4"],
  },
  {
    description:
      "The folks at Instagram pinged me about this little detail, and it’s a good one! If you import a clip longer than 15 seconds into the video editor, the app shows a bouncy scissors icon to indicate that your video has been clipped. You can then tap the scissors to edit the clip range. I love the subtle use of motion here to grab a person’s eyes and guide them towards an action!",
    title: "Trimming",
    media: ["https://videodelivery.net/3c7eb6f6bd470ff4e24df8245a5db01b/downloads/default.mp4"],
  },
];

export default details;
