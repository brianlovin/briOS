// @flow
import styled from 'styled-components'
import { theme } from '../theme'

export const IconContainer = styled.div`
  margin-right: 8px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 2px;
  color: #fff;
`

export const MiniPlayBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 24px 6px 20px;
  background: ${theme.text.default};
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  margin-right: 12px;

  &:active {
    transform: scale(0.96);
    transition: transform 0.1s ease-in-out;
  }
`

export const Label = styled.p`
  font-size: 16px;
  color: #fff;
  font-weight: 600;
`
