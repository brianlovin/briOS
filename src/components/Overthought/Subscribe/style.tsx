import styled from 'styled-components'
import defaultTheme from '~/components/Theme'
import { tint } from '~/components/utils'
import { P } from '~/components/Typography'

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: ${defaultTheme.space[3]};
  margin: ${defaultTheme.space[5]} 0 ${defaultTheme.space[3]};
  padding: ${defaultTheme.space[4]};
  background: ${props => props.theme.bg.inset};
  width: 100%;
  border-radius: 8px;
`

export const Form = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: ${defaultTheme.space[3]};
  margin-top: ${defaultTheme.space[2]};
  button {
    height: 100%;
  }

  @media(max-width: ${defaultTheme.breakpoints[4]}) {
    grid-template-columns: 1fr;
  }
`

export const Input = styled.input`
  padding: 10px ${defaultTheme.space[4]};
  border: 1px solid ${props => props.theme.border.default};
  color: ${props => props.theme.text.primary};
  border-radius: 24px;
  font-size: ${defaultTheme.fontSizes[2]};
  background: ${props => props.theme.bg.primary};

  &:focus {
    border: 1px solid ${props => props.theme.accent.blue};
    background: ${props => props.theme.bg.secondary};
  }
`

export const Success = styled.div`
  margin-top: ${defaultTheme.space[2]};
  padding: ${defaultTheme.space[2]} ${defaultTheme.space[4]};
  border: 1px solid ${props => tint(props.theme.accent.green, -8)};
  color: ${props => props.theme.text.onPrimary};
  font-weight: ${defaultTheme.fontWeights.link};
  background: ${props => props.theme.accent.green};
  border-radius: 24px;
  text-align: center;
  font-size: ${defaultTheme.fontSizes[2]};
  text-shadow: 0 1px 0 rgba(0,0,0,0.08);
`

export const Error = styled(P)`
  color: ${props => props.theme.accent.red};
  margin-left: ${defaultTheme.space[4]};
  padding-right: ${defaultTheme.space[4]};
`