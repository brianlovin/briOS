import styled, { keyframes, css } from 'styled-components';
import { theme } from '../theme';
import { hexa } from '../globals';

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
  border: 4px solid ${hexa(theme.text.default, 0.2)};
  border-left-color: ${theme.text.default};
  border-radius: 50%;
  height: 30px;
  width: 30px;
`;
