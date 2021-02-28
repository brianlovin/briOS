export function ErrorAlert({ children }) {
  return (
    <p className="p-2 text-center text-red-600 bg-red-500 bg-opacity-5">
      {children}
    </p>
  )
}

export function SuccessAlert({ children }) {
  return (
    <p className="p-2 text-center text-green-700 bg-green-500 bg-opacity-5">
      {children}
    </p>
  )
}
