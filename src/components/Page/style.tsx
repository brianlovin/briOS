import styled from 'styled-components'
import theme from '~/components/Theme'

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  max-width: 100%;
`

export const ContentContainer = styled.div`
  width: 100%;
  max-width: ${theme.breakpoints[5]};
`

export const InnerPageContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex: 1 0 auto;
  width: 100%;
  padding: 0 ${theme.space[3]};
  padding-top: ${theme.space[9]};
  padding-bottom: ${theme.space[9]};

  @media (max-width: ${theme.breakpoints[4]}) {
    max-width: 100%;
  }
`

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: ${theme.breakpoints[5]};

  @media (max-width: ${theme.breakpoints[4]}) {
    max-width: 100%;
  }
`

export const FullscreenContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  justify-items: center;
  padding: 72px 24px;
  min-height: 100%;
`

export const FullscreenContent = styled.div`
  display: grid;
  text-align: center;
  grid-auto-rows: min-content;
  align-items: center;
  justify-content: center;
  justify-items: center;
  gap: ${theme.space[3]};
`
