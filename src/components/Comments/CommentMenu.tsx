import * as React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { GhostButton } from '../Button'
import { MoreHorizontal } from 'react-feather'

export function CommentMenu({ handleDelete, handleEdit }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block text-left">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button as="div" className="z-0 inline-flex">
                <GhostButton size="small-square">
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
                  className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-sm outline-none dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={handleEdit}
                          className={`${
                            active
                              ? 'bg-gray-100 dark:text-white text-gray-900 dark:bg-gray-700'
                              : 'text-gray-900 dark:text-gray-200'
                          } flex cursor-pointer justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                        >
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                  </div>

                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={handleDelete}
                          className={`${
                            active
                              ? 'bg-red-50 dark:text-red-500 text-red-500 dark:bg-red-500 dark:bg-opacity-10'
                              : 'text-red-500 dark:text-red-500'
                          } flex justify-between cursor-pointer w-full px-4 py-2 text-sm leading-5 text-left`}
                        >
                          Delete
                        </a>
                      )}
                    </Menu.Item>
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
