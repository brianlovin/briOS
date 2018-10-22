// @flow
import styled, { css } from 'styled-components'
import { theme } from '../theme'
import { Truncate } from '../globals'

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 16px;
  width: 100%;
  max-width: 384px;
  background: ${theme.text.default};
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  z-index: 999;
  opacity: ${props => props.isVisible ? '1' : '0'};
  transform: translateY(${props => props.isVisible ? '-16px' : '80px'}) scale(1);
  transition: all 0.2s ease-in;
  display: flex;
  justify-content: center;
  flex-direction: column;
  transform-origin: center;

  &:active {
    transform: scale(0.98) translateY(-16px);
    transition: all 0.2s ease-in-out;
  }

  @media (max-width: 556px) {
    width: 100%;
    max-width: calc(100% - 32px);

    @media only screen 
    and (device-width : 375px) 
    and (device-height : 812px) 
    and (-webkit-device-pixel-ratio : 3) { 
      bottom: 20px;
    }
  }
`

export const ContentContainer = styled.div`
  display: flex;
  padding: 16px;
`

export const PodcastTitle = styled.h6`
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  display: block;
  ${Truncate(250)};
  cursor: pointer;
`

export const EpisodeTitle = styled.h5`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  margin-bottom: 8px;
  ${Truncate(300)};
  cursor: pointer;

  @media (max-width: 420px) {
    ${Truncate(256)};
  }
`

export const DismissContainer = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
`

export const IconContainer = styled.div`
  margin-right: 8px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 2px;
  cursor: pointer;
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const defaultThumbStyles = css`
  height: 16px;
  width: 16px;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  border: 2px solid ${theme.text.default};
`

const defaultTrackStyles = css`
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: rgba(255,255,255,0.6);
  border-radius: 4px;
`

const msFill = css`
  background: rgba(255,255,255,0.6);
  border-radius: 8px;
`

export const Scrubber = styled.input`
  -webkit-appearance: none;
  width: 100%;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;
    background: transparent; 
    border-color: transparent;
    color: transparent;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -6px; 
    ${defaultThumbStyles};
  }

  &::-moz-range-thumb {
    ${defaultThumbStyles};
  }

  &::-ms-thumb {
    ${defaultThumbStyles};
  }

  &::-webkit-slider-runnable-track {
    ${defaultTrackStyles};
  }

  &::-moz-range-track {
    ${defaultTrackStyles};
  }

  &::-ms-track {
    ${defaultTrackStyles};
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }

  &::-ms-fill-lower {
    background: #fff;
    border-radius: 8px;
  }

  &::-ms-fill-upper {
    ${msFill};
  }

  &::-moz-range-progress {
    background: #fff;
  }

  &:focus {
    outline: none;

    &::-webkit-slider-runnable-track {
      background: #fff;
    }

    &::-ms-fill-lower {
      background: #fff;
    }

    &::-ms-fill-upper {
      background: #fff;
    }
  }
`

export const StyledAudioPlayer = styled.audio`
  display: none;
`

export const SubscriptionsContainer = styled.div`
  padding: ${props => props.isVisible ? '16px' : '0 16px'};
  overflow: hidden;
  background: #2D2E33;
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: space-between;
  max-height: ${props => props.isVisible ? '64px' : '0'};
  transition: max-height 0.15s ease-out;

  a {
    height: 32px;
  }
`

export const SubscriptionAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${theme.bg.default};
`
