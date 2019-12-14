import styled from 'styled-components';
import defaultTheme from '~/components/Theme';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  max-width: 100%;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: ${defaultTheme.breakpoints[4]};
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.defaultColumns || 3}, 1fr);
  grid-gap: ${defaultTheme.space[3]};
  grid-auto-rows: auto;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[0]};
  margin-top: ${defaultTheme.space[5]};

  a {
    overflow: hidden;
    border-radius: 16px;
    transition: box-shadow ${defaultTheme.animations.default};
  }

  a:hover {
    box-shadow: ${defaultTheme.shadows.largeHover};
    transition: box-shadow ${defaultTheme.animations.hover};
  }

  @media (max-width: ${defaultTheme.breakpoints[1]}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const PreviewContentGrid = styled(ContentGrid)`
  a {
    overflow: hidden;
  }

  a:last-of-type {
    display: none;
  }

  @media (max-width: ${defaultTheme.breakpoints[1]}) {
    grid-template-columns: repeat(2, 1fr);
    a:last-of-type {
      display: inline-block;
    }
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
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
  padding: 0 ${defaultTheme.space[3]};
  padding-top: ${defaultTheme.space[7]};
  padding-bottom: ${defaultTheme.space[9]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    max-width: 100%;
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: ${defaultTheme.space[9]};
  width: 100%;
  max-width: ${defaultTheme.breakpoints[3]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    max-width: 100%;
    margin-top: ${defaultTheme.space[8]};
  }
`;