import styled, { css } from 'styled-components'
import theme from '~/components/Theme'
import { ButtonSize } from './types'

const getPadding = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return '4px 8px'
    case 'default':
      return '10px 20px'
    case 'large':
      return '14px 28px'
    default: {
      return '10px 20px'
    }
  }
}

const getFontSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return '14px'
    case 'default':
      return '16px'
    case 'large':
      return '28px'
    default: {
      return '16px'
    }
  }
}

const base = css`
  -webkit-appearance: none;
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: ${(props) => getFontSize(props.size)};
  font-weight: 500;
  white-space: nowrap;
  word-break: keep-all;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  line-height: 1;
  position: relative;
  text-align: center;
  padding: ${(props) => getPadding(props.size)};
  opacity: ${(props) => (props.disabled ? '0.64' : '1')};
  box-shadow: ${(props) =>
    props.disabled ? 'none' : `0 1px 2px rgba(0,0,0,0.04)`};

  &:disabled {
    cursor: not-allowed;
  }
`

export const Button = styled.button`
  ${base}
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  background-color: var(--bg-secondary);

  &:hover {
    color: var(--text-primary);
  }

  &:active {
    border: 1px solid var(--border-primary);
  }

  &:focus {
    box-shadow: 0 0 0 1px var(--bg-primary), 0 0 0 3px var(--border-primary);
  }
`

export const PrimaryButton = styled.button`
  ${base}
  border: 1px solid var(--text-link);
  color: var(--bg-secondary);
  background-color: var(--text-link);

  &:hover {
    color: var(--text-on-primary);
    box-shadow: ${(props) => (props.disabled ? 'none' : theme.shadows.button)};
  }

  &:active {
    border: 1px solid var(--text-link);
  }

  &:focus {
    box-shadow: 0 0 0 1px var(--bg-secondary),
      0 0 0 3px rgba(var(--text-link-rgb), 0.16);
  }
`

export const GhostButton = styled.button`
  ${base} border: none;
  color: var(--text-secondary);
  box-shadow: none;
  background-color: transparent;
  background-image: none;

  &:hover {
    color: var(--text-primary);
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px var(--bg-primary), 0 0 0 3px var(--text-quaternary);
  }
`

export const OutlineButton = styled.button`
  ${base}
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  background-color: transparent;
  background-image: none;

  &:hover {
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    box-shadow: none;
  }

  &:active {
    border: 1px solid var(--text-placeholder);
  }

  &:focus {
    box-shadow: 0 0 0 1px var(--bg-primary), 0 0 0 3px var(--border-primary);
  }
`
