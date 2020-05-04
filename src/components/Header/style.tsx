import styled, { css } from 'styled-components'
import theme from '../Theme'

const base = css`
  padding: 4px 8px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  font-size: ${theme.fontSizes[0]};
  font-weight: 600;
  margin: 0;

  a {
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    margin: 0 2px;
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    font-size: ${theme.fontSizes[1]};
  }
`

export const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  background: rgba(var(--bg-primary-rgb), 0.76);
  box-shadow: 0 1px 0px rgba(0, 0, 0, 0.04);
  backdrop-filter: saturate(180%) blur(20px);
`

export const Container = styled.header`
  ${base};
  justify-content: space-around;

  @media (min-width: ${theme.breakpoints[4]}) {
    display: flex;
  }
  @media (max-width: ${theme.breakpoints[4]}) {
    display: none;
  }
`

export const InnerGrid = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  justify-self: center;
  max-width: ${theme.breakpoints[3]};
  grid-gap: ${theme.space[3]};
  position: relative;
  z-index: 3;
`

export const MobileContainer = styled.header`
  ${base};

  justify-content: center;
  align-items: ${(props) => (props.expanded ? 'flex-start' : 'center')};
  flex-direction: ${(props) => (props.expanded ? 'column' : 'row')};
  padding-bottom: ${(props) => (props.expanded ? '16px' : '4px')};

  a {
    text-align: left;
  }

  @media (min-width: ${theme.breakpoints[4]}) {
    display: none;
  }
  @media (max-width: ${theme.breakpoints[4]}) {
    display: flex;
  }
`

export const CloseButton = styled.div`
  position: relative;
  padding: 0 8px;
  margin-top: -2px;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  font-size: 26px;
  font-weight: 300;
  cursor: pointer;
  z-index: 3;
  position: relative;
`

export const MenuButton = styled.div`
  padding: 0 8px;
  margin-top: 4px;
  cursor: pointer;
  z-index: 3;
  position: relative;
`

export const Label = styled.span`
  display: flex;
  flex: 1;
  z-index: 3;
  position: relative;

  a {
    text-align: center;
    background: ${(props) =>
      props.isActive ? 'rgba(var(--text-link-rgb), 0.04)' : 'none'};
    color: ${(props) =>
      props.isActive ? 'var(--text-link)' : 'var(--text-primary)'};
  }

  a:hover {
    background: ${(props) =>
      props.isActive
        ? 'rgba(var(--text-link-rgb), 0.04)'
        : 'rgba(var(--text-link-rgb), 0.04)'};
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    width: 100%;

    a {
      text-align: left;
    }
  }
`
