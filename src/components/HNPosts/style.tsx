import styled from 'styled-components'
import { A } from '~/components/Typography'

export const StyledA = styled(A)`
  padding: 4px 24px 6px;
  border-radius: 4px;
  color: ${(props) =>
    props.active ? 'var(--text-link)' : 'var(--text-primary)'};
  font-size: 14px;
  font-weight: 600;
  background: ${(props) =>
    props.active ? 'rgba(var(--text-link-rgb), 0.08)' : 'none'};

  &:hover {
    color: var(--text-link);
    background: rgba(var(--text-link-rgb), 0.08);
  }
`
