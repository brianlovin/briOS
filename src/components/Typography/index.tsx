import styled, { css } from 'styled-components'
import defaultTheme from '../Theme'


// captures the interaction on <Larr /> and <Rarr /> components
const arrows = css`
  &:hover {
    .rightArrow {
      opacity: 1;
      transform: translateX(8px);
      transition: transform ${defaultTheme.animations.default};
    }

    .leftArrow {
      opacity: 1;
      transform: translateX(-8px);
      transition: transform ${defaultTheme.animations.default};
    }
  }
`

const heading = css`
  font-weight: ${defaultTheme.fontWeights.heading};
  color: ${props => props.theme.text.primary};
  line-height: ${defaultTheme.lineHeights.heading};

  ${arrows}
`

export const h1 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[6]};
  letter-spacing: -0.6px;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[5]};
  }
`
export const H1 = styled.h1`
  ${h1};
`

export const h2 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[5]};
  letter-spacing: -0.6px;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[4]};
  }
`
export const H2 = styled.h2`
  ${h2};
`

export const h3 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[4]};
  letter-spacing: -0.6px;
`
export const H3 = styled.h3`
  ${h3};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[3]};
  }
`

export const h4 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[3]};
`
export const H4 = styled.h4`
  ${h4};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[2]};
  }
`

export const h5 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[2]};
`
export const H5 = styled.h5`
  ${h5};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[1]};
  }
`

export const h6 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[1]};
`
export const H6 = styled.h6`
  ${h6};
  font-weight: ${defaultTheme.fontWeights.bold};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[1]};
  }
`

export const p = css`
  font-size: ${defaultTheme.fontSizes[3]};
  font-weight: ${defaultTheme.fontWeights.body};
  line-height: ${defaultTheme.lineHeights.body};
  color: ${props => props.theme.text.secondary};

  a {
    color: ${props => props.theme.text.primary};
    text-decoration: underline solid ${props => props.theme.border.default};
  }

  a:hover {
    text-decoration: underline solid ${props => props.theme.text.primary};
  }

  & + & {
    margin-top: ${defaultTheme.space[4]};
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[2]};
  }
`
export const P = styled.p`
  ${p};
`

export const Blockquote = styled.blockquote``

export const list = css`
  margin: ${defaultTheme.space[4]};
  margin-left: ${defaultTheme.space[5]};
  font-size: ${defaultTheme.fontSizes[3]};
  font-weight: ${defaultTheme.fontWeights.body};
  line-height: ${defaultTheme.fontWeights.body};
  color: ${props => props.theme.text.secondary};
`
export const Ul = styled.ul`
  ${list};
`

export const Ol = styled.ol`
  ${list};
`

export const listItem = css`
  line-height: ${defaultTheme.lineHeights.heading};
  padding: ${defaultTheme.space[1]} ${defaultTheme.space[0]};
`
export const Li = styled.li`
  ${listItem}
`

export const Pre = styled.pre``

export const Code = styled.code``

export const Hr = styled.hr``

export const A = styled.a`
  ${arrows}
`

const baseArrowStyles = css`
  position: relative;
  display: inline-block;
  opacity: 0.4;
  transition: all ${defaultTheme.animations.default};
  font-weight: ${defaultTheme.fontWeights.subheading};
`

export const Rarr = styled.span.attrs({
  children: '→',
  className: 'rightArrow'
})`
  opacity: 0.4;
  ${baseArrowStyles};
`

export const Larr = styled.span.attrs({
  children: '←',
  className: 'leftArrow'
})`
  transform: translateX(-4px);
  ${baseArrowStyles};
`

export const Subheading = styled(P)`
  font-weight: ${defaultTheme.fontWeights.subheading};
  margin-top: ${defaultTheme.space[2]};

  & + & {
    margin-top: ${defaultTheme.space[3]};
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    max-width: 100%;
    margin-top: ${defaultTheme.space[2]};
  }
`;