import * as React from 'react'
import Link from 'next/link'
import routes from '~/config/routes'
import Image from 'next/image'

const { security, stack, bookmarks, ama, hn, appDissection } = routes

const projects = [ama, bookmarks, security, stack, hn, appDissection]

export default function SideProjects() {
  return (
    <div className="grid gap-2 grid-cols-2 p-2 pt-2.5  rounded-lg">
      {projects.map((project, i) => (
        <Link key={project.seo.title} passHref href={project.path}>
          <a className="transition-all block transform-gpu rounded-md shadow-none hover:border-gray-100 border border-transparent hover:-translate-y-0.5 text-primary hover:bg-white dark:hover:bg-gray-800 hover:shadow-md">
            <div className="flex items-center p-4 space-x-4">
              <Image
                src={project.icon}
                width={56}
                height={56}
                layout={'fixed'}
                quality={100}
              />
              <div>
                <p className="font-semibold text-primary">
                  {project.seo.title}
                </p>
                <p className="text-tertiary">{project.seo.description}</p>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}
