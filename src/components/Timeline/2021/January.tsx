import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { DateEntry, TimelineEntry } from '../Entry'

export function January() {
  return (
    <>
      <DateEntry title="January, 2021" />

      <BlogPost
        timestamp="January 30, 2021"
        slug="my-playbook-for-shipping-side-projects"
        title="My playbook for shipping side projects"
        description="Tips and strategies for releasing and maximizing the value of side projects."
      />

      <TimelineEntry timestamp="January 19, 2021" title="Launched Staff Design">
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

      <BlogPost
        timestamp="January 17, 2021"
        slug="becoming-a-better-interviewer"
        title="Becoming a better interviewer"
        description="What I've learned from studying the meta skills of great interviewers."
      />

      <BlogPost
        image="2020-in-review.jpg"
        timestamp="January 1, 2021"
        slug="2020-in-review"
        title="2020 in review"
        description="Looking back on 2020 and setting goals for the next year."
      />
    </>
  )
}
