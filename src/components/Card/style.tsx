import styled from 'styled-components';
import { Shadows } from '../globals';

export const StyledCard = styled.div`
  position: relative;
  background: ${props => props.theme.bg.default};
  transition: box-shadow ${props => props.theme.animations.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.heavyHover};
    transition: box-shadow ${props => props.theme.animations.hover};
    z-index: 2;
  }

  &:active {
    ${Shadows.active};
  }
`;
