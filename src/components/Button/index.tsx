export default function Button(props) {
  return (
    <button
      className="flex items-center justify-center flex-none px-4 py-2 space-x-3 font-mono font-medium bg-white border border-gray-200 dark:border-gray-800 disabled:opacity-50 dark:bg-white dark:bg-opacity-10 disabled:bg-opacity-0 text-primary hover:border-gray-300 focus:border-gray-1000 focus:ring-0 focus:outline-none"
      {...props}
    />
  )
}
