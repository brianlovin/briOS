import styled from 'styled-components'
import theme from '~/components/Theme'

export default styled.textarea`
  padding: ${theme.space[3]};
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: ${theme.space[2]};
  font-size: 16px;
  background: var(--bg-primary);
  resize: vertical;
  width: 100%;
  line-height: ${theme.lineHeights.body};

  &:focus {
    border: 1px solid var(--accent-blue);
    background: var(--bg-secondary);
  }
`
