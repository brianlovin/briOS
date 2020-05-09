import styled from 'styled-components'
import theme from '~/components/Theme'

export default styled.input`
  padding: 10px ${theme.space[3]};
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: 4px;
  font-size: 16px;
  background: var(--bg-secondary);
  width: 100%;

  &:focus {
    border: 1px solid var(--accent-blue);
    background: var(--bg-secondary);
    outline: none;
  }
`
