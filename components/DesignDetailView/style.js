// @flow
import styled from 'styled-components'
import { theme } from '../theme'
import { tint, Shadows } from '../globals'

export const Container = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
`

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 24px 0 0;

  @media (max-width: 968px) {
    align-items: flex-start;
    max-width: 100%;
  }
`

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const MediaContainer = styled.div`
  border-radius: 8px;
  background: ${tint(theme.bg.wash, -4)};
  margin: 32px 0 64px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 752px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    border-radius: 0;
  }
`

export const Video = styled.video`
  width: 100%;
  max-width: 320px;
`

export const DetailTitle = styled.h5`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.text.default};
  margin-bottom: 16px;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`

export const IconWrapper = styled.div`
  position: relative;
  width: calc(100% + 96px);
  margin-left: -48px;
  overflow: hidden;

  @media (max-width: 752px) {
    width: calc(100% + 32px);
    margin-left: -16px;
  }
`

export const IconContainer = styled.span`
  background: transparent;
  width: 64px;
  height: 88px;
  margin-top: 64px;
  display: flex;
  flex: 1 0 auto;
  min-height: 64px;
  min-width: 100%;
  overflow-x: scroll;
  position: relative;
  padding-top: 8px;
  padding-left: 48px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 752px) {
    padding-left: 16px;
    margin-top: 32px;
  }

  img {
    width: 64px;
    height: 64px;
    border-radius: 16px!important;
    background: ${theme.bg.wash};
  }

  &:first-child {
    margin-left: 0px;
  }

  .atvImg,
  .atvImg-container {
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }

  .atvImg,
  .atvImg-container,
  .atvImg-layers,
  .atvImg-shine,
  .atvImg-shadow {
    border-radius: 16px!important;
  }
`

export const Icon = styled.img`
  ${Shadows.default};
  border-radius: 16px;
  overflow: hidden;
  width: 64px;
  height: 64px;

  &:hover {
    ${Shadows.hover};
  }

  &:active {
    ${Shadows.active};
  }
`

export const LeftShadow = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background-image: linear-gradient(to right, ${theme.bg.wash}, transparent);
  z-index: 10;
  pointer-events: none;

  @media (max-width: 752px) {
    width: 16px;
  }
`

export const RightShadow = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background-image: linear-gradient(to left, ${theme.bg.wash} , transparent);
  z-index: 10;
  pointer-events: none;
`

export const LowOpacity = styled.div`
  opacity: 0.1;
  transition: opacity 0.2s ease-in-out;
  position: relative;

  &:hover {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    z-index: 11;
  }
`