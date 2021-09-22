import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'react-feather'

export function Dialog({ children, ...props }) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Overlay className="fixed inset-0 z-20 flex items-center justify-center transition-opacity duration-200 ease-in-out bg-black bg-opacity-40 dark:bg-opacity-50" />
      {children}
    </DialogPrimitive.Root>
  )
}

export const DialogContent = React.forwardRef(
  ({ children, title, ...props }, forwardedRef) => (
    <DialogPrimitive.Content
      className="fixed bottom-0 w-full pb-16 bg-white shadow-lg dark:bg-gray-800 sm:bottom-auto sm:pb-0 rounded-t-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:animate-modalEnter sm:left-1/2 sm:top-1/2 transform-gpu sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none"
      {...props}
      ref={forwardedRef}
    >
      <div className="flex flex-col">
        <div className="flex justify-between w-full p-3 border-b border-gray-150 dark:border-gray-700">
          <DialogPrimitive.Title className="text-sm font-semibold transform-gpu text-primary line-clamp-1">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close>
            <X size={16} className="text-primary" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </div>
    </DialogPrimitive.Content>
  )
)

export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
