// @flow
import styled from 'styled-components';
import { theme } from '../theme';
import { StyledCard } from '../Card/style';
import { Shadows } from '../globals';

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 12px 16px;
  padding-left: 72px;
`;

export const DetailsCount = styled.p`
  font-size: 14px;
  color: ${theme.text.tertiary};
`;

export const Title = styled.p`
  font-size: 18px;
  color: ${theme.text.default};
  font-weight: 600;
`;

export const ImageContainer = styled.span`
  background: transparent;
  width: 64px;
  height: 64px;
  position: absolute;
  z-index: 1;
  left: -8px;
  top: -8px;

  img {
    width: 64px;
    height: 64px;
    border-radius: 16px !important;
    background: ${theme.bg.wash};
  }

  .atvImage,
  .atvImg-container,
  .atvImg-layers,
  .atvImg-shine,
  .atvImg-shadow {
    border-radius: 16px !important;
  }
`;

export const Icon = styled.img`
  ${Shadows.default};
  border-radius: 16px;
  overflow: hidden;
  width: 64px;
  height: 64px;

  &:hover {
    ${Shadows.hover};
  }

  &:active {
    ${Shadows.active};
  }
`;
