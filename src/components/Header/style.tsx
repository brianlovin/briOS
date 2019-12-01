import styled from 'styled-components';
import { hexa } from '../globals'

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
    props.showHeaderShadow ? hexa(props.theme.bg.default, 0.8) : hexa(props.theme.bg.wash, 0.8)};
  z-index: 4;
  box-shadow: ${props =>
    props.showHeaderShadow ? '0 4px 8px rgba(0,0,0,0.04)' : 'none'};
  transition: all 0.2s ease-in-out;
  backdrop-filter: saturate(180%) blur(20px);

  a {
    text-decoration: none!important;
  }

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
  color: ${props => props.theme.text.default};
  margin: 0;
`;

export const Icons = styled.div`
  display: flex;
  align-items: center;

  a {
    color: ${props => props.theme.text.tertiary};
    display: flex;
    align-items: center;
  }

  a:hover {
    color: ${props => props.theme.text.default};
  }

  .icon {
    margin-right: 16px;
  }
`;

export const ButtonRowContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  grid-area: actions;
  align-items: center;

  @media (max-width: 968px) {
  }
`;
