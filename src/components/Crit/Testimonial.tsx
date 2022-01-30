import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import Button from '../Button'
import { ExternalLinkIcon } from '../Icon'

type TestimonialProps = {
  avatarSrc: string
  name: string
  quoteSrc: string
  productSrc: string
  productName: string
  quote: string
  reportSrc: string
}

export function Testimonial({
  testimonial,
}: {
  testimonial: TestimonialProps
}) {
  return (
    <div className="flex flex-col p-6 space-y-4 bg-gray-100 rounded-lg dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Image
          width="56"
          height="56"
          src={testimonial.avatarSrc}
          className="flex-none bg-gray-300 rounded-full"
        />
        <div className="flex flex-col flex-1">
          <Link href={testimonial.quoteSrc}>
            <a
              className="font-semibold text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {testimonial.name}
            </a>
          </Link>
          <a
            href={testimonial.productSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary"
          >
            {testimonial.productName}
          </a>
        </div>
        <Button
          size="large"
          target="_blank"
          rel="noopenener noreferrer"
          href={testimonial.reportSrc}
        >
          <span>View report</span>
          <ExternalLinkIcon />
        </Button>
      </div>
      <p className="prose prose-lg">
        <p>{testimonial.quote}</p>
      </p>
    </div>
  )
}
