import styled, { keyframes, css } from 'styled-components'

const donutSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const animation = () =>
  css`
    ${donutSpin}
  `

export const Spinner = styled.div`
  animation: ${animation} 0.8s linear infinite;
  border: ${(props) => props.size / 8}px solid var(--border-primary);
  border-left-color: var(--text-primary);
  border-radius: 50%;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
