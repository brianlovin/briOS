import LoadingSpinner from '~/components/LoadingSpinner'

export default function FullscreenLoading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  )
}
