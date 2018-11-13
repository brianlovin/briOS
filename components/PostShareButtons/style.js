// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;

  button {
    width: 100%;
  }

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
    grid-gap: 0;

    button {
      margin-top: 16px;
      width: 100%;
    }
  }
`;
