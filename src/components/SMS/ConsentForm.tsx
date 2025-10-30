import * as React from 'react'

import { PrimaryButton } from '~/components/Button'
import { Input } from '~/components/Input'

export function ConsentForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    consent: false,
  })
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This is a cosmetic form - no actual submission
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const isFormValid =
    formData.name && formData.email && formData.phone && formData.consent

  if (submitted) {
    return (
      <div className="h-screen w-full overflow-y-auto">
        <div className="space-y-8 max-w-lg mx-auto py-32">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="text-primary font-bold text-2xl">
                Consent Confirmed
              </h1>
              <p className="text-secondary">
                Thank you for opting in to receive SMS messages from Brian's
                Notion SMS service.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-20">
              <p className="text-sm text-primary font-medium">
                What happens next?
              </p>
              <ul className="text-sm text-secondary space-y-2 text-left">
                <li>
                  ✓ You’ll start receiving SMS messages at {formData.phone}
                </li>
                <li>✓ Send messages to create Notion database entries</li>
                <li>✓ Add items to your reading list via text</li>
                <li>✓ Set reminders and take notes on the go</li>
              </ul>
            </div>

            <div className="text-xs text-tertiary pt-4">
              <p>
                You can opt out at any time by replying STOP to any message.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full overflow-y-auto">
      <div className="space-y-8 max-w-lg mx-auto py-32">
        <div className="space-y-3">
          <h1 className="text-primary font-bold text-2xl">
            SMS Messaging Consent
          </h1>
          <p className="text-secondary">
            Sign up to receive SMS messages from Brian's Notion SMS service.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary mb-2"
              >
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-primary mb-2"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-20">
            <div className="flex items-start space-x-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                required
              />
              <label
                htmlFor="consent"
                className="text-sm text-primary font-medium cursor-pointer select-none"
              >
                I agree to receive SMS text messages from Brian's Notion SMS
              </label>
            </div>

            <div className="text-xs text-secondary space-y-2 pl-7">
              <p>
                By checking this box, I consent to receive text messages
                including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Personal reminders and notes</li>
                <li>Reading list additions</li>
                <li>Database entries</li>
              </ul>
              <p>Message frequency varies. Message and data rates may apply.</p>
              <p className="font-medium">
                Reply STOP to cancel, HELP for help.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <PrimaryButton type="submit" disabled={!isFormValid} size="large">
              Submit Consent
            </PrimaryButton>
          </div>
        </form>

        <div className="text-xs text-tertiary pt-4 border-t border-gray-200 dark:border-gray-800">
          <p>
            This service is operated by brianlovin.com. Your information will be
            used solely for SMS messaging purposes and will not be shared with
            third parties.
          </p>
        </div>
      </div>
    </div>
  )
}
