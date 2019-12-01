import styled, { keyframes, css } from 'styled-components';

const donutSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const animation = () =>
  css`
    ${donutSpin}
  `;

export default styled.div`
  animation: ${animation} 0.8s linear infinite;
  border: 4px solid ${props => props.theme.border.default};
  border-left-color: ${props => props.theme.text.default};
  border-radius: 50%;
  height: 30px;
  width: 30px;
`;
