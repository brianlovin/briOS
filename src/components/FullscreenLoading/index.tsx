import LoadingSpinner from '~/components/LoadingSpinner'

export default function FullscreenLoading() {
  return (
    <div className="flex items-center justify-center flex-1 w-full h-full min-h-full">
      <LoadingSpinner />
    </div>
  )
}
