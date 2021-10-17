import * as React from 'react'
import {
  EmailSubscription,
  EmailSubscriptionType,
  useEditEmailSubscriptionMutation,
  useGetViewerWithSettingsQuery,
} from '~/graphql/types.generated'

interface Props {
  subscription: EmailSubscription
}

function EmailSubscriptionForm({ subscription }: Props) {
  const [subscribed, setSubscribed] = React.useState(subscription.subscribed)
  const [editEmailSubscription] = useEditEmailSubscriptionMutation({})

  function onChange() {
    setSubscribed((state) => {
      editEmailSubscription({
        variables: {
          data: {
            type: subscription.type,
            subscribed: !state,
          },
        },
      })

      return !state
    })
  }

  function getTitleSubtitle(type) {
    switch (type) {
      case EmailSubscriptionType.HackerNews: {
        return {
          title: 'Hacker News Daily Digest',
          subtitle:
            'A daily email with the top stories in tech discussed on Hacker News.',
        }
      }
      case EmailSubscriptionType.Newsletter: {
        return {
          title: 'Overthought Newsletter',
          subtitle:
            'A curated newsletter of design, development, and technology news. Delivered weekly-ish.',
        }
      }
      default: {
        return {
          title: null,
          subtitle: null,
        }
      }
    }
  }

  const { title, subtitle } = getTitleSubtitle(subscription.type)

  return (
    <label className="flex items-start space-x-4">
      <input
        type="checkbox"
        onChange={onChange}
        defaultChecked={subscribed}
        className="relative w-5 h-5 border border-gray-300 rounded top-0.5 dark:border-gray-700"
      />
      <div className="flex flex-col">
        <p className="font-medium text-primary">{title}</p>
        <p className="text-tertiary">{subtitle}</p>
      </div>
    </label>
  )
}

export function EmailPreferences() {
  const { data } = useGetViewerWithSettingsQuery()
  const { viewer } = data

  if (!viewer.email) {
    return (
      <div className="p-6 bg-gray-200 rounded-lg dark:bg-gray-800">
        Add an email address first
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-8">
      {viewer.emailSubscriptions.map((subscription) => (
        <EmailSubscriptionForm
          key={subscription.type}
          subscription={subscription}
        />
      ))}
    </div>
  )
}
