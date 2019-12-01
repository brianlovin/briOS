import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 4px;
  grid-auto-rows: auto;
  width: 100%;
  margin-top: 32px;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1256px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 968px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;