import styled from 'styled-components';
import { hexa } from '~/components/utils'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'logo actions';
  padding: 12px 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props =>
    props.showHeaderShadow ? hexa(props.theme.bg.secondary, 0.8) : 'transparent'};
  z-index: 4;
  box-shadow: ${props =>
    props.showHeaderShadow ? '0 4px 8px rgba(0,0,0,0.04)' : 'none'};
  transition: all 0.2s ease-in-out;
  backdrop-filter: ${props => props.showHeaderShadow ? 'saturate(180%) blur(20px)' : 'none'};

  a {
    text-decoration: none!important;
  }

  @media (max-width: 968px) {
    padding: 8px 16px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'logo actions';
  }
`;

export const Logo = styled.p`
  grid-area: logo;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text.primary};
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
    color: ${props => props.theme.text.primary};
  }

  .icon {
    margin-left: 16px;
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
