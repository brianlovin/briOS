import * as React from 'react'
import Link from 'next/link'

function ProjectsList() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Link passHref href="/startups">
          <a className="font-medium highlight-link-hover">Startup Jobs</a>
        </Link>

        <p className="text-tertiary">
          Connecting great designers with growing startups.
        </p>
      </div>

      <div className="space-y-1">
        <a
          href="https://staff.design"
          className="font-medium highlight-link-hover"
        >
          Staff Design
        </a>

        <p className="text-tertiary">
          A collection of interviews exploring how product designers navigate
          the individual contributor path to its highest levels.
        </p>
      </div>

      <div className="space-y-1">
        <Link passHref href="/stack">
          <a className="font-medium highlight-link-hover">My Stack</a>
        </Link>

        <p className="text-tertiary">
          A curated list of my favorite tools and software.
        </p>
      </div>

      <div className="space-y-1">
        <Link passHref href="/security">
          <a className="font-medium highlight-link-hover">Security Checklist</a>
        </Link>

        <p className="text-tertiary">
          Tools and resources for staying safe on the internet.
        </p>
      </div>

      <div className="space-y-1">
        <Link passHref href="/bookmarks">
          <a className="font-medium highlight-link-hover">Bookmarks</a>
        </Link>

        <p className="text-tertiary">Internet things, saved for later.</p>
      </div>

      <div className="space-y-1">
        <Link passHref href="/ama">
          <a className="font-medium highlight-link-hover">AMA</a>
        </Link>

        <p className="text-tertiary">Ask me anything.</p>
      </div>

      <div className="space-y-1">
        <Link passHref href="/hn">
          <a className="font-medium highlight-link-hover">Better Hacker News</a>
        </Link>

        <p className="text-tertiary">A better Hacker News.</p>
      </div>

      <div className="space-y-1">
        <Link passHref href="/app-dissection">
          <a className="font-medium highlight-link-hover">App Dissection</a>
        </Link>

        <p className="text-tertiary">
          In-depth explorations of visual and interaction design in well-known
          apps.
        </p>
      </div>
    </div>
  )
}

export default ProjectsList
