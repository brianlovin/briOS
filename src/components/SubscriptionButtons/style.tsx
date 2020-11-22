import styled from 'styled-components'
import theme from '~/components/Theme'

export const SubscriptionsContainer = styled.div`
  padding: ${theme.space[4]} 0 0;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(8, 1fr);
  justify-content: center;
  width: 100%;
  max-width: ${theme.breakpoints[0]};

  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 968px) {
    grid-gap: 24px;
    grid-template-columns: repeat(4, 1fr);
  }
`

export const SubscriptionAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  transform: scale(1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
    box-shadow: ${theme.shadows.largeHover};
  }
`
