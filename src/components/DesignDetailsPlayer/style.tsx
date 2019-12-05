import styled from 'styled-components';
import theme from '../Theme';
import { tint } from '../globals';

export const Card = styled.div`
  background: ${props => props.theme.bg.secondary};
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  width: 100%;
  padding: 24px;
  display: flex;
  margin-top: 24px;
  align-items: center;
  position: relative;
  z-index: 2;

  &:hover {
    box-shadow: ${theme.shadows.largeHover};
    transition: ${theme.animations.hover};
  }

  > a {
    min-width: 114px;
    min-height: 114px;
    width: 114px;
    height: 114px;
  }

  @media (max-width: 440px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 8px;

    > a {
      width: 100%;
      height: 100%;
    }
  }
`;

export const Artwork = styled.img`
  width: 114px;
  height: 114px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  cursor: pointer;

  @media (max-width: 440px) {
    width: 100%;
    height: 100%;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 200px;
  align-items: center;

  @media (max-width: 440px) {
    margin-top: 8px;
    margin-left: 8px;
    padding-bottom: 8px;
    width: calc(100% - 16px);
    height: 208px;
  }
`;

export const Date = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.tertiary};
`;

export const Title = styled.span`
  font-size: 18px;
  color: ${props => props.theme.text.primary};
  font-weight: 600;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;

  @media (max-width: 440px) {
    margin-top: 16px;
    width: 100%;

    button {
      width: 100%;
    }
  }
`;

export const AllEpsButton = styled.button`
  background: ${props => props.theme.bg.primary};
  font-size: 16px;
  color: ${props => props.theme.text.tertiary};
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background: ${props => tint(props.theme.bg.primary, -4)};
    color: ${props => props.theme.text.secondary};
  }
`;
