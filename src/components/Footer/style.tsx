import styled from 'styled-components'
import theme from '../Theme'

export const Grid = styled.footer`
  display: flex;
  align-items: center;
  padding: ${theme.space[8]} ${theme.space[4]};
  flex-wrap: wrap;
  position: relative;
  justify-content: space-around;
  align-content: center;

  &:before {
    content: '';
    width: 100px;
    height: 1px;
    background: var(--border-primary);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  a {
    margin: ${theme.space[3]};
    font-size: ${theme.fontSizes[0]};
    color: var(--text-tertiary);
  }

  a:hover {
    color: var(--text-secondary);
    text-decoration: underline;
  }
`
