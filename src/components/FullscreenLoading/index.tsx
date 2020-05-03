import LoadingSpinner from '~/components/LoadingSpinner'
import { FullscreenContainer, FullscreenContent } from '~/components/Page/style'

export default function FullscreenLoading() {
  return (
    <FullscreenContainer>
      <FullscreenContent>
        <LoadingSpinner />
      </FullscreenContent>
    </FullscreenContainer>
  )
}
