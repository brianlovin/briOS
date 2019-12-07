import styled, { css } from 'styled-components'
import defaultTheme from '~/components/Theme'


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
  letter-spacing: -0.4px;

  ${arrows}
`

export const h1 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[6]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[5]}
  }
`
export const H1 = styled.h1`
  ${h1};
`

export const h2 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[5]};
  letter-spacing: -0.6px;
`
export const H2 = styled.h2`
  ${h2};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[4]}
  }
`

export const h3 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[4]};
  letter-spacing: -0.6px;
`
export const H3 = styled.h3`
  ${h3};
`

export const h4 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[3]};
`
export const H4 = styled.h4`
  ${h4};
`

export const h5 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[2]};
`
export const H5 = styled.h5`
  ${h5};
`

export const h6 = css`
  ${heading};
  font-size: ${defaultTheme.fontSizes[1]};
`
export const H6 = styled.h6`
  ${h6};
  font-weight: ${defaultTheme.fontWeights.bold};
  letter-spacing: 0.2px;
`

export const p = css`
  font-size: ${defaultTheme.fontSizes[2]};
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

  > code {
    margin-top: 0!important;
    font-size: ${defaultTheme.fontSizes[1]};
  }

  & + & {
    margin-top: ${defaultTheme.space[4]};
  }

  @media(min-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[3]};
  }
`
export const P = styled.p`
  ${p};
`

export const blockquote = css`
  ${p};
  margin-top: ${defaultTheme.space[5]};
  padding-left: ${defaultTheme.space[4]};
  font-style: italic;
  color: ${props => props.theme.text.tertiary};
  display: block;
  position: relative;

  &:before {
    content: '';
    height: 100%;
    width: 4px;
    border-radius: 4px;
    background: ${props => props.theme.border.default};
    position: absolute;
    left: 0;
  }
`
export const Blockquote = styled.blockquote`
  ${blockquote};
`

export const list = css`
  ${p};
  margin: ${defaultTheme.space[4]};
  margin-left: ${defaultTheme.space[5]};
  font-weight: ${defaultTheme.fontWeights.body};
  line-height: ${defaultTheme.fontWeights.body};
  color: ${props => props.theme.text.secondary};

  a {
    color: ${props => props.theme.text.primary};
    text-decoration: underline solid ${props => props.theme.border.default};
  }

  a:hover {
    text-decoration: underline solid ${props => props.theme.text.primary};
  }
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

export const pre = css`
  ${p};
  font-size: ${defaultTheme.fontSizes[1]};
  font-family: ${defaultTheme.fonts.monospace}!important;
  padding: ${defaultTheme.space[3]}!important;
  background: ${props => props.theme.bg.inset}!important;
  text-shadow: none!important;
  border-radius: 8px;
  margin: ${defaultTheme.space[5]} 0!important;
  overflow-x: scroll;
  box-shadow: 0 0 0 1px ${props => props.theme.border.default}, inset 0 1px 4px rgba(0,0,0,0.04);

  &::-webkit-scrollbar {
    display: none;
  }

  code {
    padding: ${defaultTheme.space[2]};
    line-height: ${defaultTheme.lineHeights.code};
    box-shadow: none!important;
    font-size: ${defaultTheme.fontSizes[1]};
  }

  @media(max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[0]};

    code {
      font-size: ${defaultTheme.fontSizes[0]};
    }
  }
`
export const Pre = styled.pre`
  ${pre};
`

export const code = css`
  ${p};
  font-size: ${defaultTheme.fontSizes[1]};
  font-family: ${defaultTheme.fonts.monospace}!important;
  padding:  ${defaultTheme.space[0]} ${defaultTheme.space[1]}!important;
  box-shadow: inset 0 0 0 1px ${props => props.theme.border.default};
  border-radius: 4px;
  display: inline-block;
  background: ${props => props.theme.bg.inset}!important;
  text-shadow: none!important;

  @media(max-width: ${defaultTheme.breakpoints[4]}) {
    font-size: ${defaultTheme.fontSizes[0]};
  }
`
export const Code = styled.code`
  ${code};
`

export const Hr = styled.hr``

export const A = styled.a`
  ${arrows}
  display: inline-block;
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
  font-size: ${defaultTheme.fontSizes[3]};
  font-weight: ${defaultTheme.fontWeights.subheading};
  margin-top: ${defaultTheme.space[2]};
  line-height: 1.4;

  & + & {
    margin-top: ${defaultTheme.space[3]};
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    max-width: 100%;
    margin-top: ${defaultTheme.space[2]};
  }
`;

export const img = css`
  max-width: 100%;
  border-radius: 4px;
`