const details = [
  {
    description:
      "*Sidebar: A few years ago I ran a small side project. Towards the end of that project I explored using Stripe as a way to accept payments online. So fortunately I have an account with a few transactions here to demonstrate the app.*\r\n\r\nStripe is one of the few companies that continues to push the use of shadows, highlights and depth in their applications. This, combined with intentional animations and clean transitions, feels a bit like the halfway point between iOS 6 and 7. Not purely-flat. Not overly-embellished.\r\n\r\nIt's also worth noting that there's no registration here, or walkthroughs or superflous messaging. This app is for existing users and there's no need for Stripe to add extra complexity here by trying to onboard prospects. ",
    title: "Launch",
    media: ["https://videodelivery.net/260d1a6948acbc578999c9508fb3a0f2/downloads/default.mp4"],
  },
  {
    description:
      "Microinteractions like these add value to the entire user experience. Rather than being jostled around with static view changes, Stripe helps introduce people to their dashboard with motion. Animation also buys Stripe time to load data in the background while preserving an experience that feels snappy and responsive. ",
    title: "Login",
    media: ["https://videodelivery.net/5d5c6803809735b5d1d60bb9e6be6f1a/downloads/default.mp4"],
  },
  {
    description:
      "Stripe makes parsing graphs effortless. The information is clear and concise, conveyed with just a few elements on the screen.",
    title: "Graphs",
    media: ["https://videodelivery.net/99e8e5cfd792eb7f94539fedea1cc607/downloads/default.mp4"],
  },
  {
    description:
      "I love the custom loader here, complimenting the blue gradients used throughout the app. This video demonstrates navigating between the tabs within my Activity pane. We're also introduced to perhaps the most unique view hierarchy I've seen in an app like this: cards. More on this next...",
    title: "List Views",
    media: ["https://videodelivery.net/8e90b4399a88b39de1a77ada89c6c737/downloads/default.mp4"],
  },
  {
    description:
      "Okay a few things here that Stripe has pulled off well:\r\n 1. semi-transparent blue shadows to stay on-theme\r\n 2. material-style ink in iOS\r\n 3. cards as views\r\n\r\nLet's dig in:\r\n\r\n 1. The blue overlay is a nice touch. The default decision here would have been semi-transparent black; but as we can tell Stripe Dashboard is anything but default.\r\n\r\n 2. Ah, ink drops or ripples or splashes or whatever we're calling it these days. Designers have come to associate the radiating circles that appear on-touch as a strictly Material pattern, reserved for use on Android applications. Here we see it executed on iOS and, while strange at first, it actually feels...good. I'm not surprised that more iOS apps outside of the Google family aren't adopting this effect. First, it's a lot of extra work to get it right. Second, it is absolutely a foreign paradigm to Apple's design standards, set down in the HIG and iOS documentation. \r\n\r\n     But my personal opinion is that designers shouldn't be so beholden to platform “guidelines.” Guidelines change every year as platforms learn more, hardware becomes better, screens become richer. Some of the best design interactions have come from outside Google and Apple: pull to refresh and swipe to delete come to mind, courtesy of Loren Brichter and Palm's webOS, respectively.\r\n\r\n 3. Again, the default decision here when tapping on an item in my transfer history would be to slide a new view in from the right, filling the entire screen. That's the pattern we've come to expect. But Stripe breaks the mold here and introduces the rounded card which can be dismissed with just a swipe. ",
    title: "Ink + Cards",
    media: ["https://videodelivery.net/17b242e6d034ebe60d1670eb831c5f19/downloads/default.mp4"],
  },
  {
    description:
      "Scrubbing on graphs can be a tricky design problem. You need to preserve context and display the necessary data while also accounting for the fact that a person's finger is covering most of your UI. Stripe handles this well by showing and hiding different bits of information, avoiding the need for clunky tooltips. Animations and subtle bouncing are icing on the cake in this interaction.",
    title: "Scrubbing",
    media: ["https://videodelivery.net/25b4b15fde10825f1c17b37e5777b838/downloads/default.mp4"],
  },
  {
    description:
      "Even changing the date scope on the graph has subtle bouncing and depth. Sliding the graph as the date range changes can help to preserve context (probably more-so for people that have a more populated graph than I do).",
    title: "Date Filter",
    media: ["https://videodelivery.net/ac466de1a343d9117a58ee7c029428b5/downloads/default.mp4"],
  },
  {
    description:
      "For some reason there's a toggle on the navigation here to collapse the tabs. Understanding the fact that I lack background on decisions like this, my outside opinion is that this interaction feels unnecessary. The tabs actually help provide more context to the list view when expanded, and they don't take up such a significant amount of vertical space to be a concern. But again, I lack context: I have to trust that Stripe's designers had a very concrete reason for allowing users to hide the tabs.",
    title: "Header Toggle",
    media: ["https://videodelivery.net/8f18639860c13abd326df73a5cc2bdbd/downloads/default.mp4"],
  },
  {
    description:
      "Not much to say here except that I love how fluid the app feels to navigate. I never leave my dashboard; I'm always just pushing or pulling or swiping data as I need it.",
    title: "Scrolling",
    media: ["https://videodelivery.net/fc32fa270420502ddbba12c749da1470/downloads/default.mp4"],
  },
  {
    description:
      "Stripe went all-in on the cards-as-views navigation pattern. When I tap the search icon I get, you guessed it, another card with a pre-focused search field. I think the lack of a clear signifier for how to exit this screen is balanced with how lightweight it feels. I suppose Stripe is making some clear assumptions here about their audience: probably more fluent with technology and touch screens, thus making it unnecessary to include a big 'X' or 'Cancel' button. \r\n\r\nAgain, it creates the perception that I'm never actually leaving my dashboard; instead I'm just pulling and swiping information as-needed.",
    title: "Open Search",
    media: ["https://videodelivery.net/8d31199fe8e55705a19ae06fd27da8ea/downloads/default.mp4"],
  },
  {
    description:
      "How can a card-based view navigation possibly work in a multi-step flow? Stack 'em. This was surprising the first time I found myself with a stack of cards on my screen. In a way it offers one of the most-clear indications of where I currently am in the navigational hierarchy (compared to traditional full-page views with labels in the navbar). \r\n\r\nI can't help but be in awe of the level of visual polish here. The 1px depth added to the search UI, the smooth transitions as cards are pushed and pulled along the z-index...it's beautiful and inspiring.",
    title: "Searching",
    media: ["https://videodelivery.net/d3fe7ffeb231957139f5c287ab0597df/downloads/default.mp4"],
  },
  {
    description:
      "Settings views tend to be where we stuff all the \"extras\" that some people need every now and then, but most people don't ever use. I feel like Stripe worked hard to preserve the simplicity of this screen. As I mentioned at the beginning of this post, Stripe's web dashboard gives users an insane amount of control and configurations. It must have taken a lot of restraint to narrow down the information that gets presented on this card, but the restraint has paid off. It's clear and obvious; I'm not drowning in options or explanation text.",
    title: "Settings",
    media: ["https://videodelivery.net/8f12ca7eb01268c7e5484e4f1e7b4059/downloads/default.mp4"],
  },
  {
    description:
      'This is my favorite detail in the whole app. Despite every other video in this post showing off something creative and new and visually stunning, *this* right here is something I’ve never seen. \r\n\r\nWhen you log out, the settings card gracefully dismisses to the left; your dashboard is gone and in its place is the login form.\r\n\r\nI imagine that the "signing-out" piece of the user experience is at the very bottom of most designers list of priorities. But somehow the designers at Stripe thought of everything, including this beautiful way to transition someone through a signout flow.',
    title: "Signing Out",
    media: ["https://videodelivery.net/a4d242f9930a2cdba7e69974dbf35229/downloads/default.mp4"],
  },
  {
    description:
      "I could sit and stare at any Stripe product page all day. The [landing page for Dashboard](https://stripe.com/dashboard/iphone) isn't well-advertised, but that doesn't mean it received any less care. It animates beautifully into place and kicks off a video reel to showcase some of the app's different functions.\r\n\r\nThis page is also especially useful for me here, since the demo video shows several interactions that I wasn't able to capture in this post!",
    title: "Landing Page",
    orientation: "landscape",
    media: ["https://videodelivery.net/649e6a2c20ac51d71caa1b584892218b/downloads/default.mp4"],
  },
];

export default details;
