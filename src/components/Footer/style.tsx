import styled from 'styled-components'
import defaultTheme from '../Theme'

export const Grid = styled.footer`
  display: flex;
  align-items: center;
  padding: ${defaultTheme.space[8]} ${defaultTheme.space[4]} ;
  flex-wrap: wrap;
  position: relative;
  justify-content: space-around;
  align-content: center;

  &:before {
    content: "";
    width: 100px;
    height: 1px;
    background: ${props => props.theme.border.default};
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  a {
    margin: ${defaultTheme.space[3]};
    font-size: ${defaultTheme.fontSizes[0]};
    color: ${props => props.theme.text.tertiary};
  }

  a:hover {
    color: ${props => props.theme.text.secondary};
    text-decoration: underline;
  }
`