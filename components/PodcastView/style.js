// @flow
import styled from 'styled-components'

export const Grid = styled.div`
  margin-top: 64px;
  display: grid;
  grid-template-columns: 280px minmax(min-content, max-content);
  grid-gap: 64px;
  grid-template-rows: auto;
  grid-template-areas: "sidebar content";
  max-width: 968px;

  @media (max-width: 968px) {
    grid-template-columns: 240px minmax(min-content, max-content);
    grid-gap: 32px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: "content" "sidebar";
    grid-gap: 16px;
  }
`

export const Sidebar = styled.div`
  grid-area: sidebar;
`

export const Content = styled.div`
  grid-area: content;
`

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  letter-spacing: 0.8px;
  margin-bottom: 4px;
  margin-top: 24px;
`

export const Description = styled.h2`
  font-size: 22px;
  font-weight: 400;
  color: ${props => props.theme.text.tertiary};
  line-height: 1.4;
`

export const Divider = styled.div`
  position: relative;
  height: 1px;
  border-bottom: 1px solid ${props => props.theme.border.default};
  width: 100%;
  margin-top: 48px;
`

export const Label = styled.span`
  position: relative;
  top: -13px;
  background: ${props => props.theme.bg.wash};
  padding: 2px 16px 2px 0;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.secondary};
`

export const MobileArt = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    max-width: 400px;
  }
`

export const MobileSubscriptionOptions = styled.div`
  display: none;
    
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
  }
`