import styled from 'styled-components'

export const FeaturedImage = styled.img`
  width: calc(100% + 48px);
  min-height: 256px;
  margin-left: -24px;
  margin-right: -24px;
  border-radius: 8px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 0;
    margin: 0;
    margin-bottom: 24px;
  }
`
