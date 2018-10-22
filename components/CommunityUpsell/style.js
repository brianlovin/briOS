// @flow
import styled from 'styled-components'
import { tint } from '../globals'

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.spectrum.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.spectrum.alt}, ${
      props.theme.spectrum.default
    })`};  
  border-radius: 8px;
  margin-top: 32px;

  &:hover {
    background: ${props => props.theme.spectrum.alt};
    background-image: ${props => `linear-gradient(to bottom, ${tint(props.theme.spectrum.alt, 4)}, ${tint(props.theme.spectrum.default, 4)})`};
  }
`

export const IconWrapper = styled.div`
  color: ${props => props.theme.bg.default};
  display: flex;
  align-items: center;
`

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
`

export const Title = styled.h4`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.bg.default};
  line-height: 1.3;
`

export const Subtitle = styled.h5`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.bg.default};
`