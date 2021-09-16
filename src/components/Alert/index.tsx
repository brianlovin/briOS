export function ErrorAlert({ children }) {
  return (
    <p className="px-4 py-3 mt-2 text-sm text-red-700 bg-red-500 rounded-md dark:text-red-300 bg-opacity-10">
      {children}
    </p>
  )
}

export function SuccessAlert({ children }) {
  return (
    <p className="px-4 py-3 mt-2 text-center text-green-700 bg-green-500 rounded-md dark:text-green-400 bg-opacity-10">
      {children}
    </p>
  )
}
