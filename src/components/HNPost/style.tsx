import styled from 'styled-components'

export const LeftDivider = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  width: 16px;
  height: 100%;
  border-left-width: 2px;
  border-left-style: solid;
  border-left-color: var(--border-primary);
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    border-left-color: 2px solid var(--text-quaternary);
  }
`
