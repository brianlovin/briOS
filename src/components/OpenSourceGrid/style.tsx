 
import styled from 'styled-components';
import { theme } from '../theme';
import { StyledCard } from '../Card/style';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto-fill;
  grid-gap: 16px;
  width: 100%;
  margin-top: 24px;

  ${StyledCard} {
    height: 100%;
  }

  @media (max-width: 762px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 512px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 16px;
`;

export const Org = styled.p`
  font-size: 14px;
  color: ${theme.text.tertiary};
`;

export const Name = styled.p`
  font-size: 18px;
  color: ${theme.text.default};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Description = styled.p`
  font-size: 16px;
  color: ${theme.text.secondary};
  line-height: 1.4;
`;
