import styled from 'styled-components';
import theme from '../theme';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  grid-auto-rows: auto;
  width: 100%;
  max-width: 1440px;
  margin-top: 32px;
  padding: 0 16px;

  a {
    border-radius: 16px;
    overflow: hidden;
    will-change: box-shadow;
  }

  a:hover {
    box-shadow: ${theme.shadows.heavyHover};
    transition: box-shadow ${theme.animations.hover};
  }

  @media (max-width: 1256px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 968px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;