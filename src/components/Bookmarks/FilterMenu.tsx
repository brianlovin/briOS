import { Menu, Transition } from '@headlessui/react'
import * as React from 'react'
import { Check } from 'react-feather'

import { GhostButton } from '~/components/Button'
import { useGetTagsQuery } from '~/graphql/types.generated'

import { BookmarksContext } from './BookmarksList'

export function BookmarksFilterMenu() {
  const { data, loading } = useGetTagsQuery()
  const { tag, setTag } = React.useContext(BookmarksContext)

  if (loading) return null

  const { tags } = data

  const allowedTags = ['website', 'reading', 'portfolio']

  const filtered = tags.filter((t) => allowedTags.indexOf(t.name) >= 0)

  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block text-left">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button as="div" className="relative z-0 inline-flex">
                {tag && (
                  <div className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full dark:border-gray-900 top-1 right-1" />
                )}
                <GhostButton aria-label="Filter bookmarks" size="small-square">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.75 3C0.335786 3 0 3.33579 0 3.75C0 4.16421 0.335786 4.5 0.75 4.5H15.25C15.6642 4.5 16 4.16421 16 3.75C16 3.33579 15.6642 3 15.25 3H0.75ZM3 7.75C3 7.33579 3.33579 7 3.75 7H12.25C12.6642 7 13 7.33579 13 7.75C13 8.16421 12.6642 8.5 12.25 8.5H3.75C3.33579 8.5 3 8.16421 3 7.75ZM6 11.75C6 11.3358 6.33579 11 6.75 11H9.25C9.66421 11 10 11.3358 10 11.75C10 12.1642 9.66421 12.5 9.25 12.5H6.75C6.33579 12.5 6 12.1642 6 11.75Z"
                      fill="currentColor"
                    />
                  </svg>
                </GhostButton>
              </Menu.Button>

              <Transition
                show={open}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-sm outline-none dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex flex-col py-2 space-y-2">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => setTag(null)}
                          className={`${
                            active
                              ? 'bg-gray-100 dark:text-white text-gray-900 dark:bg-gray-700'
                              : 'text-gray-900 dark:text-gray-200'
                          } flex items-center space-x-2 cursor-pointer w-full text-sm text-secondary py-2 px-4`}
                        >
                          All bookmarks
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="flex flex-col py-2">
                    {filtered.map((t) => (
                      <Menu.Item key={t.name}>
                        {({ active }) => (
                          <a
                            onClick={() => setTag(t.name)}
                            className={`${
                              active
                                ? 'bg-gray-100 dark:text-white text-gray-900 dark:bg-gray-700'
                                : 'text-gray-900 dark:text-gray-200'
                            } flex items-center space-x-2 cursor-pointer w-full text-sm text-secondary capitalize py-2 px-4`}
                          >
                            {tag === t.name ? (
                              <Check size={16} />
                            ) : (
                              <span className="w-4" />
                            )}
                            <span>{t.name}</span>
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  )
}
