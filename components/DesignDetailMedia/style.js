// @flow
import styled from 'styled-components';
import { tint } from '../globals';
import { theme } from '../theme';

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MediaContainer = styled.div`
  border-radius: 8px;
  background: ${tint(theme.bg.wash, -4)};
  margin: 32px 0 64px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 752px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    border-radius: 0;
  }
`;

export const Video = styled.video`
  width: 100%;
  max-width: 320px;
`;

export const DetailTitle = styled.h5`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.text.default};
  margin-bottom: 16px;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;
