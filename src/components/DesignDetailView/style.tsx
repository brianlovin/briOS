import styled, { createGlobalStyle } from 'styled-components';
import { hexa } from '~/components/utils';
import defaultTheme from '~/components/Theme';

export const LinkOverrides = createGlobalStyle`
  p a {
    text-decoration: underline solid ${props => hexa(props.tint, 0.4)};
  }

  p a:hover {
    text-decoration: underline solid ${props => props.tint};
  }
`

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 24px 0 0;

  @media (max-width: 968px) {
    align-items: flex-start;
    max-width: 100%;
  }
`;

export const Icon = styled.img`
  box-shadow: ${defaultTheme.shadows.default};
  transition: box-shadow ${defaultTheme.animations.default};
  border-radius: 16px;
  overflow: hidden;
  width: 64px;
  height: 64px;

  &:hover {
    transition: box-shadow ${defaultTheme.animations.hover};
    box-shadow: ${defaultTheme.shadows.hover};
  }

  &:active {
    box-shadow: ${defaultTheme.shadows.hover};
  }
`;
