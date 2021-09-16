import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'react-feather'
import routes from '~/config/routes'
import { SmallButton } from '~/components/Button'
import NewsletterSubscriptionBox from '../Newsletter'

export default function Intro() {
  const { stack, bookmarks, ama } = routes
  const projects = [ama, bookmarks, stack]

  return (
    <div className="justify-center w-full max-h-screen py-24 overflow-y-auto">
      <div className="grid items-start max-w-screen-md grid-cols-12 gap-6 px-4 mx-auto">
        <p className="col-span-2 text-right text-quaternary">Who</p>
        <p className="col-span-10 leading-normal prose">Brian Lovin</p>

        <p className="col-span-2 leading-relaxed text-right text-quaternary">
          What
        </p>
        <div className="col-span-10 prose text-primary">
          <p>
            I’m a designer, <a href="https://designdetails.fm">podcaster</a>,{' '}
            <Link href="/writing" passHref>
              <a>writer</a>
            </Link>
            , and <a href="https://github.com/brianlovin">software tinkerer</a>.
            I’m currently building{' '}
            <a href="https://github.com/mobile">native mobile apps at GitHub</a>
            .
          </p>

          <p>
            In the past I co-founded{' '}
            <a href="https://github.com/withspectrum/spectrum">Spectrum</a>, a
            platform for online communities. Before that, I worked at Facebook
            building payments systems, and cut my teeth as a product designer at{' '}
            <a href="https://buffer.com">Buffer</a>.
          </p>
        </div>

        <div className="col-span-2" />
        <div className="flex col-span-10 space-x-4">
          <SmallButton href="/about">
            <span>Learn more</span>
          </SmallButton>
          <SmallButton href="https://changelog.brianlovin.com">
            <span>View changelog</span>
          </SmallButton>
        </div>

        <p className="col-span-2 text-right text-quaternary">Where</p>
        <div className="col-span-10 pt-2">
          <Image
            src="/static/img/nyc.png"
            width={800}
            height={350}
            layout="responsive"
            className="rounded-2xl"
          />
          <p className="flex items-center justify-end pt-2 space-x-2 text-sm text-right text-quaternary">
            <MapPin size={12} />
            <span>Brooklyn, New York</span>
          </p>
        </div>

        <p className="col-span-2 text-right text-quaternary">Work</p>
        <div className="flex flex-col col-span-10 space-y-3">
          <a
            href="https://github.com/mobile"
            className="flex items-center space-x-4 group"
          >
            <span className="font-medium text-gray-1000 group-hover:underline group-hover:text-red-600 dark:group-hover:text-red-500 dark:text-gray-100">
              GitHub
            </span>
            <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-800" />
            <span className="flex-none text-tertiary">Product Designer</span>
            <span className="flex-none font-mono text-quaternary">
              2018-&nbsp;&nbsp;
            </span>
          </a>

          <a
            href="https://designdetails.fm"
            className="flex items-center space-x-4 group"
          >
            <span className="flex-none font-medium text-gray-1000 group-hover:underline group-hover:text-red-600 dark:group-hover:text-red-500 dark:text-gray-100">
              Design Details Podcast
            </span>
            <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-800" />
            <span className="flex-none text-tertiary">Co-host</span>
            <span className="flex-none font-mono text-quaternary">
              2014-&nbsp;&nbsp;
            </span>
          </a>
          <a
            href="https://github.com/withspectrum/spectrum"
            className="flex items-center space-x-4 group"
          >
            <span className="font-medium text-gray-1000 group-hover:underline group-hover:text-red-600 dark:group-hover:text-red-500 dark:text-gray-100">
              Spectrum.chat
            </span>
            <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-800" />
            <span className="flex-none text-tertiary">Co-founder</span>
            <span className="flex-none font-mono text-quaternary">2017-18</span>
          </a>
          <div className="flex items-center col-span-10 space-x-4">
            <span className="font-medium text-primary">Facebook</span>
            <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-800" />
            <span className="flex-none text-tertiary">Product Designer</span>
            <span className="flex-none font-mono text-quaternary">2015-17</span>
          </div>
          <a
            href="https://buffer.com"
            className="flex items-center space-x-4 group"
          >
            <span className="font-medium text-gray-1000 group-hover:underline group-hover:text-red-600 dark:group-hover:text-red-500 dark:text-gray-100">
              Buffer
            </span>
            <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-800" />
            <span className="flex-none text-tertiary">Product Designer</span>
            <span className="flex-none font-mono text-quaternary">2013-15</span>
          </a>
        </div>

        <p className="col-span-2 text-right text-quaternary">Newsletter</p>
        <div className="grid grid-cols-1 col-span-10">
          <div className="prose">
            <p>
              Get updates about new posts, new projects, or other meaningful
              updates to this site delivered to your inbox.
            </p>
          </div>
          <NewsletterSubscriptionBox />
        </div>
      </div>
    </div>
  )
}
