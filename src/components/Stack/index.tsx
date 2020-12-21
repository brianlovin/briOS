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
    <div className="flex flex-col mt-16">
      {sorted.map((stack) => {
        const hasBadges = stack.independent || stack.oss
        return (
          <a
            key={stack.name}
            className="flex py-4 rounded-lg sm:p-4 sm:hover:bg-gray-100 sm:dark:hover:bg-gray-900"
            href={stack.url}
            target="_blank"
            rel="nooopener noreferrer"
          >
            <Image
              src={`/static/img/stack/${stack.image}`}
              width={64}
              height={64}
              layout="fixed"
              alt={`${stack.name} icon`}
              className="border border-gray-100 dark:border-gray-900 rounded-xl flex-0"
            />
            <div className="flex flex-col justify-center flex-1 col-span-3 pl-5 space-y-2">
              <div className="flex flex-col">
                <p>{stack.name}</p>
                <p className="text-base font-normal text-gray-600 dark:text-gray-400">
                  {stack.description}
                </p>
              </div>
              {hasBadges && (
                <div className="flex space-x-2">
                  {stack.independent && (
                    <span className="self-start px-3 py-0.5 text-xs font-medium leading-5 tracking-wide dark:text-purple-400 dark:border-purple-400 text-purple-600 border border-purple-600 rounded-full">
                      Indie
                    </span>
                  )}
                  {stack.oss && (
                    <span className="self-start px-3 py-0.5 text-xs font-medium leading-5 tracking-wide dark:text-green-400 dark:border-green-400 text-green-600 border border-green-600 rounded-full">
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
