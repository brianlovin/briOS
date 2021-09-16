import * as React from 'react'
import NewsletterSubscriptionBox from '.'

export default function InlineNewsletterSubscribeBox() {
  return (
    <div
      className="p-8 -mx-4 space-y-4 bg-gray-200 bg-opacity-50 rounded-lg md:-mx-8"
      data-cy="writing-subscribe-box"
    >
      <div className="space-y-2 ">
        <p className="flex items-center text-lg font-semibold text-primary">
          The email newsletter
        </p>
        <p className="text-lg text-tertiary">
          Get updates about new posts, new projects, or other meaningful updates
          to this site delivered to your inbox. Alternatively, you can{' '}
          <a
            href="https://twitter.com/brian_lovin/"
            className="font-normal rounded-sm px-0.5 -mx-0.5 bg-blue-500 text-primary bg-opacity-20 hover:bg-opacity-30 dark:hover:bg-opacity-100"
          >
            follow me on Twitter
          </a>
          .
        </p>
      </div>
      <NewsletterSubscriptionBox />
    </div>
  )
}
