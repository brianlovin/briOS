import styled from 'styled-components';
import defaultTheme from '~/components/Theme';

export const StyledCard = styled.div`
  padding: ${defaultTheme.space[4]};
  position: relative;
  border-radius: 16px;
  background: ${props => props.theme.bg.secondary};
  transition: box-shadow ${props => props.theme.animations.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.largeHover};
    transition: box-shadow ${props => props.theme.animations.hover};
    z-index: 2;
  }

  &:active {
    box-shadow: ${props => props.theme.shadows.largeHover};
  }
`;
