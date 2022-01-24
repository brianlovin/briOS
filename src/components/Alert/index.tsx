export function ErrorAlert({ children }) {
  return (
    <div className="rounded-md bg-red-500 bg-opacity-10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
      {children}
    </div>
  )
}

export function SuccessAlert({ children }) {
  return (
    <div className="rounded-md bg-green-500 bg-opacity-10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
      {children}
    </div>
  )
}

export function WarnAlert({ children }) {
  return (
    <div className="rounded-md bg-yellow-500 bg-opacity-10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
      {children}
    </div>
  )
}
