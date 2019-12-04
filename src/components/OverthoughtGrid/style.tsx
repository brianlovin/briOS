import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 16px;
  grid-auto-rows: auto;
  width: 100%;
  max-width: 768px;
  margin-top: 32px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`