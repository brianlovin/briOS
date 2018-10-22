// @flow
import styled from 'styled-components'
import { theme } from '../theme'

export const Dismiss = styled.button`
  display: flex;
  width: 18px;
  height: 18px;
  background: none;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: ${props => props.tint ? props.tint(theme) : theme.text.tertiary};
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
    background: ${theme.text.tertiary};
    color: ${theme.bg.default};
  }

  i {
    position: relative;
    top: -1px;
    font-style: normal;
    font-size: 18px;
    line-height: 1;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`