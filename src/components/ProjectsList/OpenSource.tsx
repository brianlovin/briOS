import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'react-feather'

export default function OpenSource() {
  const projects = [
    {
      url: 'https://github.com/brianlovin/brian-lovin-next',
      name: 'brianlovin / brian-lovin-next',
      description: 'The code that powers this website you’re looking at.',
      image: `brian-lovin-next.png`,
    },
    {
      url: 'https://github.com/withspectrum/spectrum',
      name: 'withspectrum / spectrum',
      description: 'Simple, powerful online communities.',
      image: `spectrum.png`,
    },
    {
      url: 'https://github.com/designdetails/designdetails',
      name: 'designdetails / designdetails',
      description: 'The code that runs the Design Details website.',
      image: `design-details.png`,
    },
    {
      url: 'https://github.com/specfm/spec-next',
      name: 'specfm / spec-next',
      description:
        'A podcast network to help designers and developers level up.',
      image: `spec-next.png`,
    },
  ]

  return (
    <div>
      <div className="px-8 pb-6 space-y-1">
        <p className="text-lg font-semibold text-primary">Open source</p>
      </div>
      <div className="p-2 pt-2.5 overflow-hidden bg-gray-200 bg-opacity-50 rounded-lg dark:bg-gray-900">
        <div className="flex flex-col">
          {projects.map((project) => (
            <Link key={project.name} passHref href={project.url}>
              <a className="px-6 py-3 hover:bg-white shadow-none hover:shadow-sm transform-gpu hover:-translate-y-0.5 transition-all rounded-md dark:hover:bg-gray-800">
                <p className="font-medium text-primary">{project.name}</p>
                <p className="text-tertiary">{project.description}</p>
              </a>
            </Link>
          ))}
        </div>
        <a
          className="flex justify-between items-center px-6 py-4 hover:bg-white shadow-none hover:shadow-sm transform-gpu hover:-translate-y-0.5 transition-all rounded-md dark:hover:bg-gray-800"
          href={`https://github.com/brianlovin/`}
        >
          <p className="font-medium text-tertiary">View all</p>
          <p className="text-quaternary">
            <ArrowRight size={16} />
          </p>
        </a>
      </div>
    </div>
  )
}
