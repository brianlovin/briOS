import * as React from 'react'
import styled, { css } from 'styled-components'
import theme from '~/components/Theme'

const StyledCard = styled.div`
  position: relative;
  border-radius: 8px;
  background: var(--bg-secondary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02);
  transition: all ${theme.animations.hover};

  ${(props) =>
    props.contentClickable &&
    css`
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    `}

  &:after {
    content: '';
    border-radius: 8px;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: ${theme.shadows.largeHover};
    opacity: 0;
    transition: all ${theme.animations.hover};
  }

  &:hover {
    transition: all ${theme.animations.hover};
  }

  &:hover:after {
    opacity: 1;
    transition: all ${theme.animations.hover};
  }
`

export default function Card(props) {
  return <StyledCard {...props} />
}
