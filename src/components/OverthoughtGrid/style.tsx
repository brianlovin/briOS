import styled from 'styled-components'
import defaultTheme from '../Theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${defaultTheme.space[3]};
  grid-auto-rows: auto;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[2]};
  margin-top: 32px;
`