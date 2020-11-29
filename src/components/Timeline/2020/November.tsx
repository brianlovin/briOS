import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCommit, GitMerge, Zap, Wind, Twitter, Camera } from 'react-feather'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'
import { BlogPost } from '../BlogPost'

export function November() {
  return (
    <>
      <DateEntry title="November, 2020" />
      <BlogPost
        timestamp="November 29, 2020"
        slug="tailwind-css-first-impressions"
        title="Tailwind CSS First Impressions"
        description="My pros and cons for the Tailwind CSS framework after one week."
      />

      <TimelineEntry
        title="Added new bookmark types"
        timestamp="November 28, 2020"
        Icon={GitCommit}
      >
        <Notes>
          <p>
            My{' '}
            <Link href="/bookmarks" passHref>
              <a> Bookmarks</a>
            </Link>{' '}
            list keeps track of interesting things I’ve found on the internet.
            The lack of organization made it hard to decide what I should share
            and made it hard to quickly navigate to a category of content. Now
            Bookmarks are organized by
            <Link
              href="/bookmarks/[category]"
              as={`/bookmarks/reading`}
              passHref
            >
              <a> Reading</a>
            </Link>
            ,{' '}
            <Link
              href="/bookmarks/[category]"
              as={`/bookmarks/portfolio`}
              passHref
            >
              <a> Portfolios</a>
            </Link>
            , and{' '}
            <Link
              href="/bookmarks/[category]"
              as={`/bookmarks/website`}
              passHref
            >
              <a>Personal Sites</a>
            </Link>
            .
          </p>
        </Notes>
        <ButtonSet>
          <Link passHref href="/bookmarks">
            <a className="w-full md:w-auto">
              <button className="w-full md:w-auto btn">
                <span>Go to Bookmarks</span>
              </button>
            </a>
          </Link>
          <a
            href="https://github.com/brianlovin/brian-lovin-next/pull/1190"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">
              <>
                <GitMerge size={16} />
                <span>View pull request</span>
              </>
            </button>
          </a>
        </ButtonSet>
      </TimelineEntry>

      <TimelineEntry
        title="Moved Security Checklist to personal site"
        timestamp="November 24, 2020"
        Icon={GitCommit}
      >
        <Notes>
          <p>
            Over the years domains and side projects accumulate. It takes mental
            overhead to keep things updated, running, and paid for. I’m going to
            start slowly integrating personal projects like Security Checklist
            into this codebase as a more future-proof way to tinker.
          </p>
        </Notes>
        <ButtonSet>
          <Link passHref href="/security">
            <a className="w-full md:w-auto">
              <button className="w-full md:w-auto btn">
                <span>View Security Checklist</span>
              </button>
            </a>
          </Link>
          <a
            href="https://github.com/brianlovin/brian-lovin-next/pull/1188"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">
              <>
                <GitMerge size={16} />
                <span>View pull request</span>
              </>
            </button>
          </a>
        </ButtonSet>
      </TimelineEntry>
      <TimelineEntry
        title="Rebuilt site with Tailwind.css"
        timestamp="November 22, 2020"
        Icon={Wind}
      >
        <Notes>
          <p>
            So far, so good! The migration was painless (except for a few cases
            where outdated tutorials led me down the wrong path for CSS purging
            solutions). But here we are: as I slowly start to memorize the
            syntax, I feel like I have super powers.
          </p>
        </Notes>
        <ButtonSet>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">Tailwind.css</button>
          </a>
          <a
            href="https://github.com/brianlovin/brian-lovin-next/pull/1175"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">
              <>
                <GitMerge size={16} />
                <span>View pull request</span>
              </>
            </button>
          </a>
        </ButtonSet>
      </TimelineEntry>

      <BlogPost
        timestamp="November 16, 2020"
        slug="design-to-save-people-from-themselves"
        title="Design to Save People from Themselves"
        description="How software can prevent people from making mistakes,
                    causing permanent damage, or bringing about the collapse of
                    democracy."
      />

      <TimelineEntry
        title="Created Waves wallpapers"
        timestamp="November 15, 2020"
        Icon={Zap}
        tint="purple"
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://gumroad.com/l/waves-premium-phone-wallpapers"
        >
          <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
              <h5 className="px-2 pt-2">Waves</h5>
              <p className="flex-1 px-2 font-normal">
                A custom-made set of 10 phone wallpapers, each with a unique
                color palette and design. I think they’re beautiful – I hope you
                like them, too!
              </p>
              <span />
              <div className="btn">View the collection</div>
            </div>
            <div className="hidden w-full md:w-1/2 md:inline-block">
              <Image
                width="640"
                height="698"
                layout="responsive"
                src="/static/img/waves/thumbnail.png"
                alt="preview of waves, a custom made set of phone wallpapers"
              />
            </div>
          </div>
        </a>
      </TimelineEntry>

      <TimelineEntry
        title="Twitter conversation"
        timestamp="November 14, 2020"
        Icon={Twitter}
        tint="blue"
      >
        <Notes>
          <blockquote>
            Are any designers out there making good passive income outside of
            your day job? What are you trying?
          </blockquote>
          <p>
            There were some really inspiring ideas in this thread about how to
            generate passive income as a designer. I didn’t realize there were
            real businesses being built on top of Figma plugins.
          </p>
        </Notes>
        <ButtonSet>
          <a
            href="https://twitter.com/brian_lovin/status/1327734503142354945?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <button className="w-full md:w-auto btn">
              <span>View tweet</span>
            </button>
          </a>
        </ButtonSet>
      </TimelineEntry>

      <BlogPost
        timestamp="November 9, 2020"
        slug="true-respect-is-the-difference"
        title="True Respect is the Difference"
        description="True respect is the difference between a fantastic collaborator and an asshole."
      />

      <TimelineEntry
        title="Visited Yosemite"
        timestamp="November 9, 2020"
        Icon={Camera}
        tint="gray"
      >
        <a
          href="https://twitter.com/brian_lovin/status/1325864903370924033"
          target="_blank"
          rel="nooopener noreferrer"
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <Image
              src="https://pbs.twimg.com/media/EmZqxm5VMAAO0mm?format=jpg&name=small"
              width="300"
              height="300"
              layout="responsive"
              className="rounded"
              alt="Photo of Yosemite valley"
            />
            <Image
              src="https://pbs.twimg.com/media/EmZqzgZVkAAsZTN?format=jpg&name=small"
              width="300"
              height="300"
              layout="responsive"
              className="rounded"
              alt="Photo of Yosemite valley"
            />
            <Image
              src="https://pbs.twimg.com/media/EmZqzgaU8AEeFFc?format=jpg&name=small"
              width="300"
              height="300"
              layout="responsive"
              className="rounded"
              alt="Photo of Yosemite valley"
            />
            <Image
              src="https://pbs.twimg.com/media/EmZqzgtVkAAnW6H?format=jpg&name=small"
              width="300"
              height="300"
              layout="responsive"
              className="rounded"
              alt="Photo of Yosemite valley"
            />
          </div>
        </a>
        <ButtonSet>
          <a
            href="https://unsplash.com/@brianlovin"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto btn"
          >
            Download on Unsplash
          </a>
        </ButtonSet>
      </TimelineEntry>

      <BlogPost
        timestamp="November 1, 2020"
        slug="writing-better-self-reviews"
        title="Writing Better Self Reviews"
        description="My tips and strategies for writing effective self reviews."
        divider={false}
      />
    </>
  )
}
