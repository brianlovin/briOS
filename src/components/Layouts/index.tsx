import styled from 'styled-components'
import Grid from '~/components/Grid'

export const CenteredColumn = styled(Grid)`
  grid-template-columns: 1fr;
  justify-content: center;
  width: 100%;
  max-width: 640px;

  @media (max-width: 640px) {
    min-width: 100%;
    max-width: 100%;
  }
`
