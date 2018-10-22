// @flow
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 968px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(auto, max-content));
  grid-gap: 32px;
  width: 100%;
  max-width: 968px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
`