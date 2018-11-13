// @flow
import styled from 'styled-components';
import { Shadows } from '../globals';

export const StyledCard = styled.div`
  position: relative;
  background: ${props => props.theme.bg.default};
  border-radius: 8px;
  ${Shadows.default};

  &:hover {
    ${Shadows.hover};
  }

  &:active {
    ${Shadows.active};
  }
`;
