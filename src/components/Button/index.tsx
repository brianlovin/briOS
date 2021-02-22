export default function Button(props) {
  return (
    <button
      className="flex items-center justify-center flex-none px-4 py-2 space-x-3 font-mono font-medium bg-white border disabled:text-gray-400 dark:bg-white disabled:bg-opacity-0 text-primary hover:bg-opacity-10 focus:border-gray-1000 focus:ring-0 focus:outline-none"
      {...props}
    />
  )
}
