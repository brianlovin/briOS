const details = [
  {
    description:
      "[Material Design](http://www.google.com/design/spec/material-design/introduction.html) is a visual language for interacting with digital interfaces. What we find in Inbox is a whole-hearted adoption of subtle motion and gestures to guide users through flows and views.\r\n\r\nThis splash page sets the tone perfectly for what users can expect in terms of interactivity, playfulness and speed. Every animation here feels paced and intentional, with the right level of stickiness and pop to each movement.",
    title: "Splash page",
    media: ["https://videodelivery.net/630e4c2f3bd93dad13715f2191f68a15/downloads/default.mp4"],
  },
  {
    description:
      "I had actually added two email accounts to Inbox before recording this screen, but I wanted to share the little slider here that lets users pick and choose which email accounts will be shown in Inbox. Here I only toggle one, but in reality it’s possible to pick and choose between multiple accounts.\r\n\r\nAt the time of this writing, the main thing holding me back from switching to Inbox (from [Mailbox](http://www.mailboxapp.com/)) is a unified inbox. I’m managing ~6-10 email addresses at any given time, and having to toggle between them can be tedious at times. Hopefully Google can find a clever solution here – I know it’s a tough one!",
    title: "Signing in",
    media: ["https://videodelivery.net/9a0f9f03ff43a7e4fc8c3aa0b6d18aac/downloads/default.mp4"],
  },
  {
    description:
      "The red circle in the bottom right of the screen is a new persistent design element that gives you quick-access to the email composer, reminders and suggested contacts. I’m not quite sure how these suggested contacts are chosen – perhaps they’re people I email most frequently (hi mom and dad!) – this seems like an odd design choice in my opinion, as the odds of me wanting quick access to just one or two individuals is relatively low. On the odd-occasion where I do want to email these specific people though, I suppose the suggestion will be a nice shortcut.\r\n\r\nIt’s also worth paying attention to the way Inbox plays with a semi-opaque white overlay in the view to provide contrast for the quick menu options. The animations here are nice and tight and don’t feel muddled at all.\r\n\r\nNote: Not a bad idea to slip the ‘invitation’ prompt there as well! I’ve already used it once, which might provide some validation for this kind of growth interaction.",
    title: "Choose an action",
    media: ["https://videodelivery.net/ed5699c1291154bdccd8583e9f894cf8/downloads/default.mp4"],
  },
  {
    description:
      "Pinned items – what are you? Why do you exist? How do I use you effectively? These are a few questions that bounced around my head on the first run-through of Inbox. I’m familiar with starring emails in Gmail, but pinning is a whole new interaction that I’m not sure Google explains too well here.\r\n\r\nPerhaps the intention was just that, actually – leave pinning somewhat vague and let users decide the right use case for their own need.\r\n\r\nAt the risk of sounding like a pedantic typography dork – the line height feels a bit too much on the empty view notices. It flows less like a cohesive sentence and more like a series of headlines.",
    title: "Pinned items toggle",
    media: ["https://videodelivery.net/6b75daaa19ae428c304adbb8c076ca2d/downloads/default.mp4"],
  },
  {
    description:
      "If a design pattern works, it works – right? I’m pleased to see swiping become a more commonly-used gesture across all email apps, taking a cue from what Mailbox originally did so well. Here we can quickly swipe an email to mark it as ‘done’ or to ‘snooze’ it for later.\r\n\r\nA quick digression: It’s quite interesting to see Inbox place so much emphasis on getting emails ‘done,’ i.e. treating your emails like a to-do list. At the same time, however, we have this idea of ‘pinning’ emails to your inbox. There’s sort of this clash of intentions here – do I pin an important email? Or do I snooze it? Or is a pinned item like a high-priority to-do list item? When do I unpin an email? Questions like these continue to arise the longer I dive into Inbox.",
    title: "Swiping",
    media: ["https://videodelivery.net/8f9170024b5f3f1e08e905951abdd892/downloads/default.mp4"],
  },
  {
    description:
      "Inbox does a marvelous job of using color to create a sense of location within the app. Green is done, orange/yellow is snoozed, blue is inbox, grey is a label, etc. This consistency – and the bold use of color, as well – really create this coherent language and navigation that you can pick up super fast. At a glance I can know exactly where I’m located in the app.\r\n\r\nThat’s no easy feat to pull off as a designer – in fact, I’m struggling to think of any other apps that use color so prominently to create a sense of space and direction in a UI.",
    title: "Color",
    media: ["https://videodelivery.net/c564310955c322a2bc88f8003d344e00/downloads/default.mp4"],
  },
  {
    description:
      "Creating a functional, aesthetically-coherent and intuitive navigation is insanely hard. Especially when you’re Google and the use-cases for a particular product could measure beyond reason. I’m quite pleased with the general structure of the navigation in Inbox – things are ordered and grouped in a coherent, logical manner and transition animations are snappy and responsive.",
    title: "Navigation",
    media: ["https://videodelivery.net/75ffd5f1e811f13b14fab585b25d75a8/downloads/default.mp4"],
  },
  {
    description:
      "Bigger phones and wider screens mean that the corners of a UI are increasingly harder to reach, especially for people with smaller-than-giant hands. It’s up to designers to work their way around these hardware constraints, and Inbox has just shown us how flexible (and usable) an interface can really be:\r\n\r\nSwipe up or down past the edge of an individual email to return to your previous list (in this case, my inbox). In the next year or two, I hope that every app will embrace location-agnostic swipe gestures for core navigation. It really adds so much to the experience for casual and power-users alike.",
    title: "Swiping gestures",
    media: ["https://videodelivery.net/38d58924a0221f6e3a069137d6f5d068/downloads/default.mp4"],
  },
  {
    description:
      "When a feature like Reminders has this level of prominence in a Google app, it’s best to pay attention. In the core [Google Search](https://brianlovin.com/app-dissection/google-search-for-ios/) app, Reminders are tucked away in the interface – out of sight, out of mind.\r\n\r\nThere’s no doubt with Inbox, however, that Reminders play a larger part of Google’s vision for the future. Why? I’m not totally sure yet. Mixing reminders with snoozed emails with pinned emails – the meaning of these terms is starting to become a bit convoluted.",
    title: "Reminders",
    media: ["https://videodelivery.net/e80483275f9a49c508b96cc261d811d4/downloads/default.mp4"],
  },
  {
    description:
      "Your emails in Inbox are often segmented by date range – in this case, you can see some of my items in ‘Today,’ followed by some items from earlier this month. When I clear a section, pay attention to the animations and transitions happening across the app. Along the bottom of the screen the app highlights a few contextual items about my last action while the rest of the interface slides up smoothly to fill the gap. Lovely.",
    title: "Clear a section",
    media: ["https://videodelivery.net/68e9ba91567356dfa07eb9d52d7f0cf7/downloads/default.mp4"],
  },
  {
    description:
      "I love the icon transition in the upper-left corner of the navigation when the search is toggled. There’s also the beautiful Material language coming to life with the circular highlights on my tap location.",
    title: "Search",
    media: ["https://videodelivery.net/d56a519c31f4e6e7966d36cfa3db5c9c/downloads/default.mp4"],
  },
  {
    description:
      "One of the core elements of Inbox is the email previews that show up inline with your messages. These travel cards are my favorite – the layout and type here is so clear, and the accent photos that accompany my travel destinations are just icing on the cake. Inbox has done a great job with these previews both on the web and iOS, highlighting attachments and Google Docs with a lot less friction than other email apps.",
    title: "Context cards",
    media: ["https://videodelivery.net/9f3042767e6d3caa32e8cf86c95078f0/downloads/default.mp4"],
  },
  {
    description:
      "Just to highlight another example here, I can quickly preview and save a photo attachment in an email without ever having to open the message. This is – in my opinion – the biggest selling point of Inbox at this point: Saving me time on the actions I take the most.",
    title: "Attachments",
    media: ["https://videodelivery.net/3a3b15eebe4c26b6875ffe4da56cb881/downloads/default.mp4"],
  },
  {
    description:
      "Multiple attachments? No problem. This is just too slick – what a time saver for anyone who deals with a large volume of attachments!",
    title: "Multiple attachments",
    media: ["https://videodelivery.net/31420b7cc0c95532fe724b9e6d66305a/downloads/default.mp4"],
  },
  {
    description:
      "Inbox brings a new interaction pattern to the table with ‘sweeping’ – a quick way to mark a group of emails (based on time period) as done in one action. I can see this feature having a really solid application for folks that use labels liberally in their email workflow. Being able to quickly act upon a group of emails is a time saver, indeed, but in many cases will only be practical for certain workflows.\r\n\r\nAlso – don’t you just love this empty inbox view? It’s so much friendlier and more inviting than your traditional ’empty view’ text that one might expect.",
    title: "Sweep",
    media: ["https://videodelivery.net/e5afd39c0f4f9465d83367c15f4018a4/downloads/default.mp4"],
  },
  {
    description:
      "I’m a huge onboarding dork – I’m fascinated by the process, the aesthetics and the usability of it all – in fact, working on user activation is one of my core areas of focus at [Buffer](http://bufferapp.com/). Being such, I’m fascinated by the way different apps educate users about new experiences or interactions.\r\n\r\nHere’s a quick recording of Inbox’s walkthrough. Every subtle motion feels nicely structured and clear. I particularly love the way the designers here use color to prime new users for the experience in-app (i.e. orange = snooze).\r\n\r\nAlso note: Reminders is the first screen here. This is a serious push from Google to get users to interact with reminders across the Google landscape.",
    title: "Onboarding",
    media: ["https://videodelivery.net/aa40b87e38ea2a0894a5e0f777ff2d3a/downloads/default.mp4"],
  },
  {
    description:
      "Here I’ve added two email accounts to Inbox and I’m able to quickly swap between them by tapping my profile picture in the sidebar drawer. The pacing of the animations is really nice here – multi-tap account swaps can sometimes feel tedious, but in this case the flow is quite smooth.",
    title: "Switching accounts",
    media: ["https://videodelivery.net/97237e413854c1668fda4482465e525d/downloads/default.mp4"],
  },
  {
    description:
      "I realized after recording all of these videos that I hadn’t actually focused too much on what Inbox is really about – your emails. This next video captures the slick transitions that occur when you open up an email. I love the way the white expands up and down the screen, pushing the colored nav bar out of the way to create a more immersive, distraction-free reading environment.",
    title: "Reading an email",
    media: ["https://videodelivery.net/747830aa4455bdfb7c18ab70d6109cd3/downloads/default.mp4"],
  },
  {
    description:
      "Alternatively, you can tap on this little dropdown arrow in the sidebar to bring up a list of your connected email accounts. I love the subtle bouncing here on the dropdown arrow, which pairs so well with the transition of other elements in and out of the sidebar container.",
    title: "Toggling accounts",
    media: ["https://videodelivery.net/9d8afc4bf473461317fbabe08e2b2148/downloads/default.mp4"],
  },
  {
    description:
      "Let’s shift gears a bit now to take a look at some of the details in the web version of Inbox. This is the landing page that the Google team has created, which pairs color, typography and animation perfectly with what we’ve already experienced in the mobile app. Some of the scroll-jacking on this page is a bit cumbersome, but for the most part this is a slick site with an almost obsessive attention to detail.\r\n\r\nWatch the arrow in the bottom right corner of the page scroll ever-so-slightly faster than the page, guiding us down the page and onto the next set of imagery.",
    title: "Web landing page",
    orientation: "landscape",
    media: ["https://videodelivery.net/7a0167038c714e069d02129775e48b14/downloads/default.mp4"],
  },
  {
    description:
      "Designers and developers, I know you’ll appreciate just how difficult it can be to maintain a consistent UI across platforms; especially on iOS where small tweaks or adjustments might lag up to a week in the App Store review process. So my hat is off wholeheartedly to the Google folks who have put in the effort to make their web app this consistent with the mobile offering.\r\n\r\nAlso: I love the light bouncing of the shadows on the circular + button in the bottom right corner each time I click. The depth feels so appropriate here.",
    title: "Web view",
    orientation: "landscape",
    media: ["https://videodelivery.net/b9fff5a2d60169a58a1e291e7896c298/downloads/default.mp4"],
  },
  {
    description:
      "There’s a lot of good things that come from adding depth to an otherwise two-dimensional design. The flat movement has come and swept our collective heart, but in my mind there’s still something so appealing and tangible about a design with depth and shadow. I can’t quite wrestle the words out of my mind into writing, but I’ll do my best: Depth on the web creates space and a truer sense of touch that flat design simply cannot imitate.\r\n\r\nIn Google’s case, it’s the small things here – the cards lifted slightly off the page, the scroll arrow responding gently to my clicks, to the lightboxed images that take center stage. It’s these layers and shadows which bring an enriching interactivity to the web – I hope this never goes out of style.",
    title: "Depth",
    orientation: "landscape",
    media: ["https://videodelivery.net/51eeade98ff36f674d60e401be582dc5/downloads/default.mp4"],
  },
  {
    description:
      "I watched this video at least 20 times. I’m sitting here trying to wrap my head about some of the transitions here and what they mean for user experience and design in a general sense. Let me try to explain my line of thought:\r\n\r\nWhen I mark an item as done, or sweep some emails out of my inbox, the rest of the interface reacts accordingly and slides up quickly to fill the new void. This makes sense, of course. It fits our mental model of how these elements should behave in relation to one another. There is space and connection. With me?\r\n\r\nBut when I undo an action, the animation doesn’t just replay in reverse. No, the hidden elements snap sharply back into view and instantly readjust the page to accommodate for the extra objects.\r\n\r\nMy gut reaction was that this was simply a lack of polish – that the team had missed this step of keeping all the interface transitions smooth and consistent. But as I pondered more, I can’t help but think this was a very intentional decision by the Google team.\r\n\r\nAs a user, if I realize I’ve made a mistake, I want to undo that action as quickly and painlessly as possible. I want the interface to react accordingly – don’t waste a split second of my time before ensuring that my mistake was easily remedied. I think that’s what’s going on here: an undone action should be undoubtedly clear that it was complete and my information was restored. Simply reversing the transition makes me wonder if a) my information was never really gone at all or b) if I should wait for something else to happen on the page to ‘complete the undo.’\r\n\r\nI’m likely overthinking this, but would love anyone else’s feedback if they have thoughts on this UX quandary!",
    title: "Motion",
    orientation: "landscape",
    media: ["https://videodelivery.net/4d3cc7d1de352b6d277e0db5a0b13556/downloads/default.mp4"],
  },
  {
    description:
      "This video is just a showcase of some of the Material Design elements in action. Slick datepickers with wonderful layering in the UI, smooth transitions as I mark my emails as done, and of course this refreshingly-colorful empty view.",
    title: "Web view",
    orientation: "landscape",
    media: ["https://videodelivery.net/a74e54f3a18088c6872f6151f0f9e3db/downloads/default.mp4"],
  },
  {
    description:
      "The search interface in Inbox is bold and dramatic. There’s a lot of motion going on whenever you focus on the search input; in many ways it feels quite sudden and surprising, almost disorienting. I’d love to learn more about some of the testing that went into this design and flow – after all, Google is the king of search!",
    title: "Search",
    orientation: "landscape",
    media: ["https://videodelivery.net/d61eef806dc4fa6c45f4b7e6dc0507cc/downloads/default.mp4"],
  },
];

export default details;
