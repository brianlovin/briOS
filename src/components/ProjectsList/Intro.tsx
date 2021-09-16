import * as React from 'react'
import Link from 'next/link'
import Button from '~/components/Button'

export default function Intro() {
  return (
    <div className="space-y-8 md:items-center">
      <div className="prose lg:prose-xl text-primary">
        <p>
          Hey, I’m Brian. I’m a designer,{' '}
          <a href="https://designdetails.fm">podcaster</a>,{' '}
          <Link href="/writing" passHref>
            <a>writer</a>
          </Link>
          , and <a href="https://github.com/brianlovin">software tinkerer</a>.
          I’m currently building{' '}
          <a href="https://github.com/mobile">native mobile apps at GitHub</a>.
        </p>

        <p>
          In the past I co-founded{' '}
          <a href="https://github.com/withspectrum/spectrum">Spectrum</a>, a
          platform for online communities. Before that, I worked at Facebook
          building payments systems, and cut my teeth as a product designer at
          Buffer.
        </p>
      </div>
      <div className="flex flex-col space-y-3 md:space-x-4 md:space-y-0 md:flex-row">
        <Button href="/about">Learn more about me</Button>
        <Button href="https://changelog.brianlovin.com">My changelog</Button>
      </div>
    </div>
  )
}
