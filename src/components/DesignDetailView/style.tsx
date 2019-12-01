import styled from 'styled-components';
import { Shadows } from '../globals';

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 24px 0 0;

  @media (max-width: 968px) {
    align-items: flex-start;
    max-width: 100%;
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
