import * as React from 'react'
import toast from 'react-hot-toast'

import {
  EmailSubscription,
  EmailSubscriptionType,
  useEditEmailSubscriptionMutation,
  useGetViewerWithSettingsQuery,
} from '~/graphql/types.generated'

import { WritingSubscriptionForm } from '../Writing/SubscriptionForm'

interface Props {
  subscription: EmailSubscription
}

export function EmailSubscriptionForm({ subscription }: Props) {
  const [subscribed, setSubscribed] = React.useState(subscription.subscribed)
  const [editEmailSubscription] = useEditEmailSubscriptionMutation({
    onCompleted() {
      toast.success('Saved')
    },
  })

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
    <label className="flex items-start space-x-3">
      <input
        type="checkbox"
        onChange={onChange}
        defaultChecked={subscribed}
        className="relative top-1 h-4 w-4 rounded border border-gray-300 dark:border-gray-700"
      />
      <div className="flex flex-col">
        <p className="text-primary font-medium">{title}</p>
        <p className="text-tertiary">{subtitle}</p>
      </div>
    </label>
  )
}

export function EmailPreferences() {
  const { data } = useGetViewerWithSettingsQuery()
  const { viewer } = data

  return (
    <div className="flex flex-col space-y-8">
      {viewer.emailSubscriptions.map((subscription) => (
        <EmailSubscriptionForm
          key={subscription.type}
          subscription={subscription}
        />
      ))}
      <div className="pl-3">
        <p className="text-primary -mb-3 pl-4 font-medium">Newsletter</p>
        <WritingSubscriptionForm defaultValue={viewer.email} />
      </div>
    </div>
  )
}
