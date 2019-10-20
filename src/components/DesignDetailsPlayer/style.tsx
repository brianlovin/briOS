import styled from 'styled-components';
import { theme } from '../theme';
import { tint } from '../globals';

export const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  width: 100%;
  padding: 8px;
  display: flex;
  margin-top: 24px;
  align-items: center;
  position: relative;
  z-index: 2;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.09);
    transition: all 0.2s ease-in-out;
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
    width: 100%;
  }
`;

export const Date = styled.span`
  font-size: 14px;
  color: ${theme.text.tertiary};
`;

export const Title = styled.span`
  font-size: 18px;
  color: ${theme.text.default};
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
  background: ${theme.bg.wash};
  font-size: 16px;
  color: ${theme.text.tertiary};
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background: ${tint(theme.bg.wash, -4)};
    color: ${theme.text.secondary};
  }
`;
