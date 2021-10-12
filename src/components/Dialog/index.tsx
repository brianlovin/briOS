import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { X } from 'react-feather'
import { GhostButton } from '../Button'

export default function DialogComponent({ trigger, title, children }) {
  let [isOpen, setIsOpen] = useState(false)
  let closeButtonRef = React.useRef(null)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <button type="button" onClick={openModal}>
        {trigger}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
          initialFocus={closeButtonRef}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-10 dark:bg-opacity-40" />
            </Transition.Child>

            <Transition.Child
              as={'div'}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-30"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed bottom-0 left-0 w-full pb-4 bg-white rounded-t-lg shadow-2xl dark:bg-gray-800 sm:bottom-auto sm:pb-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:left-1/2 sm:top-1/2 transform-gpu sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between w-full py-2 pl-4 pr-2 border-b border-gray-150 dark:border-gray-700">
                    <Dialog.Title
                      as="h3"
                      className="text-sm font-semibold text-left text-primary"
                    >
                      {title}
                    </Dialog.Title>
                    <GhostButton
                      size="small-square"
                      onClick={closeModal}
                      ref={closeButtonRef}
                    >
                      <X size={16} />
                    </GhostButton>
                  </div>

                  <div className="p-4">{children({ closeModal })}</div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
