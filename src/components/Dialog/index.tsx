import { Dialog, Transition } from '@headlessui/react'
import * as React from 'react'
import { Fragment, useState } from 'react'
import { X } from 'react-feather'

import { GhostButton } from '~/components/Button'

interface DialogProps {
  trigger?: React.ReactElement
  children?: Function
  title: String
  modalContent: Function
}

export function DialogComponent({
  trigger = null,
  children = null,
  title,
  modalContent,
}: DialogProps) {
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
      {trigger && <div onClick={openModal}>{trigger}</div>}

      {/* 
        Rendering children as a function here allows us to
        wrap any component in a dialog handler, while still rendering
        that component. For example, we can wrap the CommentForm component
        in a dialog, render the comment form itself, but pass it the SignIn
        dialog's openModal and closeModal handlers. Those handlers can then
        be invoked programatically in the CommentForm if a user tries to
        send a comment without being signed in.  
      */}
      {children && children({ closeModal, openModal })}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
          initialFocus={closeButtonRef}
        >
          <div className="min-h-screen px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <Transition.Child
              as={'div'}
              className="h-screen w-screen"
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-30"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed bottom-0 left-0 max-h-screen w-full transform-gpu overflow-y-auto rounded-t-xl border border-gray-200 bg-white pb-10 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-2xl sm:bottom-auto sm:!top-1/2 sm:left-1/2 sm:max-w-sm sm:-translate-x-1/2 sm:rounded-xl sm:pb-0 md:max-w-md lg:max-w-lg">
                <div className="flex flex-col">
                  <div className="sticky top-0 flex w-full items-center justify-between border-b border-gray-150 bg-white py-2 pl-4 pr-2 dark:border-gray-700 dark:bg-gray-800">
                    <Dialog.Title
                      as="h3"
                      className="text-primary text-left text-sm font-semibold"
                    >
                      {title}
                    </Dialog.Title>
                    <GhostButton
                      aria-label="Close dialog"
                      size="small-square"
                      ref={closeButtonRef}
                      onClick={closeModal}
                    >
                      <X size={16} />
                    </GhostButton>
                  </div>

                  <div className="overflow-y-auto">
                    {/* 
                      A dialog must receive modal content to be rendered
                      once the dialog is opened. That dialog content receives
                      open and close handlers so that a dialog can be closed
                      programatically. For example, after creating a bookmark
                      we can close the dialog and then redirect the user
                      to the new bookmark view.
                    */}
                    {modalContent({ closeModal, openModal })}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
