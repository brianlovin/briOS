import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import Button from '../Button'
import { ExternalLinkIcon, YouTubeIcon } from '../Icon'

type TestimonialProps = {
  avatarSrc: string
  name: string
  quoteSrc: string
  productSrc: string
  productLogo: string
  productName: string
  quote: string
  youtube: string
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
        <Link
          href={testimonial.quoteSrc}
          className="font-semibold text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            width={56}
            height={56}
            alt="testimonial avatar"
            src={testimonial.avatarSrc}
            className="flex-none bg-gray-300 rounded-full"
          />
        </Link>
        <div className="flex flex-col flex-1">
          <Link
            href={testimonial.quoteSrc}
            className="font-semibold text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {testimonial.name}
          </Link>
          <div className="flex items-center space-x-1.5">
            <Image
              alt="product logo"
              src={testimonial.productLogo}
              width={16}
              height={16}
              className="rounded"
            />
            <a
              href={testimonial.productSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary"
            >
              {testimonial.productName}
            </a>
          </div>
        </div>
        {testimonial.reportSrc && (
          <Button
            size="large"
            target="_blank"
            rel="noopenener noreferrer"
            href={testimonial.reportSrc}
          >
            <span>View report</span>
            <ExternalLinkIcon />
          </Button>
        )}
      </div>
      <p className="prose prose-lg">
        <p>{testimonial.quote}</p>
      </p>
      {testimonial.youtube && (
        <div className="relative w-full pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-md"
            src={testimonial.youtube}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}
