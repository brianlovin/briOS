import styled, { css } from 'styled-components';
import { hexa } from '~/components/utils'
import defaultTheme from '../Theme';

const base = css`
  padding: 4px 8px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => hexa(props.theme.bg.secondary, 0.8)};
  z-index: 4;
  box-shadow: 0 4px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease-in-out;
  backdrop-filter: saturate(180%) blur(20px);
  font-size: ${defaultTheme.fontSizes[0]};
  font-weight: 600;
  margin: 0;

  a {
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    margin: 0 2px;
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[1]};
  }
`

export const Container = styled.header`
  ${base};

  justify-content: space-around;

  @media (min-width: ${defaultTheme.breakpoints[4]}) {
    display: flex;
  }
  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    display: none;
  }
`;

export const InnerGrid = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  justify-self: center;
  max-width: ${defaultTheme.breakpoints[3]};
  grid-gap: ${defaultTheme.space[3]};
`

export const MobileContainer = styled.header`
  ${base};

  justify-content: center;
  align-items: ${props => props.expanded ? 'flex-start' : 'center'};
  flex-direction: ${props => props.expanded ? 'column' : 'row'};
  padding-bottom: ${props => props.expanded ? '16px' : '4px'};

  a {
    text-align: left;
  }

  @media (min-width: ${defaultTheme.breakpoints[4]}) {
    display: none;
  }
  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    display: flex;
  }
`

export const CloseButton = styled.div`
  position: relative;
  padding: 0 8px;
  margin-top: -2px;
  display: ${props => props.visible ? 'block' : 'none'};
  font-size: 26px;
  font-weight: 300;
  cursor: pointer;
`

export const MenuButton = styled.div`
  padding: 0 8px;
  margin-top: 4px;
  cursor: pointer;
`

export const Label = styled.span`
  display: flex;
  flex: 1;
  
  a {
    text-align: center;
    background: ${props => props.isActive ? hexa(props.theme.text.link, 0.04) : 'none'};
    color: ${props => props.isActive ? props.theme.text.link : props.theme.text.primary};
  }

  a:hover {
    background: ${props => props.isActive ? hexa(props.theme.text.link, 0.08) : hexa(props.theme.text.primary, 0.04)};
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    width: 100%;

    a {
      text-align: left;
    }
  }
`