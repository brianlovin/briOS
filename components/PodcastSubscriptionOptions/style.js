// @flow
import styled from 'styled-components'
import { tint } from '../globals'
import { theme } from '../theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 8px;
  align-items: center;
  margin-top: 32px;
  width: 100%;
`

export const Option = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  grid-template-rows: auto;
  grid-gap: 16px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.1s ease-in-out;

  &:hover {
    transition: all 0.1s ease-in-out;
    background: ${tint(theme.bg.wash, -3)};
  }

  &:active {
    background: ${tint(theme.bg.wash, -6)};
    transform: translateY(1px);
    transition: all 0.1s ease-in-out;
  }
`

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${theme.bg.default};
`

export const Label = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.text.secondary};
  align-items: center;
  display: flex;
`

export const Arrow = styled.span``