const details = [
  {
    description:
      "When you boot up the app for the first time, one of the smoothest onboarding flows I’ve seen in an app kicks into gear.\r\n\r\nSmoothness and aesthetics aside, I can’t help but to bring up the fact that the video below shows the app auto-scrolling if I don’t touch the screen within a few seconds. This tells me that, for whatever reason, people weren’t interacting with the indicative scroll gesture on the splash screen, so Dropbox had to nudge people along.\r\n\r\nI’d love to know more behind that decision to auto-scroll users to the sign-in step, but for now it tells me that somewhere in the testing process the team found that people weren’t making it past the splash view.",
    title: "Splash",
    media: ["https://videodelivery.net/32c9c80dabd12fb3fd955282b0ca36fe/downloads/default.mp4"],
  },
  {
    description:
      "If you are the person who engages with the onscreen prompt to scroll, you’ll see a beautifully choreographed animation as the photos on screen fall elegantly into alignment on your phone. I love that it’s not a timed animation, but rather that it corresponds precisely with your scroll speed.",
    title: "Choreography",
    media: ["https://videodelivery.net/b1edb59375c919a14f3127d78694247f/downloads/default.mp4"],
  },
  {
    description:
      "Carousel is a Dropbox product, so they already know I have an account and am logged in on the main application. So here I get a beautifully-simple sign-in flow that forgoes having to look up my password or go through a 2-step auth flow.\r\n\r\nThis view, I imagine, was a tough one to design. Here we have an app that, by its very nature, needs access to your photos. But they don’t just come right out and flag you with the iOS permissions notification. Instead, you have to opt-in with a clear text label and checkbox. If you try to sign-in without granting access to your photos, a subtle shake guides user’s eyes to the right place.\r\n\r\nTruthfully, I’m wondering how many people drop off from Carousel at this point. As an avid technology consumer and eager experimenter, of course I’m going to give Dropbox access to my photos. For someone that might not be as familiar with the product, parent company or even the concept of organizing your photos in the cloud, it might feel slightly more intrusive and daunting to grant this access.\r\n\r\nFor those brave enough to continue, there are wonderful things in store.",
    title: "Permissions",
    media: ["https://videodelivery.net/18f64eeb3eebb60979b867029fb4f710/downloads/default.mp4"],
  },
  {
    description:
      "This video is just showing how Dropbox primes users for the iOS permissions notification. As soon as you tick the checkbox, the real permissions have to be granted. This priming pattern is becoming commonplace among well-designed iOS apps; the priming of permission requests helps users to understand why and how their data will be used. Asking for permissions at the right time is key.",
    title: "Priming",
    media: ["https://videodelivery.net/c117812e28b32663456285c294cfa1ca/downloads/default.mp4"],
  },
  {
    description:
      "Oh, here’s the traditional walkthrough I was missing before. It’s interesting to see Dropbox explain the details and value of Carousel after signing in. Sure, it reduces the cognitive load of a new user booting the app up for the first time, but somehow this walkthrough explains things in a way that would convince me even more to use Carousel in the first place.\r\n\r\n*“Carousel keeps your photos safe…”*\r\n\r\nThat’s so key, at least for me. It’s not just about creating a nice looking gallery of your photos and organizing them into albums. I can do that in Photos.app. I can do that on my Mac. What I want to know is that my photos will be taken care of, that they’ll always be there for me no matter what happens to my hardware.",
    title: "Walkthrough",
    media: ["https://videodelivery.net/963ef01a0055e072a82f2a3b93ef55c7/downloads/default.mp4"],
  },
  {
    description:
      "Okay, we’re in. But Carousel isn’t quite done showing users the ropes. Once your photos buffer in, the app kicks off a fairly explicit and intrusive “tutorial” about some of the different elements of the app. The first one tells me that my photos are organized – here I can see them filtered by date and location.\r\n\r\nThere are different opinions about whether these “tooltip-style” tours provide a good user experience. On one-hand, I can see it being helpful for someone less savvy on an iPhone. On the other hand, seeing that organization by date and location is just obvious – or, at least it’s obvious enough that I’m questioning such a prominent callout in the new-user experience.",
    title: "Tour",
    media: ["https://videodelivery.net/5f426032410d2285f4c8aec847b6897d/downloads/default.mp4"],
  },
  {
    description:
      "There are two more tutorial steps in the flow. The first shows me how to select and share sets of photos. Fair enough.\r\n\r\nThe second shows me a time wheel, and how to access it. Interestingly enough, I have an old video from when Carousel first came out and this timewheel was along the bottom of the screen. Iterations, ftw.",
    title: "Tour continued",
    media: ["https://videodelivery.net/0b2363cb0f380f69ccbdcdecb58865ca/downloads/default.mp4"],
  },
  {
    description: "",
    title: "",
    media: ["https://videodelivery.net/baeb1954249a2dae421708a7381b1a44/downloads/default.mp4"],
  },
  {
    description:
      "I’m a little camera-shy, so here’s my kitchen. But it’s a nice touch to have a preview of the crop for your image at the same time you’re taking the photo. On a high level, I’m confused why I need a profile picture for Carousel – does this tie over to Dropbox? Does this show up anywhere? Can other people see it?\r\n\r\nI figure it’s basically just so that people you share photos with can see your photo. Maybe adding that explanation could make this process more inviting. After all, this is the dominant UI element on the “more” tab of Carousel.",
    title: "Profile picture",
    media: ["https://videodelivery.net/09248c15594b73fb5aaab77ad09a2890/downloads/default.mp4"],
  },
  {
    description:
      "This is my favorite part of Carousel. It’s just smart psychology and activation design, but it’s also (almost comically) friendly and inviting. Who wouldn’t want to make that lil’ cupcake happy?\r\n\r\nAt a high level, including onboarding “task-lists” is still a rare experience in app design. I’d say Dropbox is most famous for their web implementation of this flow, where they offer users extra storage for completing certain tasks or sharing Dropbox with friends. Here, they cleverly mix in two super-easy tasks (view a photo…right) with a viral component: share your photos with friends.\r\n\r\nThat’s how they getcha. That’s smart design.",
    title: "Task list",
    media: ["https://videodelivery.net/1faf880b0069a812eefadf8e457eb383/downloads/default.mp4"],
  },
  {
    description:
      "The time wheel is a really nice feature here. In most photo apps it can be a massive pain to scroll back through thousands of photos. I’ve been snapping smartphone pictures for 8 years now, so giving a quick way to access years and months makes so much sense.\r\n\r\nApple has done this by letting you zoom out in the “moments” view of the stock Photos app. Dropbox instead took a more linear, visually engaging way of helping users go back in time. Sometimes the timeline here is harder to pinpoint, but for the most part it’s fairly obvious and fits into my mental model of how my photos relate to each other chronologically.",
    title: "Timeline scrubbing",
    media: ["https://videodelivery.net/f079e237aa6c03cfab97eadf707e3301/downloads/default.mp4"],
  },
  {
    description:
      "This video is a bit confusing, sorry – what you’re seeing here are screenshots of Carousel in my camera roll being show inside Carousel. Those screenshots will be further down in this post, so just ignore them for now.\r\n\r\nAnyways, check this out: If you scroll past the bottom of the timeline (Today), a wonderful little design details fades into view: “Take me somewhere…” Keep pulling and you’ll be taken back in time to a random moment. I tried this a few times and Carousel will sometimes spring you back to a specific place. There’s not much practical use here, except to perhaps encourage exploring and reliving past moments and memories.\r\n\r\nIt’s a powerful thing to yank on those emotional strings.",
    title: "Take me somewhere...",
    media: ["https://videodelivery.net/ce492b39e288bd8eda29d8fa6529d53d/downloads/default.mp4"],
  },
  {
    description:
      "This is another video I managed to save from when Carousel first came out. Originally you could swipe photos into boxes along the top and bottom of the screen to hide or share. It was a really fun experience, although not too practical. Carousel has since toned the sharing experience down to be more straightforward and obvious, but I still thought it was cool to see this evolution.",
    title: "Throwback",
    media: ["https://videodelivery.net/33cc5f1a6c5d6ce0e5bb72de385e15ed/downloads/default.mp4"],
  },
  // {
  //   description:
  //     'These next few screenshots didn’t warrant videos, but the illustrations here are worth sharing. For me, the illustrations make the app work.\r\n\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-1.png" width="100%">\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-2.png" width="100%">\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-3.png" width="100%">\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-4.png" width="100%">\r\n\r\nDropbox has assembled one of the best illustration teams in the world, and their work breathes life into what might otherwise be a bland application.\r\n\r\nNotice how the bottom photo has the woman hiding her face while I’m looking at the hidden photos view. Brilliant.',
  //   title: 'Illustrations',
  //   media: [''],
  // },
  // {
  //   description:
  //     'Carousel is a gorgeous iPhone app. They get a lot of interaction design right and the product is so simple and clear. I wondered if their web application would offer that same ease-of-use and clarity; I was pleasantly surprised.\r\n\r\nHere’s the header image on their homepage. I’m constantly amazed at how such simple illustrations can create such an emotional experience. The photos tell a story, they’re relatable, they evoke real-world memories; a perfect example of emotional design.\r\n\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-5.png" width="100%">\r\n\r\nOnce you get inside the web app, a brief walkthrough pops into view. Dropbox’s clean modals take center stage and help guide users into the app while, naturally, pushing folks to activate on their mobile apps as well.\r\n\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-7.png" width="100%">',
  //   title: 'Carousel on the web',
  //   media: [''],
  // },
  // {
  //   description:
  //     'This sequence of photos captures the flow of sharing a photo on the web app. The animations and interaction design here is worth visiting the website to see in-person.\r\n\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-11.png" width="100%">\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-12.png" width="100%">\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-13.png" width="100%">',
  //   title: 'Sharing on the web',
  //   media: [''],
  // },
  // {
  //   description:
  //     'Two more little details I loved: on the left, you can see a slick recreation of the timeline scrub. Jumping back in time is incredibly easy, and bold tooltips help guide you to a specific date. Putting this tech into the browser must have been a lot of work, but the continuity of experiences makes the application feel complete.\r\n\r\nOn the right, we’re greeted once again by our friendly cupcake encouraging you to share photos with friends.\r\n\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-9.png" width="100%">\r\n\r\n<img src="https://brianlovin.s3.amazonaws.com/carousel-img-10.png" width="100%">',
  //   title: 'Timeline and sharing',
  //   media: [''],
  // },
];

export default details;
