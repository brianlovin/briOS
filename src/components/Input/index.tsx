import styled from 'styled-components'
import theme from '~/components/Theme'

export default styled.input`
  padding: 12px ${theme.space[3]};
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: 4px;
  font-size: 16px;
  background: var(--bg-primary);
  width: 100%;
  line-height: 1.4;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.04);

  &:focus {
    border: 1px solid var(--accent-blue);
    background: var(--bg-secondary);
    outline: none;
  }
`
