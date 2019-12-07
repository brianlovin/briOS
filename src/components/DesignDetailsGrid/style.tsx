import styled from 'styled-components';
import defaultTheme from '~/components/Theme';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${defaultTheme.space[3]};
  grid-auto-rows: auto;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[0]};
  margin-top: ${defaultTheme.space[5]};

  a {
    border-radius: 16px;
    overflow: hidden;
    will-change: box-shadow;
  }

  a:hover {
    box-shadow: ${defaultTheme.shadows.largeHover};
    transition: box-shadow ${defaultTheme.animations.hover};
  }

  @media (min-width: ${defaultTheme.breakpoints[4]}) {
    padding: 0 ${defaultTheme.space[3]};
  }

  @media (max-width: ${defaultTheme.breakpoints[1]}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;