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

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${theme.space[3]};
  width: 100%;
  max-width: ${theme.breakpoints[4]};
  margin-top: ${theme.space[5]};

  a {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04);
    transition: box-shadow ${theme.animations.default};
  }

  a:hover {
    box-shadow: ${theme.shadows.largeHover};
    transition: box-shadow ${theme.animations.hover};
  }

  @media (max-width: ${theme.breakpoints[1]}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    grid-template-columns: repeat(1, 1fr);
  }
`

export const PreviewContentGrid = styled(ContentGrid)`
  a {
    overflow: hidden;
  }

  a:last-of-type {
    display: none;
  }

  @media (max-width: ${theme.breakpoints[1]}) {
    a:last-of-type {
      display: inline-block;
    }
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    grid-template-columns: repeat(1, 1fr);

    a:first-of-type {
      grid-column: 1;
    }
  }
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
  margin-top: -72px;
  gap: ${theme.space[3]};
`
