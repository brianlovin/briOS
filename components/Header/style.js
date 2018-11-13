// @flow
import styled from 'styled-components';
import { theme } from '../theme';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'logo actions';
  padding: 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props =>
    props.showHeaderShadow ? props.theme.bg.default : props.theme.bg.wash};
  z-index: 3;
  box-shadow: ${props =>
    props.showHeaderShadow ? '0 4px 8px rgba(0,0,0,0.04)' : 'none'};
  transition: all 0.2s ease-in-out;

  @media (max-width: 968px) {
    padding: 8px 16px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'logo actions';
  }
`;

export const Logo = styled.h1`
  grid-area: logo;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.text.default};
`;

export const ButtonRowContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  grid-area: actions;
  align-items: center;

  @media (max-width: 968px) {
  }
`;
