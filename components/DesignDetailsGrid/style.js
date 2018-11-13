// @flow
import styled from 'styled-components';
import { tint } from '../globals';
import { theme } from '../theme';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24px;
  width: 100%;
  margin-top: 32px;

  @media (max-width: 752px) {
    grid-template-columns: 1fr;
  }
`;

export const ViewMoreContainer = styled.div`
  margin-top: 32px;
  width: 100%;
  justify-content: center;
  display: flex;

  button {
    width: 100%;
    background: ${tint(theme.bg.wash, -4)};
    padding: 12px;
    font-weight: 600;
    color: ${theme.text.tertiary};
  }

  button:hover {
    background: ${tint(theme.bg.wash, -8)};
  }
`;
