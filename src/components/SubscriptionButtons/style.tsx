import styled, { css } from 'styled-components';
import defaultTheme from '../Theme';

export const SubscriptionsContainer = styled.div`
  padding: ${props => (props.isVisible ? '16px' : '0 16px')};
  border-radius: 0 0 8px 8px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(8, 1fr);
  justify-content: center;
  transition: max-height 0.15s ease-out;
  position: relative;
  top: -8px;
  padding: 24px 0 0;
  padding-top: 32px;
  z-index: 1;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[0]};

  a {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 968px) {
    grid-gap: 24px;
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const SubscriptionAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.bg.secondary};
  transform: scale(1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
    box-shadow: ${defaultTheme.shadows.largeHover};
  }
`;
