const details = [
  {
    description:
      "There's something magic that happens when you download an app and it opens to the thing you actually care about. This happens in about 0.1% of all apps; social sign-ins, tedious walkthroughs, or long-winded intro videos have become the norm. It's a shame because it seems that *most* apps could very realistically offer a very complete and valuable signed-out experience for people who are curious and need more signal.\r\n\r\nI'm happy to see NeuBible *just work*. No fuss, no signup, no over-the-top splash view. Nope, just the content you downloaded the app for in the first place.",
    title: "Launch",
    media: ["https://videodelivery.net/307d453ba1210fc2b2a037d45b171e61/downloads/default.mp4"],
  },
  {
    description:
      "This is one of the better reading experiences I've seen in an app. I'd argue that the left and right margins are a *tad* too large, but otherwise the vertical rhythm of the entire app is seamless. I love the snap-to-chapter interaction whenever you scroll past the current section; it feels great to use and has enough rubber-band tension to make it super obvious that you've transitioned to a new chapter.",
    title: "Reading",
    media: ["https://videodelivery.net/13717da2b08fd997afde7600cf129be5/downloads/default.mp4"],
  },
  {
    description:
      "This is such a great example of product thinking: after you close the content view, there's never any question about where you left off. It's the digital equivalent of propping your book on a bedside table, making for an even faster navigation than bookmarking.",
    title: "Navigation",
    media: ["https://videodelivery.net/130201237afcfddbbfa0f917cbb9ef4c/downloads/default.mp4"],
  },
  {
    description:
      "The app doesn't let you manually highlight text to copy/paste or save to your highlights. Instead it defaults to selecting a single verse at a time. Pressing and dragging will let you select multiple verses at a time. This is a logical reason to break the default pattern of text selection on the OS: verses are the atomic unit in this context, not words.",
    title: "Highlighting",
    media: ["https://videodelivery.net/eebb078a84ef9f4b78230916d90f7ebe/downloads/default.mp4"],
  },
  {
    description:
      "This is one of the best interactions in NeuBible. When you tap on the reading settings icon it returns you to the place in the text where you left off. In that way you can see, live, how your reading experience will be changed with each tweak of the settings.\r\n\r\nThis is smart product thinking and a delightful experience; I appreciate how simple the customizations are and how opinionated the creators are about what makes for a good reading experience. There aren't dozens of typeface options. No, just four that the creators think are *good*. Opinionated design like this is great because it gives us a glimpse into the mind of the designer in a way that generalized systems never will. ",
    title: "Customize",
    media: ["https://videodelivery.net/a05867ee31c40d6064631d8b7c4cf1f0/downloads/default.mp4"],
  },
  {
    description:
      "One of the four primary navigation elements is search. Tapping it brings down a skinned search bar to match the look and feel of the reading experience. It's simple and snappy, not overcomplicated and easy to find.\r\n\r\nThere is a hidden trick though: if you double tap anywhere while reading content, the search bar will appear. This is useful for quickly jumping between sections of content without having to use the app's primary navigation structures.",
    title: "Search",
    media: ["https://videodelivery.net/fe6d42b00f794dee14b835d21fc107eb/downloads/default.mp4"],
  },
  {
    description:
      "Jumping straight to chapters in a book is one of the less-discoverable bits of UI in NeuBible. I don't fully understand the use case here, so it might very well be a subdued interaction for a reason. My initial reaction was that being able to jump to a specific chapter might be a higher intent user goal, and having to swipe to filter by chapter wasn't immediately obvious.\r\n\r\nRegardless, this is probably the first time I've ever seen a table cell swipe interaction be used as a navigation element rather than an action trigger (think: swipe to delete in Mail.app). ",
    title: "Chapters",
    media: ["https://videodelivery.net/0a87c7ad9a4449d197c0410e83573413/downloads/default.mp4"],
  },
  {
    description:
      "I discovered later that you can *also* swipe left from the reading view to find a chapter navigation. Again, not that discoverable albeit beautifully executed at the visual level. ",
    title: "Chapters Cont.",
    media: ["https://videodelivery.net/28422cab8c2166b7660fecb19f2b3cf9/downloads/default.mp4"],
  },
  {
    description:
      "I love the timeline structure of the highlights view. It builds a reverse-chronological history of your favorite verses and passages. Ordering highlights by the date of creation, rather than by location in the overall text, is an interesting decision. I agree with it, however, because it gives the feeling of curating ideas and discovery over time, rather than a feeling of finding needles in a haystack of text.\r\n\r\nI would also suppose that the highlights ordering lends to this subtle, emotional feeling of *this app is my own*. The small customizations and tweaks that happen in the system all add up to an app that will never feel the same between any two people, even if the underlying content remains untouched.",
    title: "Highlights",
    media: ["https://videodelivery.net/a3a6313fcb4cb9f1de2d2c4564d302ff/downloads/default.mp4"],
  },
  {
    description:
      "Even the settings view is gorgeous. Settings is usually an overlooked dark-corner of the apps we use – rarely seen, utilitarian in nature and not deserving of visual polish. I respect that NeuBible treats settings like a core piece of the experience, carrying theme colors, type, and more into the view.",
    title: "Settings",
    media: ["https://videodelivery.net/a6063f9c594928f59dda71d47bd285eb/downloads/default.mp4"],
  },
  {
    description:
      "Swiping up and down along the left sidebar of settings (or tapping the arrows) changes the app's color scheme. I *love* that the color scheme informs the toggle tint, the link colors and more (it also tints your highlights in the text). Watching it happen live is fun and makes you feel like the app is your own – it's no longer a stock Bible that millions of other people see. No, this is *your* space finely tuned to your own aesthetic and reading style.\r\n\r\nBuilding this emotional connection to an app or service isn't easy or straightforward. Somehow these small customizations can begin to build that bridge, helping users feel like they own their experience and craft it in a way that can more closely reflect their personality. ",
    title: "Themes",
    media: ["https://videodelivery.net/2529cd9953dbc06d9a295fb30ca6db3e/downloads/default.mp4"],
  },
  {
    description:
      "Setting a reading reminder initiates a beautiful blend of custom and stock UI. Selecting days and times is understandable and clear. It's also nice that this is the only time the app prompts for permissions – when they're needed, and not a moment sooner.",
    title: "Reminders",
    media: ["https://videodelivery.net/09f07f8a03e88a4de3bfe8c53db3be57/downloads/default.mp4"],
  },
  {
    description:
      "This just goes above and beyond what I've come to expect from most apps. There's no stock list-view here. No, changing the translation of the app brings us back to the days where coverflow was one of the most visually-striking design patterns that existed on iOS. In this case, the large images are readable and add more context to the translation itself.",
    title: "Translations",
    media: ["https://videodelivery.net/95e30b1f3d4231eae348ae3d41745718/downloads/default.mp4"],
  },
  {
    description:
      "Often tucked away in the deepest corner of a settings view, things like the about page and colophon are often afterthoughts, rarely seen by people. In NueBible's case these pages receive a first-class treatment, respecting (most of) a person's reading settings (in this case, the night mode UI).",
    title: "Dark corners",
    media: ["https://videodelivery.net/b89f9e100010e477aa9ad5c28274b1d1/downloads/default.mp4"],
  },
];

export default details;
