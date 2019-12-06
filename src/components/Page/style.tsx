import styled from 'styled-components';
import defaultTheme from '../Theme';
import { P } from '../Typography'

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  max-width: 100%;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: ${defaultTheme.breakpoints[4]};
`

export const InnerPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex: 1 0 auto;
  width: 100%;
  padding-top: ${defaultTheme.space[7]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    max-width: 100%;
    padding: 0 ${defaultTheme.space[3]};
    padding-top: ${defaultTheme.space[6]};
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  margin: ${defaultTheme.space[8]} 0 0;
  padding: 0 ${defaultTheme.space[3]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    align-items: flex-start;
    max-width: 100%;
    margin-top: ${defaultTheme.space[6]};
    padding: 0;
  }
`;