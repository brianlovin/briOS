import { Menu, Transition } from '@headlessui/react'
import * as React from 'react'
import { MoreHorizontal } from 'react-feather'

import { GhostButton } from '~/components/Button'

export function CommentMenu({ handleDelete, handleEdit, comment }) {
  return (
    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100">
      <div className="relative inline-block text-left">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button as="div" className="z-0 inline-flex">
                <GhostButton
                  aria-label="Open comment actions menu"
                  size="small-square"
                >
                  <MoreHorizontal size={16} />
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
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-sm outline-none dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
                >
                  {comment.viewerCanEdit && (
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={handleEdit}
                            className={`${
                              active
                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                : 'text-gray-900 dark:text-gray-200'
                            } flex w-full cursor-pointer justify-between px-4 py-2 text-left text-sm leading-5`}
                          >
                            Edit
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  )}

                  {comment.viewerCanDelete && (
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={handleDelete}
                            className={`${
                              active
                                ? 'bg-red-50 text-red-500 dark:bg-red-500 dark:bg-opacity-10 dark:text-red-500'
                                : 'text-red-500 dark:text-red-500'
                            } flex w-full cursor-pointer justify-between px-4 py-2 text-left text-sm leading-5`}
                          >
                            Delete
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  )
}
