import styled from 'styled-components'

export const LeftDivider = styled.div`
  position: absolute;
  left: ${(props) => (props.level > 0 ? 0 : '-20px')};
  height: 100%;
  width: 16px;
  border-left-width: 2px;
  border-left-style: solid;
  border-left-color: ${(props) =>
    props.level > 0 ? 'var(--border-primary)' : 'var(--text-link)'};
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    border-left-color: 2px solid var(--text-quaternary);
  }
`
