// @flow
import styled from 'styled-components'
import { Shadows } from '../globals'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 128px);
  grid-template-rows: auto-fill;
  grid-gap: 16px;
  width: 100%;
  margin-top: 24px;

  > a {
    min-width: 128px;
    height: 196px;
    width: 128px;
  }

  @media (max-width: 752px) {
    display: flex;
    overflow-x: scroll;
    width: calc(100% + 32px);
    margin-left: -16px;
    padding-top: 4px;
    padding-bottom: 4px;
    position: relative;

    &::-webkit-scrollbar {
      display: none;
    }

    > a {
      margin-left: 16px;
    }

    > a:last-of-type {
      margin-right: 16px;
    }
  }
`

export const Spacer = styled.div`
  display: none;
  height: 196px;
  position: relative;
  min-width: 1px;

  @media (max-width: 752px) {
    display: block;
  }
`

export const Artwork = styled.img`
  ${Shadows.default};
  border-radius: 8px;
  overflow: hidden;
  width: 128px;
  height: 196px;

  &:hover {
    ${Shadows.hover};
  }

  &:active {
    ${Shadows.active};
  }
`