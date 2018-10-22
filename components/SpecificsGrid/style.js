// @flow
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  grid-gap: 32px;
  max-width: 968px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
`

export const Art = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0 0;
  margin-bottom: -6px;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;

  button {
    margin-top: 24px;
    width: 100%;
  }
`

export const Title = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  margin-bottom: 4px;
`

export const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.tertiary};
  line-height: 1.5;
`