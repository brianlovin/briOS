// @flow
import styled from 'styled-components'
import { tint } from '../globals'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  max-width: 100%;
`

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1 0 auto;
  padding-top: 64px;
  padding-left: 32px;
  padding-right: 32px;
  position: relative;
  width: 100%;
  max-width: 768px;

  @media (max-width: 968px) {
    align-items: flex-start; 
    max-width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 96px;
  }
`

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 72px 0 0;

  @media (max-width: 968px) {
    align-items: flex-start;
    max-width: 100%;
  }
`

export const Heading = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};

  @media (max-width: 968px) {
    text-align: left; 
    max-width: 100%;
  }
`

export const Subheading = styled.h4`
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.text.tertiary};
  
  @media (max-width: 968px) {
    text-align: left;  
    max-width: 100%;
  }
`

export const ScrollToTop = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 16px;
  right: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  transition: all 0.2s ease-in-out;
  opacity: ${props => props.isVisible ? '1' : '0'};
  background: ${props => props.theme.text.default};
  color: ${props => props.theme.bg.default};
  transform: translateY(${props => props.isVisible ? '0' : '80px'});
  cursor: pointer;
  z-index: 9999;

  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.10);
    transform: translateY(-3px);
    transition: all 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 6px 20px rgba(0,0,0,0.09);
    transform :translateY(-2px);
    transition: all 0.2s ease-in-out;
    background: ${props => tint(props.theme.text.default, -4)};
  }

  .icon {
    transform: rotate(270deg);
  }

  @media (max-width: 968px) {
    bottom: 16px;
    right: 16px;
  }

  @media (max-width: 556px) {
    display: none;
  }
`