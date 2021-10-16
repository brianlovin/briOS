export function ErrorAlert({ children }) {
  return (
    <div className="px-4 py-3 text-sm text-red-700 bg-red-500 rounded-md dark:text-red-300 bg-opacity-10">
      {children}
    </div>
  )
}

export function SuccessAlert({ children }) {
  return (
    <div className="px-4 py-3 text-sm text-green-700 bg-green-500 rounded-md dark:text-green-400 bg-opacity-10">
      {children}
    </div>
  )
}

export function WarnAlert({ children }) {
  return (
    <div className="px-4 py-3 text-sm text-yellow-700 bg-yellow-500 rounded-md dark:text-yellow-400 bg-opacity-10">
      {children}
    </div>
  )
}
