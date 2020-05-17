import styled from 'styled-components'

export const LeftDivider = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  width: 16px;
  height: 100%;
  border-left: 2px solid var(--border-primary);
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    border-left: 2px solid var(--text-quaternary);
  }
`
