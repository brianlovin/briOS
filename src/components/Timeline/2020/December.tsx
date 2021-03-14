import Link from 'next/link'
import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'

export function December() {
  return (
    <>
      <DateEntry title="December, 2020" />

      <TimelineEntry title="Shut down Spec.fm" timestamp="December 26, 2020">
        <>
          <Notes>
            <p>
              This week we shut down <a href="https://spec.fm">Spec.fm</a>, a
              podcast network I co-founded in 2015. Sarah wrote a reflection on
              the last five years of operating the network, lessons we learned,
              and how much money the company made.
            </p>
            <p>
              <a href="https://designdetails.fm">Design Details</a> will
              continue as an independent podast – new episodes coming in 2021!
            </p>
          </Notes>
          <ButtonSet>
            <a
              href="https://medium.com/@sarahberus/a09fa8390000"
              className="btn"
            >
              Read the blog post
            </a>
          </ButtonSet>
        </>
      </TimelineEntry>

      <TimelineEntry title="Published my stack" timestamp="December 21, 2020">
        <>
          <Notes>
            <p>
              Over the years, I’ve been curating my list of favorite tools,
              apps, and independent software. Let me know what else I should
              try!
            </p>
          </Notes>
          <ButtonSet>
            <Link href="/stack" passHref>
              <a className="btn">View my stack &nbsp; &rarr;</a>
            </Link>
          </ButtonSet>
        </>
      </TimelineEntry>

      <BlogPost
        timestamp="December 20, 2020"
        slug="reasons-you-arent-updating-your-personal-site"
        title="Reasons You Aren't Updating Your Personal Site"
        description="Tips and strategies to painlessly manage a personal website."
      />

      <TimelineEntry
        title="Announced Staff.design"
        timestamp="December 6, 2020"
      >
        <a href="https://staff.design">
          <div className="relative overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div
              style={{ zIndex: 2 }}
              className="justify-center flex-auto px-3 pt-8 pb-8 space-y-1 md:items-center"
            >
              <h1 className="px-2 pt-2">Staff Design</h1>
              <p className="flex-1 px-2 pb-6 text-lg font-normal md:text-center">
                Navigating the individual contributor career path
              </p>
              <span />
              <div className="px-6 py-4 text-sm text-center hover:bg-opacity-10 filter-saturate filter-blur bg-gray-1000 bg-opacity-5 dark:bg-gray-50 text-primary">
                View the project
              </div>
            </div>
          </div>
        </a>
      </TimelineEntry>
    </>
  )
}
