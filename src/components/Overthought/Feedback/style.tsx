import styled from 'styled-components'
import theme from '~/components/Theme'
import { P } from '~/components/Typography'

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: ${theme.space[3]};
  padding: ${theme.space[4]};
  background: var(--bg-inset);
  width: 100%;
  border-radius: 8px;

  @media (max-width: ${theme.breakpoints[5]}) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
    border-radius: 0;
    border-top: 1px solid var(--border-primary);
    border-bottom: 1px solid var(--border-primary);
  }
`

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${theme.space[3]};

  button {
    height: 100%;
    justify-self: flex-end;
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    grid-template-columns: 1fr;
  }
`

export const Textarea = styled.textarea`
  padding: ${theme.space[3]};
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: ${theme.space[2]};
  font-size: 16px;
  background: var(--bg-primary);
  resize: vertical;

  &:focus {
    border: 1px solid var(--accent-blue);
    background: var(--bg-secondary);
  }
`

export const InputGrid = styled.div`
  display: grid;
  grid-gap: ${theme.space[3]};
  grid-template-columns: auto;

  @media (max-width: ${theme.breakpoints[4]}) {
    grid-template-columns: 1fr;
  }
`

export const Success = styled.div`
  padding: ${theme.space[2]} ${theme.space[4]};
  border: 1px solid var(--accent-green);
  color: var(--text-on-primary);
  font-weight: ${theme.fontWeights.link};
  background: var(--accent-green);
  border-radius: 8px;
  text-align: center;
  font-size: ${theme.fontSizes[1]};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
`

export const Error = styled(P)`
  color: var(--accent-red);
  margin-left: ${theme.space[4]};
  padding-right: ${theme.space[4]};
`

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: ${theme.fontSizes[0]};
  color: var(--text-quaternary);

  span {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
`
