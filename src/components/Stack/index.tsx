import * as React from 'react'
import Image from 'next/image'
import data from './data'

export default function StackList() {
  const sorted = data.sort(function (a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
    return 0
  })

  return (
    <div className="mt-8">
      {sorted.map((stack) => {
        const hasBadges = stack.independent || stack.oss
        return (
          <a
            key={stack.name}
            className="flex py-4 bg-gray-400 bg-opacity-0 rounded md:-mx-4 sm:p-4 sm:hover:bg-opacity-5 sm:dark:hover:bg-gray-900 sm:dark:hover:bg-opacity-100"
            href={stack.url}
          >
            <Image
              src={`/static/img/stack/${stack.image}`}
              width={64}
              height={64}
              layout="fixed"
              alt={`${stack.name} icon`}
              className="border border-gray-100 rounded-xl dark:border-gray-900 flex-0"
            />

            <div className="justify-center flex-1 col-span-3 pl-5 space-y-2 ">
              <div className="space-y-1 ">
                <p className="mt-2 font-medium text-primary">{stack.name}</p>
                <p className="text-base font-normal leading-snug text-tertiary">
                  {stack.description}
                </p>
              </div>
              {hasBadges && (
                <div className="flex space-x-2">
                  {stack.independent && (
                    <span className="self-start rounded px-3 py-0.5 text-sm font-medium leading-5 tracking-wide dark:text-purple-400 dark:border-purple-400 text-purple-600 bg-purple-500 bg-opacity-5 dark:bg-opacity-20">
                      Indie
                    </span>
                  )}
                  {stack.oss && (
                    <span className="self-start rounded px-3 py-0.5 text-sm font-medium leading-5 tracking-wide dark:text-green-400 dark:border-green-400 text-green-600 bg-green-500 bg-opacity-5 dark:bg-opacity-20">
                      Open Source
                    </span>
                  )}
                </div>
              )}
            </div>
          </a>
        )
      })}
    </div>
  )
}
